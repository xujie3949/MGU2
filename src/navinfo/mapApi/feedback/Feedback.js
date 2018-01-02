import GeometryFactory from '../../geometry/GeometryFactory';

/**
 * 反馈由若干符号组成
 */
export default class Feedback {
    /**
     * 构造方法,初始化Feedback对象各属性.
     * @param options {object} -构造选项,包含isDynamic,interval,priority三个选项
     * isDynamic表示feedback是否是动态的,interval表示动态效果间隔时间,priority表示优先级
     * @returns {undefined}
     */
    constructor(options = {}) {
        /**
         * 几何工厂
         * @type {Object}
         */
        this.geometryFactory = GeometryFactory.getInstance();
        /**
         * 反馈管理器
         * @type {Object}
         */
        this.feedbackController = null;
        /**
         * 是否动态反馈
         * @type {number}
         */
        this.isDynamic = options.isDynamic || false;
        /**
         * 动态效果时间间隔
         * @type {number}
         */
        this.interval = options.interval || -1;
        /**
         * 动态效果定时器
         * @type {function}
         * */
        this.timer = null;
        /**
         * 反馈的优先级
         * @type {number}
         */
        this.priority = options.priority || 0;
        /**
         * 一个反馈的符号容器
         * @type {Array}
         * */
        this.items = [];

        this._refreshTimer();
    }

    /**
     * 设置反馈管理器
     */
    setFeedbackController(value) {
        this.feedbackController = value;

        this._refreshTimer();
    }

    /**
     * 设置反馈是否动态
     */
    setIsDynamic(value) {
        this.isDynamic = value;

        this._refreshTimer();
    }

    /**
     * 设置反馈的动态效果间隔时间
     */
    setInterval(value) {
        this.interval = value;

        this._refreshTimer();
    }

    /**
     * 刷新定时器
     */
    _refreshTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }

        if (this.feedbackController && this.isDynamic && this.interval > 0) {
            const items = this.getItems();
            const self = this;
            this.timer = setInterval(() => {
                if (self.getItems().length > 0) {
                    self.setItems([]);
                } else {
                    self.setItems(items);
                }
                self.feedbackController.refresh();
            }, this.interval);
        }
    }

    /**
     * 给反馈中的符号容器中添加用于绘制的符号.
     * @param {Object} geojson - 符号几何对象
     * @param {Object} symbol - 符号对象
     * @return {undefined}
     */
    add(geojson, symbol) {
        if (!geojson || !symbol) {
            return;
        }
        const geometry = this.geometryFactory.fromGeojson(geojson);
        const item = {
            geometry: geometry,
            symbol: symbol,
            type: 'geometry'
        };
        this.items.push(item);

        this._refreshTimer();
    }

    /**
     * 根据符号在反馈中的索引删除该符号.
     * @param {Number} index - 符号在反馈容器的位置索引
     * @return {undefined}
     */
    del(index) {
        this.items.splice(index, 1);

        this._refreshTimer();
    }

    /**
     * 清空反馈中的所有符号.
     * @return {undefined}
     */
    clear() {
        this.items = [];

        this._refreshTimer();
    }

    /**
     * 设置反馈对象中所有的原始项.
     * @param {Array} value - 原始项
     */
    setItems(value) {
        this.items = value;
    }

    /**
     * 获得反馈对象中所有的原始项.
     * @returns {Array} - 原始项
     */
    getItems() {
        return this.items;
    }

    /**
     * 获得反馈对象中所有根据原始对象得到的可绘制项.
     * 基类中可绘制项和原始项完全相同
     * @returns {Array} - 可绘制项
     */
    getDrawItems() {
        return this.items;
    }
}
