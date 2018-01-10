import PolygonTool from './PolygonTool';
import Feedback from '../../../../mapApi/feedback/Feedback';

/**
 * Created by xujie3949 on 2016/12/8.
 * polygon添加形状点工具
 */

class PolygonVertexAddTool extends PolygonTool {
    constructor() {
        super();

        this.name = 'PolygonVertexAddTool';
        this.dashLineFeedback = null;
        this.dashLine = null;
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

        this.refreshFeedback();
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

        if (this.shapeEditor.editResult.isClosed) {
            return;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        const length = ls.coordinates.length;
        if (length === 0) {
            return;
        }

        if (!this.mousePoint) {
            return;
        }

        if (length === 1) {
            this.dashLine = this.getTwoPointDashLine();
        } else {
            this.dashLine = this.getThreePointDashLine();
        }
    }

    resetMouseInfo() {
        if (!this.shapeEditor.editResult.finalGeometry.coordinates.length) {
            this.setMouseInfo('点击地图开始绘面');
            return;
        }
        if (!this.shapeEditor.editResult.isClosed && this.shapeEditor.editResult.finalGeometry.coordinates.length < 3) {
            this.setMouseInfo('请点击继续绘制');
            return;
        }
        if (!this.shapeEditor.editResult.isClosed && this.shapeEditor.editResult.finalGeometry.coordinates.length >= 3) {
            this.setMouseInfo('继续绘制或者按鼠标滚轮结束绘制');
            return;
        }
        if (this.shapeEditor.editResult.isClosed) {
            this.setMouseInfo('面已经闭合,可以按ESC重新绘制或者切换到其他工具进行修形');
        }
    }

    closeGeometry() {
        if (this.shapeEditor.editResult.finalGeometry.coordinates.length < 3) {
            this.setCenterInfo('面至少有3个点才能闭合', 1000);
            return true;
        }

        if (this.shapeEditor.editResult.isClosed) {
            return true;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;
        this.addVertex(ls.coordinates.length, this.coordinatesToPoint(ls.coordinates[0]));
        return true;
    }

    onKeyUp(event) {
        if (!super.onKeyUp(event)) {
            return false;
        }

        const key = event.key;
        switch (key) {
            case 'c':
                // 闭合几何
                this.closeGeometry();
                break;
            default:
                break;
        }

        return true;
    }

    onLeftButtonClick(event) {
        if (!super.onLeftButtonClick(event)) {
            return false;
        }

        if (this.shapeEditor.editResult.isClosed) {
            return true;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;
        this.addVertex(ls.coordinates.length, this.mousePoint);

        return true;
    }

    onMiddleButtonClick(event) {
        if (!super.onMiddleButtonClick(event)) {
            return false;
        }

        return this.closeGeometry();
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        this.resetDashLine();
        this.resetDashLineFeedback();

        return true;
    }
}

export default PolygonVertexAddTool;

