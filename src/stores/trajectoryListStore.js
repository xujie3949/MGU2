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

class TrajectoryListStore {
    @observable.ref data;
    @observable.ref selectedIndex;

    constructor() {
        this.data = [];
        this.selectedIndex = -1;
    }

    @action
    setData(value) {
        this.data = value;
    }

    @action
    setSelectedIndex(value) {
        this.selectedIndex = value;
    }

    @computed
    get selected() {
        if (this.selectedIndex < 0 || this.selectedIndex > this.data.length - 1) {
            return null;
        }
        return this.data[this.selectedIndex];
    }

    async fetchData() {
        try {
            loadingStore.show();

            const start = Date.now();

            const data = await service.getTrajectoryList('hanxuesong01664', '016640');

            const diff = Date.now() - start;

            if (diff < 500) {
                await delay(500 - diff);
            }

            loadingStore.close();

            if (data.code === 0) {
                this.setData(data.data);
            } else {
                Modal.error(data.message);
            }
        } catch (err) {
            loadingStore.close();
            Modal.error(err.message);
        }
    }

    logout() {
        userStore.setUser(null);
        userStore.clearUserInfo();
    }
}

const trajectoryListStore = new TrajectoryListStore();
export default trajectoryListStore;
