import React from 'react';
import navinfo from 'Navinfo';
import stores from 'Stores/stores';
import ImageViewer from 'Components/imageViewer/ImageViewer';
import Map from 'Components/map/Map';
import TrajectoryList from 'Components/trajectoryList/TrajectoryList';

class TrajectoryPlaybackModelSwitchCommand extends navinfo.framework.command.Command {
    constructor() {
        super();

        this.key = 'TrajectoryPlaybackModelSwitch';
        this.name = '轨迹回放模式切换';
        this.desc = '轨迹回放模式切换';
        this.icon = 'compass';
        this.isTrajectoryPlaybackModel = false;
    }

    execute() {
        if (this.isTrajectoryPlaybackModel) {
            this.updateEditorMainToNormal();
            stores.trajectoryListStore.clearFeedback();
            this.stopEditControl();
        } else {
            this.updateEditorMainToTrajectory();
        }

        this.clearHighlight();

        this.isTrajectoryPlaybackModel = !this.isTrajectoryPlaybackModel;
    }

    stopEditControl() {
        const editFactory = navinfo.framework.editControl.EditControlFactory.getInstance();
        editFactory.currentControl.abort();
    }

    clearHighlight() {
        const highlightController = navinfo.framework.highlight.HighlightController.getInstance();
        highlightController.clear();
    }

    updateEditorMainToNormal() {
        stores.leftPanelStore.close();
        stores.rightPanelStore.close();

        const main = {
            children: <Map/>,
        };

        stores.editorStore.setMain(main);

        const left = {
            children: null,
        };
        stores.editorStore.setLeft(left);
    }

    updateEditorMainToTrajectory() {
        const main = {
            children: [
                <ImageViewer id="photo" key="photo"/>,
                <Map id="map" key="map"/>,
            ],
            config: {
                sizes: [50, 50],
                onDragEnd: () => {
                    stores.mapStore.map.resize();
                },
            },
            onCreated: () => {
                stores.mapStore.map.resize();
            },
        };

        stores.editorStore.setMain(main);

        const left = {
            children: <TrajectoryList/>,
        };
        stores.editorStore.setLeft(left);

        stores.leftPanelStore.open();
        stores.rightPanelStore.close();
    }

    canExecute() {
        return true;
    }
}

export default TrajectoryPlaybackModelSwitchCommand;
