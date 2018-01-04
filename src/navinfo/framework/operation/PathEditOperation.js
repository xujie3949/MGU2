import Operation from './Operation';
import CheckController from '../check/CheckController';

/**
 * 增加形状点操作
 * @class PathEditOperation
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class PathEditOperation extends Operation {
    /**
     * 初始化方法
     * @method initialize
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} description 操作描述字符串
     * @param  {object} shapeEditor 修形编辑器
     * @param  {object} index 索引
     * @param  {object} point 点对象
     * @param  {object} snap 捕捉对象
     * @return {undefined}
     */
    constructor(description, shapeEditor, index, point, snap) {
        super(description, shapeEditor.onRedo, shapeEditor.onUndo);

        this.index = index;
        this.point = point;
        this.snap = snap;
        this.oldEditResult = shapeEditor.editResult;
        this.newEditResult = null;

        this.checkController = CheckController.getInstance();
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

    /**
     * 获取新的编辑结果，子类需要重写此方法
     * @method getNewEditResult
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    getNewEditResult() {
        throw new Error('未重写getNewEditResult方法');
    }
}

export default PathEditOperation;
