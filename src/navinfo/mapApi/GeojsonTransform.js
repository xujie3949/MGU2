/**
 * 转换geojson坐标辅助类
 */
export default class GeojsonTransform {
    static instance = null;

    /**
     * 初始化构造函数.
     * @return {undefined}
     */
    constructor() {
        /**
         * 坐标转换函数.
         * @type {null|Function} convertFunction
         */
        this.convertFunction = null;
        /**
         * FM地图对象
         * @type {null|Object} map
         */
        this.map = null;
        /**
         * 瓦片信息对象
         * @type {null|Object} tile
         */
        this.tile = null;
    }

    /**
     * 设置转换的环境
     * 就是设置以什么转换函数转换数据
     * @param {Object} map - FM地图对象
     * @param {Object} tile - 瓦片信息对象
     * @param {Function} convertFuc - 转换函数
     * @return {undefined}
     */
    setEnviroment(map, tile, convertFuc) {
        this.convertFunction = convertFuc;
        this.map = map;
        this.tile = tile;
    }

    /**
     * 遍历geojson对象，使用给定的方法转换坐标
     * 不会改变原对象
     * @param {Object} geojson - 要转换的geoJson对象
     * @returns {Object} newGeojson - 转换后新的geoJson对象
     */
    convertGeometry(geojson) {
        const type = geojson.type;
        const newGeojson = {
            type: type,
        };
        switch (type) {
            case 'Point':
                newGeojson.coordinates = this.convertPoint(geojson.coordinates);
                break;
            case 'MultiPoint':
            case 'LineString':
                newGeojson.coordinates = this.convertLineString(geojson.coordinates);
                break;
            case 'MultiLineString':
            case 'Polygon':
                newGeojson.coordinates = this.convertPolygon(geojson.coordinates);
                break;
            case 'MultiPolygon':
                newGeojson.coordinates = this.convertMultiPolygon(geojson.coordinates);
                break;
            case 'GeometryCollection':
                newGeojson.geometries = this.convertGeometryCollection(geojson.geometries);
                break;
            default:
                throw new Error(`未知的几何类型:${type}`);
        }

        return newGeojson;
    }

    /**
     * 转换点几何坐标.
     * @param {Array} coordinates - 点的几何数组
     * @returns {Array} - 转换后的点几何数组
     */
    convertPoint(coordinates) {
        return this.convertFunction(this.map, this.tile, coordinates);
    }

    /**
     * 转换线几何坐标.
     * @param {Array} coordinates - 线的几何数组
     * @returns {Array} - 转换后的线几何数组
     */
    convertLineString(coordinates) {
        const newCoordinates = [];
        for (let i = 0; i < coordinates.length; ++i) {
            newCoordinates.push(this.convertPoint(coordinates[i]));
        }

        return newCoordinates;
    }

    /**
     * 转换面几何坐标.
     * @param {Array} coordinates - 面的几何数组
     * @returns {Array} - 转换后的面几何数组
     */
    convertPolygon(coordinates) {
        const newCoordinates = [];
        for (let i = 0; i < coordinates.length; ++i) {
            newCoordinates.push(this.convertLineString(coordinates[i]));
        }

        return newCoordinates;
    }

    /**
     * 转换多面几何坐标.
     * @param {Array} coordinates - 多面的几何数组
     * @returns {Array} - 转换后的多面几何数组
     */
    convertMultiPolygon(coordinates) {
        const newCoordinates = [];
        for (let i = 0; i < coordinates.length; ++i) {
            newCoordinates.push(this.convertPolygon(coordinates[i]));
        }

        return newCoordinates;
    }

    /**
     * 转换多几何集合坐标
     * 通过遍历每种几何类型数据转换其几何坐标数据.
     * @param {Array} geometries - 几何集合
     * @returns {Array} - 转换后的新的几何集合
     */
    convertGeometryCollection(geometries) {
        const newGeometries = [];
        for (let i = 0; i < geometries.length; ++i) {
            newGeometries.push(this.convertGeometry(geometries[i]));
        }

        return newGeometries;
    }

    /**
     * 单例销毁方法.
     * @return {undefined}
     */
    destroy() {
        GeojsonTransform.instance = null;
    }

    /**
     * 获取转换geojson坐标辅助类单例对象的静态方法.
     * @example
     * const geojsonTransform = GeojsonTransform.getInstance();
     * @returns {Object} GeojsonTransform单例对象
     */
    static getInstance() {
        if (!GeojsonTransform.instance) {
            GeojsonTransform.instance = new GeojsonTransform();
        }
        return GeojsonTransform.instance;
    }
}
