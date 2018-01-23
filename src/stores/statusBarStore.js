import {
    observable,
    action,
    computed,
} from 'mobx';
import { Modal } from 'antd';

import navinfo from 'navinfo';

class StatusBarStore {
    @observable toolName;
    @observable.ref mousePoint;
    @observable zoom;

    constructor() {
        this.toolName = null;
        this.mousePoint = null;
        this.zoom = null;

        const eventController = navinfo.common.EventController.getInstance();
        eventController.on('ToolChanged', this.onToolChanged);
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

    onToolChanged = e => {
        if (!e.newCurrentTool) {
            this.setToolName(null);
            return;
        }
        this.setToolName(e.newCurrentTool.name);
    };
}

const statusBarStore = new StatusBarStore();
export default statusBarStore;
