import navinfo from 'navinfo';
import stores from 'Stores/stores';

class TrajectoryPlaybackCommand extends navinfo.framework.command.Command {
    constructor() {
        super();

        this.key = 'TrajectoryPlayback';
        this.name = '轨迹回放';
        this.desc = '轨迹回放';
        this.icon = '';
    }

    execute() {
        const editControlFactory = navinfo.framework.editControl.EditControlFactory.getInstance();
        const editControl = editControlFactory.getEditControl(
            this.key,
            {
                map: stores.mapStore.map,
            },
        );

        if (!editControl) {
            throw new Error(`命令未实现:${this.name}`);
        }

        editControl.run();
    }

    canExecute() {
        return true;
    }
}

export default TrajectoryPlaybackCommand;
