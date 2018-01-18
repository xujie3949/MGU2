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
import FeatureSelector from '../../../../mapApi/FeatureSelector';
import GeojsonTransform from '../../../../mapApi/GeojsonTransform';
import OperationController from '../../../operation/OperationController';
import GeometryAlgorithm from '../../../../geometry/GeometryAlgorithm';
import GeometryFactory from '../../../../geometry/GeometryFactory';
import SymbolFactory from '../../../../symbol/SymbolFactory';
import EventController from '../../../../common/EventController';
import Util from '../../../../common/Util';
import ShapeEditor from '../ShapeEditor';

/**
 * Created by xujie3949 on 2016/12/8.
 */

class ShapeTool extends MapTool {
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
        this.shapeEditor = ShapeEditor.getInstance();
        this.eventController = EventController.getInstance();
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
    }

    shutdown() {
        this.uninstallFeedbacks();
        this.uninstallSnapActors();
        this.snapController.shutdown();
        this.refreshFeedback();
    }

    resetStatus() {
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

    createFeatureSnapActor(layerId, exceptions) {
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

    createGivenPointSnapActor(pairs) {
        if (!pairs) {
            throw new Error('GivenPointSnapActor必须指定待捕捉的点');
        }

        const snapActor = new GivenPointSnapActor();
        pairs.forEach(item => snapActor.addPair(item.key, item.value));

        return snapActor;
    }

    createNearestLocationSnapActor(geometry) {
        if (!geometry) {
            throw new Error('NearestLocationSnapActor必须指定捕捉的几何');
        }

        const snapActor = new NearestLocationSnapActor();
        snapActor.geometry = geometry;

        return snapActor;
    }

    createNearestVertexSnapActor(geometry, canSnapStart, canSnapEnd) {
        if (!geometry) {
            throw new Error('NearestVertexSnapActor必须指定捕捉的几何');
        }

        const snapActor = new NearestVertexSnapActor();
        snapActor.geometry = geometry;
        snapActor.canSnapStart = canSnapStart;
        snapActor.canSnapEnd = canSnapEnd;

        return snapActor;
    }

    createFullScreenFeatureSnapActor(layerId, exceptions) {
        if (!layerId) {
            throw new Error('FeatureSnapActor必须指定捕捉的层');
        }

        const snapActor = new FullScreenFeatureSnapActor();
        snapActor.layerId = layerId;

        if (exceptions) {
            for (let i = 0; i < exceptions.length; ++i) {
                const exception = exceptions[i];
                snapActor.addSnapException(exception);
            }
        }

        return snapActor;
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

        // 和服务端存的数据精度保持一致；
        const mousePoint = this.latlngToPoint(event.latlng);

        this.mousePoint = mousePoint;

        this.resetMouseInfoFeedback();

        return true;
    }

    onLeftButtonDown(event) {
        if (!super.onLeftButtonDown(event)) {
            return false;
        }

        return true;
    }

    onLeftButtonUp(event) {
        if (!super.onLeftButtonUp(event)) {
            return false;
        }

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
                this.shapeEditor.createOperation('恢复初始状态', newEditResult);
                break;
            case ' ':
                if (this.onFinish) {
                    this.onFinish(null);
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

export default ShapeTool;
