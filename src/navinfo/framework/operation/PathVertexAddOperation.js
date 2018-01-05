import PathEditOperation from './PathEditOperation';

/**
 * 增加形状点操作
 * @class PathVertexAddOperation
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class PathVertexAddOperation extends PathEditOperation {
    /**
     * 初始化方法
     * @method constructor
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} shapeEditor 修形编辑器
     * @param  {object} index 索引
     * @param  {object} point 点对象
     * @param  {object} snap 捕捉对象
     * @return {undefined}
     */
    constructor(shapeEditor, index, point, snap) {
        super(
            '添加形状点',
            shapeEditor,
            index,
            point,
            snap,
        );
        this.newEditResult = this.getNewEditResult();
    }

    /**
     * 获取新的编辑结果
     * @method getNewEditResult
     * @author XuJie
     * @date   2017-09-11
     * @return {object} newEditResult
     */
    getNewEditResult() {
        const newEditResult = this.oldEditResult.clone();
        const results = newEditResult.snapResults;
        newEditResult.snapResults = {};
        const keys = Object.getOwnPropertyNames(results);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const index = parseInt(key, 10);
            const snap = results[key];
            if (index < this.index) {
                newEditResult.snapResults[index] = snap;
            } else {
                newEditResult.snapResults[index + 1] = snap;
            }
        }

        let point = this.point;
        if (this.snap) {
            newEditResult.snapResults[this.index] = this.snap;
            point = this.snap.point;
        }
        newEditResult.finalGeometry.coordinates.splice(this.index, 0, point.coordinates);
        return newEditResult;
    }
}

export default PathVertexAddOperation;
