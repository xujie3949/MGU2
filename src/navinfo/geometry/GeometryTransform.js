/**
 * 转换geometry坐标辅助类.
 */
class GeometryTransform {
    /**
   * 初始化geometry坐标辅助类的属性.
   */
    constructor() {
    /** @type {null|function} 具体的坐标转换方法 */
        this.convertFunction = null;
        /** @type {@link navinfo.mapApi.map} map对象 */
        this.map = null;
        this.tile = null;
    }

    /**
   * 设置转换环境
   * @param {@link navinfo.mapApi.map} map - navinfo.mapApi.map对象
   * @param tile
   * @param convertFuc
   */
    setEnviroment(map, tile, convertFuc) {
        this.map = map;
        this.tile = tile;
        this.convertFunction = convertFuc;
    }

    /**
   * 遍历geometry对象，根据几何类型使用给定的方法转换坐标，不会改变原对象.
   * @param geometry
   * @returns {object} 返回geometry对象
   */
    convertGeometry(geometry) {
        const newGeometry = geometry.clone();
        const type = newGeometry.type;
        switch (type) {
            case 'Point':
                return this.convertPoint(newGeometry);
            case 'LineString':
                return this.convertLineString(newGeometry);
            case 'Polygon':
                return this.convertPolygon(newGeometry);
            default:
                throw new Error(`不支持的类型:${type}`);
        }
    }

    /**
   * 点几何坐标转换方法.
   * @param geometry
   * @returns {object} 返回geometry对象
   */
    convertPoint(geometry) {
        return this.convertFunction(this.map, this.tile, geometry);
    }

    /**
   * 线几何坐标转换方法.
   * @param geometry
   * @returns {object} 返回geometry对象
   */
    convertLineString(geometry) {
        geometry.coordinates = geometry.coordinates.map(function (element, index, array) {
            return this.convertPoint(element);
        }, this);
        return geometry;
    }

    /**
   * 面几何坐标转换方法.
   * @param geometry
   * @returns {object} 返回geometry对象
   */
    convertPolygon(geometry) {
        geometry.coordinates = geometry.coordinates.map(function (element, index, array) {
            return this.convertLineString(element);
        }, this);
        return geometry;
    }

    /**
   * 销毁几何转换类.
   */
    destroy() {
        GeometryTransform.instance = null;
    }

    /**
   * 获取几何转换单例的静态方法.
   * @example
   * const GeometryTransform = GeometryTransform.getInstance();
   * @returns {Object} 返回 GeometryTransform.instance 单例对象.
   */
    static getInstance() {
        if (!GeometryTransform.instance) {
            GeometryTransform.instance = new GeometryTransform();
        }
        return GeometryTransform.instance;
    }
}

GeometryTransform.instance = null;

export default GeometryTransform;
