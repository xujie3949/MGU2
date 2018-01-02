import AssistantTool from './AssistantTool';
import Feedback from '../../../mapApi/feedback/Feedback';
import Util from '../../../common/Util';

/**
 * Created by xujie3949 on 2016/12/8.
 */

class DistanceTool extends AssistantTool {
    constructor() {
        super();

        this.name = 'DistanceTool';
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
        this.dashLine = this.resetDashLine();
        this.resetFeedback();
        this.resetDashLineFeedback();
        this.resetMouseInfo();
    }

    resetMouseInfo() {
        this.setMouseInfo('');

        const ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length === 0) {
            this.setMouseInfo('单击鼠标左键开始测量距离');
        }
    }

    onRedo(oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    }

    onUndo(oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    }

    resetFeedback() {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        this.drawFinalGeometry();

        this.drawFinalGeometryVertex();

        this.drawLengthText();

        this.refreshFeedback();
    }

    drawFinalGeometry() {
        const ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        const lineSymbol = this.symbolFactory.getSymbol('distance_tool_ls_edge');
        this.defaultFeedback.add(ls, lineSymbol);
    }

    drawFinalGeometryVertex() {
        const ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        const vertexSymbol = this.symbolFactory.getSymbol('distance_tool_pt_vertex');

        for (let i = 0; i < ls.coordinates.length; ++i) {
            const vertex = this.coordinatesToPoint(ls.coordinates[i]);
            this.defaultFeedback.add(vertex, vertexSymbol);
        }
    }

    drawLengthText() {
        const ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        let totalLength = 0;
        for (let i = 0; i < ls.coordinates.length - 1; ++i) {
            const vertex = this.coordinatesToPoint(ls.coordinates[i]);
            const nextVertex = this.coordinatesToPoint(ls.coordinates[i + 1]);
            const length = this.geometryAlgorithm.sphericalDistance(vertex, nextVertex);
            totalLength += length;
            const symbol = Util.clone(this.symbolFactory.getSymbol('distance_tool_pt_length_text'));
            symbol.text = `${length.toFixed(2)}/${totalLength.toFixed(2)}米'`;
            this.setTextSymbolOffset(symbol);
            this.defaultFeedback.add(nextVertex, symbol);
        }
    }

    resetDashLineFeedback() {
        if (!this.dashLineFeedback) {
            return;
        }

        this.dashLineFeedback.clear();
        this.refreshFeedback();

        const ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        if (!this.dashLine || this.dashLine.coordinates.length < 2) {
            return;
        }

        this.drawDashLine();

        this.drawMousePoint();

        this.refreshFeedback();
    }

    drawDashLine() {
        const length = this.geometryAlgorithm.sphericalLength(this.dashLine);
        const totalLength = this.editResult.length + length;
        const lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
        const textSymbol = Util.clone(this.symbolFactory.getSymbol('distance_tool_pt_length_text'));
        textSymbol.text = `${length.toFixed(2)}/${totalLength.toFixed(2)}米`;
        this.setTextSymbolOffset(textSymbol);
        this.dashLineFeedback.add(this.dashLine, lineSymbol);
        this.dashLineFeedback.add(this.mousePoint, textSymbol);
    }
    
    drawMousePoint() {
        const vertexSymbol = this.symbolFactory.getSymbol('distance_tool_pt_vertex');

        this.dashLineFeedback.add(this.mousePoint, vertexSymbol);
    }

    setTextSymbolOffset(symbol) {
        const size = symbol.getOriginBound().getSize();
        symbol.offsetX = size.width / 2;
        symbol.offsetY = -size.height;
    }

    resetDashLine() {
        const dashLine = {
            type: 'LineString',
            coordinates: [],
        };

        if (this.editResult.isFinish) {
            return null;
        }

        const ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length === 0) {
            return null;
        }

        if (!this.mousePoint) {
            return null;
        }

        const lastCoordinate = ls.coordinates[ls.coordinates.length - 1];
        dashLine.coordinates.push(lastCoordinate);
        dashLine.coordinates.push(this.mousePoint.coordinates);
        return dashLine;
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        this.dashLine = this.resetDashLine();
        this.resetDashLineFeedback();

        return true;
    }

    onLeftButtonClick(event) {
        if (!super.onLeftButtonClick(event)) {
            return false;
        }

        this.onAddVertex();

        return true;
    }

    onLeftButtonDblClick(event) {
        if (!super.onLeftButtonDblClick(event)) {
            return false;
        }

        this.onAddVertexFinish();

        return true;
    }

    onAddVertex() {
        let newEditResult = Util.clone(this.editResult);
        if (newEditResult.isFinish) {
            newEditResult = this.getEmptyEditResult();
        }
        newEditResult.finalGeometry.coordinates.push(this.mousePoint.coordinates);
        newEditResult.length = this.geometryAlgorithm.sphericalLength(newEditResult.finalGeometry);
        this.createOperation('添加形状点', newEditResult);
    }

    onAddVertexFinish() {
        const newEditResult = Util.clone(this.editResult);
        newEditResult.isFinish = true;
        this.createOperation('添加形状点', newEditResult);
    }
}

export default DistanceTool;

