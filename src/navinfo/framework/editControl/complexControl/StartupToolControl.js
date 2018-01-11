import EditControl from '../EditControl';

/**
 * Created by xujie3949 on 2016/12/28.
 */

class StartupToolControl extends EditControl {
    constructor(options) {
        super(options);
    }

    run() {
        // 注意:地图漫游流程不需要切换场景
        if (!super.run()) {
            return false;
        }

        const success = this.toolController.resetCurrentTool(this.options.toolName, null, null);
        if (!success) {
            this.eventController.fire('EditControlError', {
                message: `未能激活选择工具:${this.options.toolName}`,
            });
            return false;
        }

        return true;
    }
}

export default StartupToolControl;
