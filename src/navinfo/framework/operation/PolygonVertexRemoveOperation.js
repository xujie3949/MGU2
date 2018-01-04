import PolygonEditOperation from './PolygonEditOperation';

/**
 * 删除形状点操作
 * @class PolygonVertexRemoveOperation
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class PolygonVertexRemoveOperation extends PolygonEditOperation {
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
            '删除形状点',
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
            newEditResult.finalGeometry.coordinates.splice(length - 1, 1);
            newEditResult.finalGeometry.coordinates.splice(0, 1);
            newEditResult.finalGeometry.coordinates.push(newEditResult.finalGeometry.coordinates[0]);
        } else {
            newEditResult.finalGeometry.coordinates.splice(this.index, 1);
        }
        return newEditResult;
    }
}

export default PolygonVertexRemoveOperation;
