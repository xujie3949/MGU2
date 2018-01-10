import EditControl from '../EditControl';

/**
 * Created by xujie3949 on 2016/12/28.
 */
class ModifySimpleFeatureControl extends EditControl {
    constructor(map, options) {
        super(map, options);

        this.geoLiveType = options.originObject.geoLiveType;
        this.shapeEditor = fastmap.uikit.shapeEdit.ShapeEditor.getInstance();
        this.topoEditor = this.topoEditFactory.getTopoEditor('modify', this.geoLiveType, { map: this.map });
    }

    run() {
        if (!super()) {
            return false;
        }

        const editResult = this.topoEditor.getModifyEditResult(this.options);
        this.shapeEditor.start(editResult, this.onModifyFinish);

        return true;
    }

    abort() {
        super.abort();
        this.shapeEditor.abort();
    }

    onModifyFinish(editResult) {
        if (!this.precheck(editResult)) {
            return;
        }

        this.toolController.pause();

        this.topoEditor
            .update(editResult)
            .then(this.onSuccess)
            .catch(this.onFail);
    }

    onSuccess(res) {
        this.toolController.continue();

        this.shapeEditor.stop();

        if (res === '属性值未发生变化') {
            return;
        }

        // 根据服务log获取发生变更的要素类型列表
        const geoLiveTypes = this.getChangedGeoLiveTypes(this.geoLiveType, res.log);

        // 刷新对应图层
        this.sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);

        // 自动选中要素
        super.onSuccess(res);
    }

    onFail(err) {
        this.toolController.continue();

        super.onFail(err);
    }
}

export default ModifySimpleFeatureControl;
