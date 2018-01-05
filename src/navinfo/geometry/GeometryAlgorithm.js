import GeojsonTransform from '../mapApi/GeojsonTransform';
import jsts from '../algorithm/jsts';
import Proj4Transform from '../transform/Proj4Transform';
import Vector from '../math/Vector';
import Matrix from '../math/Matrix';
import Point from '../geometry/Point';
import EventController from '../common/EventController';

/**
 * 处理geoJson格式的几何的各种计算.
 */
export default class GeometryAlgorithm {
    static instance = null;

    /**
     * 初始化构造函数.
     * @param {Object} options - 初始化参数
     * @returns {undefined}
     */
    constructor(options) {
        this.reader = new jsts.io.GeoJSONReader();
        this.writer = new jsts.io.GeoJSONWriter();
        this.wktReader = new jsts.io.WKTReader();
        this.wktWriter = new jsts.io.WKTWriter();
        this.factory = new jsts.geom.GeometryFactory();
        this.geojsonTransform = GeojsonTransform.getInstance();
        this.proj4Transform = new Proj4Transform();

        this._eventController = EventController.getInstance();
        this._eventController.once('DestroySingleton', () => this.destroy());
    }

    /**
     * 计算两个几何之间的距离
     * @param {Object} geometry1 - 几何1
     * @param {Object} geometry2 - 几何1
     * @returns {Number} - 返回距离单位随传入几何的单位
     */
    distance(geometry1, geometry2) {
        const jstsGeometry1 = this.reader.read(geometry1);
        const jstsGeometry2 = this.reader.read(geometry2);
        return jstsGeometry1.distance(jstsGeometry2);
    }

    /**
     * 计算两个点之间的球面距离,单位为米.
     * @param {Object} point1 - geosjson格式的经纬点
     * @param {Object} point2 - geosjson格式的经纬点
     * @returns {number} - 返回距离
     */
    sphericalDistance(point1, point2) {
        this.geojsonTransform.setEnviroment(
            null,
            null,
            (map, tile, coordinates) => this.proj4Transform.forward(coordinates),
        );
        const p1 = this.geojsonTransform.convertGeometry(point1);
        const p2 = this.geojsonTransform.convertGeometry(point2);
        return this.distance(p1, p2);
    }

    nearestPoints(geometry1, geometry2) {
        const jstsGeometry1 = this.reader.read(geometry1);
        const jstsGeometry2 = this.reader.read(geometry2);
        const pair = jsts.operation.distance.DistanceOp.nearestPoints(jstsGeometry1, jstsGeometry2);
        const res = {
            distance: pair[0].distance(pair[1]),
            point1: this.writer.write(this.factory.createPoint(pair[0])),
            point2: this.writer.write(this.factory.createPoint(pair[1])),
        };
        return res;
    }

    contains(geometry1, geometry2) {
        const jstsGeometry1 = this.reader.read(geometry1);
        const jstsGeometry2 = this.reader.read(geometry2);
        return jstsGeometry1.contains(jstsGeometry2);
    }

    /* 判断两个几何是否相交
     return: boolen
     */
    intersects(geometry1, geometry2) {
        const jstsGeometry1 = this.reader.read(geometry1);
        const jstsGeometry2 = this.reader.read(geometry2);
        return jstsGeometry1.intersects(jstsGeometry2);
    }

    /* 计算两个几何的交集
     return: geoJson
     */
    intersection(geometry1, geometry2) {
        const jstsGeometry1 = this.reader.read(geometry1);
        const jstsGeometry2 = this.reader.read(geometry2);
        return this.writer.write(jstsGeometry1.intersection(jstsGeometry2));
    }

    isWithinDistance(geometry1, geometry2, distance) {
        const jstsGeometry1 = this.reader.read(geometry1);
        const jstsGeometry2 = this.reader.read(geometry2);
        return jstsGeometry1.isWithinDistance(jstsGeometry2, distance);
    }

    intersectsAndContains(geometry1, geometry2) {
        const jstsGeometry1 = this.reader.read(geometry1);
        const jstsGeometry2 = this.reader.read(geometry2);
        // 采用三元表达式,尽量减少计算相交的次数
        return jstsGeometry1.contains(jstsGeometry2) ? true : jstsGeometry1.intersects(jstsGeometry2);
    }

    bbox(geometry) {
        const jstsGeometry = this.reader.read(geometry);
        const envelope = jstsGeometry.getEnvelopeInternal();
        const bbox = {
            minX: envelope.getMinX(),
            minY: envelope.getMinY(),
            maxX: envelope.getMaxX(),
            maxY: envelope.getMaxY(),
        };
        return bbox;
    }

