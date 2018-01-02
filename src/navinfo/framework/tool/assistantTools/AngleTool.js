import AssistantTool from './AssistantTool';
import Feedback from '../../../mapApi/feedback/Feedback';
import Vector from '../../../math/Vector';
import Util from '../../../common/Util';

/**
 * Created by xujie3949 on 2016/12/8.
 */

class AngleTool extends AssistantTool {
    constructor() {
        super();

        this.name = 'AngleTool';
        this.dashLineFeedback = null;
        this.dashLine = null;
        this.arc = null;
    }

    startup() {
        this.resetStatus();

        super.startup();

        this.dashLineFeedback = Feedback();
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
        this.arc = null;
    }

    refresh() {
        this.arc = this.resetArc();
        this.dashLine = this.resetDashLine();
        this.resetFeedback();
        this.resetDashLineFeedback();
        this.resetMouseInfo();
    }

    resetMouseInfo() {
        this.setMouseInfo('');

        const ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length === 0) {
            this.setMouseInfo('单击鼠标左键开始测量角度');
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

        for (let i = 0; i < ls.coordinates.length - 1; ++i) {
            const vertex = this.coordinatesToPoint(ls.coordinates[i]);
            const nextVertex = this.coordinatesToPoint(ls.coordinates[i + 1]);
            const length = this.geometryAlgorithm.sphericalDistance(vertex, nextVertex);
            const symbol = Util.clone(this.symbolFactory.getSymbol('distance_tool_pt_length_text'));
            symbol.text = `${length.toFixed(2)}米`;
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

        this.drawDashLine();

        this.drawTmpDashLine();

        this.drawMousePoint();

        this.drawArc();

        this.drawAngle();

        this.refreshFeedback();
    }

    drawDashLine() {
        if (!this.dashLine || this.dashLine.coordinates.length < 2) {
            return;
        }

        const length = this.geometryAlgorithm.sphericalLength(this.dashLine);

        if (length === 0) {
            return;
        }

        const lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
        const textSymbol = Util.clone(this.symbolFactory.getSymbol('distance_tool_pt_length_text'));
        textSymbol.text = `${length.toFixed(2)}米`;
        this.setTextSymbolOffset(textSymbol);
        this.dashLineFeedback.add(this.dashLine, lineSymbol);
        this.dashLineFeedback.add(this.mousePoint, textSymbol);
    }

    drawTmpDashLine() {
        const ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 2) {
            return;
        }

        if (!this.arc || this.arc.coordinates.length < 2) {
            return;
        }

        const start = this.coordinatesToPoint(ls.coordinates[0]);
        const center = this.coordinatesToPoint(ls.coordinates[1]);
        let end = null;
        if (ls.coordinates.length === 2) {
            end = this.mousePoint;
        } else {
            end = this.coordinatesToPoint(ls.coordinates[2]);
        }

        this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);

        const pixelStart = this.geojsonTransform.convertGeometry(start);
        const pixelEnd = this.geojsonTransform.convertGeometry(end);
        const pixelCenter = this.geojsonTransform.convertGeometry(center);

        const gStert = this.geometryFactory.fromGeojson(pixelStart);
        const gEnd = this.geometryFactory.fromGeojson(pixelEnd);
        const gCenter = this.geometryFactory.fromGeojson(pixelCenter);

        const vS = gStert.minus(gCenter);
        const vE = gEnd.minus(gCenter);

        const sLength = vS.length();
        const eLength = vE.length();

        vS.normalize();
        vE.normalize();

        let gPoint1 = null;
        let gPoint2 = null;
        if (sLength > eLength) {
            gPoint1 = gEnd;
            gPoint2 = gCenter.plusVector(vE.multiNumber(sLength));
        } else {
            gPoint1 = gStert;
            gPoint2 = gCenter.plusVector(vS.multiNumber(eLength));
        }

        this.geojsonTransform.setEnviroment(this.map, null, this.convertToGeography);

        let point1 = this.geometryFactory.toGeojson(gPoint1);
        let point2 = this.geometryFactory.toGeojson(gPoint2);
        point1 = this.geojsonTransform.convertGeometry(point1);
        point2 = this.geojsonTransform.convertGeometry(point2);

        const geometry = {
            type: 'LineString',
            coordinates: [point1.coordinates, point2.coordinates],
        };

