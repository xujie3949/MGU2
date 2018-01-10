import PathTool from './PathTool';

/**
 * Created by xujie3949 on 2016/12/8.
 * links删除中间形状点工具
 */

class PathVertexRemoveTool extends PathTool {
    constructor() {
        super();

        this.name = 'PathVertexRemoveTool';
    }

    refresh() {
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
    }

    resetSnapActor() {
        this.uninstallSnapActors();
        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 2) {
            return;
        }

        const snapActor = this.createNearestVertexSnapActor(ls, false, false);
        this.installSnapActor(snapActor);
    }

    resetMouseInfo() {
        this.setMouseInfo('');

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            this.setMouseInfo('不能对空几何进行删除点操作，请切换到延长线工具');
            return;
        }

        if (ls.coordinates.length < 3) {
            this.setMouseInfo('至少需要3个形状点才能进行删除点操作，请切换到延长线工具或平滑修形工具');
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

        const res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return false;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;
        const index = res.index;
        if (index === 0 || index === ls.coordinates.length - 1) {
            return false;
        }

        this.delVertex(index);

        return true;
    }
}

export default PathVertexRemoveTool;
