import {
    observable,
    action,
    computed,
} from 'mobx';

import navinfo from 'Navinfo';
import service from 'Services/service';
import stores from 'Stores/stores';
import TrajectoryPoint from 'Models/TrajectoryPoint';

class TrajectoryLine {
    platform;
    worker;
    date;
    @observable.ref points;

    constructor(json) {
        this.platform = null;
        this.worker = null;
        this.date = null;
        this.points = [];

        this.fromJson(json);
    }

    @action
    setPoints(value) {
        this.points = value.map((point, index) => {
            point.id = index;
            return new TrajectoryPoint(point);
        });
    }

    @computed
    get key() {
        return `${this.platform}-${this.worker}-${this.date}`;
    }

    fromJson(json) {
        this.platform = json.plateform;
        this.worker = json.collectUser;
        this.date = json.utcdate;
        if (json.points) {
            this.setPoints(json.points);
        }
    }

    toJson() {
        const pointsJson = this.points.map(point => point.toJson());
        return {
            platform: this.platform,
            worker: this.worker,
            date: this.date,
            points: this.pointsJson,
        };
    }

    async fetchDetail() {
        try {
            stores.loadingStore.show();

            const start = Date.now();

            const data = await service.getTrajectoryLineDetail(this);

            const diff = Date.now() - start;

            if (diff < 500) {
                await navinfo.common.Util.delay(500 - diff);
            }

            stores.loadingStore.close();

            if (data.code === 0) {
                this.setPoints(data.data.slice(10000, 10200));
            } else {
                stores.modalStore.error(data.message);
            }
        } catch (err) {
            stores.loadingStore.close();
            stores.modalStore.error(err.message);
        }
    }
}

export default TrajectoryLine;
