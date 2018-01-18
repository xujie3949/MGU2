import MapTool from '../../../tool/MapTool';
import FeedbackController from '../../../../mapApi/feedback/FeedbackController';
import Feedback from '../../../../mapApi/feedback/Feedback';
import SnapController from '../../../../mapApi/snap/SnapController';
import FeatureSnapActor from '../../../../mapApi/snap/FeatureSnapActor';
import GivenFeatureSnapActor from '../../../../mapApi/snap/GivenFeatureSnapActor';
import GivenPointSnapActor from '../../../../mapApi/snap/GivenPointSnapActor';
import NearestLocationSnapActor from '../../../../mapApi/snap/NearestLocationSnapActor';
import NearestVertexSnapActor from '../../../../mapApi/snap/NearestVertexSnapActor';
import FullScreenFeatureSnapActor from '../../../../mapApi/snap/FullScreenFeatureSnapActor';
import GivenObjectSnapActor from '../../../../mapApi/snap/GivenObjectSnapActor';
import FeatureSelector from '../../../../mapApi/FeatureSelector';
import GeojsonTransform from '../../../../mapApi/GeojsonTransform';
import MecatorTranform from '../../../../transform/MercatorTransform';
import OperationController from '../../../operation/OperationController';
import GeometryAlgorithm from '../../../../geometry/GeometryAlgorithm';
import GeometryFactory from '../../../../geometry/GeometryFactory';
import SymbolFactory from '../../../../symbol/SymbolFactory';
import EditResultOperation from '../../../operation/EditResultOperation';
import Util from '../../../../common/Util';

/**
 * Created by xujie3949 on 2016/12/8.
 */
class ComplexTool extends MapTool {
    constructor() {
        super();

        this.feedbackController = FeedbackController.getInstance();
        this.operationController = OperationController.getInstance();
        this.symbolFactory = SymbolFactory.getInstance();
        this.geometryFactory = GeometryFactory.getInstance();
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
        this.snapController = SnapController.getInstance();
        this.featureSelector = FeatureSelector.getInstance();
        this.geojsonTransform = GeojsonTransform.getInstance();
        this.transform = new MecatorTranform();
        this.editResult = null;
        this.defaultFeedback = null;
        this.centerInfoFeedback = null;
        this.mouseInfoFeedback = null;
        this.mousePoint = null;
        this.mouseInfo = null;
        this.mouseInfoColor = null;
        this.feedbacks = [];
        this.snapActors = [];
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
        this.defaultFeedback = new Feedback();
        this.installFeedback(this.defaultFeedback);
        this.centerInfoFeedback = new Feedback();
        this.installFeedback(this.centerInfoFeedback);
        this.mouseInfoFeedback = new Feedback();
        this.installFeedback(this.mouseInfoFeedback);
        this.snapController.startup();
        this.operationController.clear();

        this.editResult = this.options.editResult.clone();
    }

    shutdown() {
        this.uninstallFeedbacks();
        this.uninstallSnapActors();
        this.snapController.shutdown();
        this.operationController.clear();
        this.refreshFeedback();
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
        this.snapActors = [];
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

    installSnapActor(snapActor) {
        this.snapActors.push(snapActor);
        this.snapController.add(snapActor);
    }

    uninstallSnapActor(snapActor) {
        for (let i = 0; i < this.snapActors.length; ++i) {
            if (snapActor === this.snapActors[i]) {
                this.snapActors.splice(i, 1);
                this.snapController.del(snapActor);
                return;
            }
        }
    }

    uninstallSnapActors() {
        for (let i = 0; i < this.snapActors.length; ++i) {
            const snapActor = this.snapActors[i];
            this.snapController.del(snapActor);
        }
        this.snapActors = [];
    }

    refreshFeedback() {
        this.feedbackController.refresh();
    }

    createFeatureSnapActor(layerId, exceptions, snapFunction) {
        if (!layerId) {
            throw new Error('FeatureSnapActor必须指定捕捉的层');
        }

        const snapActor = new FeatureSnapActor();
        snapActor.layerId = layerId;

        if (exceptions) {
            for (let i = 0; i < exceptions.length; ++i) {
                const exception = exceptions[i];
                snapActor.addSnapException(exception);
            }
        }

        if (snapFunction) {
            snapActor.setSnapFunction(snapFunction);
        }

        return snapActor;
    }

    createFullScreenFeatureSnapActor(layerId, exceptions, snapFunction) {
        if (!layerId) {
            throw new Error('FullScreenFeatureSnapActor必须指定捕捉的层');
        }

        const snapActor = new FullScreenFeatureSnapActor();
        snapActor.layerId = layerId;

        if (exceptions) {
            for (let i = 0; i < exceptions.length; ++i) {
                const exception = exceptions[i];
                snapActor.addSnapException(exception);
            }
        }

        if (snapFunction) {
            snapActor.setSnapFunction(snapFunction);
        }

        return snapActor;
    }

    createGivenFeatureSnapActor(features) {
        if (!features) {
            throw new Error('GivenFeatureSnapActor必须指定捕捉的要素');
        }

        const snapActor = new GivenFeatureSnapActor();
        snapActor.setFeatures(features);

        return snapActor;
    }

    createGivenObjectSnapActor(features) {
        if (!features) {
            throw new Error('GivenObjectSnapActor必须指定捕捉的要素');
        }

        const snapActor = new GivenObjectSnapActor();
        snapActor.setObjects(features);

        return snapActor;
    }

    createGivenPointSnapActor(pairs) {
        if (!pairs) {
            throw new Error('GivenPointSnapActor必须指定待捕捉的点');
        }

        const snapActor = new GivenPointSnapActor();
        pairs.forEach(item => snapActor.addPair(item.key, item.value));

        return snapActor;
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
            Util.delay(duration, () => this.setCenterInfo(''));
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
                const options = this.options.editResult;
                const newEditResult = options.clone();
                this.createOperation('恢复初始状态', newEditResult);
                break;
            case ' ':
                if (this.onFinish) {
                    this.onFinish(this.editResult);
                }
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

    convertToPixel(map, tileInfo, coordinates) {
        const x = coordinates[0];
        const y = coordinates[1];
        const point = map.project(
            [
                y,
                x,
            ],
        );
        return [
            point.x,
            point.y,
        ];
    }

    convertToGeography(map, tileInfo, coordinates) {
        const x = coordinates[0];
        const y = coordinates[1];
        const lnglat = map.unproject(
            [
                x,
                y,
            ],
        );
        return [
            lnglat.lng,
            lnglat.lat,
        ];
    }
}

export default ComplexTool;
