import {
    Map as LeafletMap,
    Point,
    Bounds,
} from 'leaflet';

import 'leaflet/dist/leaflet.css';

import SourceController from './source/SourceController';
import SceneController from './scene/SceneController';
import VectorLayer from './layer/VectorLayer';
import GridLayer from './layer/GridLayer';
import MeshLayer from './layer/MeshLayer';
import TileBoundsLayer from './layer/TileBoundsLayer';
import TileWMSLayer from './layer/TileWMSLayer';
import FeedbackLayer from './layer/FeedbackLayer';
import OverlayLayer from './layer/OverlayLayer';
import TileRequestController from './TileRequestController';
import Util from '../common/Util';
import EventController from '../common/EventController';

/**
 * FastMap地图类，是对leafletmap的二次包装，对外提供添加图层
 * 以及地图图层更新后的刷新方法.
 */
export default class Map {
    /**
     * 构造leaflet地图的初始属性.
     * @type {Object}
     */
    options = {
        tileSize: 256,
        container: 'editorMap',
        center: [0, 0],
        zoom: 0,
    };

    /**
     * FM地图的构造方法.
     * @param {Object} options - 初始化leaflet地图的参数.
     * @returns {undefined}
     */
    constructor(options) {
        this.options = Util.merge(this.options, options);
        /**
         * 地图的瓦片容器.
         * @type {Array}
         */
        this._tiles = [];
        /**
         * leaflet地图对象.
         * @type {Object}
         */
        this._leafletMap = null;
        /**
         * 数据员管理器的单例对象引用
         * @type {Object}
         */
        this._sourceController = SourceController.getInstance();
        this._sceneController = SceneController.getInstance();
        this._tileRequestController = TileRequestController.getInstance();
        this._eventController = EventController.getInstance();
        /**
         * 当前处于激活状态的矢量图层
         * @type {Object}
         */
        this._activeLeafletVectorLayer = null;
        /**
         * 当前激活状态矢量图层包含的场景图层容器
         * @type {Array}
         */
        this._featureLayers = [];
        // 初始化leaflet地图对象
        this._initLeafletMap();
    }

    /**
     * 初始化leaflet地图对象并对地图绑定
     * moveend和resize事件.
     * @return {undefined}
     */
    _initLeafletMap() {
        this._createLeafletMap();
        this._bindLeafletMapEvent();
        this._sceneController.setMap(this);
        this._onMapMoveEnd();
    }

    /**
     * 创建leaflet地图对象的内部方法.
     * @return {undefined}
     */
    _createLeafletMap() {
        this._leafletMap = new LeafletMap(this.options.container, {
            dragging: false,
            touchZoom: false,
            doubleClickZoom: false,
            scrollWheelZoom: false,
            boxZoom: false,
            keyboard: false,
            tap: false,
            attributionControl: false,
            zoomControl: false,
            center: this.options.center,
            zoom: this.options.zoom,
            trackResize: true,
        });
    }

    /**
     * 为地图绑定事件，监听地图状态的变化从而更新地图的显示.
     * @return {undefined}
     */
    _bindLeafletMapEvent() {
        this._leafletMap.on('moveend', this._onMapMoveEnd, this);
        this._leafletMap.on('resize', this._resizeLayers, this);

        // 屏蔽掉默认的右键菜单
        this._leafletMap.getContainer()
            .addEventListener('contextmenu', event => event.preventDefault());

        // 阻止地图双击选中事件
        this._leafletMap.getContainer()
            .addEventListener('selectstart', event => event.preventDefault());
    }

    /**
     * 获得leaflet地图对象.
     * @returns {Object} _leafletMap - leaflet地图对象
     */
    getLeafletMap() {
        return this._leafletMap;
    }

    /**
     * 设置地图的显示级别.
     * @param {Number} zoom - 地图的显示级别参数
     * @returns {Object} - 返回leaflet地图对象的引用
     */
    setZoom(zoom) {
        return this._leafletMap.setZoom(zoom);
    }

    /**
     * 获得地图的显示级别.
     * @returns {Object} - 返回leaflet地图对象的引用
     */
    getZoom() {
        return this._leafletMap.getZoom();
    }

    /**
     * 获得地图的容器.
     * @returns {Object} - 返回地图容器
     */
    getContainer() {
        return this._leafletMap.getContainer();
    }

    /**
     * 获得地图范围
     * @returns {Object} - 返回地图容器
     */
    getBounds() {
        return this._leafletMap.getBounds();
    }

