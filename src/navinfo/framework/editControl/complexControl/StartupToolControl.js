import EditControl from '../EditControl';

/**
 * Created by xujie3949 on 2016/12/28.
 */

class StartupToolControl extends EditControl {
    constructor(map, options) {
        super(map, options);

        this.toolName = this.options.toolName;
    }

    run() {
        // 注意:地图漫游流程不需要切换场景
        if (!super.run()) {
            return false;
        }

        const success = this.toolController.resetCurrentTool(this.toolName, null, null);
        if (!success) {
            this.eventController.fire('EditControlError', {
                message: `未能激活选择工具:${this.toolName}`,
            });
            return false;
        }

        return true;
    }
}

export default StartupToolControl;
