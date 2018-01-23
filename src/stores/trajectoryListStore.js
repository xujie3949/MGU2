import {
    observable,
    action,
    computed,
} from 'mobx';
import { Modal } from 'antd';

import navinfo from 'navinfo';
import service from 'Services/service';
import stores from 'Stores/stores';
import TrajectoryPoint from 'Models/TrajectoryPoint';
import TrajectoryLine from 'Models/TrajectoryLine';

class TrajectoryListStore {
    @observable.ref data;
    @observable.ref selected;

    constructor() {
        this.data = [];
        this.selected = null;
    }

    @action
    setData(value) {
        this.data = value.map(item => new TrajectoryLine(item));
    }

    @action
    setSelected(value) {
        this.selected = value;
    }

    async fetchTrajectoryLineList(northWest, southEast) {
        try {
            stores.loadingStore.show();

            const start = Date.now();

            const data = await service.getTrajectoryLineList(northWest, southEast);

            const diff = Date.now() - start;

            if (diff < 500) {
                await navinfo.common.Util.delay(500 - diff);
            }

            stores.loadingStore.close();

            if (data.code === 0) {
                this.setData(data.data);
            } else {
                stores.modalStore.error(data.message);
            }
        } catch (err) {
            stores.loadingStore.close();
            stores.modalStore.error(err.message);
        }
    }
}

const trajectoryListStore = new TrajectoryListStore();
export default trajectoryListStore;
