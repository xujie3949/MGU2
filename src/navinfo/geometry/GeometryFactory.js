import Point from './Point';
import LineString from './LineString';
import Polygon from './Polygon';
import Bound from './Bound';

/**
 * 几何工厂,负责创建点,线,面对象,以及点线面对象和geojson之间的转换等.
 */
class GeometryFactory {
    /**
     * 创建Point对象.
     * @param {Array} coordinates - 传入的点坐标,coodinates格式[x, y]
     * @returns {object} Point的实例对象
     */
    createPoint(coordinates) {
        return new Point(coordinates[0], coordinates[1]);
    }

    /**
     * 创建LineString对象.
     * @param {Array} coordinates - 传线的坐标串
     * coodinates格式[[x1, y1], [x2, y2]].
     * @returns {object} LineString的实例对象
     */
    createLineString(coordinates) {
        const lineString = new LineString();
        for (let i = 0; i < coordinates.length; ++i) {
            const point = this.createPoint(coordinates[i]);
            lineString.coordinates.push(point);
        }
        return lineString;
    }

    /**
     * 创建Polygon对象.
     * @param {Array} coordinates - 传线的坐标串,
     * coodinates格式[[[x1, y1], [x2, y2], [x3, y3], [x1, y1]]].
     * @returns {object} Polygon的实例对象
     */
    createPolygon(coordinates) {
        const polygon = new Polygon();
        for (let i = 0; i < coordinates.length; ++i) {
            const lineString = this.createLineString(coordinates[i]);
            polygon.coordinates.push(lineString);
        }
        return polygon;
    }

    /**
     * 将符号几何对象的类型转换为geojson对象.
     * @param {object} geometry - 要转换的几何符号几何对象
     * @returns {{type: string, coordinates: Array}} - 转换后的geojson对象
     */
    toGeojson(geometry) {
        const type = geometry.type;
        let coordinates = [];
        switch (type) {
            case 'Point':
                coordinates = [
                    geometry.x,
                    geometry.y,
                ];
                break;
            case 'LineString':
                coordinates = geometry.coordinates.map(point => [
                    point.x,
                    point.y,
                ]);
                break;
            case 'Polygon':
                coordinates = geometry.coordinates.map(
                    ls => ls.coordinates.map(point => [
                        point.x,
                        point.y,
                    ]),
                );
                break;
            default:
                throw new Error(`不支持的类型:${type}`);
        }

        const geojson = {
            type: type,
            coordinates: coordinates,
        };

        return geojson;
    }

    /**
     * 将geojson对象转换为符号几何对象.
     * @param {object} geojson - 要转换的geojson对象
     * @returns {object} - 符号几何对象
     */
    fromGeojson(geojson) {
        const type = geojson.type;
        switch (type) {
            case 'Point':
                return new Point(geojson.coordinates[0], geojson.coordinates[1]);
            case 'LineString':
                return this.createLineString(geojson.coordinates);
            case 'Polygon':
                return this.createPolygon(geojson.coordinates);
            default:
                throw new Error(`不支持的类型:${type}`);
        }
    }

    /**
     * 根据中心点，宽度，高度构造bound
     * x方向为宽度，y方向为高度
     * 如果center为null或undefined，则使用[0,0]作为中心点.
     * @param {Object} center - 中心点几何坐标
     * @param {Number} width - 范围矩形区域的宽
     * @param {Number} height - 范围矩形区域的高
     * @returns {Object} bound - 符号几何对象
     */
    createBound(center, width, height) {
        let cX = 0;
        let cY = 0;
        if (center) {
            cX = center.x;
            cY = center.y;
        }
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const left = cX - halfWidth;
        const top = cY - halfHeight;
        const right = cX + halfWidth;
        const bottom = cY + halfHeight;
        const bound = new Bound(
            left,
            top,
            right,
            bottom,
        );
        return bound;
    }

    /**
     * 销毁几何工厂类.
     */
    destroy() {
        GeometryFactory.instance = null;
    }

    /**
     * 获取创建几何工厂单例的静态方法.
     * @example
     * const geojson = { type: 'Polygon',coordinates: [[[1, 1], [10, 10],[1, 10], [1, 1]]]};
     * const geometryFactory = GeometryFactory.getInstance();
     * const polygon = geometryFactory.fromGeojson(geojson);
     * @returns {Object} 返回 GeometryTransform.instance 单例对象.
     */
    static getInstance() {
        if (!GeometryFactory.instance) {
            GeometryFactory.instance = new GeometryFactory();
        }
        return GeometryFactory.instance;
    }
}

GeometryFactory.instance = null;

export default GeometryFactory;

