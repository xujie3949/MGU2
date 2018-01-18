import navinfo from 'Navinfo';
import stores from 'Stores/stores';

/**
 * Created by xujie3949 on 2016/12/8.
 * link平滑修行工具
 */
class TrajectoryPlaybackTool extends navinfo.framework.edit.ShapeTool {
    constructor() {
        super();

        this.name = 'TrajectoryPlaybackTool';
        this.snapPoint = null;
        this.playing = false;
    }

    startup() {
        this.resetStatus();

        super.startup();

        this.snapPoint = null;
        this.playing = false;

        this.eventController.on('TrajectoryPlay', this.onTrajectoryPlay, this);
        this.eventController.on('TrajectoryPause', this.onTrajectoryPause, this);

        this.refresh();
    }

    shutdown() {
        super.shutdown();

        this.eventController.on('TrajectoryPlay', this.onTrajectoryPlay, this);
        this.eventController.on('TrajectoryPause', this.onTrajectoryPause, this);

        this.resetStatus();
    }

    onTrajectoryPlay() {
        this.snapPoint = null;
        this.playing = true;
        this.refresh();
    }

    onTrajectoryPause() {
        this.snapPoint = null;
        this.playing = false;
        this.refresh();
    }

    resetStatus() {
        super.resetStatus();

        this.snapPoint = null;
        this.playing = false;
    }

    refresh() {
        this.resetSnapActor();
        this.resetFeedback();
        this.resetMouseInfo();
    }

    resetSnapActor() {
        this.uninstallSnapActors();
        if (this.playing) {
            return;
        }

        const points = stores.trajectoryListStore.selected.points;
        const pairs = [];
        points.forEach((item, index) => {
            pairs.push(
                {
                    key: {
                        type: 'Point',
                        coordinates: [item.longitude, item.latitude],
                    },
                    value: item,
                },
            );
        });

        const snapActor = this.createGivenPointSnapActor(pairs);
        snapActor.setIsDrawFeecback(false);
        this.installSnapActor(snapActor);
    }

    resetFeedback() {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (!this.snapPoint) {
            this.refreshFeedback();
            return;
        }

        const symbol = this.symbolFactory.getSymbol('snap_pt_cross');
        this.defaultFeedback.add(this.snapPoint, symbol);

        this.refreshFeedback();
    }

    resetMouseInfo() {
        this.setMouseInfo('');

        if (this.playing) {
            return;
        }

        this.setMouseInfo('请选择轨迹点');
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        const res = this.snapController.snap(this.mousePoint);
        if (res) {
            this.snapPoint = res.point;
        } else {
            this.snapPoint = null;
        }

        this.resetFeedback();

        return true;
    }

    onLeftButtonClick(event) {
        if (!super.onLeftButtonClick(event)) {
            return false;
        }

        const res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return false;
        }

        if (this.onFinish) {
            this.onFinish(res.value);
        }

        return true;
    }

    onKeyUp(event) {
        // 不需要处理键盘输入
        return true;
    }
}

export default TrajectoryPlaybackTool;
