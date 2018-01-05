import EventController from '../../common/EventController';

/**
 * 反馈控制器,通过本类管理来对Feedback对象和FeedbackLayer进行操作.
 */
export default class FeedbackController {
    /**
     * 构造方法，初始化FeedbackController对象各属性.
     * @returns {undefined}
     */
    constructor() {
        /**
         * 件管理器,用于发送feedbackRefresh事件
         * @type {Object}
         */
        this.eventController = EventController.getInstance();
        /**
         * 反馈容器，存储所有添加到本对象的反馈
         * @type {Array}
         */
        this.feedbacks = [];

        this.eventController.once('DestroySingleton', () => this.destroy());
    }

    /**
     * 向feedbacks属性中添加反馈,并按照priority重新排序.
     * @param {Object} feedback - 增加的反馈对象
     * @return {undefined}
     */
    add(feedback) {
        const existFeedback = this.feedbacks.find(element => element === feedback);

        if (existFeedback) {
            return;
        }

        feedback.setFeedbackController(this);
        this.feedbacks.push(feedback);

        this.feedbacks.sort((a, b) => a.priority - b.priority);
    }

    /**
     * 从feedbacks属性中添删除指定的反馈对象.
     * @param {Object} feedback - 要删除的反馈对象
     * @return {undefined}
     */
    del(feedback) {
        const existFeedback = this.feedbacks.find(item => item === feedback);

        if (!existFeedback) {
            return;
        }

        existFeedback.setFeedbackController(null);

        this.feedbacks = this.feedbacks.filter(item => item !== feedback);
    }

    /**
     * 清空所有反馈.
     * @return {undefined}
     */
    clear() {
        this.feedbacks.forEach(item => {
            item.setFeedbackController(null);
        });
        this.feedbacks = [];
    }

    /**
     * 当触发FEEDBACKREFRESH事件,将反馈中所有符号发送到feedBackLayer中绘制.
     * @return {undefined}
     */
    refresh() {
        let drawItems = [];
        this.feedbacks.forEach(item => {
            drawItems = drawItems.concat(item.getDrawItems());
        });

        this.eventController.fire('FeedbackRefresh', { drawItems: drawItems });
    }

    /**
     * 单例销毁方法.
     * @return {undefined}
     */
    destroy() {
        FeedbackController.instance = null;
    }

    static instance = null;

    /**
     * 获取场反馈控制器单例的静态方法.
     * @example
     * const feedbackController = FeedbackController.getInstance();
     * feedbackController.add(feedback);
     * feedbackController.refresh();
     * @returns {Object} 返回FeedbackController.instance单例对象.
     */
    static getInstance() {
        if (!FeedbackController.instance) {
            FeedbackController.instance = new FeedbackController();
        }
        return FeedbackController.instance;
    }
}
