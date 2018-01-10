import navinfo from 'Navinfo';

/**
 * Created by xujie3949 on 2016/12/28.
 */

class TrajectoryPlaybackControl extends navinfo.framework.editControl.EditControl {
    constructor(map, options) {
        super(map, options);

        this.geoLiveType = options.geoLiveType;
        this.topoEditor = this.topoEditFactory.getTopoEditor('create', this.geoLiveType, { map: this.map });
    }

    run() {
        if (!super.run()) {
            return false;
        }

        const editResult = this.topoEditor.getCreateEditResult();
        this.shapeEditor.start(editResult, this.onToolFinish);

        return true;
    }

    onToolFinish(editResult) {
        if (!this.precheck(editResult)) {
            return;
        }

        this.toolController.pause();

        this.topoEditor
            .create(editResult)
            .then(this.onSuccess)
            .catch(this.onFail);
    }

    onSuccess(res) {
        this.toolController.continue();

        this.shapeEditor.stop();

        // 根据服务log获取发生变更的要素类型列表
        const geoLiveTypes = this.getChangedGeoLiveTypes(this.geoLiveType, res.log);

        // 刷新对应图层
        this.sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);

        // 自动选中要素

        super.onSuccess(res);

        // 重新执行流程方便连续创建
        this.run();
    }

    onFail(err) {
        this.toolController.continue();

        super.onFail(err);
    }
}

export default TrajectoryPlaybackControl;
