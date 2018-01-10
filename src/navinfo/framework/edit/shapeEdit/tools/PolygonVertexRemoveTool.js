import PolygonTool from './PolygonTool';

/**
 * Created by xujie3949 on 2016/12/8.
 * polygon绘制工具
 */

class PolygonVertexRemoveTool extends PolygonTool {
    constructor() {
        super();

        this.name = 'PolygonVertexRemoveTool';
    }

    startup() {
        this.resetStatus();

        super.startup();

        this.refresh();
    }

    shutdown() {
        super.shutdown();

        this.resetStatus();
    }

    refresh() {
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
    }

    resetFeedback() {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        this.drawFill();

        this.drawFinalGeometry(true);

        this.drawFinalGeometryVertex();

        this.refreshFeedback();
    }

    resetSnapActor() {
        this.uninstallSnapActors();

        if (!this.shapeEditor.editResult.isClosed) {
            return;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (ls.coordinates.length <= 4) {
            return;
        }

        const snapActor = this.createNearestVertexSnapActor(ls, true, true);
        this.installSnapActor(snapActor);
    }

    resetMouseInfo() {
        this.setMouseInfo('');

        if (!this.shapeEditor.editResult.isClosed) {
            this.setMouseInfo('不能对未闭合的面进行删除形状点操作，请切换到绘制形状点工具');
            return;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (ls.coordinates.length <= 4) {
            this.setMouseInfo('不能对只有4个点的面进行删除形状点操作，请切换到绘制形状点工具');
        }
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        return true;
    }

    onLeftButtonClick(event) {
        if (!super.onLeftButtonClick(event)) {
            return false;
        }

        if (!this.shapeEditor.editResult.isClosed) {
            return true;
        }

        const res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return false;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;

        this.delVertex(res.index);

        return true;
    }
}

export default PolygonVertexRemoveTool;