    bboxToPolygon(bbox) {
        const geojson = {
            type: 'Polygon',
            coordinates: [
                [
                    [bbox.minX, bbox.minY],
                    [bbox.maxX, bbox.minY],
                    [bbox.maxX, bbox.maxY],
                    [bbox.minX, bbox.maxY],
                    [bbox.minX, bbox.minY],
                ],
            ],
        };
        return geojson;
    }

    centroid(geometry) {
        const jstsGeometry = this.reader.read(geometry);
        const coordinate = jstsGeometry.getCentroid().getCoordinate();
        const point = {
            type: 'Point',
            coordinates: [coordinate.x, coordinate.y],
        };
        return point;
    }

    buffer(geometry, distance) {
        const jstsGeometry = this.reader.read(geometry);
        const parameters = new jsts.operation.buffer.BufferParameters();
        parameters.setEndCapStyle(jsts.operation.buffer.BufferParameters.CAP_ROUND);
        parameters.setJoinStyle(jsts.operation.buffer.BufferParameters.JOIN_ROUND);
        // parameters.setSingleSided(true);
        const bufferOp = new jsts.operation.buffer.BufferOp(jstsGeometry, parameters);
        const buffer = bufferOp.getResultGeometry(distance);
        return this.writer.write(buffer);
    }

    convexHull(geometry) {
        const jstsGeometry = this.reader.read(geometry);
        const convexHull = jstsGeometry.convexHull();
        return this.writer.write(convexHull);
    }

    nearestLocations(point, lineString) {
        const jstsPoint = this.reader.read(point);
        const jstsLineString = this.reader.read(lineString);
        const distanceOp = new jsts.operation.distance.DistanceOp(jstsPoint, jstsLineString);
        const pair = distanceOp.nearestLocations();
        const p0 = this.factory.createPoint(pair[0].getCoordinate());
        const p1 = this.factory.createPoint(pair[1].getCoordinate());
        const segmentIndex = pair[1].getSegmentIndex();
        const res = {
            distance: p0.distance(p1),
            point: this.writer.write(p1),
            previousIndex: segmentIndex,
            nextIndex: segmentIndex + 1,
            previousPoint: this.writer.write(jstsLineString.getPointN(segmentIndex)),
            nextPoint: this.writer.write(jstsLineString.getPointN(segmentIndex + 1)),
        };
        return res;
    }

    wktToGeojson(wkt) {
        try {
            const jstsGeometry = this.wktReader.read(wkt);
            return this.writer.write(jstsGeometry);
        } catch (e) {
            return null;
        }
    }

    geoJsonToWkt(geojson) {
        try {
            const jstsGeometry = this.reader.read(geojson);
            return this.wktWriter.write(jstsGeometry);
        } catch (e) {
            return null;
        }
    }

    // 将经纬度坐标转换成大地坐标后，计算长度，计算出来的长度单位为米
    getLength(geometry) {
        const func = (map, tile, coordinates) => this.proj4Transform.forward(coordinates);
        this.geojsonTransform.setEnviroment(null, null, func);
        const g = this.geojsonTransform.convertGeometry(geometry);

        const jstsGeometry = this.reader.read(g);
        return jstsGeometry.getLength();
    }

    /**
     * 计算LineString长度,单位为米
     * @param lineString geosjson格式的经纬线
     * @returns {number}
     */
    sphericalLength(lineString) {
        if (lineString.coordinates.length < 2) {
            return 0;
        }

        this.geojsonTransform.setEnviroment(
            null,
            null,
            (map, tile, coordinates) => this.proj4Transform.forward(coordinates),
        );
        const g = this.geojsonTransform.convertGeometry(lineString);

        const jstsGeometry = this.reader.read(g);
        return jstsGeometry.getLength();
    }

    isClosed(lineString) {
        const length = lineString.coordinates.length;
        if (length < 3) {
            return false;
        }
        const jstsGeometry = this.reader.read(lineString);
        return jstsGeometry.isClosed();
    }

    close(lineString) {
        const length = lineString.coordinates.length;
        if (length < 3) {
            throw new Error('LineString至少拥有三个坐标点才能闭合!');
        }
        lineString.coordinates[length] = lineString.coordinates[0];
    }

