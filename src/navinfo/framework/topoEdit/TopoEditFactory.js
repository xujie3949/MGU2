import Util from '../../common/Util';
import EventController from '../../common/EventController';

/**
 * Created by xujie3949 on 2016/12/28.
 */

class TopoEditFactory {
    constructor() {
        this.topoEditorClasses = {};

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

    destroy() {
        this.clear();
        TopoEditFactory.instance = null;
    }

    static instance = null;

    static getInstance() {
        if (!TopoEditFactory.instance) {
            TopoEditFactory.instance = new TopoEditFactory();
        }
        return TopoEditFactory.instance;
    }
}

export default TopoEditFactory;

