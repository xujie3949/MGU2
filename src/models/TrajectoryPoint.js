import {
    observable,
    action,
} from 'mobx';

import service from 'Services/service';
import stores from 'Stores/stores';

class TrajectoryPoint {
    rowKey;
    direction;
    longitude;
    latitude;
    photoStr;

    constructor(json) {
        this.id = 0;
        this.rowKey = null;
        this.direction = null;
        this.longitude = null;
        this.latitude = null;
        this.photoStr = null;

        this.fromJson(json);
    }

    fromJson(json) {
        this.id = json.id;
        this.rowKey = json.rowKey;
        this.direction = json.direction;
        this.longitude = json.longitude || json.lon;
        this.latitude = json.latitude || json.lat;
        this.photoStr = json.photoStr;
    }

    toJson() {
        return {
            id: this.id,
            rowKey: this.rowKey,
            direction: this.direction,
            longitude: this.longitude,
            latitude: this.latitude,
            photoStr: this.photoStr,
        };
    }

    async fetchDetail() {
        try {
            // stores.loadingStore.show();

            const start = Date.now();

            const data = await service.getTrajectoryPointDetail(this);

            const diff = Date.now() - start;

            // if (diff < 500) {
            //     await navinfo.common.Util.delay(500 - diff);
            // }

            // stores.loadingStore.close();

            if (data.code === 0) {
                const detail = data.data[0];
                this.photoStr = detail.photoStr;
                this.direction = detail.direction;
            } else {
                // stores.modalStore.error(data.message);
            }
        } catch (err) {
            // stores.loadingStore.close();
            // stores.modalStore.error(err.message);
        }
    }
}

export default TrajectoryPoint;
