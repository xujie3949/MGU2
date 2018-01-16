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
                        coordinates: [item.lon, item.lat],
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

    drawFinalGeometry() {
        const point = this.shapeEditor.editResult.finalGeometry;
        if (!point) {
            return;
        }

        const angle = this.shapeEditor.editResult.angle;
        if (!angle) {
            return;
        }

        const symbol = this.symbolFactory.getSymbol('trajectory_currentPoint');
        const cloneSymbol = navinfo.common.Util.clone(symbol);
        cloneSymbol.angle = angle;
        this.defaultFeedback.add(cloneSymbol, point);
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
