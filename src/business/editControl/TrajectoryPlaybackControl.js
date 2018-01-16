import React from 'react';

import navinfo from 'Navinfo';
import stores from 'Stores/stores';
import service from 'Services/service';

/**
 * Created by xujie3949 on 2016/12/28.
 */

class TrajectoryPlaybackControl extends navinfo.framework.editControl.EditControl {
    constructor(options) {
        super(options);
        this.feedback = null;
    }

    run() {
        if (!super.run()) {
            return false;
        }

        stores.leftPanelStore.open();
        stores.rightPanelStore.close();

        this.toolController.resetCurrentTool('TrajectoryPlaybackTool', this.onFinish, null);

        return true;
    }

    abort() {
        super.abort();
        this.clearFeedback();
    }

    async onFinish(point) {
        const detail = await this.fetchPointDetail(point);
        this.updateTrajectoryFeedback(detail);
    }

    updateTrajectoryFeedback(detail) {
        const feedbackController = navinfo.mapApi.feedback.FeedbackController.getInstance();

        if (!this.feedback) {
            this.feedback = new navinfo.mapApi.feedback.Feedback();
            feedbackController.add(this.feedback);
        }

        this.feedback.clear();

        if (detail) {
            const geometry = {
                type: 'Point',
                coordinates: [detail.lon, detail.lat],
            };
            const symbol = this.symbolFactory.getSymbol('trajectory_currentPoint');
            const cloneSymbol = navinfo.common.Util.clone(symbol);
            cloneSymbol.angle = 0;
            this.feedback.add(geometry, symbol);
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

    async fetchPointDetail(point) {
        try {
            stores.loadingStore.show();

            const start = Date.now();

            const data = await service.getTrajectoryDetail(this.selected);

            const diff = Date.now() - start;

            if (diff < 500) {
                await navinfo.common.Util.delay(500 - diff);
            }

            stores.loadingStore.close();

            if (data.code === 0) {
                stores.imageViewerStore.setSrc(`data:image/jpeg;base64,${data.data.photoStr}`);
            } else {
                stores.modalStore.error(data.message);
            }
        } catch (err) {
            stores.loadingStore.close();
            stores.modalStore.error(err.message);
        }
    }
}

export default TrajectoryPlaybackControl;
