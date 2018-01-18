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
    }

    run() {
        if (!super.run()) {
            return false;
        }

        stores.leftPanelStore.close();
        stores.rightPanelStore.close();

        this.toolController.resetCurrentTool('TrajectoryPlaybackTool', this.onFinish, null);

        return true;
    }

    abort() {
        super.abort();
        this.clearFeedback();
    }

    onFinish = async point => {
        await point.fetchDetail();
        stores.imageViewerStore.setIndex(point.id);
        this.eventController.fire('SelectedTrajectoryPointChanged', null);
    };
}

export default TrajectoryPlaybackControl;
