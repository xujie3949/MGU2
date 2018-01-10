import Util from '../../common/Util';

/**
 * Created by xujie3949 on 2016/12/8.
 */

class Editor {
    constructor(options) {
        this.options = options;
        this.isEditing = false;
        this.onFinish = null;
        this.editResultMapping = {};
    }

    register(key, value) {
        if (Util.has(this.editResultMapping, key)) {
            throw new Error(`key已经存在:${key}`);
        }

        this.editResultMapping[key] = value;
    }

    unRegister(key) {
        if (!Util.has(this.editResultMapping, key)) {
            return;
        }

        delete this.editResultMapping[key];
    }

    start() {
        if (this.isEditing) {
            return;
        }

        this.isEditing = true;
    }

    stop() {
        if (!this.isEditing) {
            return;
        }

        this.isEditing = false;
    }

    abort() {
        this.isEditing = false;
    }
}

export default Editor;
