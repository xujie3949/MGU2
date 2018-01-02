import WholeLayer from './WholeLayer';
import Util from '../../common/Util';
import EventController from '../../common/EventController';
import GeometryFactory from '../../geometry/GeometryFactory';
import GeometryTransform from '../../geometry/GeometryTransform';
import GeometryAlgorithm from '../../geometry/GeometryAlgorithm';
import SymbolFactory from '../../symbol/SymbolFactory';
import FeatureSelector from '../FeatureSelector';
import ImageLoader from '../../common/ImageLoader';
import Logger from '../../common/Logger';

/**
 * Created by xujie on 2016-11-26.
 * FeedbackLayer类代表整体的图层
 * 所有的高亮，编辑等创建的反馈都应该在此图层中绘制
 */
export default class FeedbackLayer extends WholeLayer {
    options = {};

    /** *
     *
     * @param options 初始化可选options
     */
    constructor(options) {
        super();

        Util.merge(this.options, options);

        this.eventController = EventController.getInstance();
        this.geometryFactory = GeometryFactory.getInstance();
        this.transform = GeometryTransform.getInstance();
        this.featureSelector = FeatureSelector.getInstance();
        this.symbolFactory = SymbolFactory.getInstance();
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
        this.logger = Logger.getInstance();
    }

    onAdd(map) {
        this.map = map;
        this._initContainer(this.options);

        this._drawItems = [];
        this.eventController.on('FeedbackRefresh', this._onFeedbackRefresh, this);
        map.on('moveend', this._redraw, this);
    }

    onRemove(map) {
        this.map.getPanes()
            .overlayPane
            .removeChild(this._div);

        this.eventController.off('FeedbackRefresh', this._onFeedbackRefresh, this);
        map.off('moveend', this._redraw, this);

        this.map = null;
    }

    /**
     * 响应FEEDBACKREFRESH事件
     * @param event
     */
    _onFeedbackRefresh(event) {
        this._drawItems = event.drawItems;
        this._redraw();
    }

    /** *
     * 绘制图层内容
     */
    _draw() {
        const urls = this._getDependencyResource(this._drawItems);
        const loader = new ImageLoader(urls);
        const self = this;
        loader.load()
            .then(() => {
                self._onDependencyResourceLoaded();
            })
            .catch(e => {
                this.logger.log(e);
            });
    }

    _onDependencyResourceLoaded() {
        // 由于绘制是异步的,所有只有在异步请求完成之后清空canvas才能
        // 保证在连续绘制的时候不出现重复绘制问题
        this._clear();
        this.transform.setEnviroment(this.map, null, this._convertGeometry);
        const g = this._ctx.canvas.getContext('2d');
        for (let i = 0; i < this._drawItems.length; ++i) {
            const item = this._drawItems[i];
            const convertedGeometry = this.transform.convertGeometry(item.geometry);
            const symbol = item.symbol;
            symbol.geometry = convertedGeometry;
            symbol.draw(g);
        }
    }

    _getDependencyResource(drawItems) {
        let urls = [];
        for (let i = 0; i < drawItems.length; i++) {
            const item = drawItems[i];
            const symbol = item.symbol;
            if (!symbol) {
                continue;
            }

            urls = urls.concat(this.symbolFactory.getUrlsFromSymbol(symbol));
        }

        return urls;
    }

    _convertGeometry(map, tile, geometry) {
        const point = map.latLngToContainerPoint([geometry.y, geometry.x]);
        geometry.x = point.x;
        geometry.y = point.y;
        return geometry;
    }

    /** *
     * 重绘图层
     */
    _redraw() {
        this._resetCanvasPosition();

        this._draw();
    }

    /** *
     * 清空图层
     */
    _clear() {
        this._ctx.clearRect(0, 0, this.canv.width, this.canv.height);
    }
}
