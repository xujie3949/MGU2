import {
    observable,
    action,
    computed,
} from 'mobx';
import { Modal } from 'antd';

import navinfo from 'Navinfo';
import service from 'Services/service';
import stores from 'Stores/stores';

class ImageViewerStore {
    @observable index;

    constructor() {
        this.index = -1;
    }

    @action
    setIndex(value) {
        this.index = value;
    }

    @computed
    get total() {
        if (!stores.trajectoryListStore.selected) {
            return 0;
        }

        return stores.trajectoryListStore.selected.points.length;
    }

    @computed
    get hasPrev() {
        if (this.index <= 0) {
            return false;
        }

        return true;
    }

    @computed
    get hasNext() {
        if (this.index > this.total - 1) {
            return false;
        }

        return true;
    }

    @computed
    get src() {
        if (this.index < 0 || this.index > this.total - 1) {
            return null;
        }

        const point = stores.trajectoryListStore.selected.points[this.index];

        return `data:image/jpeg;base64,${point.photoStr}`;
    }

    async prev() {
        if (!this.hasPrev) {
            return;
        }

        const prevIndex = this.index - 1;
        const point = stores.trajectoryListStore.selected.points[prevIndex];
        await point.fetchDetail();
        this.setIndex(prevIndex);

        const eventController = navinfo.common.EventController.getInstance();
        eventController.fire('SelectedTrajectoryPointChanged', null);
    }

    async next() {
        if (!this.hasNext) {
            return;
        }

        const nextIndex = this.index + 1;
        const point = stores.trajectoryListStore.selected.points[nextIndex];
        await point.fetchDetail();
        this.setIndex(nextIndex);

        const eventController = navinfo.common.EventController.getInstance();
        eventController.fire('SelectedTrajectoryPointChanged', null);
    }
}

const imageViewerStore = new ImageViewerStore();
export default imageViewerStore;
