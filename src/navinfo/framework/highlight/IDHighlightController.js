import IDHighlight from './IDHighlight';
import FeedbackController from '../../mapApi/feedback/FeedbackController';
import Util from '../../common/Util';
import EventController from '../../common/EventController';

/**
 * 高亮模块控制器,负责管理所有被高亮的对象。
 * 统一管理要素的高亮和取消高亮，清除高亮等操作.
 */
export default class IDHighlightController {
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
        this.map = null;

        this.eventController.on('TileLayersLoaded', this.refresh);
        this.eventController.once('DestroySingleton', () => this.destroy());
    }

    /**
     * 高亮指定的id
     * @param {Object || Array} value - 需要高亮的id等信息,可以是单个对象或者数组
     * @param {Object} options - 控制本次高亮所使用的的反馈
     * @return {null | string}.
     */
    highlight(value, options = {}) {
        if (!value) {
            return null;
        }

        const key = Util.uuid();

        const highlight = new IDHighlight(value, options);
        highlight.highlight();
        this.highlightItems[key] = highlight;
        this.feedbackController.add(highlight.feedback);
        this.feedbackController.refresh();
        return key;
    }

    /**
     * 清除指定的id的高亮效果
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
        this.eventController.off('TileLayersLoaded');
        IDHighlightController.instance = null;
    }

    /**
     * 获取高亮模块控制管理类单例对象的静态方法.
     * @example
     * const idHighlightController = IDHighlightController.instance();
     * @returns {Object} IDHighlightController单例对象.
     */
    static getInstance() {
        if (!IDHighlightController.instance) {
            IDHighlightController.instance = new IDHighlightController();
        }
        return IDHighlightController.instance;
    }
}