    /**
     * 重新设置地图大小.
     * @returns {undefined} - 返回地图容器
     */
    resize() {
        this._leafletMap.invalidateSize();
    }

    _resizeLayers() {
        this._leafletMap.eachLayer(item => {
            if (item.resize) {
                item.resize();
            }
        });
    }

    /**
     * 获得当前地图上加载的所有矢量图层.
     * @returns {Array} layers
     */
    _getVectorLayers() {
        const layers = [];
        this._leafletMap.eachLayer(item => {
            if (item instanceof VectorLayer) {
                layers.push(item);
            }
        });

        return layers;
    }

    /**
     * 清空地图上加载的所有矢量图层画布的内容.
     * @returns {Array} layers - 返回所有加载的矢量图层数组
     */
    _clearVectorLayers() {
        const layers = [];
        this._leafletMap.eachLayer(item => {
            if (item instanceof VectorLayer) {
                item.clear();
            }
        });

        return layers;
    }

    /**
     * 重新绘制非矢量leaflet图层.
     * @return {undefined}
     */
    _redrawNonVectorLayers() {
        this._leafletMap.eachLayer(item => {
            if (!(item instanceof VectorLayer) && item.redraw) {
                item.redraw();
            }
        });
    }

    /**
     * 获得地图上加载的所有场景图层
     * 通过找到所有的矢量图层，遍历矢量图层的场景图层容器获得.
     * @returns {Array} layers - 返回地图上加载的所有场景图层
     */
    _getFeatureLayers() {
        const layers = [];
        this._leafletMap.eachLayer(item => {
            if (item instanceof VectorLayer) {
                const visibleLayers = item.getSceneLayers()
                    .filter(layer => layer.visible());
                Array.prototype.push.apply(layers, visibleLayers);
            }
        });

        return layers;
    }

    /**
     * 重绘地图，删除全部数据，重新请求
     * @param {Array} layers - 场景图层数组
     * @return {undefined}
     */
    redraw(layers) {
        this._redrawNonVectorLayers();

        this._clearVectorLayers();

        if (layers && layers.length > 0) {
            const redLayers = [];
            for (let i = 0; i < layers.length; i++) {
                this._delLayerData(layers[i]);
                redLayers.push(layers[i].getLeafletLayer());
            }

            this._requestAndDrawTiles(this._tiles, layers);

            const vectorLayer = this._getVectorLayers();
            const greenLayers = Util.difference(vectorLayer, redLayers);
            this._redrawTiles(this._tiles, greenLayers);
        } else {
            this._delTilesData(this._tiles);

            this._requestAndDrawTiles(this._tiles, this._featureLayers);
        }
    }

    /**
     * 刷新地图，对地图图层执行了新增、删除操作后，必须执行此方法.
     * @return {undefined}
     */
    refresh() {
        // this._tileRequestController.clear();
        let i;
        const vectorLayer = this._getVectorLayers();
        const featureLayers = this._getFeatureLayers();

        const addLayers = Util.differenceBy(featureLayers, this._featureLayers, 'id');
        let delLayers = Util.differenceBy(this._featureLayers, featureLayers, 'id');
        const remLayers = Util.intersectionBy(featureLayers, this._featureLayers, 'id');

        this._clearVectorLayers();

        delLayers = delLayers.filter(item => {
            for (let k = 0; k < remLayers.length; k++) {
                if (item.useSameData(remLayers[k])) {
                    return false;
                }
            }
            return true;
        });
        for (i = 0; i < delLayers.length; i++) {
            this._delLayerData(delLayers[i]);
        }
        const redLayers = [];
        for (i = 0; i < addLayers.length; i++) {
            redLayers.push(addLayers[i].getLeafletLayer());
        }
        this._requestAndDrawTiles(this._tiles, addLayers);

        const greenLayers = Util.difference(vectorLayer, redLayers);
        this._redrawTiles(this._tiles, greenLayers);

        this._featureLayers = featureLayers;
    }

    /**
     * 局部瓦片刷新，处理地图移动和缩放事件.
     * @return {undefined}
     */
    _onMapMoveEnd() {
        const tiles = this._getTiles();
        const addTiles = Util.differenceBy(tiles, this._tiles, 'name');
        const delTiles = Util.differenceBy(this._tiles, tiles, 'name');
        const remTiles = Util.intersectionBy(tiles, this._tiles, 'name');

        this._clearVectorLayers();

        this._delTilesData(delTiles);

        const layers = this._getVectorLayers();

        this._requestAndDrawTiles(addTiles, this._featureLayers);

        this._redrawTiles(remTiles, layers);

        this._tiles = tiles;
    }

