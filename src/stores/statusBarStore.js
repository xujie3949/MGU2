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

class StatusBarStore {
    @observable toolName;
    @observable.ref mousePoint;
    @observable zoom;

    constructor() {
        this.toolName = null;
        this.mousePoint = null;
        this.zoom = null;
    }

    @action
    setToolName(value) {
        this.toolName = value;
    }

    @action
    setMousePoint(value) {
        this.mousePoint = value;
    }

    @action
    setZoom(value) {
        this.zoom = value;
    }

    @computed
    get coordinates() {
        if (!this.mousePoint) {
            return '';
        }

        return `${this.mousePoint.coordinates[0].toFixed(10)},${this.mousePoint.coordinates[1].toFixed(10)}`;
    }
}

const statusBarStore = new StatusBarStore();
export default statusBarStore;