import GeometryFactory from '../../geometry/GeometryFactory';
import SymbolFactory from '../../symbol/SymbolFactory';

/**
 * 要素渲染类的基类.
 */
export default class Renderer {
    /**
     * 初始化构造函数.
     * @returns {undefined}
     */
    constructor() {
        /**
         * 符号工厂
         * @type {Object}
         */
        this._symbolFactory = SymbolFactory.getInstance();

        /**
         * 几何工厂
         * @type {Object}
         */
        this._geometryFactory = GeometryFactory.getInstance();
        /**
         * 要素的渲染数据
         * @type {Object}
         */
        this._feature = null;
        /**
         * 地图的缩放级别
         * @type {Number}
         */
        this._zoom = null;
    }

    /**
     * 抽象方法,必须在子类中重写此方法
     * @abstract
     * @param {Object} feature - 服务返回的渲染数据
     * @param {Number} zoom - 当前请求的地图级别
     * @return {Object} - 根据渲染模型创建的渲染符号
     */
    getSymbol(feature, zoom) {
        throw new Error(`${this.feature.type}要素对应Render未实现getSymbol方法`);
    }

    /**
     * 抽象方法,必须在子类中重写此方法
     * @abstract
     * @param {Object} feature - 服务返回的渲染数据
     * @param {Number} zoom - 当前请求的地图级别
     * @return {Object} - 根据渲染模型创建的高亮符号
     */
    getHighlightSymbol(feature, zoom) {
        throw new Error(`${this.feature.type}要素对应Render未实现getHighlightSymbol方法`);
    }
}
