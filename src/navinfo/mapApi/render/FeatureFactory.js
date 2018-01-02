import Util from '../../common/Util';

/**
 * 数据显示符号渲染器基类.
 */
export default class FeatureFactory {
    static instance = null;

    constructor() {
        this.featureCreator = {};
    }

    register(key, value) {
        if (Util.has(this.featureCreator, key)) {
            return;
        }

        this.featureCreator[key] = value;
    }

    unRegister(key) {
        if (!Util.has(this.featureCreator, key)) {
            return;
        }
        
        delete this.featureCreator[key];
    }

    clear() {
        this.featureCreator = {};
    }

    /**
     * 创建要素
     * @param {String|Number} key - key
     * @param {Object} data - 要素data
     * @param {Object} tile - 瓦片信息
     * @return {Object} - 要素对象
     */
    createFeature(key, data, tile) {
        if (!Util.has(this.featureCreator, key)) {
            throw new Error(`${key}没有注册`);
        }
        const featureCreator = this.featureCreator[key];
        return featureCreator(data, tile);
    }

    /**
     * 单例销毁方法.
     * @return {undefined}
     */
    destroy() {
        this.clear();
        FeatureFactory.instance = null;
    }

    /**
     * 获取FeatureFactory单例对象的静态方法
     * @example
     * const featureFactory = FeatureFactory.getInstance();
     * @returns {Object} FeatureFactory单例对象
     */
    static getInstance() {
        if (!FeatureFactory.instance) {
            FeatureFactory.instance = new FeatureFactory();
        }
        return FeatureFactory.instance;
    }
}
