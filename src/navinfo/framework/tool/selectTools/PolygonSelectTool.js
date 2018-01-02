import MapTool from '../MapTool';
import Feedback from '../../../mapApi/feedback/Feedback';
import FeedbackController from '../../../mapApi/feedback/FeedbackController';
import GeometryAlgorithm from '../../../geometry/GeometryAlgorithm';
import GeometryFactory from '../../../geometry/GeometryFactory';
import SymbolFactory from '../../../symbol/SymbolFactory';
import FeatureSelector from '../../../mapApi/FeatureSelector';
import SceneController from '../../../mapApi/scene/SceneController';
import EventController from '../../../common/EventController';
import Util from '../../../common/Util';

/**
 * Created by zhaohang on 2017/7/5.
 */
class PolygonSelectTool extends MapTool {
    constructor() {
        super();

        this.name = 'PolygonSelectTool';
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
        this.feedbackController = FeedbackController.getInstance();
        this.sceneController = SceneController.getInstance();
        this.symbolFactory = SymbolFactory.getInstance();
        this.featureSelector = FeatureSelector.getInstance();
        this.eventController = EventController.getInstance();
        this.feedback = null;
        this.finalGeometry = {
            type: 'LineString',
            coordinates: [],
        };
        this.dashPoint = null;
        this.isDrag = false;
        this.selectGeoLiveTypes = null;
        this.centerInfoFeedback = null;
        this.editing = true;
    }

    onActive(onFinish) {
        if (!super.onActive(onFinish)) {
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
        this.resetStatus();

        this.feedback = new Feedback();
        this.feedbackController.add(this.feedback);
        this.centerInfoFeedback = new Feedback();
        this.feedbackController.add(this.centerInfoFeedback);
        this.selectGeoLiveTypes = this.getSelectedGeoLiveTypes();
        this.eventController.on('SceneChanged', this.onSceneChanged);
    }

    shutdown() {
        this.feedbackController.del(this.feedback);
        this.feedbackController.refresh();

        this.resetStatus();

        this.eventController.off('SceneChanged', this.onSceneChanged);
    }

    resetStatus() {
        this.feedback = null;
        this.finalGeometry = {
            type: 'LineString',
            coordinates: [],
        };
        this.dashPoint = null;
        this.isDrag = false;
        this.selectGeoLiveTypes = null;
        this.editing = true;
    }

    resetFeedback() {
        this.feedback.clear();
        if (this.finalGeometry.coordinates.length > 0 && this.dashPoint) {
            const lineString = {
                type: 'LineString',
                coordinates: [],
            };
            lineString.coordinates.push(this.finalGeometry.coordinates[this.finalGeometry.coordinates.length - 1]);
            lineString.coordinates.push(this.dashPoint.coordinates);
            const lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
            this.feedback.add(lineString, lineSymbol);
        }
        if (this.finalGeometry.coordinates.length > 1) {
            const finalLineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_edge');
            this.feedback.add(this.finalGeometry, finalLineSymbol);
        }
        if (this.finalGeometry.coordinates.length > 0) {
            const vertexSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_vertex');

            for (let i = 0; i < this.finalGeometry.coordinates.length; ++i) {
                const vertex = this.coordinatesToPoint(this.finalGeometry.coordinates[i]);
                this.feedback.add(vertex, vertexSymbol);
            }
        }
        this.feedbackController.refresh();
    }

    getSelectedGeoLiveTypes() {
        let geoLiveTypes = [];
        if (!this.options) {
            geoLiveTypes = this.getSceneGeoLiveTypes();
        } else {
            geoLiveTypes = this.options;
        }

        return geoLiveTypes;
    }

    onSceneChanged(args) {
        this.selectGeoLiveTypes = this.getSelectedGeoLiveTypes();
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        if (!this.isDrag) {
            return true;
        }

        if (!this.editing) {
            return false;
        }
        this.dashPoint = this.latlngToGeojson(event.latlng);

        this.resetFeedback();

        return true;
    }

    onLeftButtonClick(event) {
        if (!super.onLeftButtonClick(event)) {
            return false;
        }

        if (!this.editing) {
            return false;
        }

        this.isDrag = true;

        this.finalGeometry.coordinates.push([event.latlng.lng, event.latlng.lat]);

        this.resetFeedback();

        return true;
    }

    onLeftButtonDblClick(event) {
        if (!super.onLeftButtonDblClick(event)) {
            return false;
        }

        if (this.finalGeometry.coordinates.length < 4) {
            this.setCenterInfo('至少需要三个点组成面！', 2000);
            return false;
        }
        this.geometryAlgorithm.close(this.finalGeometry);
        const polygonGeometry = {
            type: 'Polygon',
            coordinates: [this.finalGeometry.coordinates],
        };
        const features = this.featureSelector.selectByGeometry(polygonGeometry, this.selectGeoLiveTypes);
        const options = {
            ctrlKey: event.originalEvent.ctrlKey,
            type: 'PolygonSelectTool',
        };
        this.editing = false;

        if (this.onFinish) {
            this.onFinish(polygonGeometry, event, options);
        }
        return true;
    }

    latlngToGeojson(latlng) {
        const geojson = {
            type: 'Point',
            coordinates: [latlng.lng, latlng.lat],
        };
        return geojson;
    }

    coordinatesToPoint(coordinates) {
        const point = {
            type: 'Point',
            coordinates: coordinates,
        };
        return point;
    }

    setCenterInfo(msg, duration, color) {
        if (!this.centerInfoFeedback) {
            return;
        }

        this.centerInfoFeedback.clear();
        if (!msg) {
            this.resetFeedback();
            return;
        }

        let symbol = this.symbolFactory.getSymbol('relationEdit_tx_center_info');
        symbol = Util.clone(symbol);
        symbol.text = msg;
        if (color) {
            symbol.color = color;
        }
        const latlng = this.map.getBounds().getCenter();
        const point = this.latlngToGeojson(latlng);
        this.centerInfoFeedback.add(point, symbol);
        this.resetFeedback();

        const self = this;
        if (duration) {
            Util.delay(() => this.setCenterInfo(''), duration);
        }
    }
}

export default PolygonSelectTool;
