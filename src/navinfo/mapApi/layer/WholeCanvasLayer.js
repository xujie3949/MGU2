import WholeLayer from './WholeLayer';
import GeometryTransform from '../../geometry/GeometryTransform';
import ImageLoader from '../../common/ImageLoader';
import SymbolFactory from '../../symbol/SymbolFactory';
import Logger from '../../common/Logger';
import Util from '../../common/Util';
import RenderFactory from '../render/RenderFactory';

/**
 * @class
 * WholeCanvasLayer类代表整体的图层
 */
export default class WholeCanvasLayer extends WholeLayer {
    /** *
     *
     * @param options 初始化可选options
     */
    constructor(options) {
        super(options);

        // 绑定函数作用域
        // FM.Util.bind(this);

        this._drawItems = {};

        this._transform = GeometryTransform.getInstance();
        this._logger = Logger.getInstance();
    }

    /** *
     * 图层添加到地图时调用
     * @param map
     */
    onAdd(map) {
        this.map = map;
        this._initContainer(this.options);
    }
    /** *
     * 图层被移除时调用
     * @param map
     */
    onRemove(map) {
        map.getPanes().overlayPane.removeChild(this._div);
    }

    /** *
     * 绘制图层内容
     */
    draw(tile, features) {
        const symbols = this._symbolizeFeatures(features);
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

    /** *
     * 清空图层
     */
    clear() {
        this._resetCanvasPosition();
        this._ctx.clearRect(0, 0, this.canv.width, this.canv.height);
        this._drawItems = {};
    }

    _symbolizeFeatures(features) {
        const zoom = this.map.getZoom();

        let symbols = [];
        for (let i = 0; i < features.length; ++i) {
            const feature = features[i];
            if (!this._canDraw(zoom, feature)) {
                continue;
            }

            const render = RenderFactory.getInstance().getRender(feature.type);
            const symbol = render.getSymbol(feature, this.map.getZoom());
            if (!symbol) {
                // 如果要素在某种情况下不需要绘制会返回null
                continue;
            }
            if (Util.isArray(symbol)) {
                symbols = symbols.concat(symbol);
            } else {
                symbols.push(symbol);
            }
        }

        return symbols;
    }

    _canDraw(zoom, feature) {
        if (zoom < 17) {
            // 小于17级时不需要做去重处理,所以总是可绘制
            return true;
        }

        const type = feature.type;
        const id = feature.id;
        const key = `${type}:${id}`;
        if (this._drawItems.hasOwnProperty(key)) {
            // 已经绘制过了
            return false;
        }

        this._drawItems[key] = true;
        return true;
    }

    _onDependencyResourceLoaded(tile, symbols) {
        this._transform.setEnviroment(this.map, tile, this._convertGeometry);
        const g = this._ctx.canvas.getContext('2d');
        for (let i = 0; i < symbols.length; ++i) {
            const symbol = symbols[i];
            const convertedGeometry = this._transform.convertGeometry(symbol.geometry);
            symbol.geometry = convertedGeometry;
            symbol.draw(g);
        }
    }

    _getDependencyResource(symbols) {
        const symbolFactory = SymbolFactory.getInstance();
        let urls = [];
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            urls = urls.concat(symbolFactory.getUrlsFromSymbol(symbol));
        }

        return urls;
    }

    _convertGeometry(map, tile, geometry) {
        const origin = this.map.getPixelBounds().min;
        const x = tile.size * tile.x + geometry.x - origin.x;
        const y = tile.size * tile.y + geometry.y - origin.y;
        geometry.x = x;
        geometry.y = y;
        return geometry;
    }
}
