import navinfo from 'Navinfo';

class Command extends navinfo.framework.command.Command {
    constructor() {
        super();

        this.key = 'TrajectoryPlayback';
        this.name = '轨迹回放';
        this.desc = '轨迹回放';
        this.icon = 'compass';
    }

    execute() {
        const editControlFactory = navinfo.framework.editControl.EditControlFactory.getInstance();

    }

    canExecute() {
        return true;
    }
}

export default Command;
