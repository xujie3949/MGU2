import EventController from '../../common/EventController';
import Util from '../../common/Util';

/**
 * 编辑流程工厂
 */
class SelectObjectController {
    static instance = null;

    /**
     * 创建选择对象管理器实例
     * @returns {undefined}
     */
    constructor() {
        this.objects = [];

        this._eventController = EventController.getInstance();
        this._eventController.once('DestroySingleton', () => this.destroy());
    }

    setObjects(objects) {
        this.objects = objects;
    }

    addObjects(objects) {
        this.objects = Util.concat(this.objects, objects);
    }

    clear() {
        this.objects = [];
    }

    getTopoEditor(operation, geoLiveType, options) {
        const key = `${operation}-${geoLiveType}`;
        if (!Util.has(this.topoEditorClasses, key)) {
            throw new Error(`key未注册:${key}`);
        }
        const topoEditorClass = this.topoEditorClasses[key];
        // eslint-disable-next-line new-cap
        return new topoEditorClass(options);
    }

    /**
     * 销毁单例对象
     * @returns {undefined}
     */
    destroy() {
        this.clear();
        SelectObjectController.instance = null;
    }

    /**
     * 获取编辑流程工厂单例对象的静态方法.
     * @example
     * const editControlFactory = EditControlFactory.getInstance();
     * @returns {Object} EditControlFactory单例对象.
     */
    static getInstance() {
        if (!SelectObjectController.instance) {
            SelectObjectController.instance = new SelectObjectController();
        }
        return SelectObjectController.instance;
    }
}

export default SelectObjectController;
