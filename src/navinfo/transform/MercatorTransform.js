import Proj4Transform from './Proj4Transform';

/**
 * mercator坐标转换类
 */
export default class MercatorTransform {
    constructor(tileSize) {
        this.proj4Transform = new Proj4Transform();
        /**
         * 瓦片大小,默认256
         * @type {Number} tileSize
         */
        this.tileSize = tileSize || 256;
        /**
         * 地球半径
         * @type {Number} tileSize
         */
        this.radius = 6378137;
        /**
         * 地球周长
         * @type {Number} tileSize
         */
        this.perimeter = 2 * Math.PI * this.radius;
        /**
         * 坐标原点
         * @type {object} origin
         */
        this.origin = {
            x: -this.perimeter / 2.0,
            y: this.perimeter / 2.0,
        };
        /**
         * 初始像素分辨率.
         * @type {Number} initialResolution
         */
        this.initialResolution = this.perimeter / this.tileSize;
    }

    /**
     * 计算当前地图分辨率
     * @param {Number} zoom - 当前地图的缩放等级
     * @returns {Number} - 当前地图像素分辨率
     */
    resolution(zoom) {
        return this.initialResolution / Math.pow(2, zoom);
    }

    /**
     * 经纬(地理坐标)度到mercator转换.
     * @param {Number} lon - 传入的经度
     * @param {Number} lat - 传入的纬度
     * @returns {Array} xy - 返回转换后的坐标数组
     */
    geographic2Mercator(lon, lat) {
        return this.proj4Transform.forward([lon, lat]);
    }

    /**
     * mercator到经纬度(地理)坐标转换.
     * @param {Number} x - mercator投影的x轴坐标
     * @param {Number} y - mercator投影的y轴坐标
     * @returns {Array} lonlat - 转换后的坐标数组
     */
    mercator2Geographic(x, y) {
        return this.proj4Transform.inverse([x, y]);
    }

    /**
     * mercator到像素坐标转换
     * @param {Number} x - x轴像素坐标
     * @param {Number} y - y轴像素坐标
     * @param {Number} zoom - 地图的缩放等级
     * @returns {Array} xy - 转换后的坐标数组
     */
    mercator2Pixel(x, y, zoom) {
        const res = this.resolution(zoom);
        const px = (x - this.origin.x) / res;
        const py = -(y - this.origin.y) / res;
        return [px, py];
    }

    /**
     * 像素坐标转mercator
     * @param {Number} px - x轴像素坐标
     * @param {Number} py - y轴像素坐标
     * @param {Number} zoom - 地图的缩放等级
     * @returns {Array} xy - 转换后的坐标数组
     */
    pixel2Mercator(px, py, zoom) {
        const res = this.resolution(zoom);
        const x = px * res + this.origin.x;
        const y = this.origin.y - py * res;
        return [x, y];
    }

    /**
     * 像素坐标到瓦片坐标转换
     * @param {Number} x - x像素坐标
     * @param {Number} y - y像素坐标
     * @returns {Array} xy - 转换后的瓦片坐标数组
     */
    pixel2Tile(x, y) {
        const tx = Math.ceil(x / 256);
        const ty = Math.ceil(y / 256);
        return [tx, ty];
    }

    /**
     * mercator到瓦片坐标转换
     * 需要先转换为像素坐标再转为瓦片坐标.
     * @param {Number} x - x轴像素坐标
     * @param {Number} y - y轴像素坐标
     * @param {Number} zoom - 地图的缩放等级
     * @returns {Array} xy - 转换后的瓦片坐标数组
     */
    mercator2Tile(x, y, zoom) {
        const merXY = this.mercator2Pixel(x, y, zoom);
        const xy = this.pixel2Tile(merXY[0], merXY[1]);
        return xy;
    }

    /**
     * 经纬度到像素坐标转换
     * 需要先转换为墨卡托坐标再转为像素坐标
     * @param {Number} lon - 经度
     * @param {Number} lat - 纬度
     * @param {Number} zoom - 地图的缩放等级
     * @returns {Array} xy - 转换后的像素坐标数组
     */
    geographic2Pixel(lon, lat, zoom) {
        const mxy = this.geographic2Mercator(lon, lat);
        const pxy = this.mercator2Pixel(mxy[0], mxy[1], zoom);
        return pxy;
    }

    /**
     * 经纬度到瓦片坐标转换
     * 需要先转换为墨卡托坐标再转为像素坐标最后转为瓦片坐标
     * @param {Number} lon - 经度
     * @param {Number} lat - 纬度
     * @param {Number} zoom - 地图的缩放等级
     * @returns {Array} xy - 转换后的瓦片坐标数组
     */
    geographic2Tile(lon, lat, zoom) {
        const pxy = this.geographic2Pixel(lon, lat, zoom);
        const res = this.pixel2Tile(pxy[0], pxy[1]);
        return res;
    }

    /**
     * 像素坐标转换经纬度.
     * @param {Number} px - 经度
     * @param {Number} py - 纬度
     * @param {Number} zoom - 地图的缩放等级
     * @returns {Array} xy - 转换后的经纬度坐标数组
     */
    pixel2Geographic(px, py, zoom) {
        const mxy = this.pixel2Mercator(px, py, zoom);
        const lonlat = this.mercator2Geographic(mxy[0], mxy[1]);
        return lonlat;
    }
}