        const lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
        this.dashLineFeedback.add(geometry, lineSymbol);
    }

    drawMousePoint() {
        if (!this.dashLine || this.dashLine.coordinates.length < 2) {
            return;
        }

        if (!this.mousePoint) {
            return;
        }

        const vertexSymbol = this.symbolFactory.getSymbol('distance_tool_pt_vertex');

        this.dashLineFeedback.add(this.mousePoint, vertexSymbol);
    }

    drawArc() {
        if (!this.arc || this.arc.coordinates.length < 2) {
            return;
        }

        const lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
        this.dashLineFeedback.add(this.arc, lineSymbol);
    }

    drawAngle() {
        const ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 2) {
            return;
        }

        const center = this.coordinatesToPoint(ls.coordinates[1]);
        const start = this.coordinatesToPoint(ls.coordinates[0]);
        let end = null;
        if (ls.coordinates.length === 2) {
            end = this.mousePoint;
        } else {
            end = this.coordinatesToPoint(ls.coordinates[2]);
        }

        if (this.geometryAlgorithm.equals(center, start)) {
            return;
        }

        if (this.geometryAlgorithm.equals(center, end)) {
            return;
        }

        const angle = this.getAngle(start, end, center);
        const symbol = Util.clone(this.symbolFactory.getSymbol('angle_tool_pt_angle_text'));
        symbol.text = `${angle.toFixed(2)}°`;
        this.setAngleSymbolOffset(symbol);
        this.dashLineFeedback.add(center, symbol);
    }

    setTextSymbolOffset(symbol) {
        const size = symbol.getOriginBound().getSize();
        symbol.offsetX = size.width / 2;
        symbol.offsetY = -size.height;
    }

    setAngleSymbolOffset(symbol) {
        const size = symbol.getOriginBound().getSize();
        symbol.offsetX = size.width / 2;
        symbol.offsetY = size.height;
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

    resetArc() {
        const ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 2) {
            return null;
        }

        if (!this.mousePoint) {
            return null;
        }

        let center = null;
        let start = null;
        let end = null;
        if (ls.coordinates.length === 2) {
            start = this.coordinatesToPoint(ls.coordinates[0]);
            end = this.mousePoint;
            center = this.coordinatesToPoint(ls.coordinates[1]);
            if (this.geometryAlgorithm.equals(start, center) ||
                this.geometryAlgorithm.equals(end, center)) {
                return null;
            }
            return this.getArcGeometry(start, end, center);
        }

        if (ls.coordinates.length === 3) {
            start = this.coordinatesToPoint(ls.coordinates[0]);
            end = this.coordinatesToPoint(ls.coordinates[2]);
            center = this.coordinatesToPoint(ls.coordinates[1]);

            if (this.geometryAlgorithm.equals(start, center) ||
                this.geometryAlgorithm.equals(end, center)) {
                return null;
            }

            return this.getArcGeometry(start, end, center);
        }

        return null;
    }

    getArcGeometry(start, end, center) {
        this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);

        const pixelStart = this.geojsonTransform.convertGeometry(start);
        const pixelEnd = this.geojsonTransform.convertGeometry(end);
        const pixelCenter = this.geojsonTransform.convertGeometry(center);

        const radiusStart = this.geometryAlgorithm.distance(pixelStart, pixelCenter);
        const radiusEnd = this.geometryAlgorithm.distance(pixelEnd, pixelCenter);
        const radius = radiusStart > radiusEnd ? radiusStart : radiusEnd;

        const vY = new Vector(0, -1);
        const vS = this.geometryFactory.fromGeojson(pixelStart).minus(this.geometryFactory.fromGeojson(pixelCenter));
        const vE = this.geometryFactory.fromGeojson(pixelEnd).minus(this.geometryFactory.fromGeojson(pixelCenter));

        let sAngle = vY.angleTo(vS);
        let eAngle = vY.angleTo(vE);
        const sSigned = vY.cross(vS);
        const eSigned = vY.cross(vE);
        if (sSigned < 0) {
            sAngle = -sAngle;
        }
        if (eSigned < 0) {
            eAngle = -eAngle;
        }

        let startAngle = null;
        let endAngle = null;
        const angle = vS.angleTo(vE);
        const signed = vS.cross(vE);
        if (signed < 0) {
            startAngle = eAngle;
        } else {
            startAngle = sAngle;
        }
        endAngle = startAngle + angle;

        const x = pixelCenter.coordinates[0];
        const y = pixelCenter.coordinates[1];

        let arc = this.geometryAlgorithm.arc(x, y, radius, startAngle, endAngle, 2);

        this.geojsonTransform.setEnviroment(this.map, null, this.convertToGeography);

        arc = this.geojsonTransform.convertGeometry(arc);

        return arc;
    }

    getAngle(start, end, center) {
        this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);

        const pixelStart = this.geojsonTransform.convertGeometry(start);
        const pixelEnd = this.geojsonTransform.convertGeometry(end);
        const pixelCenter = this.geojsonTransform.convertGeometry(center);

        const vS = this.geometryFactory.fromGeojson(pixelStart).minus(this.geometryFactory.fromGeojson(pixelCenter));
        const vE = this.geometryFactory.fromGeojson(pixelEnd).minus(this.geometryFactory.fromGeojson(pixelCenter));

        const angle = vS.angleTo(vE);

        return angle;
    }

    getNearestEndPoint(point, ls) {
        const start = this.coordinatesToPoint(ls.coordinates[0]);
        const end = this.coordinatesToPoint(ls.coordinates[ls.coordinates.length - 1]);

        const sDis = this.geometryAlgorithm.sphericalDistance(start, point);
        const eDis = this.geometryAlgorithm.sphericalDistance(end, point);

        if (sDis < eDis) {
            return start;
        }
        return end;
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        this.arc = this.resetArc();
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

    onAddVertex() {
        let newEditResult = Util.clone(this.editResult);
        if (newEditResult.finalGeometry.coordinates.length === 3) {
            newEditResult = this.getEmptyEditResult();
        }
        newEditResult.finalGeometry.coordinates.push(this.mousePoint.coordinates);
        if (newEditResult.finalGeometry.coordinates.length === 3) {
            newEditResult.isFinish = true;
            this.createOperation('添加形状点', newEditResult);
        } else {
            this.createOperation('添加形状点', newEditResult);
        }
    }
}

export default AngleTool;