    /**
     * 根据当前地图视口计算所有要加载的瓦片.
     * @returns {Array} tiles - 所有要加载的瓦片对象数组
     */
    _getTiles() {
        const map = this._leafletMap;
        const bounds = map.getPixelBounds();
        const size = bounds.getSize();
        if (size.x === 0 || size.y === 0) {
            // 当地图宽度或者高度为零时,返回空数组
            return [];
        }
        const zoom = map.getZoom();
        const tileSize = this.options.tileSize;

        const tileBounds = new Bounds(
            bounds.min.divideBy(tileSize)
                ._floor(),
            bounds.max.divideBy(tileSize)
                ._floor(),
        );

        const queue = [];
        const center = tileBounds.getCenter();

        for (let j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
            for (let i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
                const point = new Point(i, j);
                queue.push(point);
            }
        }

        // load tiles in order of their distance to center
        queue.sort((a, b) => a.distanceTo(center) - b.distanceTo(center));

        const tiles = [];
        for (let i = 0; i < queue.length; ++i) {
            const x = queue[i].x;
            const y = queue[i].y;
            const tile = this._createTile(x, y, zoom);
            tiles.push(tile);
        }

        return tiles;
    }

    /**
     * 创建加载的瓦片信息对象
     * 该对象的信息包括瓦片的行列号，名称，全名以及瓦片的大小.
     * @param {Number} x - 瓦片的行号
     * @param {Number} y - 瓦片的列号
     * @param {Number} z - 瓦片的等级
     * @returns {{name: string, fullName: string, x: *, y: *, z: *, size: number}} tile
     */
    _createTile(x, y, z) {
        const tile = {
            name: `${x}:${y}`,
            fullName: `${x}:${y}:${z}`,
            x: x,
            y: y,
            z: z,
            size: this.options.tileSize,
        };
        return tile;
    }

    /**
     * 请求传入的瓦片下所有要素场景图层对应的要素数据绘制图层.
     * @param {Object[]} tiles - 瓦片对象数组
     * @param {Object[]} layers - 请求的场景图层.
     * @return {undefined}
     */
    _requestAndDrawTiles(tiles, layers) {
        if (tiles.length === 0 || layers.length === 0) {
            return;
        }

        this._eventController.fire('TileLayersLoading', {
            layers: layers,
            tiles: tiles,
        });

        const vectorLayers = [];
        for (let i = 0; i < layers.length; i++) {
            const temp = layers[i].getLeafletLayer();
            if (vectorLayers.indexOf(temp) < 0) {
                vectorLayers.push(temp);
            }
        }

        const innerFunc = (tile, index) =>
            this._requestTileData(tile, index, layers)
                .then(() => {
                    this._redrawTile(tile, vectorLayers);
                });

        const promises = [];
        for (let i = 0; i < tiles.length; ++i) {
            promises.push(innerFunc(tiles[i], i));
        }

        Promise.all(promises)
            .then(() => {
                this._eventController.fire('TileLayersLoaded', {
                    layers: layers,
                    tiles: tiles,
                });
            });
    }

    /**
     * 绘制当前瓦片数组下的给定矢量图层.
     * @param {Object[]} tiles - 瓦片对象数组
     * @param {Object[]} vectorLayers - 传入的矢量图层数组
     * @return {undefined}
     */
    _redrawTiles(tiles, vectorLayers) {
        if (tiles.length === 0 || vectorLayers.length === 0) {
            return;
        }

        let tile;
        for (let i = 0; i < tiles.length; ++i) {
            tile = tiles[i];
            this._redrawTile(tile, vectorLayers);
        }
    }

    /**
     * 绘制当前瓦片下的给定矢量图层.
     * @param {Object} tile - 瓦片数据对象
     * @param {Object[]} vectorLayers - 传入的矢量图层
     * @return {undefined}
     */
    _redrawTile(tile, vectorLayers) {
        for (let i = 0; i < vectorLayers.length; ++i) {
            vectorLayers[i].draw(tile);
        }
    }

    /**
     * 根据传入的图层场景创建请求地址对象
     * 然后将数据请求权交给数据管理器实瓦片数据的请求并立即返回异步对象.
     * @param {Object} tile - 请求的瓦片信息对象
     * @param {Number} tileIndex - 该瓦片的请求索引
     * @param {Object[]} layers - 请求的场景图层
     * @returns {Promise} - 返回异步对象
     */
    _requestTileData(tile, tileIndex, layers) {
        const urlObject = this._createUrlObject(tile, layers);
        return this._sourceController.requestTileData(tile, tileIndex, urlObject);
    }

