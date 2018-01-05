import Operation from './Operation';
import CheckController from '../check/CheckController';

/**
 * 编辑结果操作
 * @class EditResultOperation
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class EditResultOperation extends Operation {
    /**
     * 初始化方法
     * @method constructor
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} description 操作描述字符串
     * @param  {object} redoCallback 回调函数
     * @param  {object} undoCallback 回调函数
     * @param  {object} oldEditResult 操作前的编辑结果
     * @param  {object} newEditResult 操作后的编辑结果
     * @return {undefined}
     */
    constructor(description, redoCallback, undoCallback, oldEditResult, newEditResult) {
        super(description, redoCallback, undoCallback);

        this.checkController = CheckController.getInstance();

        this.oldEditResult = oldEditResult;
        this.newEditResult = newEditResult;
    }

    /**
     * 判断本次操作是否可以通过检查
     * @method canDo
     * @author XuJie
     * @date   2017-09-11
     * @return {boolean} 可以操作返回true，否侧false
     */
    canDo() {
        const engine = this.checkController.getCheckEngine(this.newEditResult.geoLiveType, 'runtime');
        if (engine && !engine.check(this.newEditResult)) {
            this.lastErrors = engine.lastErrors;
            return false;
        }

        return true;
    }

    /**
     * 获取错误信息
     * @method getError
     * @author XuJie
     * @date   2017-09-11
     * @return {string} 错误信息
     */
    getError() {
        let errMsg = '';
        const length = this.lastErrors.length;
        for (let i = 0; i < length; ++i) {
            const err = this.lastErrors[i];
            errMsg += err.message;
            if (i !== length - 1) {
                errMsg += '\n';
            }
        }
        return errMsg;
    }

    /**
     * 操作方法
     * @method do
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    do() {
        this.redoCallback(this.oldEditResult, this.newEditResult);
    }

    /**
     * 撤销上一次操作的方法
     * @method undo
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    undo() {
        this.undoCallback(this.oldEditResult, this.newEditResult);
    }
}

export default EditResultOperation;
