import WholeCanvasLayer from './WholeCanvasLayer';
import SourceController from '../source/SourceController';
import ImageLoader from '../../common/ImageLoader';
import Logger from '../../common/Logger';
import Util from '../../common/Util';
import RenderFactory from '../render/RenderFactory';

/**
 * @class
 */
export default class VectorLayer extends WholeCanvasLayer {
    constructor(options) {
        super(options);

        this._sourceController = SourceController.getInstance();
        this._sceneLayers = [];
        this._size = 20; // 最多可加载的sceneLayer的个数
        this._logger = Logger.getInstance();
    }
    /** *
     * 绘制图层内容
     */
    draw(tile) {
        const symbols = this._getSymbols(tile);
        const urls = this._getDependencyResource(symbols);
        const loader = new ImageLoader(urls);
        loader.load()
            .then(() => {
                this._onDependencyResourceLoaded(tile, symbols);
            })
            .catch(e => {
                this._logger.log(e);
            });
    }

    _getSymbols(tile) {
        const symbols = [];
        const zoom = this.map.getZoom();
        for (let i = 0; i < this._sceneLayers.length; i++) {
            const sceneLayer = this._sceneLayers[i];
            if (!sceneLayer.canDraw(zoom)) {
                continue;
            }

            const options = sceneLayer.getOptions();
            if (!options.featureType || !options.source) {
                continue;
            }

            const render = RenderFactory.getInstance().getRender(options.featureType);
            const source = this._sourceController.getSource(options.source);
            const features = source.queryFeaturesByType(options.featureType, tile.fullName);

            Array.prototype.push.apply(symbols, this._symbolizeFeatures(features, sceneLayer, render));
        }

        return symbols;
    }

    _symbolizeFeatures(features, sceneLayer, render) {
        const symbols = [];
        for (let i = 0; i < features.length; ++i) {
            const feature = features[i];
            if (!this._canDraw(feature, sceneLayer)) {
                continue;
            }

            const symbol = render.getSymbol(feature, this.map.getZoom());
            if (!symbol) {
                // 如果要素在某种情况下不需要绘制会返回null
                continue;
            }
            if (Util.isArray(symbol)) {
                Array.prototype.push.apply(symbols, symbol);
            } else {
                symbols.push(symbol);
            }
        }

        return symbols;
    }

    _canDraw(feature, sceneLayer) {
        const zoom = this.map.getZoom();
        const filterObj = sceneLayer.options.unique;
        const minEditZoom = sceneLayer.options.minEditZoom || sceneLayer.options.minZoom;
        if (filterObj) {
            if (zoom < filterObj.level) {
                return true;
            }
        } else {
            if (zoom < minEditZoom) {
                // 小于最小可编辑级别时不需要做去重处理,所以总是可绘制
                return true;
            }
        }

        const type = feature.type;
        const id = feature.id;
        const key = `${sceneLayer.id}:${type}:${id}`;
        if (this._drawItems.hasOwnProperty(key)) {
            // 已经绘制过了
            return false;
        }

        this._drawItems[key] = true;
        return true;
    }

    addSceneLayer(sceneLayer) {
        sceneLayer.setLeafletLayer(this);
        this._sceneLayers.push(sceneLayer);
    }

    removeSceneLayer(sceneLayer) {
        const index = this._sceneLayers.indexOf(sceneLayer);
        if (index >= 0) {
            this._sceneLayers.splice(index, 1);
            sceneLayer.setLeafletLayer(null);
        }
    }

    getSceneLayers() {
        return this._sceneLayers;
    }

    available() {
        return this._sceneLayers.length <= this._size;
    }
}
