import MapTool from '../MapTool';
import Feedback from '../../../mapApi/feedback/Feedback';
import FeedbackController from '../../../mapApi/feedback/FeedbackController';
import GeometryFactory from '../../../geometry/GeometryFactory';
import FeatureSelector from '../../../mapApi/FeatureSelector';

/**
 * Created by xujie3949 on 2016/12/28.
 */

class PointSelectTool extends MapTool {
    constructor() {
        super();

        this.name = 'PointSelectTool';

        this.feedbackController = FeedbackController.getInstance();
        this.geometryFactory = GeometryFactory.getInstance();
        this.featureSelector = FeatureSelector.getInstance();
        this.feedback = null;
        this.selectGeoLiveTypes = [];
        this.selectTolerance = 10;
        this.symbols = [];
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
        this.resetStatus();

        this.feedback = new Feedback();
        this.feedbackController.add(this.feedback);
        this.selectGeoLiveTypes = this.getSelectedGeoLiveTypes();
        this.map.on('SceneChanged', this.onSceneChanged);
    }

    shutdown() {
        this.feedbackController.del(this.feedback);
        this.feedbackController.refresh();
        this.map.off('SceneChanged', this.onSceneChanged);
        this.resetStatus();
    }

    resetStatus() {
        this.feedback = null;
        this.selectGeoLiveTypes = [];
        this.symbols = [];
    }

    onSceneChanged() {
        this.selectGeoLiveTypes = this.getSelectedGeoLiveTypes();
    }
    
    getSelectedGeoLiveTypes() {
        let geoLiveTypes = [];
        if (!this.options) {
            geoLiveTypes = this.getEditableGeoLiveTypes();
        } else {
            geoLiveTypes = [this.options];
        }

        return geoLiveTypes;
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        const point = this.latlngToGeojson(event.latlng);
        const box = this.getBox(point, this.selectTolerance);
        const features = this.featureSelector.selectByGeometry(box, this.selectGeoLiveTypes);
        this.symbolizeFeatures(features);
        this.resetFeedback();

        return true;
    }
    
    onLeftButtonClick(event) {
        if (!super.onLeftButtonClick(event)) {
            return false;
        }

        const point = this.latlngToGeojson(event.latlng);
        const box = this.getBox(point, this.selectTolerance);
        const features = this.featureSelector.selectByGeometry(box, this.selectGeoLiveTypes);

        if (this.onFinish) {
            this.onFinish(features, event);
        }

        return true;
    }

    getBox(point, tolerance) {
        const x = point.coordinates[0];
        const y = point.coordinates[1];
        const pixelPoint = this.map.project([y, x]);
        const left = pixelPoint.x - tolerance;
        const right = pixelPoint.x + tolerance;
        const top = pixelPoint.y - tolerance;
        const bottom = pixelPoint.y + tolerance;

        const geojson = {
            type: 'Polygon',
            coordinates: [],
        };

        const coordinates = [];
        const leftTop = this.map.unproject([left, top]);
        const rightTop = this.map.unproject([right, top]);
        const rightBottom = this.map.unproject([right, bottom]);
        const leftBottom = this.map.unproject([left, bottom]);

        coordinates.push([leftTop.lng, leftTop.lat]);
        coordinates.push([rightTop.lng, rightTop.lat]);
        coordinates.push([rightBottom.lng, rightBottom.lat]);
        coordinates.push([leftBottom.lng, leftBottom.lat]);
        coordinates.push([leftTop.lng, leftTop.lat]);

        geojson.coordinates = [coordinates];

        return geojson;
    }

    resetFeedback() {
        if (!this.feedback) {
            return;
        }

        this.feedback.clear();

        this.symbols.forEach(function (symbol) {
            const geometry = this.geometryFactory.toGeojson(symbol.geometry);
            this.feedback.add(geometry, symbol);
        }, this);

        this.feedbackController.refresh();
    }

    latlngToGeojson(latlng) {
        const geojson = {
            type: 'Point',
            coordinates: [latlng.lng, latlng.lat],
        };
        return geojson;
    }
}

export default PointSelectTool;

