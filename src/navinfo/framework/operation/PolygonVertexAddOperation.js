import PolygonEditOperation from './PolygonEditOperation';

/**
 * 增加形状点操作
 * @class PolygonVertexAddOperation
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class PolygonVertexAddOperation extends PolygonEditOperation {
    /**
     * 初始化方法
     * @method constructor
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} shapeEditor 修形编辑器
     * @param  {object} index 索引
     * @param  {object} point 点对象
     * @return {undefined}
     */
    constructor(shapeEditor, index, point) {
        super(
            '添加形状点',
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
        if (length >= 3 && this.pointEqual(this.coordinatesToPoint(ls.coordinates[0]), this.point)) {
            newEditResult.isClosed = true;
        }

        newEditResult.finalGeometry.coordinates.splice(this.index, 0, this.point.coordinates);
        return newEditResult;
    }

    /**
     * 根据坐标创建点对象
     * @method coordinatesToPoint
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} coordinates 坐标
     * @return {object} 点对象
     */
    coordinatesToPoint(coordinates) {
        return {
            type: 'Point',
            coordinates: coordinates,
        };
    }
}

export default PolygonVertexAddOperation;

