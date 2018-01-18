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
        this.threshold = null;
    }

    startup() {
        this.resetStatus();

        super.startup();

        this.threshold = 10;

        this.refresh();
    }

    shutdown() {
        super.shutdown();

        this.resetStatus();
    }

    resetStatus() {
        super.resetStatus();

        this.threshold = null;
    }

    refresh() {
        this.resetSnapActor();
        this.resetMouseInfo();
    }

    resetSnapActor() {
        this.uninstallSnapActors();
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
        this.installSnapActor(snapActor);
    }

    resetMouseInfo() {
        this.setMouseInfo('请选择轨迹点');
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

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
