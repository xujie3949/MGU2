import PolygonTool from './PolygonTool';
import Feedback from '../../../../mapApi/feedback/Feedback';

/**
 * Created by xujie3949 on 2016/12/8.
 * polygon移动形状点工具
 */
class PolygonVertexMoveTool extends PolygonTool {
    constructor() {
        super();

        this.name = 'PolygonVertexMoveTool';
        this.dashLineFeedback = null;
        this.dashLine = null;
        this.selectedVertexIndex = null;
        this.isDragging = false;
        this.nearestPoint = null;
    }

    startup() {
        this.resetStatus();

        super.startup();

        this.dashLineFeedback = new Feedback();
        this.dashLineFeedback.priority = 0;
        this.defaultFeedback.priority = 1;
        this.installFeedback(this.dashLineFeedback);

        this.refresh();
    }

    shutdown() {
        super.shutdown();

        this.resetStatus();
    }

    resetStatus() {
        super.resetStatus();

        this.dashLineFeedback = null;
        this.dashLine = null;
        this.selectedVertexIndex = null;
        this.isDragging = false;
        this.nearestPoint = null;
    }

    refresh() {
        this.resetDashLine();
        this.resetDashLineFeedback();
        this.resetFeedback();
        this.resetMouseInfo();
    }

    resetFeedback() {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        this.drawFill();

        this.drawFinalGeometry();

        this.drawFinalGeometryVertex();

        this.drawMouseNearestPoint();

        this.refreshFeedback();
    }

    drawMouseNearestPoint() {
        if (!this.isDragging || !this.nearestPoint) {
            return;
        }

        const symbol = this.symbolFactory.getSymbol('shapeEdit_pt_selected_vertex');

        this.defaultFeedback.add(this.nearestPoint, symbol);
    }

    resetDashLineFeedback() {
        if (!this.dashLineFeedback) {
            return;
        }

        this.dashLineFeedback.clear();
        this.refreshFeedback();

        if (this.dashLine) {
            const lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
            this.dashLineFeedback.add(this.dashLine, lineSymbol);
        }

        this.refreshFeedback();
    }

    resetDashLine() {
        if (!this.isDragging) {
            return;
        }

        if (this.selectedVertexIndex !== null) {
            this.dashLine = this.getDashLineByVertexIndex(this.selectedVertexIndex);
        }
    }

    resetMouseInfo() {
        this.setMouseInfo('');

        if (!this.shapeEditor.editResult.isClosed) {
            this.setMouseInfo('不能对未闭合的面进行移动形状点操作，请切换到添加形状点工具');
        }
    }

    getDashLineByVertexIndex(index) {
        const dashLine = {
            type: 'LineString',
            coordinates: [],
        };

        const ls = this.shapeEditor.editResult.finalGeometry;

        let prevCoordinate = null;
        let nextCoordinate = null;
        let mouseCoordinate = null;

        if (index === 0 || index === ls.coordinates.length - 1) {
            prevCoordinate = ls.coordinates[1];
            nextCoordinate = ls.coordinates[ls.coordinates.length - 2];
            mouseCoordinate = this.mousePoint.coordinates;
            dashLine.coordinates.push(prevCoordinate);
            dashLine.coordinates.push(mouseCoordinate);
            dashLine.coordinates.push(nextCoordinate);
        } else {
            prevCoordinate = ls.coordinates[index - 1];
            nextCoordinate = ls.coordinates[index + 1];
            mouseCoordinate = this.mousePoint.coordinates;
            dashLine.coordinates.push(prevCoordinate);
            dashLine.coordinates.push(mouseCoordinate);
            dashLine.coordinates.push(nextCoordinate);
        }

        return dashLine;
    }

    getSelectedVertexIndexFromNearestLoactions(nearstLocation) {
        const prevPoint = nearstLocation.previousPoint;
        const nextPoint = nearstLocation.nextPoint;
        const point = nearstLocation.point;

        const prevDis = this.geometryAlgorithm.distance(point, prevPoint);
        const nextDis = this.geometryAlgorithm.distance(point, nextPoint);

        if (prevDis < nextDis) {
            return nearstLocation.previousIndex;
        }

        return nearstLocation.nextIndex;
    }

    getNearestLocations(point) {
        if (!point) {
            return null;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        return this.geometryAlgorithm.nearestLocations(point, ls);
    }

    getPointByIndex(index, nearestLocations) {
        if (index === nearestLocations.previousIndex) {
            return nearestLocations.previousPoint;
        }
        if (index === nearestLocations.nextIndex) {
            return nearestLocations.nextPoint;
        }
        return null;
    }

    onLeftButtonDown(event) {
        if (!super.onLeftButtonDown(event)) {
            return false;
        }

        if (!this.shapeEditor.editResult.isClosed) {
            return true;
        }

        this.isDragging = true;

        const nearestLocations = this.getNearestLocations(this.mousePoint);
        this.selectedVertexIndex = this.getSelectedVertexIndexFromNearestLoactions(nearestLocations);
        this.nearestPoint = this.getPointByIndex(this.selectedVertexIndex, nearestLocations);

        this.refresh();

        return true;
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        if (!this.isDragging) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        this.resetDashLine();
        this.resetDashLineFeedback();

        return true;
    }

    onLeftButtonUp(event) {
        if (!super.onLeftButtonUp()) {
            return false;
        }

        if (!this.isDragging) {
            return false;
        }

        this.isDragging = false;
        const res = this.snapController.snap(this.mousePoint);
        this.moveVertex(this.selectedVertexIndex, this.mousePoint, res);

        return true;
    }
}

export default PolygonVertexMoveTool;

