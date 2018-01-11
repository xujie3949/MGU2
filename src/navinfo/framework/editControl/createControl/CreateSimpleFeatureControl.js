import EditControl from '../EditControl';
import ShapeEditor from '../../edit/shapeEdit/ShapeEditor';

/**
 * Created by xujie3949 on 2016/12/28.
 */

class CreateSimpleFeatureControl extends EditControl {
    constructor(options) {
        super(options);

        this.shapeEditor = ShapeEditor.getInstance();
        this.topoEditor = this.topoEditFactory.getTopoEditor('create', this.options);
    }

    run() {
        if (!super.run()) {
            return false;
        }

        const editResult = this.topoEditor.getCreateEditResult();
        this.shapeEditor.start(editResult, this.onToolFinish);

        return true;
    }

    abort() {
        super.abort();
        this.shapeEditor.abort();
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
        const geoLiveTypes = this.getChangedGeoLiveTypes(this.options.geoLiveType, res.log);

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

export default CreateSimpleFeatureControl;
