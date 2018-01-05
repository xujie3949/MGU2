import PathEditOperation from './PathEditOperation';

/**
 * 移动形状点操作
 * @class PathVertexMoveOperation
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class PathVertexMoveOperation extends PathEditOperation {
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
            '移动形状点',
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
        if (results.hasOwnProperty(this.index)) {
            delete results[this.index];
        }

        let point = this.point;
        if (this.snap) {
            newEditResult.snapResults[this.index] = this.snap;
            point = this.snap.point;
        }

        newEditResult.finalGeometry.coordinates[this.index] = point.coordinates;
        return newEditResult;
    }
}

export default PathVertexMoveOperation;

