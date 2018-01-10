import PolygonTool from './PolygonTool';

/**
 * Created by xujie3949 on 2016/12/8.
 * polygon形状点插入工具
 */
class PolygonVertexInsertTool extends PolygonTool {
    constructor() {
        super();

        this.name = 'PolygonVertexInsertTool';
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

        this.drawFinalGeometry();

        this.drawFinalGeometryVertex();

        this.refreshFeedback();
    }

    resetSnapActor() {
        this.uninstallSnapActors();

        if (!this.shapeEditor.editResult.isClosed) {
            return;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;

        const snapActor = this.createNearestLocationSnapActor(ls);
        this.installSnapActor(snapActor);
    }

    resetMouseInfo() {
        this.setMouseInfo('');

        if (!this.shapeEditor.editResult.isClosed) {
            this.setMouseInfo('不能对未闭合的面进行插入形状点操作，请切换到添加形状点工具');
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

        const nearestLoations = this.geometryAlgorithm.nearestLocations(res.point, ls);

        this.addVertex(nearestLoations.nextIndex, res.point);

        return true;
    }
}

export default PolygonVertexInsertTool;

