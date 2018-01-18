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
    @observable playing;
    @observable loading;
    timer;

    constructor() {
        this.index = -1;
        this.playing = false;
        this.loading = false;
        this.timer = null;
    }

    @action
    setIndex(value) {
        this.index = value;
    }

    @action
    setPlaying(value) {
        this.playing = value;
    }

    @action
    setLoading(value) {
        this.loading = value;
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
        if (this.index >= this.total - 1) {
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

    jumpToPoint = async index => {
        try {
            this.setLoading(true);
            const point = stores.trajectoryListStore.selected.points[index];
            await point.fetchDetail();
            this.setIndex(index);
            const eventController = navinfo.common.EventController.getInstance();
            eventController.fire('SelectedTrajectoryPointChanged', null);
            this.setLoading(false);
        } catch (err) {
            const logger = navinfo.common.Logger.getInstance();
            logger.log(err.message);
            this.setLoading(false);
        }
    };

    first = async () => {
        const index = 0;

        if (this.index === index) {
            return;
        }

        if (this.loading) {
            return;
        }

        await this.jumpToPoint(index);
    };

    prev = async () => {
        if (!this.hasPrev) {
            return;
        }

        if (this.loading) {
            return;
        }

        const prevIndex = this.index - 1;
        await this.jumpToPoint(prevIndex);
    };

    reversePlay = async () => {
        this.setPlaying(true);

        this.timer = window.setInterval(() => {
            if (!this.playing) {
                return;
            }

            if (!this.hasPrev) {
                this.pause();
                return;
            }

            this.prev();
        }, 200);

        const eventController = navinfo.common.EventController.getInstance();
        eventController.fire('TrajectoryPlay', { type: 'reverse' });
    };

    pause = () => {
        if (!this.playing) {
            return;
        }

        this.setPlaying(false);
        service.cancelRequest();
        window.clearInterval(this.timer);
        this.timer = null;

        const eventController = navinfo.common.EventController.getInstance();
        eventController.fire('TrajectoryPause', { type: 'reverse' });
    };

    play = async () => {
        this.setPlaying(true);

        this.timer = window.setInterval(() => {
            if (!this.playing) {
                return;
            }

            if (!this.hasNext) {
                this.pause();
                return;
            }

            this.next();
        }, 200);

        const eventController = navinfo.common.EventController.getInstance();
        eventController.fire('TrajectoryPlay', { type: 'play' });
    };

    next = async () => {
        if (!this.hasNext) {
            return;
        }

        if (this.loading) {
            return;
        }

        const nextIndex = this.index + 1;
        await this.jumpToPoint(nextIndex);
    };

    last = async () => {
        const lastIndex = this.total - 1;

        if (this.index === lastIndex) {
            return;
        }

        if (this.loading) {
            return;
        }

        await this.jumpToPoint(lastIndex);
    };
}

const imageViewerStore = new ImageViewerStore();
export default imageViewerStore;
