import {
    observable,
    action,
    computed,
} from 'mobx';
import { Modal } from 'antd';

import navinfo from 'Navinfo';
import service from 'Services/service';
import delay from 'Utils/delay';
import User from 'Models/User';
import loadingStore from 'Stores/loadingStore';
import userStore from 'Stores/userStore';

class TrajectoryListStore {
    @observable.ref data;
    @observable selectedIndex;
    feedback = null;

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

    @action
    setTrajectoryPoints(index, value) {
        if (index < 0 || index > this.data.length - 1) {
            return;
        }
        this.data[index].points = value;
    }

    @computed
    get selected() {
        if (this.selectedIndex < 0 || this.selectedIndex > this.data.length - 1) {
            return null;
        }
        return this.data[this.selectedIndex];
    }

    async fetchData(northWest, southEast) {
        try {
            loadingStore.show();

            const start = Date.now();

            const data = await service.getTrajectoryList(northWest, southEast);

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

    async fetchSelectedTrajectoryPoints() {
        try {
            loadingStore.show();

            const start = Date.now();

            const data = await service.getTrajectoryDetail(this.selected);

            const diff = Date.now() - start;

            if (diff < 500) {
                await delay(500 - diff);
            }

            loadingStore.close();

            if (data.code === 0) {
                this.setTrajectoryPoints(this.selectedIndex, data.data);
            } else {
                Modal.error(data.message);
            }
        } catch (err) {
            loadingStore.close();
            Modal.error(err.message);
        }
    }

    updateTrajectoryFeedback() {
        const feedbackController = navinfo.mapApi.feedback.FeedbackController.getInstance();

        if (!this.feedback) {
            this.feedback = new navinfo.mapApi.feedback.Feedback();
            feedbackController.add(this.feedback);
        }

        this.feedback.clear();

        if (this.selected) {
            const points = this.selected.points;
            const symbolData = {
                type: 'CircleMarkerSymbol',
                radius: 3,
                color: 'blue',
            };
            const geometryFactory = navinfo.geometry.GeometryFactory.getInstance();
            const symbolFactory = navinfo.symbol.SymbolFactory.getInstance();
            const symbol = symbolFactory.createSymbol(symbolData);
            points.forEach(item => {
                const geometry = {
                    type: 'Point',
                    coordinates: [item.lon, item.lat],
                };
                this.feedback.add(geometry, symbol);
            });
        }

        feedbackController.refresh();
    }

    clearFeedback() {
        if (!this.feedback) {
            return;
        }

        this.feedback.clear();
        const feedbackController = navinfo.mapApi.feedback.FeedbackController.getInstance();
        feedbackController.del(this.feedback);
        feedbackController.refresh();
    }
}

const trajectoryListStore = new TrajectoryListStore();
export default trajectoryListStore;
