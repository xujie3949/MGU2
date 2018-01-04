import PolygonEditOperation from './PolygonEditOperation';

/**
 * 移动形状点操作
 * @class PolygonVertexMoveOperation
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class PolygonVertexMoveOperation extends PolygonEditOperation {
    /**
     * 初始化方法
     * @method initialize
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} shapeEditor 修形编辑器
     * @param  {object} index 索引
     * @param  {object} point 点对象
     * @return {undefined}
     */
    constructor(shapeEditor, index, point) {
        super(
            '移动形状点',
            shapeEditor,
            index,
            point,
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

        const ls = newEditResult.finalGeometry;
        const length = ls.coordinates.length;
        if (this.index === 0 || this.index === length - 1) {
            newEditResult.finalGeometry.coordinates[0] = this.point.coordinates;
            newEditResult.finalGeometry.coordinates[length - 1] = this.point.coordinates;
        } else {
            newEditResult.finalGeometry.coordinates[this.index] = this.point.coordinates;
        }

        return newEditResult;
    }
}

export default PolygonVertexMoveOperation;

