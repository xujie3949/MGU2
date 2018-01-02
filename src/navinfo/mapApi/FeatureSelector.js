import SourceController from './source/SourceController';
import GeometryAlgorithm from '../geometry/GeometryAlgorithm';
import SceneController from './scene/SceneController';
import GeometryTransform from '../geometry/GeometryTransform';
import MercatorTransform from '../transform/MercatorTransform';
import Util from '../common/Util';

/**
 * 要素选择器类.
 */
export default class FeatureSelector {
    static instance = null;
    /**
     * @type {Object}
     */
    options = {};

    /**
     * 构造方法.
     * @returns {undefined}
     */
    constructor() {
        this.map = null;
        this.sourceController = SourceController.getInstance();
        this.sceneController = SceneController.getInstance();
        this.transform = new MercatorTransform();
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
        this.geojsonTransform = GeometryTransform.getInstance();
    }

    /**
     * 设置map属性
     * @param {Object} map - 是一个FM地图对象
     * @return {undefined}
     */
    setMap(map) {
        this.map = map;
    }

    /**
     * 设置数据选择额外参数(例如设置筛选条件函数等).
     * @param {Object} options - 选择数据的额外属性
     * @return {undefined}
     */
    setOptions(options) {
        Util.merge(this.options, options);
    }

    /**
     * 删除当前选择器的某个特定的选择条件.
     * @param {String} key - 筛选条件的key值
     * @return {undefined}
     */
    removeOption(key) {
        if (this.options) {
            delete this.options[key];
        }
    }

    /**
     * 删除当前选择器的所有筛选条件.
     * @return {undefined}
     */
    clearOptions() {
        this.options = {};
    }

    /**
     * 根据一个几何范围和geoLiveType选择要素
     * 如果geoLiveTypes为undefined或null,则查找所有类型要素
     * 如果未找到匹配feature返回[].
     * @param {Object} geometry 支持所有geoJson几何类型
     * @param {Array} geoLiveTypes - geoLiveType数组
     * @returns {Array} 所有被选中的feature数组
     */
    selectByGeometry(geometry, geoLiveTypes) {
        let targetGeoLiveTypes = null;
        if (!geoLiveTypes) {
            targetGeoLiveTypes = this.getFeatureTypes();
        } else {
            targetGeoLiveTypes = Util.uniq(geoLiveTypes);
        }

        if (targetGeoLiveTypes.length === 0) {
            return [];
        }

        // 用于选择的几何转换成像素坐标
        this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixelPoint);
        const pixelSelectGeometry = this.geojsonTransform.convertGeometry(geometry);

        // 计算几何所跨越的tiles
        const tiles = this.getTilesFromGeometry(pixelSelectGeometry);

