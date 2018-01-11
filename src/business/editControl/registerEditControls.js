import navinfo from 'Navinfo';
import TrajectoryPlaybackControl from './TrajectoryPlaybackControl';

function registerEditControls() {
    const editControlFactory = navinfo.framework.editControl.EditControlFactory.getInstance();
    editControlFactory.register('TrajectoryPlayback', TrajectoryPlaybackControl);
}

export default registerEditControls;
