import SceneController from '../../mapApi/scene/SceneController';
import RenderFactory from '../../mapApi/render/RenderFactory';
import Tool from './Tool';
import Util from '../../common/Util';

/**
 * Created by xujie3949 on 2016/12/8.
 */
class MapTool extends Tool {
    constructor() {
        super();

        this.name = 'MapTool';

        this.sceneController = SceneController.getInstance();
    }

    onActive(map, onFinish, options) {
        if (!super.onActive(map, onFinish, options)) {
            return false;
        }

        this.map.getContainer().style.cursor = 'default';

        return true;
    }

    onWheel(event) {
        if (!super.onWheel(event)) {
            return false;
        }

        if (!this.map) {
            return false;
        }
        let zoom = this.map.getZoom();
        const mousePoint = this.map.mouseEventToLatLng(event);
        if (event.deltaY > 0) {
            if (zoom === this.map.getMinZoom()) {
                return true;
            }
            zoom -= 1;
        } else {
            if (zoom === this.map.getMaxZoom()) {
                return true;
            }
            zoom += 1;
        }
        this.map.setZoomAround(mousePoint, zoom);

        return true;
    }

    onRightButtonClick(event) {
        if (!super.onRightButtonClick(event)) {
            return false;
        }

        this.map.setView(event.latlng);

        return true;
    }

    getSceneGeoLiveTypes() {
        return this.sceneController.getLoadedFeatureTypes();
    }

    getRendersByGeoLiveType(geoLiveType) {
        const renders = [];
        const layers = this.sceneController.getLoadedLayersByFeatureType(geoLiveType);
        for (let i = 0; i < layers.length; i++) {
            if (layers[i].getFeatureType() === geoLiveType) {
                renders.push(layers[i].getRender());
            }
        }

        return Util.uniq(renders);
    }

    symbolizeFeatures(features) {
        this.symbols = [];
        const zoom = this.map.getZoom();
        for (let i = 0; i < features.length; ++i) {
            const feature = features[i];
            const render = RenderFactory.getInstance().getRender(feature.properties.type);
            const symbol = render.getHighlightSymbol(feature, zoom);
            if (!symbol) {
                // 如果要素在某种情况下不需要绘制会返回null
                continue;
            }
            if (Util.isArray(symbol)) {
                this.symbols = this.symbols.concat(symbol);
            } else {
                this.symbols.push(symbol);
            }
        }
    }

    getEditableGeoLiveTypes() {
        return this.sceneController.getEditableFeatureTypes();
    }
}

export default MapTool;