        // 根据类型和tiles查询要素
        const self = this;
        let features = this.getFeaturesFromGeoLiveTypes(targetGeoLiveTypes, tiles);
        if (features.length > 0) {
            features = this.uniqueFeatureArray(features);

            // 在像素坐标下做第二次精确的筛选
            this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixelPoint);
            features = features.filter(feature => {
                const pixelFeatureGeometry = this.geojsonTransform.convertGeometry(feature.geometry);
                return this.isHitGeometry(pixelSelectGeometry, pixelFeatureGeometry);
            });
        }

        return features;
    }

    /**
     * 选择指定类型的所有要素如果geoLiveType为undefined或null,则返回[]
     * 如果未找到匹配要素类型返回[]
     * 注意此接口效率较低,切勿在循环中调用.
     * @param {String} geoLiveType - 要素数据类型
     * @returns {Array} - 被选中的要素
     */
    selectByGeoLiveType(geoLiveType) {
        if (!geoLiveType) {
            return [];
        }

        const features = this.getFeaturesFromGeoLiveTypes([geoLiveType], null);

        return features;
    }

    /**
     * 根据要素类型和要素id选择要素
     * 如果geoLiveType为undefined或null,则返回null
     * 如果未找到匹配feature返回null
     * @param {Number} id - 要素的唯一标识
     * @param {String} geoLiveType - 要素类型
     * @returns {null|Object} 被选中的要素
     */
    selectByFeatureId(id, geoLiveType) {
        if (!id || !geoLiveType) {
            return null;
        }

        const tileIds = this.getTileIdsFromFeatureId([geoLiveType], id);
        const tiles = tileIds.map(tileId => this.getTileInfoFromTileId(tileId));
        let features = this.getFeaturesFromGeoLiveTypes([geoLiveType], tiles);
        features = features.filter(feature => feature.properties.id === id);

        if (features.length === 0) {
            return null;
        }

        return features[0];
    }

    /**
     * 根据传入的过滤函数和geoLiveType选择要素
     * 如果geoLiveType为undefined或null,则返回[]
     * 如果未找到匹配feature返回[]
     * 注意此接口效率较低,切勿在循环中调用
     * @param {Function} func - 自定义函数,接受feature参数,返回bool值
     * @param {String} geoLiveType - 要素类型
     * @returns {Array} 所有被选中的feature数组
     */
    selectByFunction(func, geoLiveType) {
        if (!geoLiveType) {
            return [];
        }

        let features = this.getFeaturesFromGeoLiveTypes([geoLiveType], null);
        features = features.filter(feature => func(feature));

        return features;
    }

    /**
     * 选择指定瓦片中指定类型的所有要素
     * 如果geoLiveType为undefined或null,则返回[]
     * 如果未找到匹配要素类型返回n[]
     * 注意此接口效率较低,切勿在循环中调用.
     * @param {String} tile - 瓦片的名称，由瓦片的行列号以及缩放级别组成
     * @param {String} geoLiveType - 要素类型
     * @returns {Array} 所有被选中的feature数组
     */
    selectByTile(tile, geoLiveType) {
        if (!geoLiveType || !tile) {
            return [];
        }

        const sources = this.getSourcesByFeatureType(geoLiveType);

        let features = [];
        for (let i = 0; i < sources.length; i++) {
            features = Util.concat(features, this.getFeaturesFromTile(sources[i], geoLiveType, tile));
        }

        return features;
    }

    /**
     * 根据传入的几何，计算与该几何处于包含或者存在交集关系的所有瓦片
     * 首先计算该几何的外包矩形，得到外包矩形的范围的所有瓦片
     * 遍历得到的瓦片和几何对象计算包含和相交关系，最终过滤出所要的瓦片.
     * @param {Object} geometry - 传入的几何对象
     * @returns {Object[]} tiles - 瓦片信息对象构成数组
     */
    getTilesFromGeometry(geometry) {
        const bbox = this.geometryAlgorithm.bbox(geometry);
        let tiles = this.getTilesFromBBox(bbox);
        tiles = tiles.filter(tile => {
            const tileBound = this.getTileBoundsByTile(tile);
            return this.geometryAlgorithm.intersectsAndContains(tileBound, geometry);
        });
        return tiles;
    }

    /**
     * 根据传入的范围框返回其范围内所有的瓦片集合
     * @param {Object} bbox - 包含该范围最小x,y 最大x,y的对象.
     * @returns {Array} tiles.
     */
    getTilesFromBBox(bbox) {
        const zoom = this.map.getZoom();
        const tiles = [];
        const tileSize = 256;
        const min = L.point(bbox.minX, bbox.minY).divideBy(tileSize)._floor();
        const max = L.point(bbox.maxX, bbox.maxY).divideBy(tileSize)._floor();

        for (let j = min.y; j <= max.y; j++) {
            for (let i = min.x; i <= max.x; i++) {
                const tile = this.createTile(i, j, zoom);
                tiles.push(tile);
            }
        }
        return tiles;
    }

    /**
     * 根据瓦片id，获得该瓦片的Bounds几何对象.
     * @param {Object} tile - 瓦片信息对象
     * @returns {{type: string, coordinates: Array}} bounds - 创建的Bounds几何对象
     */
    getTileBoundsByTile(tile) {
        const bounds = {
            type: 'Polygon',
            coordinates: [],
        };

        const min = L.point(tile.x, tile.y).multiplyBy(tile.tileSize);
        const max = min.add([tile.tileSize, tile.tileSize]);

        const coordinates = [];
        coordinates.push([min.x, min.y]);
        coordinates.push([max.x, min.y]);
        coordinates.push([max.x, max.y]);
        coordinates.push([min.x, max.y]);
        coordinates.push([min.x, min.y]);

        bounds.coordinates = [coordinates];

        return bounds;
    }

    /**
     * 根据传入几何获得该几何所在的瓦片范围的工厂方法.
     * @param {Array} geometry - 传入的geoJson对象.
     * @param {Number} zoom - 当前地图的缩放级别（用于经纬度转瓦片坐标）
     * @returns {Array}.
     */
    getTileIdsFromGeometry(geometry, zoom) {
        const type = geometry.type;
        switch (type) {
            case 'Point':
                return [this.getTileIdFromPoint(geometry.coordinates, zoom)];
            case 'MultiPoint':
            case 'LineString':
                return this.getTileIdsFromLineString(geometry.coordinates, zoom);
            case 'MultiLineString':
            case 'Polygon':
                return this.getTileIdsFromPolygon(geometry.coordinates, zoom);
            case 'MultiPolygon':
                return this.getTileIdsFromMultiPolygon(geometry.coordinates, zoom);
            case 'GeometryCollection':
                return this.getTileIdsFromGeometryCollection(geometry.geometries, zoom);
            default:
                return [];
        }
    }

    /**
     * 根据要传入的点几何，查询包含这个点范围的所有瓦片.
     * @param {Array} coordinates - 点的coordinates属性
     * @param {Number} zoom - 当前地图的缩放级别（用于经纬度转瓦片坐标）
     * @returns {Array} tiles
     */
    getTileIdFromPoint(coordinates, zoom) {
        const tileArr = this.transform.lonlat2Tile(coordinates[0], coordinates[1], zoom);
        return `${tileArr[0]}:${tileArr[1]}`;
    }

    /**
     * 根据要传入的线几何，查询包含这个线范围的所有瓦片.
     * @param {Array} coordinates - 线的coordinates属性
     * @param {Number} zoom - 当前地图的缩放级别（用于经纬度转瓦片坐标）
     * @returns {Array} tiles
     */
    getTileIdsFromLineString(coordinates, zoom) {
        const tiles = [];
        for (let i = 0; i < coordinates.length; ++i) {
            const tile = this.getTileIdFromPoint(coordinates[i], zoom);
            tiles.push(tile);
        }
        return tiles;
    }

    /**
     * 根据要传入的面几何，查询包含这个面范围的所有瓦片.
     * @param {Array} coordinates - 面的coordinates属性
     * @param {Number} zoom - 当前地图的缩放级别（用于经纬度转瓦片坐标）
     * @returns {Array} tiles
     */
    getTileIdsFromPolygon(coordinates, zoom) {
        let tiles = [];
        for (let i = 0; i < coordinates.length; ++i) {
            const lineStringTiles = this.getTileIdsFromLineString(coordinates[i], zoom);
            tiles = tiles.concat(lineStringTiles);
        }
        return tiles;
    }

    /**
     * 根据要传入的多面几何，查询包含这些几何范围的所有瓦片.
     * @param {Object[]} coordinates - 面几何的coordinates属性
     * @param {Number} zoom - 当前地图的缩放级别（用于经纬度转瓦片坐标）
     * @returns {Array} tiles
     */
    getTileIdsFromMultiPolygon(coordinates, zoom) {
        let tiles = [];
        for (let i = 0; i < coordinates.length; ++i) {
            const polygonTiles = this.getTileIdsFromPolygon(coordinates[i], zoom);
            tiles = tiles.concat(polygonTiles);
        }
        return tiles;
    }

    /**
     * 根据要传入的几何集，查询包含这些几何范围的所有瓦片.
     * @param {Object[]} geometries - 几何集合
     * @param {Number} zoom - 当前地图的缩放级别（用于经纬度转瓦片坐标）
     * @returns {Array} tiles
     */
    getTileIdsFromGeometryCollection(geometries, zoom) {
        let tiles = [];
        for (let i = 0; i < geometries.length; ++i) {
            const multiGeometries = this.getTileIdsFromGeometry(geometries[i], zoom);
            tiles = tiles.concat(multiGeometries);
        }
        return tiles;
    }

    /**
     * 根据要素类型数组和要的的id值，查询包含要素的所有瓦片.
     * @param {String[]} geoLiveTypes - 要素类型数组
     * @param {Number} id - 要素的唯一标识
     * @returns {Array} tileIds - 返回的瓦片id数组.
     */
    getTileIdsFromFeatureId(geoLiveTypes, id) {
        let tileIds = [];
        let featureType = null;
        let sources = null;
        for (let i = 0; i < geoLiveTypes.length; ++i) {
            featureType = geoLiveTypes[i];
            sources = this.getSourcesByFeatureType(featureType);
            for (let j = 0; j < sources.length; ++j) {
                tileIds = Util.concat(tileIds, sources[j].queryTilesById(featureType, id));
            }
        }

        return tileIds;
    }

    /**
     * 根据给定的数据类型数组，查找给定瓦片范围内所有满足条件的要素数据.
     * 返回的要素数据的几何已转换为地理坐标.
     * @param {Array} geoLiveTypes - 查找的要素数据类型数组
     * @param {Object[]} tiles - 查找的瓦片对象数组（限定查找的瓦片范围）
     * @returns {Array} features - 返回查找到的要素数据
     */
    getFeaturesFromGeoLiveTypes(geoLiveTypes, tiles) {
        let features = [];
        let featureType = null;
        let sources = null;
        for (let i = 0; i < geoLiveTypes.length; ++i) {
            featureType = geoLiveTypes[i];
            sources = this.getSourcesByFeatureType(featureType);
            for (let j = 0; j < sources.length; ++j) {
                features = Util.concat(features, this.getFeaturesFromTiles(sources[j], featureType, tiles));
            }
        }

        features = this.uniqueFeatureArray(features);
        return features;
    }

    /**
     * 根据瓦片数组要素类型，在给定的数据源中查询该类型要素的所有数据
     * 返回的要素数据的几何已转换为地理坐标.
     * @param {Object} source - 查找的数据源对象
     * @param {String} geoLiveType - 查找的要素数据类型
     * @param {Object[]} tiles - 查找的瓦片对象数组
     * @returns {Array} resFeatures - 返回查找到的要素数据
     */
    getFeaturesFromTiles(source, geoLiveType, tiles) {
        let tileIds = null;
        if (!tiles) {
            tileIds = source.queryTiles();
        } else {
            tileIds = tiles.map(tile => tile.fullName);
        }

        let features = [];
        for (let i = 0; i < tileIds.length; ++i) {
            const tileId = tileIds[i];
            features = features.concat(this.getFeaturesFromTile(source, geoLiveType, tileId));
        }
        return features;
    }

    /**
     * 根据瓦片名称以及要素类型，在给定的数据源中查询该类型要素的所有数据
     * 返回的要素数据的几何已转换为地理坐标.
     * @param {Object} source - 查找的数据源对象
     * @param {String} geoLiveType - 查找的要素数据类型
     * @param {String} tileId - 查找的瓦片名称
     * @returns {Array} resFeatures - 返回查找到的要素数据
     */
    getFeaturesFromTile(source, geoLiveType, tileId) {
        const resFeatures = [];
        const features = source.queryFeaturesByType(geoLiveType, tileId);
        const tileInfo = this.getTileInfoFromTileId(tileId);
        this.geojsonTransform.setEnviroment(this.map, tileInfo, this.convertToLngLat);
        for (let i = 0; i < features.length; ++i) {
            const feature = features[i];
            if (!this.geometryAlgorithm.isValidGeometry(feature.geometry)) {
                continue;
            }
            // 这里需要转换坐标,为了不影响原来的数据,先克隆
            const cloneFeature = feature.clone();
            cloneFeature.geometry = this.geojsonTransform.convertGeometry(cloneFeature.geometry);
            resFeatures.push(cloneFeature);
        }
        return resFeatures;
    }

    /**
     * 通过瓦片的id创建瓦片信息数据对象
     * 通过对瓦片名称字符串以冒号分割可以提取出瓦片的行列号以及缩放等级.
     * @param {String} tileId - 瓦片名称，由行列号以及缩放等级字符串以冒号分割拼接起来的.
     * @returns {Object} - 瓦片信息对象
     */
    getTileInfoFromTileId(tileId) {
        const array = tileId.split(':');

        const tile = this.createTile(array[0], array[1], array[2]);

        return tile;
    }

    /**
     * 创建瓦片信息对象实际方法.
     * @param {Number} x - 瓦片列号
     * @param {Number} y - 瓦片行号
     * @param {Number} z - 当前地图的缩放级别
     * @returns {{name: string, fullName: string, x: *, y: *, z: *, tileSize: number}} title - 瓦片信息对象
     */
    createTile(x, y, z) {
        const tile = {
            name: `${x}:${y}`,
            fullName: `${x}:${y}:${z}`,
            x: x,
            y: y,
            z: z,
            tileSize: 256,
        };
        return tile;
    }

    /**
     * 瓦片坐标转换为地理坐标
     * 瓦片转换地理坐标首先根据瓦片行列号计算瓦片的像素坐标
     * 然后通过投影逆向转换为地理坐标
     * @param {Object} map - leaflet地图对象
     * @param {Object} tileInfo - 瓦片对象
     * @param {Array} coordinates - 要转换的瓦片坐标
     * @returns {Array} - 转换后的地理坐标
     */
    convertToLngLat(map, tileInfo, coordinates) {
        const x = tileInfo.x * tileInfo.tileSize + coordinates[0];
        const y = tileInfo.y * tileInfo.tileSize + coordinates[1];
        const lnglat = this.transform.pixel2Geographic(x, y, map.getZoom());
        return lnglat;
    }

    /**
     * 将地理坐标转换为像素坐标.
     * @param {Object} map - leaflet地图对象
     * @param {Object} tileInfo - 瓦片对象
     * @param {Array} coordinates - 要转换的地理坐标
     * @returns {Array} - 转换后的像素坐标
     */
    convertToPixelPoint(map, tileInfo, coordinates) {
        const x = coordinates[0];
        const y = coordinates[1];
        const point = this.transform.geographic2Pixel(x, y, map.getZoom());
        return point;
    }

    /**
     * 判断两个几何是否满足下面设定的条件.
     * @param {Object} selectGeometry - 要对比的几何
     * @param {Object} geometry - 获得的要素几何
     * @returns {Boolean} - 是否满足条件
     */
    isHitGeometry(selectGeometry, geometry) {
        const type = selectGeometry.type;
        switch (type) {
            case 'Point':
            case 'MultiPoint':
                return this.geometryAlgorithm.isWithinDistance(selectGeometry, geometry, 5);
            case 'LineString':
            case 'MultiLineString':
                return this.geometryAlgorithm.intersects(selectGeometry, geometry);

            case 'Polygon':
            case 'MultiPolygon':
                return this.geometryAlgorithm.intersectsAndContains(selectGeometry, geometry);

            case 'GeometryCollection':
                return selectGeometry.geometries.some(item => this.isHitGeometry(selectGeometry, item));
            default:
                throw new Error(`不支持的几何类型:${type}`);
        }
    }

    /**
     * 对选则的要素进行去重.
     * @param {Array} arr - 传入的要素数组
     * @returns {Array} - res - 去重后的要素数组
     */
    uniqueFeatureArray(arr) {
        const res = [];
        const obj = {};
        for (let i = 0; i < arr.length; i++) {
            const feature = arr[i];
            const key = `${feature.properties.geoLiveType}:${feature.properties.id}`;
            if (!obj[key]) {
                res.push(feature);
                obj[key] = true;
            }
        }
        return res;
    }

    /**
     * 获得当前加载的场景中所有的要素类型.
     * @returns {Array}.
     */
    getFeatureTypes() {
        return this.sceneController.getLoadedFeatureTypes();
    }

    /**
     * 根据要素类型获得所有该数据的数据源.
     * @param {String} featureType - 要素数据类型(例如rdLink rdNode等)
     * @returns {Array}.
     */
    getSourcesByFeatureType(featureType) {
        const sources = [];
        const layers = this.sceneController.getLoadedLayersByFeatureType(featureType);
        for (let i = 0; i < layers.length; i++) {
            sources.push(this.sourceController.getSource(layers[i].getSourceName()));
        }

        return Util.uniq(sources);
    }

    /**
     * 销毁单例对象
     * @return {undefined}
     */
    destroy() {
        FeatureSelector.instance = null;
    }

    /**
     * 获取要素选择器类单例对象的静态方法.
     * @statis
     * @example
     * const FeatureSelector = FeatureSelector.getInstance();
     * @returns {Object} 返回FeatureSelector.instance单例对象.
     */
    static getInstance() {
        if (!FeatureSelector.instance) {
            FeatureSelector.instance = new FeatureSelector();
        }
        return FeatureSelector.instance;
    }
}
