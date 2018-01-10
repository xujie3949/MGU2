import PathTool from './PathTool';

/**
 * Created by xujie3949 on 2016/12/8.
 * links移动形状点工具
 */

class PathVertexMoveTool extends PathTool {
    constructor() {
        super();

        this.name = 'PathVertexMoveTool';
        this.selectedVertexIndex = null;
    }

    resetStatus() {
        super.resetStatus();

        this.selectedVertexIndex = null;
    }

    refresh() {
        this.resetDashLine();
        this.resetDashLineFeedback();
        this.resetFeedback();
        this.resetMouseInfo();
    }

    resetMouseInfo() {
        this.setMouseInfo('');

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            this.setMouseInfo('不能对空几何进行移动点操作，请切换到延长线工具');
            return;
        }

        if (ls.coordinates.length < 2) {
            this.setMouseInfo('至少需要2个形状点才能进行移动点操作，请切换到延长线工具');
        }
    }

    resetDashLine() {
        if (!this.isDragging) {
            return;
        }

        if (this.selectedVertexIndex !== null) {
            this.dashLine = this.getDashLineByVertexIndex(this.selectedVertexIndex);
        }
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

    onLeftButtonDown(event) {
        if (!super.onLeftButtonDown(event)) {
            return false;
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
        if (!super.onLeftButtonUp(event)) {
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

export default PathVertexMoveTool;
