import {
    observable,
    action,
    computed,
} from 'mobx';
import { Modal } from 'antd';

import service from 'Services/service';
import delay from 'Utils/delay';
import User from 'Models/User';
import loadingStore from 'Stores/loadingStore';
import userStore from 'Stores/userStore';

class ImageViewerStore {
    @observable src;

    constructor() {
        this.src = null;
    }

    @action
    setSrc(value) {
        this.src = value;
    }

    @computed
    get hasSrc() {
        if (!this.src) {
            return false;
        }

        return true;
    }
}

const imageViewerStore = new ImageViewerStore();
export default imageViewerStore;
