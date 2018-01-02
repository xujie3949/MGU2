import AssistantTool from './AssistantTool';
import Feedback from '../../../mapApi/feedback/Feedback';
import Vector from '../../../math/Vector';
import Util from '../../../common/Util';

/**
 * Created by xujie3949 on 2016/12/8.
 */

class AreaTool extends AssistantTool {
    constructor() {
        super();

        this.name = 'AreaTool';
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
        super.shutdown.apply();

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
            this.setMouseInfo('单击鼠标左键开始测量面积');
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

        this.drawDashLine();

        this.drawMousePoint();

        this.drawAreaText();

        this.drawFill();

        this.refreshFeedback();
    }

    drawDashLine() {
        if (!this.dashLine || this.dashLine.coordinates.length < 2) {
            return;
        }

        const lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
        this.dashLineFeedback.add(this.dashLine, lineSymbol);
    }

    drawMousePoint() {
        if (this.editResult.isFinish) {
            return;
        }

        if (!this.dashLine || this.dashLine.coordinates.length < 2) {
            return;
        }

        const vertexSymbol = this.symbolFactory.getSymbol('distance_tool_pt_vertex');

        this.dashLineFeedback.add(this.mousePoint, vertexSymbol);
    }

    drawAreaText() {
        const ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 3) {
            return;
        }

        const ring = Util.clone(ls);
        ring.coordinates.push(ring.coordinates[0]);

        const polygon = {
            type: 'Polygon',
            coordinates: [ring.coordinates],
        };

        const isSample = this.geometryAlgorithm.isSimple(polygon);

        const area = this.geometryAlgorithm.sphericalArea(polygon);

        const symbol = Util.clone(this.symbolFactory.getSymbol('area_tool_pt_area_text'));
        if (isSample) {
            symbol.marker.text = `${area.toFixed(2)}平米`;
        } else {
            symbol.marker.text = '自相交';
        }

        this.dashLineFeedback.add(polygon, symbol);
    }

    drawFill() {
        const ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        const length = ls.coordinates.length;
        if (length < 3) {
            return;
        }

        const ring = Util.clone(ls);
        this.geometryAlgorithm.close(ring);

        const polygon = {
            type: 'Polygon',
            coordinates: [ring.coordinates],
        };

        const symbol = this.symbolFactory.getSymbol('shapeEdit_py_red');
        this.dashLineFeedback.add(polygon, symbol);
    }

    resetDashLine() {
        const ls = this.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        if (this.editResult.isFinish) {
            return null;
        }

        const length = ls.coordinates.length;
        if (length === 0) {
            return null;
        }

        if (length === 1) {
            return this.getTwoPointDashLine();
        }
        return this.getThreePointDashLine();
    }

    getTwoPointDashLine() {
        const ls = this.editResult.finalGeometry;
        const length = ls.coordinates.length;

        const dashLine = {
            type: 'LineString',
            coordinates: [],
        };

        const prevCoordinate = ls.coordinates[0];
        const mouseCoordinate = this.mousePoint.coordinates;
        dashLine.coordinates.push(prevCoordinate);
        dashLine.coordinates.push(mouseCoordinate);

        return dashLine;
    }

    getThreePointDashLine() {
        const ls = this.editResult.finalGeometry;
        const length = ls.coordinates.length;

        const dashLine = {
            type: 'LineString',
            coordinates: [],
        };

        const prevCoordinate = ls.coordinates[0];
        const nextCoordinate = ls.coordinates[ls.coordinates.length - 1];
        const mouseCoordinate = this.mousePoint.coordinates;
        dashLine.coordinates.push(prevCoordinate);
        dashLine.coordinates.push(mouseCoordinate);
        dashLine.coordinates.push(nextCoordinate);

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
        this.geometryAlgorithm.close(newEditResult.finalGeometry);
        newEditResult.isFinish = true;
        this.createOperation('添加形状点', newEditResult);
    }
}

export default AreaTool;

