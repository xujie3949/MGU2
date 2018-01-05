import Util from '../../common/Util';
import EventController from '../../common/EventController';

/**
 * 数据显示符号渲染器基类.
 */
export default class RenderFactory {
    static instance = null;

    constructor() {
        this.renderClass = {};

        this._eventController = EventController.getInstance();
        this._eventController.once('DestroySingleton', () => this.destroy());
    }

    register(key, value) {
        if (Util.has(this.renderClass, key)) {
            return;
        }

        this.renderClass[key] = value;
    }

    unRegister(key) {
        if (!Util.has(this.renderClass, key)) {
            return;
        }
        
        delete this.renderClass[key];
    }

    clear() {
        this.renderClass = {};
    }

    /**
     * 获取要素渲染符号的方法.
     * @param {String} key - 关键字
     * @return {Object} - 渲染器
     */
    getRender(key) {
        if (!Util.has(this.renderClass, key)) {
            throw new Error(`${key}没有注册`);
        }
        const renderClass = this.renderClass[key];
        // eslint-disable-next-line new-cap
        const render = new renderClass();
        return render;
    }

    /**
     * 单例销毁方法.
     * @return {undefined}
     */
    destroy() {
        this.clear();
        RenderFactory.instance = null;
    }

    /**
     * 获取RenderFactory单例对象的静态方法
     * @example
     * const renderFactory = RenderFactory.getInstance();
     * @returns {Object} RenderFactory单例对象
     */
    static getInstance() {
        if (!RenderFactory.instance) {
            RenderFactory.instance = new RenderFactory();
        }
        return RenderFactory.instance;
    }
}
