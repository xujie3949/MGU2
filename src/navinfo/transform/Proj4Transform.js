import proj4 from 'proj4/lib';

/**
 * 处理坐标系转换.
 */
export default class Proj4Transform {
    constructor(options) {
        // epsg编号定义详见http://spatialreference.org/ref/epsg/
        // 坐标系参数含义详见:http://proj4.org/parameters.html#

        // 源坐标系使用wgs84,epsg编号4326
        this.sourceProjection = proj4('EPSG:4326');

        // 目标坐标系使用web mercator,epsg编号3857
        this.targetProjection = proj4('EPSG:3857');

        this._updateTransform();
    }

    /**
     * 设置源坐标系
     * @param {string} projection - 坐标系定义
     * @returns {Object}.
     */
    setSourceProjection(projection) {
        this.sourceProjection = projection;
        this._updateTransform();
    }

    /**
     * 设置目标坐标系
     * @param {string} projection - 坐标系定义
     * @returns {Object}.
     */
    setTargetProjection(projection) {
        this.targetProjection = projection;
        this._updateTransform();
    }

    /**
     * 从源坐标系到目标坐标系转换
     * 输入的坐标格式可以是{x:x,y:y}或者[]
     * 返回的坐标格式和输入格式相同
     * @param {Array|Object} coordinate - 要转换的坐标
     * @returns {Object}.
     */
    forward(coordinate) {
        return this.forward(coordinate);
    }

    /**
     * 从目标坐标系到源坐标系转换
     * 输入的坐标格式可以是{x:x,y:y}或者[]
     * 返回的坐标格式和输入格式相同
     * @param {Array|Object} coordinate - 要转换的坐标
     * @returns {Object}.
     */
    inverse(coordinate) {
        return this.inverse(coordinate);
    }

    _updateTransform() {
        this.transform = proj4(this.sourceProjection, this.targetProjection);
        this.forward = this.transform.forward;
        this.inverse = this.transform.inverse;
    }
}
