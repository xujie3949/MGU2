import GeoLiveHighlight from './GeoLiveHighlight';
import FeedbackController from '../../mapApi/feedback/FeedbackController';
import Util from '../../common/Util';
import EventController from '../../common/EventController';

/**
 * 高亮模块控制器,负责管理所有被高亮的对象。
 * 统一管理要素的高亮和取消高亮，清除高亮等操作.
 */
export default class HighlightController {
    /** @statis */
    static instance = null;

    /**
     * 初始化构造函数,设置高亮模块引用的反馈操作对象，高亮要素容器.
     * @return {undefined}
     */
    constructor() {
        this.eventController = EventController.getInstance();
        this.feedbackController = FeedbackController.getInstance();
        this.highlightItems = {};
        this.highlightRules = {};

        this.eventController.on('TileLayersLoaded', this.refresh());
    }

    loadConfig(config) {
        if (!config) {
            return;
        }

        Util.forOwn(config, (value, key) => {
            if (Util.has(this.highlightRules, key)) {
                throw new Error(`高亮规则存在重复:${key}`);
            }
            this.highlightRules[key] = value;
        });
    }

    getRule(key) {
        if (!Util.has(this.highlightRules, key)) {
            return null;
        }

        return this.highlightRules[key];
    }

    /**
     * 高亮指定的要素，接收通过getByPid返回的要素数据模型.
     * @param {Object} geoLiveObject - 要素数据模型.
     * @return {null | string}.
     */
    highlight(geoLiveObject) {
        if (!geoLiveObject) {
            return null;
        }

        const type = this.geoLiveObject.geoLiveType;
        const rule = this.getRule(type);
        if (!rule) {
            return null;
        }

        const key = Util.uuid();

        const highlight = new GeoLiveHighlight(geoLiveObject, rule);
        highlight.highlight();
        this.highlightItems[key] = highlight;
        this.feedbackController.add(highlight.feedback);
        this.feedbackController.refresh();
        return key;
    }

    /**
     * 清除指定的要素的高亮效果
     * @param {string} key - 参数为highlight方法的返回的key
     * @return {undefined}.
     */
    unHighlight(key) {
        if (!key) {
            return;
        }

        const highlight = this.highlightItems[key];
        if (!highlight) {
            return;
        }

        this.feedbackController.del(highlight.feedback);
        this.feedbackController.refresh();
        delete this.highlightItems[key];
    }

    /**
     * 清除所有的高亮要素.
     * @return {undefined}.
     */
    clear() {
        const keys = Object.getOwnPropertyNames(this.highlightItems);
        keys.forEach(key => {
            const highlight = this.highlightItems[key];
            this.feedbackController.del(highlight.feedback);
            delete this.highlightItems[key];
        });

        this.feedbackController.refresh();
    }

    /**
     * 判断是否存在高亮要素
     * @returns {boolean}.
     */
    isEmpty() {
        const keys = Object.getOwnPropertyNames(this.highlightItems);
        return keys.length === 0;
    }

    /**
     * 刷新高亮效果.
     * @return {undefined}
     */
    refresh() {
        const keys = Object.getOwnPropertyNames(this.highlightItems);
        keys.forEach(key => {
            const highlight = this.highlightItems[key];
            highlight.highlight();
        });

        this.feedbackController.refresh();
    }

    /**
     * 销毁单例对象.
     * @returns {undefined}
     */
    destroy() {
        this.highlightRules = {};
        this.eventController.off('TileLayersLoaded');
        HighlightController.instance = null;
    }

    /**
     * 获取高亮模块控制管理类单例对象的静态方法.
     * @example
     * const HighlightController = HighlightController.instance();
     * @returns {Object} 返回HighlightController.instance单例对象.
     */
    static getInstance() {
        if (!HighlightController.instance) {
            HighlightController.instance = new HighlightController();
        }
        return HighlightController.instance;
    }
}
