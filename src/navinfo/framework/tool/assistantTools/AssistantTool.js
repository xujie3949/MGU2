/**
 * Created by xujie3949 on 2016/12/8.
 */
import MapTool from '../MapTool';
import Feedback from '../../../mapApi/feedback/Feedback';
import OperationController from '../../../framework/operation/OperationController';
import EditResultOperation from '../../../framework/operation/EditResultOperation';
import FeedbackController from '../../../mapApi/feedback/FeedbackController';
import GeometryAlgorithm from '../../../geometry/GeometryAlgorithm';
import GeometryFactory from '../../../geometry/GeometryFactory';
import SymbolFactory from '../../../symbol/SymbolFactory';
import FeatureSelector from '../../../mapApi/FeatureSelector';
import SceneController from '../../../mapApi/scene/SceneController';
import GeojsonTransform from '../../../mapApi/GeojsonTransform';
import EventController from '../../../common/EventController';
import Util from '../../../common/Util';

class AssistantTool extends MapTool {
    constructor() {
        super();

        this.feedbackController = FeedbackController.getInstance();
        this.operationController = OperationController.getInstance();
        this.symbolFactory = SymbolFactory.getInstance();
        this.geometryFactory = GeometryFactory.getInstance();
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
        this.geojsonTransform = GeojsonTransform.getInstance();
        this.editResult = null;
        this.defaultFeedback = null;
        this.centerInfoFeedback = null;
        this.mouseInfoFeedback = null;
        this.mousePoint = null;
        this.mouseInfo = null;
        this.mouseInfoColor = null;
        this.feedbacks = [];
    }

    onActive(map, onFinish, options) {
        if (!super.onActive(map, onFinish, options)) {
            return false;
        }

        this.startup();
        return true;
    }

    onDeactive() {
        this.shutdown();
        return super.onDeactive();
    }

    startup() {
        this.editResult = this.getEmptyEditResult();
        this.defaultFeedback = Feedback();
        this.installFeedback(this.defaultFeedback);
        this.centerInfoFeedback = new Feedback();
        this.installFeedback(this.centerInfoFeedback);
        this.mouseInfoFeedback = new Feedback();
        this.installFeedback(this.mouseInfoFeedback);
        this.operationController.clear();
    }

    shutdown() {
        this.uninstallFeedbacks();
        this.operationController.clear();
        this.refreshFeedback();
    }

    getEmptyEditResult() {
        return {
            isFinish: false,
            finalGeometry: {
                type: 'LineString',
                coordinates: [],
            },
            lenth: 0,
            area: 0,
            angle: 0,
        };
    }

    resetStatus() {
        this.editResult = null;
        this.defaultFeedback = null;
        this.centerInfoFeedback = null;
        this.mouseInfoFeedback = null;
        this.mousePoint = null;
        this.mouseInfo = null;
        this.mouseInfoColor = null;
        this.feedbacks = [];
    }

    installFeedback(feedback) {
        this.feedbacks.push(feedback);
        this.feedbackController.add(feedback);
    }

    uninstallFeedback(feedback) {
        for (let i = 0; i < this.feedbacks.length; ++i) {
            if (feedback === this.feedbacks[i]) {
                this.feedbacks.splice(i, 1);
                this.feedbackController.del(feedback);
                return;
            }
        }
    }

    uninstallFeedbacks() {
        for (let i = 0; i < this.feedbacks.length; ++i) {
            const feedback = this.feedbacks[i];
            this.feedbackController.del(feedback);
        }
        this.feedbacks = [];
    }

    refreshFeedback() {
        this.feedbackController.refresh();
    }

    createOperation(name, newEditResult) {
        const operation = new EditResultOperation(
            name,
            this.onRedo,
            this.onUndo,
            this.editResult,
            newEditResult,
        );
        if (!operation.canDo()) {
            this.refresh();
            const err = operation.getError();
            this.setCenterError(err, 2000);
            return;
        }
        this.operationController.add(operation);
    }

    onRedo(oldEditResult, newEditResult) {
        throw new Error('未重写onRedo方法');
    }

    onUndo(oldEditResult, newEditResult) {
        throw new Error('未重写onUndo方法');
    }

    refresh() {
        throw new Error('未重写refresh方法');
    }

    setCenterInfo(msg, duration, color) {
        if (!this.centerInfoFeedback) {
            return;
        }

        this.centerInfoFeedback.clear();
        if (!msg) {
            this.refreshFeedback();
            return;
        }

        let symbol = this.symbolFactory.getSymbol('relationEdit_tx_center_info');
        symbol = Util.clone(symbol);
        symbol.text = msg;
        if (color) {
            symbol.color = color;
        }
        const latlng = this.map.getBounds().getCenter();
        const point = this.latlngToPoint(latlng);
        this.centerInfoFeedback.add(point, symbol);
        this.refreshFeedback();

        if (duration) {
            Util.delay(() => this.setCenterInfo(''), duration);
        }
    }

    setCenterError(msg, duration) {
        this.setCenterInfo(msg, duration);
    }

    setMouseInfo(msg, color) {
        this.mouseInfo = msg;
        this.mouseInfoColor = color || 'blue';
        this.resetMouseInfoFeedback();
    }

    resetMouseInfoFeedback() {
        this.mouseInfoFeedback.clear();
        if (!this.mouseInfo || !this.mousePoint) {
            this.refreshFeedback();
            return;
        }

        let symbol = this.symbolFactory.getSymbol('relationEdit_tx_mouse_info');
        symbol = Util.clone(symbol);
        symbol.text = this.mouseInfo;
        symbol.color = this.mouseInfoColor;
        this.mouseInfoFeedback.add(this.mousePoint, symbol);
        this.refreshFeedback();
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        this.mousePoint = this.latlngToPoint(event.latlng);

        this.resetMouseInfoFeedback();

        return true;
    }

    onKeyUp(event) {
        if (!super.onKeyUp(event)) {
            return false;
        }

        const key = event.key;
        switch (key) {
            case 'Escape':
                const newEditResult = this.getEmptyEditResult();
                this.createOperation('恢复初始状态', newEditResult);
                break;
            case 'z':
                if (event.ctrlKey) {
                    this.operationController.undo();
                }
                break;
            case 'x':
                if (event.ctrlKey) {
                    this.operationController.redo();
                }
                break;
            default:
                break;
        }

        return true;
    }

    latlngToPoint(latlng) {
        return {
            type: 'Point',
            coordinates: [
                latlng.lng,
                latlng.lat,
            ],
        };
    }

    coordinatesToPoint(coordinates) {
        const point = {
            type: 'Point',
            coordinates: coordinates,
        };
        return point;
    }

    convertToPixel(map, tileInfo, coordinates) {
        const x = coordinates[0];
        const y = coordinates[1];
        const point = map.project([y, x]);
        return [
            point.x,
            point.y,
        ];
    }

    convertToGeography(map, tileInfo, coordinates) {
        const x = coordinates[0];
        const y = coordinates[1];
        const lnglat = map.unproject([x, y]);
        return [
            lnglat.lng,
            lnglat.lat,
        ];
    }
}

export default AssistantTool;
