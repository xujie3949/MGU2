import PolygonTool from './PolygonTool';
import Feedback from '../../../../mapApi/feedback/Feedback';

/**
 * Created by xujie3949 on 2016/12/8.
 * polygon平滑修行工具
 */
class PolygonSmoothTool extends PolygonTool {
    constructor() {
        super();

        this.name = 'PolygonSmoothTool';
        this.threshold = null;
        this.dashLineFeedback = null;
        this.dashLine = null;
        this.isSelectedVertex = false;
        this.selectedVertexIndex = null;
        this.selectedEdgeIndex = null;
        this.isDragging = false;
        this.nearestPoint = null;
    }

    startup() {
        this.resetStatus();

        super.startup();

        this.threshold = 10;
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

        this.threshold = null;
        this.dashLineFeedback = null;
        this.dashLine = null;
        this.isSelectedVertex = false;
        this.selectedVertexIndex = null;
        this.selectedEdgeIndex = null;
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
        this.dashLine = null;

        if (!this.isDragging) {
            return;
        }

        if (this.isSelectedVertex) {
            this.dashLine = this.getDashLineByVertexIndex(this.selectedVertexIndex);
        } else {
            this.dashLine = this.getDashLineByEdgeIndex(this.selectedEdgeIndex);
        }
    }

    resetMouseInfo() {
        this.setMouseInfo('');

        if (!this.shapeEditor.editResult.isClosed) {
            this.setMouseInfo('不能对未闭合的面进行平滑修形操作，请切换到延长线工具');
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

    getDashLineByEdgeIndex(index) {
        const dashLine = {
            type: 'LineString',
            coordinates: [],
        };

        const ls = this.shapeEditor.editResult.finalGeometry;

        const prevCoordinate = ls.coordinates[index];
        const nextCoordinate = ls.coordinates[index + 1];
        const mouseCoordinate = this.mousePoint.coordinates;
        dashLine.coordinates.push(prevCoordinate);
        dashLine.coordinates.push(mouseCoordinate);
        dashLine.coordinates.push(nextCoordinate);

        return dashLine;
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

    getSelectedVertexIndex(point) {
        if (!point) {
            return null;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        const points = [];
        for (let i = 0; i < ls.coordinates.length; ++i) {
            const tmpPoint = this.coordinatesToPoint(ls.coordinates[i]);
            this.addPoint(tmpPoint, i, points);
        }

        const pixelPoint = this.lonlatToPixel(point);
        const selectedItem = this.findNearestPoint(pixelPoint, points);
        if (!selectedItem) {
            return null;
        }

        const dis = this.geometryAlgorithm.distance(pixelPoint, selectedItem.key);
        if (dis < this.threshold) {
            return selectedItem.value;
        }

        return null;
    }

    getNearestVertexIndex(index, point) {
        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        const length = ls.coordinates.length;
        let prevIndex = 0;
        let nextIndex = 0;
        if (index === 0) {
            prevIndex = length - 2;
            nextIndex = index + 1;
        } else if (index === length - 1) {
            prevIndex = index - 1;
            nextIndex = 1;
        } else {
            prevIndex = index - 1;
            nextIndex = index + 1;
        }
        const points = [];

        const prevPoint = this.coordinatesToPoint(ls.coordinates[prevIndex]);
        this.addPoint(prevPoint, prevIndex, points);

        const nextPoint = this.coordinatesToPoint(ls.coordinates[nextIndex]);
        this.addPoint(nextPoint, nextIndex, points);

        const pixelPoint = this.lonlatToPixel(point);
        const selectedItem = this.findNearestPoint(pixelPoint, points);
        if (!selectedItem) {
            return null;
        }

        const dis = this.geometryAlgorithm.distance(pixelPoint, selectedItem.key);
        if (dis < this.threshold) {
            return selectedItem.value;
        }

        return null;
    }

    addPoint(point, value, points) {
        const pixelPoint = this.lonlatToPixel(point);
        points.push({
            key: pixelPoint,
            value: value,
        });
    }

    findNearestPoint(point, points) {
        let selectedItem = null;
        let minDis = Number.MAX_VALUE;
        for (let i = 0; i < points.length; ++i) {
            const item = points[i];
            const tmpPoint = item.key;
            const dis = this.geometryAlgorithm.distance(point, tmpPoint);
            if (dis < minDis) {
                minDis = dis;
                selectedItem = item;
            }
        }

        return selectedItem;
    }

    coordinatesToPoint(coordinates) {
        const point = {
            type: 'Point',
            coordinates: coordinates,
        };
        return point;
    }

    lonlatToPixel(point) {
        const pixelPoint = this.map.project([point.coordinates[1], point.coordinates[0]]);
        const newPoint = this.coordinatesToPoint([pixelPoint.x, pixelPoint.y]);
        return newPoint;
    }

    onLeftButtonDown(event) {
        if (!super.onLeftButtonDown(event)) {
            return false;
        }

        if (!this.shapeEditor.editResult.isClosed) {
            return true;
        }

        this.isDragging = true;

        const ls = this.shapeEditor.editResult.finalGeometry;

        const nearestLocations = this.getNearestLocations(this.mousePoint);
        const index = this.getSelectedVertexIndex(nearestLocations.point);
        if (index !== null) {
            this.isSelectedVertex = true;
            this.selectedVertexIndex = index;
            this.nearestPoint = this.getPointByIndex(this.selectedVertexIndex, nearestLocations);
        } else {
            this.isSelectedVertex = false;
            this.selectedEdgeIndex = nearestLocations.previousIndex;
            this.nearestPoint = nearestLocations.point;
        }

        this.refresh();

        return true;
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        if (!this.shapeEditor.editResult.isClosed) {
            return true;
        }

        if (!this.isDragging) {
            return false;
        }

        this.resetDashLine();
        this.resetDashLineFeedback();

        if (this.isSelectedVertex) {
            const ls = this.shapeEditor.editResult.finalGeometry;
            const index = this.getNearestVertexIndex(this.selectedVertexIndex, this.mousePoint);
            if (index !== null && ls.coordinates.length > 4) {
                if (index === ls.coordinates.length - 1) {
                    this.selectedVertexIndex -= 1;
                } else if (index < this.selectedVertexIndex) {
                    this.selectedVertexIndex -= 1;
                }
                this.delVertex(index);
            }
        }

        return true;
    }

    onLeftButtonUp(event) {
        if (!super.onLeftButtonUp(event)) {
            return false;
        }

        if (!this.shapeEditor.editResult.isClosed) {
            return true;
        }

        if (!this.isDragging) {
            return false;
        }

        this.isDragging = false;
        const res = this.snapController.snap(this.mousePoint);
        if (this.isSelectedVertex) {
            this.moveVertex(this.selectedVertexIndex, this.mousePoint, res);
        } else {
            this.addVertex(this.selectedEdgeIndex + 1, this.mousePoint, res);
        }

        return true;
    }
}

export default PolygonSmoothTool;

