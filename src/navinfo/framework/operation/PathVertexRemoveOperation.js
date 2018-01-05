import PathEditOperation from './PathEditOperation';

/**
 * 删除形状点操作
 * @class PathVertexRemoveOperation
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class PathVertexRemoveOperation extends PathEditOperation {
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
            '删除形状点',
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
            } else if (index === this.index) {
                continue;
            } else {
                newEditResult.snapResults[index - 1] = snap;
            }
        }

        newEditResult.finalGeometry.coordinates.splice(this.index, 1);
        return newEditResult;
    }
}

export default PathVertexRemoveOperation;

