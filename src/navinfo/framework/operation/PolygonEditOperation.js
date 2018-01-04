import Operation from './Operation';
import CheckController from '../check/CheckController';
import GeometryAlgorithm from '../../geometry/GeometryAlgorithm';

/**
 * 增加形状点操作
 * @class PolygonEditOperation
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class PolygonEditOperation extends Operation {
    /**
     * 初始化方法
     * @method initialize
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} description 操作描述字符串
     * @param  {object} shapeEditor 修形编辑器
     * @param  {object} index 索引
     * @param  {object} point 点对象
     * @return {undefined}
     */
    constructor(description, shapeEditor, index, point) {
        super(
            description,
            shapeEditor.onRedo,
            shapeEditor.onUndo,
        );

        this.index = index;
        this.point = point;
        this.oldEditResult = shapeEditor.editResult;
        this.newEditResult = null;

        this.checkController = CheckController.getInstance();
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
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

    /**
     * 判断两个点是否为同一个点
     * @method pointEqual
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} p1 点对象
     * @param  {object} p2 点对象
     * @return {boolean} 同一个点返回true，否则false
     */
    pointEqual(p1, p2) {
        const dis = this.geometryAlgorithm.distance(p1, p2);
        const precision = 1e-10;
        if (dis < precision) {
            return true;
        }
        return false;
    }
}

export default PolygonEditOperation;