    /**
     * 计算给定角度之间的弧几何
     * @param x 圆心x
     * @param y 圆心y
     * @param radius 半径
     * @param startAngle 起始角度,单位度
     * @param endAngle 终止角度,单位度
     * @param distance 形状点之间距离
     * @returns {{type: string, coordinates: Array}}
     */
    arc(x, y, radius, startAngle, endAngle, distance) {
        if (endAngle < startAngle) {
            throw new Error('endAngle必须大于startAngle');
        }
        const perimeter = 2 * Math.PI * radius;
        const count = Math.floor(perimeter / distance);
        const remainderLength = perimeter % distance;
        const remainderAngle = 180 * remainderLength / (Math.PI * radius);
        const angleStep = (360 - remainderAngle) / count;

        let vector = new Vector(0, -1);
        vector = vector.multiNumber(radius);
        const matrix = new Matrix();
        const point = new Point(x, y);
        const geometry = {
            type: 'LineString',
            coordinates: [],
        };

        let tmpVector = null;
        let tmpPoint = null;
        let tmpMatrix = null;
        for (let i = startAngle; i < endAngle;) {
            tmpMatrix = matrix.makeRotate(i);
            tmpVector = vector.crossMatrix(tmpMatrix);
            tmpPoint = point.plusVector(tmpVector);
            geometry.coordinates.push([tmpPoint.x, tmpPoint.y]);
            i += angleStep;
        }
        tmpMatrix = matrix.makeRotate(endAngle);
        tmpVector = vector.crossMatrix(tmpMatrix);
        tmpPoint = point.plusVector(tmpVector);
        geometry.coordinates.push([tmpPoint.x, tmpPoint.y]);

        return geometry;
    }

    equals(geometry1, geometry2) {
        const jstsGeometry1 = this.reader.read(geometry1);
        const jstsGeometry2 = this.reader.read(geometry2);
        return jstsGeometry1.equals(jstsGeometry2);
    }

    /**
     * 计算球面多边形投影之后的面积,单位为平米
     * @param polygon polygon格式的经纬点
     * @returns {number}
     */
    sphericalArea(polygon) {
        if (polygon.coordinates.length === 0) {
            return 0;
        }
        if (polygon.coordinates[0].length < 3) {
            return 0;
        }

        this.geojsonTransform.setEnviroment(
            null,
            null,
            (map, tile, coordinates) => this.proj4Transform.forward(coordinates),
        );

        const g = this.geojsonTransform.convertGeometry(polygon);

        const jstsGeometry1 = this.reader.read(g);
        return jstsGeometry1.getArea();
    }

    isSimple(geometry) {
        const jstsGeometry = this.reader.read(geometry);
        return jstsGeometry.isSimple();
    }

    isValidGeometry(geometry) {
        try {
            const jstsGeometry = this.reader.read(geometry);
            return true;
        } catch (err) {
            // FM.Util.log(err);
            return false;
        }
    }

    getGeometriesByType(geometry, targetType) {
        if (!geometry) {
            return [];
        }
        const type = geometry.type;
        let geometries = [];
        switch (type) {
            case 'MultiPoint':
            case 'MultiLineString':
            case 'MultiPolygon':
                geometries = this.multiGeometryToArray(geometry);
                break;
            case 'GeometryCollection':
                for (let i = 0; i < geometry.geometries.length; ++i) {
                    const subGeometry = geometry.geometries[i];
                    geometries = geometries.concat(this.getGeometriesByType(subGeometry, targetType));
                }
                break;
            default:
                if (type === targetType) {
                    geometries.push(geometry);
                }
        }
        return geometries;
    }

    multiGeometryToArray(multiGeometry) {
        const geometries = [];
        const type = multiGeometry.type;
        for (let i = 0; i < multiGeometry.coordinates.length; ++i) {
            const geometry = {
                type: type.substr(5),
                coordinates: multiGeometry.coordinates[i],
            };
            geometries.push(geometry);
        }
        return geometries;
    }

    precision(value, num) {
        const factor = Math.pow(10, num);
        let value1 = value * factor;
        value1 += 0.5;
        value1 = Math.floor(value1);
        value1 /= factor;
        return value1;
    }

    precisionGeometry(geometry, num) {
        this.geojsonTransform.setEnviroment(null, null, (map, tile, coordinates) => {
            const x = this.precision(coordinates[0], num);
            const y = this.precision(coordinates[1], num);
            return [x, y];
        });

        const g = this.geojsonTransform.convertGeometry(geometry);
        return g;
    }

    destroy() {
        GeometryAlgorithm.instance = null;
    }

    static getInstance() {
        if (!GeometryAlgorithm.instance) {
            GeometryAlgorithm.instance = new GeometryAlgorithm();
        }
        return GeometryAlgorithm.instance;
    }
}
