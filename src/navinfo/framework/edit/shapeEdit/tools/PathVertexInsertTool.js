import PathTool from './PathTool';

/**
 * Created by xujie3949 on 2016/12/8.
 * link插入中间形状点工具
 */

class PathVertexInsertTool extends PathTool {
    constructor() {
        super();

        this.name = 'PathVertexInsertTool';
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

        const snapActor = this.createNearestLocationSnapActor(ls);
        this.installSnapActor(snapActor);
    }

    resetMouseInfo() {
        this.setMouseInfo('');

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            this.setMouseInfo('不能对空几何进行插入形状点操作，请切换到延长线工具');
            return;
        }

        if (ls.coordinates.length < 2) {
            this.setMouseInfo('至少需要2个形状点才能进行插入形状点操作，请切换到延长线工具');
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

        const nearestLoations = this.geometryAlgorithm.nearestLocations(res.point, ls);

        this.addVertex(nearestLoations.nextIndex, res.point, null);

        return true;
    }
}

export default PathVertexInsertTool;
