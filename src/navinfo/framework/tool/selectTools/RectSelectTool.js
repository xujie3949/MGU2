import MapTool from '../MapTool';
import Feedback from '../../../mapApi/feedback/Feedback';
import FeedbackController from '../../../mapApi/feedback/FeedbackController';
import GeometryAlgorithm from '../../../geometry/GeometryAlgorithm';
import GeometryFactory from '../../../geometry/GeometryFactory';
import GeojsonTransform from '../../../mapApi/GeojsonTransform';
import SymbolFactory from '../../../symbol/SymbolFactory';
import FeatureSelector from '../../../mapApi/FeatureSelector';
import SceneController from '../../../mapApi/scene/SceneController';
import EventController from '../../../common/EventController';
import Util from '../../../common/Util';

/**
 * Created by xujie3949 on 2016/12/28.
 */

class RectSelectTool extends MapTool {
    constructor() {
        super();

        this.name = 'RectSelectTool';

        this.feedbackController = FeedbackController.getInstance();
        this.sceneController = SceneController.getInstance();
        this.symbolFactory = SymbolFactory.getInstance();
        this.featureSelector = FeatureSelector.getInstance();
        this.geometryFactory = GeometryFactory.getInstance();
        this.geojsonTransform = GeojsonTransform.getInstance();
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
        this.eventController = EventController.getInstance();

        this.selectSquareFeedBack = null;
        this.selectFeatureFeedBack = null;
        this.startPoint = null;
        this.endPoint = null;
        this.isDrag = false;
        this.selectGeoLiveTypes = null;
        this.selectedFeatures = [];
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
        // 分别添加feedback;
        this.selectSquareFeedBack = Feedback();
        this.feedbackController.add(this.selectSquareFeedBack);
        this.selectFeatureFeedBack = Feedback();
        this.feedbackController.add(this.selectFeatureFeedBack);
        this.selectGeoLiveTypes = this.getSelectedGeoLiveTypes();
        this.eventController.on('SceneChanged', this.onSceneChanged);
    }

    shutdown() {
        this.feedbackController.del(this.selectSquareFeedBack);
        this.feedbackController.del(this.selectFeatureFeedBack);
        this.feedbackController.refresh();

        this.resetStatus();

        this.eventController.off('SceneChanged', this.onSceneChanged);
    }

    resetStatus() {
        this.selectSquareFeedBack = null;
        this.selectFeatureFeedBack = null;
        this.startPoint = null;
        this.endPoint = null;
        this.isDrag = false;
        this.selectGeoLiveTypes = null;
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

    onSceneChanged(args) {
        this.selectGeoLiveTypes = this.getSelectedGeoLiveTypes();
    }

    refresh() {
        this.resetSquareFeedback();
        this.resetFeatureFeedback();
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

    resetSquareFeedback() {
        if (!this.selectSquareFeedBack) {
            return;
        }

        this.selectSquareFeedBack.clear();

        if (this.isDrag && this.startPoint && this.endPoint) {
            const box = this.getSelectBox(this.startPoint, this.endPoint);
            const symbol = this.symbolFactory.getSymbol('selectTool_py_rectSelect');
            this.selectSquareFeedBack.add(box, symbol);
        }

        this.feedbackController.refresh();
    }

    resetFeatureFeedback() {
        if (!this.selectFeatureFeedBack) {
            return;
        }
        this.selectFeatureFeedBack.clear();

        if (this.symbols && this.symbols.length) {
            this.symbols.forEach(highLightSymbol => {
                const geometry = this.geometryFactory.toGeojson(highLightSymbol.geometry);
                this.selectFeatureFeedBack.add(geometry, highLightSymbol);
            });
        }

        this.feedbackController.refresh();
    }

    onLeftButtonDown(event) {
        if (!super.onLeftButtonDown(event)) {
            return false;
        }

        this.startPoint = this.latlngToGeojson(event.latlng);
        this.isDrag = true;

        return true;
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        if (!this.isDrag) {
            return true;
        }

        this.endPoint = this.latlngToGeojson(event.latlng);

        this.resetSquareFeedback();

        return true;
    }

    modifyFeatures(features) {
        const addItems = Util.differenceBy(this.selectedFeatures, features, 'properties.id');
        const remainItems = Util.differenceBy(features, this.selectedFeatures, 'properties.id');
        this.selectedFeatures = remainItems.concat(addItems);
    }

    onLeftButtonUp(event) {
        if (!super.onLeftButtonUp(event)) {
            return false;
        }

        if (!this.isDrag) {
            return false;
        }

        this.isDrag = false;

        this.endPoint = this.latlngToGeojson(event.latlng);

        const box = this.getSelectBox(this.startPoint, this.endPoint);
        this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);
        const pixelBox = this.geometryAlgorithm.bbox(this.geojsonTransform.convertGeometry(box));
        const lengthX = Math.abs(pixelBox.maxX - pixelBox.minX);
        const lengthY = Math.abs(pixelBox.maxY - pixelBox.minY);
        const boxPixelArea = lengthX * lengthY;

        const features = this.featureSelector.selectByGeometry(box, this.selectGeoLiveTypes);
        // 框选框面积小于100并且没有框选到数据则认为不是要清除高亮和回收面板;
        if (!features.length && boxPixelArea < 100) {
            this.resetSquareFeedback();
            return false;
        }

        if (event.originalEvent.ctrlKey) {
            this.modifyFeatures(features);
        } else {
            this.selectedFeatures = features;
        }

        this.symbolizeFeatures(this.selectedFeatures);
        this.refresh();

        const options = {
            ctrlKey: event.originalEvent.ctrlKey,
            type: 'rectSelect',
        };

        if (this.onFinish) {
            this.onFinish(this.selectedFeatures, event, options);
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

    getSelectBox(point1, point2) {
        const minLng = Math.min(point1.coordinates[0], point2.coordinates[0]);
        const minLat = Math.min(point1.coordinates[1], point2.coordinates[1]);
        const maxLng = Math.max(point1.coordinates[0], point2.coordinates[0]);
        const maxLat = Math.max(point1.coordinates[1], point2.coordinates[1]);

        const coordinates = [];
        coordinates.push([minLng, minLat]);
        coordinates.push([minLng, maxLat]);
        coordinates.push([maxLng, maxLat]);
        coordinates.push([maxLng, minLat]);
        coordinates.push([minLng, minLat]);

        const geojson = {
            type: 'Polygon',
            coordinates: [coordinates],
        };
        return geojson;
    }
}

export default RectSelectTool;

