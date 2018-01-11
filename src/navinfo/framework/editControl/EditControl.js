import EventController from '../../common/EventController';
import FeedbackController from '../../mapApi/feedback/FeedbackController';
import FeatureSelector from '../../mapApi/FeatureSelector';
import ToolController from '../tool/ToolController';
import TopoEditFactory from '../topoEdit/TopoEditFactory';
import EditControlFactory from './EditControlFactory';

/**
 * Created by xujie3949 on 2016/12/28.
 */
class EditControl {
    /**
     * 构造函数
     * @param  {object} options 可选项
     * @return {undefined}
     */
    constructor(options) {
        this.options = options;

        this.eventController = EventController.getInstance();

        this.feedbackCtrl = FeedbackController.getInstance();
        this.featureSelector = FeatureSelector.getInstance();

        this.toolController = ToolController.getInstance();
        this.topoEditFactory = TopoEditFactory.getInstance();
        this.editControlFactory = EditControlFactory.getInstance();
        this.status = 'Ready';
    }

    /**
     * 启动流程
     * @return {boolean} 操作是否成功
     */
    run() {
        this.setCurrentControl(this);
        this.status = 'Running';
        return true;
    }

    /**
     * 设置控制类中的当前流程
     * @param {class}      control 编辑流程
     * @return {undefined}
     */
    setCurrentControl(control) {
        if (this.editControlFactory.currentControl) {
            this.editControlFactory.currentControl.abort();
        }
        this.editControlFactory.currentControl = control;
    }

    /**
     * 中止
     * @return {[type]} [description]
     */
    abort() {
        this.status = 'Aborted';
    }

    /**
     * 流程执行成功
     * @param  {[type]}    data [description]
     * @return {[type]}     [description]
     */
    onSuccess(data) {
        this.eventController.fire('EditControlSuccess', {
            data: data,
        });
    }

    /**
     * 流程执行失败
     * @param  {[type]} err [description]
     * @return {[type]}     [description]
     */
    onFail(err) {
        this.eventController.fire('EditControlError', {
            message: err,
        });
    }
}

export default EditControl;
