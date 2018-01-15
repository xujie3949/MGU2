import React from 'react';
import navinfo from 'Navinfo';
import stores from 'Stores/stores';
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
        } else {
            this.updateEditorMainToTrajectory();
        }
    }

    updateEditorMainToNormal() {
        const main = {
            children: <Map/>,
        };

        stores.editorStore.setMain(main);

        stores.editorStore.setLeft(null);

        stores.leftPanelStore.close();
        stores.rightPanelStore.close();
    }

    updateEditorMainToTrajectory() {
        const main = {
            children: [
                <div id="photo" key="photo"/>,
                <Map id="map" key="map"/>,
            ],
            split: {
                children: ['#photo', '#map'],
                config: {
                    sizes: [50, 50],
                },
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