    /**
     * 创建请求url对象
     * 该对象的数据结构是以数据源类型为键，已某种数据源下个要素的geoLiveType组成的字符串数组为值.
     * @param {Object} tile - 请求的瓦片信息对象
     * @param {Object[]} layers - 请求的场景图层
     * @returns {Object} urls
     */
    _createUrlObject(tile, layers) {
        const zoom = this._leafletMap.getZoom();
        const urls = {};
        for (let i = 0; i < layers.length; ++i) {
            if (!layers[i].canDraw(zoom)) {
                continue;
            }
            const options = layers[i].getOptions();
            const sourceName = options.source;
            let featureType = options.serverFeatureType;
            if (!featureType) {
                featureType = options.featureType;
            }

            if (!urls.hasOwnProperty(sourceName)) {
                urls[sourceName] = [];
            }
            urls[sourceName].push(featureType);
        }
        return urls;
    }

    /**
     * 请求出错抛出错误异常.
     * @param {Object} e - 错误异常对象
     * @return {undefined}
     */
    _onRequestTileDataError(e) {
        throw new Error(e);
    }

    /**
     * 清除传入瓦片下的所有数据.
     * @param {Object} tiles - 瓦片对象数组
     * @return {undefined}
     */
    _delTilesData(tiles) {
        for (let i = 0; i < tiles.length; ++i) {
            const tile = tiles[i];
            this._delTileData(tile);
        }
    }

    /**
     *
     * 删除传入的瓦片下的所有数据
     * 直接删除所有数据源类型下以该瓦片全名为键的对象.
     * @param {Object} tile - 传入的瓦片对象数组.
     * @return {undefined}
     */
    _delTileData(tile) {
        this._tileRequestController.del(tile.fullName);
        const sources = this._sourceController.getAllSources();
        for (let i = 0; i < sources.length; ++i) {
            const source = sources[i];
            source.delByTile(tile.fullName);
        }
    }

    /**
     * 删除数据源中给定场景图层的所有数据
     * 根据场景图层确定该种场景图层的数据源和要素类型
     * 然后遍历数据源，删除所有瓦片下以该要素类型为键的所有数据对象.
     * @param {Object} sceneLayer - 场景图层.
     * @return {undefined}
     */
    _delLayerData(sceneLayer) {
        const sources = this._sourceController.getSource(sceneLayer.getSourceName());
        const featureType = sceneLayer.getFeatureType();
        for (let i = 0; i < this._tiles.length; i++) {
            sources.delByType(featureType, this._tiles[i].fullName);
        }
    }

    /**
     * 创建WMS地图图层,返回leaflet的网络地图服务图层实例(用与资三图层显示).
     * @param {Object} sceneLayer - 场景图层
     * @return {Object} - 返回leaflet的网络地图服务图层实例
     */
    _createWmsLayer(sceneLayer) {
        const opts = this._getLeafletLayerOption(sceneLayer);

        return new TileWMSLayer(opts.source, opts);
    }

    /**
     * 创建栅格地图图层，返回leaflet瓦片图层实例
     * 一般用于切分好的图像(每个图片的大小与瓦片大小相同一般为256*256)构成的图层的显示渲染.
     * @param {Object} sceneLayer - 场景图层
     * @return {Object} - 返回leaflet的瓦片地图服务图层实例
     */
    _createRasterLayer(sceneLayer) {
        const opts = this._getLeafletLayerOption(sceneLayer);

        return L.tileLayer(opts.source, opts);
    }

    /**
     * 创建矢量要素显示渲染图层，该图层由覆盖整个地图视口的整体canvas画布构成
     * 用于对与将服务返回的要素数据转换为符号库中对应的符号后绘制而成的图层.
     * @return {Object} - 矢量图层对象实例
     */
    _createVectorLayer() {
        return new VectorLayer();
    }

    /**
     * 创建格网图层，返回自定义的格网图层实例
     * 该图层继承与图幅图层，每个图幅包含16个格网.
     * @param {Object} sceneLayer - 场景图层
     * @return {Object} - 格网图层实例对象
     */
    _createGridLayer(sceneLayer) {
        const opts = this._getLeafletLayerOption(sceneLayer);

        return new GridLayer(opts);
    }

