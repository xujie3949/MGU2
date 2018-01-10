import EventController from '../../common/EventController';
import Util from '../../common/Util';

/**
 * 编辑流程工厂
 */
class EditControlFactory {
    static instance = null;

    /**
     * 创建编辑流程工厂实例
     * @returns {undefined}
     */
    constructor() {
        this.currentControl = null;

        this._eventController = EventController.getInstance();
        this._eventController.once('DestroySingleton', () => this.destroy());
    }

    register(operation, geoLiveType, topoEditor) {
        const key = `${operation}-${geoLiveType}`;
        if (Util.has(this.topoEditorClasses, key)) {
            throw new Error(`key已经注册:${key}`);
        }

        this.topoEditorClasses[key] = topoEditor;
    }

    unRegister(operation, geoLiveType) {
        const key = `${operation}-${geoLiveType}`;
        if (!Util.has(this.topoEditorClasses, key)) {
            return;
        }

        delete this.topoEditorClasses[key];
    }

    clear() {
        this.topoEditorClasses = {};
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
        EditControlFactory.instance = null;
    }

    /**
     * 获取编辑流程工厂单例对象的静态方法.
     * @example
     * const editControlFactory = EditControlFactory.getInstance();
     * @returns {Object} EditControlFactory单例对象.
     */
    static getInstance() {
        if (!EditControlFactory.instance) {
            EditControlFactory.instance = new EditControlFactory();
        }
        return EditControlFactory.instance;
    }
}

export default EditControlFactory;
