import EditControl from '../EditControl';

/**
 * 选择流程
 * Created by xujie3949 on 2016/12/28.
 */
export default class SelectControl extends EditControl {
    /**
     * 构造方法
     * @param  {[type]} options     [description]
     * @return {[type]}             [description]
     */
    constructor(options) {
        super(options);

        this.selectMode = options.selectMode ? options.selectMode : 'point';
    }
    
    /**
     * 启动流程
     * @return {[type]} [description]
     */
    run() {
        if (!super.run()) {
            return false;
        }
        
        const toolName = this._getToolName(this.selectMode);
        const success = this.toolController.resetCurrentTool(toolName, this.onFinish, {
            toolOptions: [this.options.geoLiveType],
        });
        if (!success) {
            this.eventController.fire('EditControlError', {
                message: `未能激活选择工具:${toolName}`,
            });
            return false;
        }

        return true;
    }
    
    /**
     * 获取选择工具名称
     * @param  {[type]} selectMode [description]
     * @return {[type]}            [description]
     */
    _getToolName(selectMode) {
        // 暂时只支持点选和框选,其他选择方式用到时再添加
        switch (selectMode) {
            case 'point':
                return 'PointSelectTool';
            case 'rect':
                return 'RectSelectTool';
            default:
                return 'PointSelectTool';
        }
    }
    
    /**
     * 流程执行结束的处理
     * @param  {[type]} features [description]
     * @param  {[type]} event    [description]
     * @return {[type]}          [description]
     */
    onFinish(features, event) {
        this.eventController.fire('ObjectSelected', {
            features: features,
            event: event,
        });

        // 支持连续选择
        this.run();

        return true;
    }
}