    /**
     * 创建图幅图层
     * @param {Object} sceneLayer - 场景图层
     * @return {Object} - 图幅图层实例对象
     */
    _createMeshLayer(sceneLayer) {
        const opts = this._getLeafletLayerOption(sceneLayer);

        return new MeshLayer(opts);
    }

    /**
     * 创建瓦片范围图层
     * @param {Object} sceneLayer - 场景图层
     * @return {Object} - 瓦片范围图层实例对象
     */
    _createTileBoundsLayer(sceneLayer) {
        const opts = this._getLeafletLayerOption(sceneLayer);
        opts.tileSize = opts.tileSize || 256;

        return new TileBoundsLayer(opts);
    }

    /**
     * 创建反馈图层
     * @param {Object} sceneLayer - 场景图层
     * @return {Object} - 反馈图层实例对象
     */
    _createFeedbackLayer(sceneLayer) {
        const opts = this._getLeafletLayerOption(sceneLayer);

        return new FeedbackLayer(opts);
    }

    /**
     * 根据传入的场景图层创建覆盖物图层.
     * @param {Object} sceneLayer - 传入的场景图层
     * @return {Object} - 覆盖物图层
     */
    _createOverlayLayer(sceneLayer) {
        const opts = this._getLeafletLayerOption(sceneLayer);

        return new OverlayLayer(opts);
    }

    /**
     * 根据传入的场景图层构建构造leaflet图层所需要的参数.
     * @param {Object} sceneLayer - 传入的场景图层
     * @returns {Object} opts
     */
    _getLeafletLayerOption(sceneLayer) {
        let opts = {
            id: sceneLayer.id,
            name: sceneLayer.name,
        };
        opts = Util.merge(opts, sceneLayer.options);

        return opts;
    }

    /**
     * 根据传入的场景图层创建对应的leaflet图层，并加入leaflet图层容器中
     * 并为该场景图层设置对应的leaflet图层引用
     * 每个矢量图层最多绘制20个要素数据.
     * @param {Object} sceneLayer - 传入的场景图层
     * @returns {Object} sceneLayer - 传入的场景图层
     */
    addLayer(sceneLayer) {
        let leafletLayer;
        let vectFlag = false;
        let temp;
        switch (sceneLayer.type) {
            case 'wms':
                leafletLayer = this._createWmsLayer(sceneLayer);
                break;
            case 'raster':
                leafletLayer = this._createRasterLayer(sceneLayer);
                break;
            case 'vector':
                if (!this._activeLeafletVectorLayer || !this._activeLeafletVectorLayer.available()) {
                    this._activeLeafletVectorLayer = this._createVectorLayer();
                    leafletLayer = this._activeLeafletVectorLayer;
                }
                this._activeLeafletVectorLayer.addSceneLayer(sceneLayer);
                vectFlag = true;
                break;
            case 'grid':
                leafletLayer = this._createGridLayer(sceneLayer);
                break;
            case 'mesh':
                leafletLayer = this._createMeshLayer(sceneLayer);
                break;
            case 'tile':
                leafletLayer = this._createTileBoundsLayer(sceneLayer);
                break;
            case 'feedback':
                leafletLayer = this._createFeedbackLayer(sceneLayer);
                break;
            case 'overlay':
                leafletLayer = this._createOverlayLayer(sceneLayer);
                break;
            default:
                throw new Error(`不能识别的图层:${sceneLayer.type}`);
        }

        if (leafletLayer) {
            this._leafletMap.addLayer(leafletLayer);
        }

        if (!vectFlag) {
            sceneLayer.setLeafletLayer(leafletLayer);
            this._activeLeafletVectorLayer = null;
        }

        return sceneLayer;
    }

    /**
     * 移除场景图层对应的leaflet图层.
     * @param {Object} layer - 传入的场景图层
     * @return {undefined}
     */
    removeLayer(layer) {
        const leafletLayer = layer.getLeafletLayer();
        let temp;
        if (leafletLayer) {
            if (layer.type === 'vector') {
                leafletLayer.removeSceneLayer(layer);
                if (leafletLayer.getSceneLayers().length === 0) {
                    if (this._activeLeafletVectorLayer === leafletLayer) {
                        this._activeLeafletVectorLayer = null;
                    }
                    this._leafletMap.removeLayer(leafletLayer);
                }
            } else {
                this._leafletMap.removeLayer(leafletLayer);
                layer.setLeafletLayer(null);
            }
        }
    }
}
