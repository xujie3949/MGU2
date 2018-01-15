// import EventEmitter from 'wolfy87-eventemitter';
import EventEmitter from 'eventemitter3';

/**
 * 该类对事件进行统一管理
 */
class EventController {
    static instance = null;
    eventEmitter = null;

    /**
     * 初始化事件管理器
     */
    constructor() {
        this.eventEmitter = new EventEmitter();

        this.once('DestroySingleton', () => this.destroy());
    }

    /**
     * 添加事件
     * @param {string} name - 事件名称
     * @param {object} listener - 响应事件的函数
     * @param {object} context - 事件上下文
     */
    on(name, listener, context) {
        this.eventEmitter.on(name, listener, context);
    }

    /**
     * 添加事件
     * @param {string} name - 事件名称
     * @param {object} listener - 响应事件的函数
     * @param {object} context - 事件上下文
     */
    once(name, listener, context) {
        this.eventEmitter.once(name, listener, context);
    }

    /**
     * 删除事件
     * @param {string} name - 事件名称
     * @param {object} listener - 响应事件的函数,可选,如果不传则删除所有响应函数
     */
    off(name, listener) {
        if (listener) {
            this.eventEmitter.off(name, listener);
        } else {
            this.eventEmitter.removeAllListeners(name);
        }
    }

    /**
     * 触发指定事件
     * @param {string} name - 事件名称
     * @param {object} arg - 事件参数,可选
     */
    fire(name, arg) {
        this.eventEmitter.emit(name, arg);
    }

    /**
     * 清空所有事件
     */
    clear() {
        this.eventEmitter.removeAllListeners();
    }

    /**
     * 销毁事件管理器.
     */
    destroy() {
        this.clear();
        EventController.instance = null;
    }

    /**
     * 获取时间管理器单例的静态方法
     * @example
     * const eventController = EventController.getInstance();
     * @returns {Object} 返回 EventController单例对象
     */
    static getInstance() {
        if (!EventController.instance) {
            EventController.instance =
                new EventController();
        }
        return EventController.instance;
    }
}

export default EventController;

