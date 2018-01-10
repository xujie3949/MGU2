import PathTool from './PathTool';

/**
 * Created by xujie3949 on 2016/12/8.
 * link平滑修行工具
 */
class PathSmoothTool extends PathTool {
    constructor() {
        super();

        this.name = 'PathSmoothTool';
        this.isSelectedVertex = false;
        this.selectedVertexIndex = null;
        this.selectedEdgeIndex = null;
    }

    resetStatus() {
        super.resetStatus();

        this.isSelectedVertex = false;
        this.selectedVertexIndex = null;
        this.selectedEdgeIndex = null;
    }

    refresh() {
        this.resetDashLine();
        this.resetDashLineFeedback();
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
    }

    resetDashLine() {
        if (!this.isDragging) {
            return;
        }

        if (this.isSelectedVertex) {
            this.dashLine = this.getDashLineByVertexIndex(this.selectedVertexIndex);
        } else {
            this.dashLine = this.getDashLineByEdgeIndex(this.selectedEdgeIndex);
        }
    }

    resetSnapActor() {
        this.uninstallSnapActors();

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        if (!this.isDragging || !this.isSelectedVertex) {
            return;
        }

        if (this.selectedVertexIndex !== 0 &&
            this.selectedVertexIndex !== ls.coordinates.length - 1) {
            return;
        }

        super.resetSnapActor();
    }

    resetMouseInfo() {
        this.setMouseInfo('');

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            this.setMouseInfo('不能对空几何进行平滑修形操作，请切换到延长线工具');
            return;
        }

        if (ls.coordinates.length < 2) {
            this.setMouseInfo('至少需要2个形状点才能进行平滑修形操作，请切换到延长线工具');
        }
    }

    onLeftButtonDown(event) {
        if (!super.onLeftButtonDown(event)) {
            return false;
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

        if (!this.isDragging) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        this.resetDashLine();
        this.resetDashLineFeedback();

        if (this.isSelectedVertex) {
            const ls = this.shapeEditor.editResult.finalGeometry;
            const index = this.getNearestVertexIndex(this.selectedVertexIndex, this.mousePoint);
            if (index && index > 0 && index < ls.coordinates.length - 1) {
                if (index < this.selectedVertexIndex) {
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

export default PathSmoothTool;

