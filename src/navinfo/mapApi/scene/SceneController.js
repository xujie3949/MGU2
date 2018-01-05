import SceneLayer from './SceneLayer';
import Scene from './Scene';
import Util from '../../common/Util';
import EventController from '../../common/EventController';

/**
 * 场景图层控制器类，用于管理所有的场景.
 */
export default class SceneController {
    static instance = null;

    constructor() {
        /**
         * FM地图对象
         * @type {Object} _map
         */
        this._map = null;
        /**
         * 当前显示（激活）的场景
         * @type {Object} _currentScene
         */
        this._currentScene = null;
        /**
         * 场景容器
         * @type {Array} _scenes
         */
        this._scenes = [];
        /**
         * 场景图层容器
         * @type {Array} _layers
         */
        this._layers = [];

        /**
         * 背景图层容器
         * @type {Array} _backgrounds
         */
        this._backgrounds = [];
        /**
         * 覆盖物图层容器
         * @type {Array} _overlays
         */
        this._overlays = [];
        /**
         * 记录临时添加到地图中显示的图层，切换场景后会清空
         * @type {Array} _temporaries
         */
        this._temporaries = [];
        /**
         * 记录加载到当前场景的图层，包含_temporaries
         * @type {Array} _sceneLayers
         */
        this._sceneLayers = [];

        this._eventController = EventController.getInstance();
        this._eventController.once('DestroySingleton', () => this.destroy());
    }

    /**
     * 设置场景控制器的地图对象
     * @param {Object} map 是FM.mapapi.map类的实例对象
     * @returns {undefined}
     */
    setMap(map) {
        this._map = map;
    }

    /**
     * 获得mapApi的map对象
     * @returns {Object} - mapApi的map对象
     */
    getMap() {
        return this._map;
    }

    /**
     * 获得leaflet的map对象
     * @returns {Object} - leaflet的map对象
     */
    getLeafletMap() {
        return this._map.getLeafletMap();
    }

    /**
     * 获取当前地图的显示级别.
     * @returns {Number} zoom - 地图的缩放级别
     */
    getZoom() {
        return this._map.getZoom();
    }

    /**
     * 设置场景的默认显示以及编辑配置.
     * @param {Object} config - App.Config.map
     * @returns {undefined}
     */
    setDefaultZoom(config) {
        this.defaultZoom = Util.merge(
            {
                minZoom: 1,
                maxZoom: 20,
                minEditZoom: 17,
            },
            config,
        );
    }

    /**
     * 遍历图层配置信息，创建场景图层并存入场景图层容器_layers中.
     * @param {Object} config - 某种类型的图层配置例如要素
     * 的图层配置App.Config.map.FeatureLayers
     * @param {String} label - 图层的label标记
     * @returns {undefined}
     */
    loadLayers(config, label) {
        const keys = Object.getOwnPropertyNames(config);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const value = config[key];
            if (this.getLayerById(key)) {
                throw new Error(`图层ID存在重复:${key}`);
            }
            value.label = value.label || label || 'None';

            if (this.defaultZoom) {
                value.options = value.options || {};
                value.options.minZoom = value.options.minZoom || this.defaultZoom.minZoom;
                value.options.maxZoom = value.options.maxZoom || this.defaultZoom.maxZoom;
                if (value.type === 'vector') {
                    value.options.minEditZoom = value.options.minEditZoom || this.defaultZoom.minEditZoom;
                }
            }

            const layer = new SceneLayer(key, value);
            this._layers.push(layer);
        }
    }

    /**
     * 创建场景的方法
     * @param {String} sceneId - 场景的唯一标识
     * @param {Object} config - 一个场景配置信息一般包括type,label,name,layers
     * @returns {Object} scene - 场景类的实例对象
     */
    _createScene(sceneId, config) {
        const scene = new Scene(sceneId, config);

        const orderedLayers = [];

        // 注意：场景中图层的配置顺序决定了图层的加载顺序
        for (let i = 0; i < config.layers.length; ++i) {
            const item = config.layers[i];
            const sceneLayer = this.getLayerById(item);
            if (sceneLayer) {
                scene.addLayer(sceneLayer);
            } else if (item.charAt(0) === '[' && item.charAt(item.length - 1) === ']') {
                const label = item.slice(1, item.length - 1);
                const tempLayers = this.getLayersByLabel(label);
                for (let j = 0; j < tempLayers.length; j++) {
                    scene.addLayer(tempLayers[j]);
                }
            } else {
                throw new Error(`场景配置的图层不存在:${item}`);
            }
        }
        return scene;
    }

    /**
     * 接收App.Config.map.Scenes对象，遍历该对象创建系统中所有的场景
     * 存放到场景容器_scenes中，并切换到配置的默认场景.
     * @param {Object} config - 场景配置对象
     * @returns {undefined}
     */
    loadScenes(config) {
        const keys = Object.getOwnPropertyNames(config.scenes);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const value = config.scenes[key];
            if (this.getSceneById(key)) {
                throw new Error(`场景ID存在重复:${key}`);
            }
            const scene = this._createScene(key, value);
            this._scenes.push(scene);
        }

        if (config.defaultScene) {
            this.changeScene(config.defaultScene);
        }
    }

    /**
     * 加载背景场景图层,并将背景图层存入_backgrounds背景图层容器中.
     * @param {Array} list - App.Config.map.Background中定义的背景图层
     * @returns {undefined}
     */
    loadBackground(list) {
        let layer;
        for (let i = 0; i < list.length; i++) {
            layer = this.getLayerById(list[i]);
            if (!layer) {
                throw new Error(`Background配置的图层ID不存在:${list[i]}`);
            }
            this._addToBackground(layer);
        }

        this.refreshBackground();
    }

    /**
     * 加载覆盖物图层,并将覆盖物图层存入_overlays覆盖物图层容器中.
     * @param {Array} list - App.Config.map.Overlay中定义的覆盖物图层
     * @returns {undefined}
     */
    loadOverlay(list) {
        for (let i = 0; i < list.length; i++) {
            const layer = this.getLayerById(list[i]);
            if (!layer) {
                throw new Error(`Overlay配置的图层ID不存在:${list[i]}`);
            }
            this._addToOverlay(layer);
        }

        this.refreshOverlay();
    }

    /**
     * 将背景场景图层压入_backgrounds背景图层容器
     * 将背景场景图创建为对应的leaflet图层加入leaflet地图图层中
     * @param {Object} sceneLayer - 场景图层
     * @returns {Object} layer - 场景图层
     */
    _addToBackground(sceneLayer) {
        const layer = sceneLayer.clone();
        this._map.addLayer(layer);
        this._backgrounds.push(layer);

        return layer;
    }

    /**
     * 加载背景图层并重绘地图.
     * @param {Object} sceneLayer - 场景图层
     * @returns {undefined}
     */
    addToBackground(sceneLayer) {
        this._addToBackground(sceneLayer);

        this.refreshBackground();
    }

    /**
     * 根据背景场景图层id删除，删除对应的场景图层，分别维护leaflet图层容器和
     * _backgrounds背景图层容器，并重绘地图.
     * @param {String} sceneLayerId - 场景图层id
     * @returns {undefined}
     */
    removeFromBackground(sceneLayerId) {
        let layer;
        for (let i = 0; i < this._backgrounds.length; i++) {
            layer = this._backgrounds[i];
            if (layer.id === sceneLayerId) {
                this._map.removeLayer(layer);
                this._backgrounds.splice(i, 1);
                break;
            }
        }
        this._map.refresh();
    }

    /**
     * 重置背景图层，使背景图层始终在所有类型图层的最下层.
     * @returns {undefined}
     */
    _resetBackground() {
        let leafletLayer;
        for (let i = this._backgrounds.length - 1; i >= 0; i--) {
            leafletLayer = this._backgrounds[i].getLeafletLayer();
            leafletLayer.bringToBack();
        }
    }

    /**
     * 重置背景图层并重绘地图.
     * @returns {undefined}
     */
    refreshBackground() {
        this._resetBackground();
        this._map.refresh();
    }

    /**
     * 将覆盖物场景图层压入_overlays覆盖物图层容器中
     * 将覆盖物场景图创建为对应的leaflet图层加入leaflet地图图层中
     * @param {Object} sceneLayer - 场景图层
     * @returns {Object} layer - 场景图层
     */
    _addToOverlay(sceneLayer) {
        const layer = sceneLayer.clone();
        this._map.addLayer(layer);
        this._overlays.push(layer);

        return layer;
    }

    /**
     * 加载覆盖物图层并重绘地图.
     * @param {Object} sceneLayer - 场景图层
     * @returns {undefined}
     */
    addToOverlay(sceneLayer) {
        this._addToOverlay(sceneLayer);

        this.refreshOverlay();
    }

    /**
     * 根据覆盖物场景图层id，删除对应的场景图层，分别维护leaflet图层容器和
     * _overlays覆盖物图层容器，并重绘地图.
     * @param {String} sceneLayerId - 场景图层id
     * @returns {undefined}
     */
    removeFromOverlay(sceneLayerId) {
        let layer;
        for (let i = 0; i < this._overlays.length; i++) {
            layer = this._overlays[i];
            if (layer.id === sceneLayerId) {
                this._map.removeLayer(layer);
                this._overlays.splice(i, 1);
                break;
            }
        }
        this._map.refresh();
    }

    /**
     * 重置覆盖物图层，使覆盖物图层始终在所有类型图层的最上层.
     * @returns {undefined}
     */
    _resetOverlay() {
        let leafletLayer;
        for (let i = 0; i < this._overlays.length; i++) {
            leafletLayer = this._overlays[i].getLeafletLayer();
            leafletLayer.bringToFront();
        }
    }

    /**
     * 重置覆盖物图层并重绘地图.
     * @returns {undefined}
     */
    refreshOverlay() {
        this._resetOverlay();
        this._map.refresh();
    }

    /**
     * 将新增的场景图层创建leaflet图层加入leaflet图层
     * 并更新当前场景的图层容器.
     * @param {Object} sceneLayer - 场景图层对象
     * @returns {Object} layer - 返回添加的场景图层对象
     */
    _addToScene(sceneLayer) {
        const layer = sceneLayer.clone();
        this._map.addLayer(layer);
        this._sceneLayers.push(layer);

        return layer;
    }

    /**
     * 给当前场景图层中添加新的场景图层.
     * @param {Array|Object} sceneLayers - 要添加的场景图层接收一个场景
     * 图层对象或者场景图层数组
     * @returns {undefined}
     */
    addToScene(sceneLayers) {
        let layers;
        if (Util.isObject(sceneLayers)) {
            layers = [sceneLayers];
        } else if (Util.isArray(sceneLayers)) {
            layers = sceneLayers;
        }
        if (!layers || layers.length === 0) {
            return;
        }

        for (let i = 0; i < layers.length; i++) {
            this._addToScene(layers[i]);
        }

        this.refreshOverlay();
    }

    /**
     * 根据接收的场景图层id数组删除当前场景下对应的图层并刷新地图.
     * @param {Array} sceneLayerIds - 场景图层id数组
     * @returns {undefined}
     */
    removeFromScene(sceneLayerIds) {
        let ids = null;
        if (Util.isArray(sceneLayerIds)) {
            ids = sceneLayerIds;
        } else if (sceneLayerIds) {
            ids = [sceneLayerIds];
        }
        if (!ids || ids.length === 0) {
            return;
        }

        for (let i = this._sceneLayers.length - 1; i >= 0; i--) {
            const layer = this._sceneLayers[i];
            if (ids.indexOf(layer.id) >= 0) {
                this._map.removeLayer(layer);
                this._sceneLayers.splice(i, 1);
            }
        }
        this._map.refresh();
    }

    /**
     * 清除当前场景下的图层，私有方法，一般在切换场景时内部调用.
     * @returns {undefined}
     */
    _clearScene() {
        for (let i = 0; i < this._sceneLayers.length; i++) {
            this._map.removeLayer(this._sceneLayers[i]);
        }
        this._temporaries.length = 0;
        this._sceneLayers.length = 0;
    }

    /**
     * 给当前临时场景图层中添加新的场景图层,并重置覆盖物图层并重绘地图（保证覆盖物的位置）.
     * @param {Array} layers - 要添加的场景图层,接收场景图层对象数组
     * @returns {undefined}
     */
    addToTemporary(layers) {
        let addLayer;
        for (let i = 0; i < layers.length; i++) {
            this._temporaries.push(this._addToScene(layers[i]));
        }

        this.refreshOverlay();
    }

    /**
     * 根据接收的场景图层id数组删除当前临时图层容器下的图层，并删除
     * 当前场景下对应的图层并重绘地图.
     * @param {Array} temporaryLayerIds - 场景图层id数组
     * @returns {undefined}
     */
    removeFromTemporary(temporaryLayerIds) {
        let ids = null;
        if (Util.isArray(temporaryLayerIds)) {
            ids = temporaryLayerIds;
        } else if (temporaryLayerIds) {
            ids = [temporaryLayerIds];
        }
        if (!ids || ids.length === 0) {
            return;
        }

        for (let i = this._temporaries.length - 1; i >= 0; i--) {
            const layer = this._temporaries[i];
            if (ids.indexOf(layer.id) >= 0) {
                this._temporaries.splice(i, 1);
            }
        }

        this.removeFromScene(temporaryLayerIds);
    }

    /**
     * 清空临时图层方法，其内部调用removeFromScene方法更新地图.
     * @returns {undefined}
     */
    clearTemporary() {
        const ids = [];
        for (let i = 0; i < this._temporaries.length; i++) {
            ids.push(this._temporaries[i].id);
        }

        this.removeFromScene(ids);

        this._temporaries.length = 0;
    }

    /**
     * 获取所有的场景.
     * @returns {Array} - 返回场景容器
     */
    getScenes() {
        return this._scenes;
    }

    /**
     * 获取当前显示的场景.
     * @returns {Object} - 当前显示的场景对象
     */
    getCurrentScene() {
        return this._currentScene;
    }

    /**
     * 根据场景id查询场景.
     * @param {String} sceneId - 场景的唯一标识
     * @returns {null|Object} - 返回查找到的场景对象，找不到则返回null
     */
    getSceneById(sceneId) {
        for (let i = 0; i < this._scenes.length; i++) {
            if (this._scenes[i].id === sceneId) {
                return this._scenes[i];
            }
        }
        return null;
    }

    /**
     * 获取所有的场景图层.
     * @returns {Array} - 返回场景图层容器
     */
    getLayers() {
        return this._layers;
    }

    /**
     * 根据场景id查询场景图层.
     * @param {String} layerId - 场景图层的唯一标识
     * @returns {null|Object} - 返回查找到的场景图层对象，找不到则返回null
     */
    getLayerById(layerId) {
        for (let i = 0; i < this._layers.length; i++) {
            if (this._layers[i].id === layerId) {
                return this._layers[i];
            }
        }
        return null;
    }

    /**
     * 根据图层label查询场景图层
     * 主要用于加载场景配置文件中场景图层layers属性中使用中括号配置方式查找所属场景图层.
     * @param {String} label - 区分不同类别（feature/tip/thematic）场景图层
     * @returns {Array} layers - 某一类场景图层下所有的图层,例如所有要素的场景图层
     */
    getLayersByLabel(label) {
        const layers = [];
        for (let i = 0; i < this._layers.length; i++) {
            if (this._layers[i].label === label) {
                layers.push(this._layers[i]);
            }
        }
        return layers;
    }

    /**
     * 根据图层sourceName查询场景图层.
     * @param {String} sourceName - 数据图层的数据源名称
     * @returns {Array} layers - 某一类(相同数据源)场景图层下所有的图层,例如所有以thematicSource
     * 为数据源名称的场景图层
     */
    getLayersBySourceName(sourceName) {
        const layers = [];
        for (let i = 0; i < this._layers.length; i++) {
            if (this._layers[i].getSourceName() === sourceName) {
                layers.push(this._layers[i]);
            }
        }
        return layers;
    }

    /**
     * 在给定类型场景图层里查找某一特定要素类型所在的多有场景图层.
     * @param {String} featureType - 要素的数据类型
     * @param {String} label - 特定类型场景图层标识
     * @return {undefined}
     */
    getLayersByFeatureType(featureType, label) {
        const layers = [];
        let layer;
        let type;
        for (let i = 0; i < this._layers.length; i++) {
            layer = this._layers[i];
            type = layer.getFeatureType();
            if (!type || type !== featureType) {
                continue;
            }
            if (label && (!layer.label || layer.label !== label)) {
                continue;
            }

            layers.push(layer);
        }

        return layers;
    }

    /**
     * 获得所有的背景图层.
     * @returns {Array} - 返回背景图层容器.
     */
    getBackgroundLayers() {
        return this._backgrounds;
    }

    /**
     * 获得所有的覆盖物图层.
     * @returns {Array} - 返回覆盖物图层容器.
     */
    getOverlayLayers() {
        return this._overlays;
    }

    /**
     * 获得所有的临时图层.
     * @returns {Array} - 返回临时图层容器.
     */
    getTemporaryLayers() {
        return this._temporaries;
    }

    /**
     * 获取当前显示场景下所有的场景图层.
     * @returns {Array} - 前显示场景下所有的场景图层
     */
    getSceneLayers() {
        return this._sceneLayers;
    }

    /**
     * 返回当前加载到地图上的所有图层，包括覆盖物图层，背景图层以及当前场景下的图层
     * @returns {Array} layers - 当前加载到地图上的所有图层
     */
    getLoadedLayers() {
        const layers = [];
        Array.prototype.push.apply(layers, this._backgrounds);
        Array.prototype.push.apply(layers, this._sceneLayers);
        Array.prototype.push.apply(layers, this._overlays);

        return layers;
    }

    /**
     * 在加载到地图上的图层中查找特定数据类型的场景图层.
     * @param {String} featureType 图层配置的options.featureType值
     * @returns {Array} layers - 查找到的场景图层
     */
    getLoadedLayersByFeatureType(featureType) {
        const layers = [];
        let i;
        for (i = 0; i < this._backgrounds.length; i++) {
            if (this._backgrounds[i].getFeatureType() === featureType) {
                layers.push(this._backgrounds[i]);
            }
        }

        for (i = 0; i < this._sceneLayers.length; i++) {
            if (this._sceneLayers[i].getFeatureType() === featureType) {
                layers.push(this._sceneLayers[i]);
            }
        }

        for (i = 0; i < this._overlays.length; i++) {
            if (this._overlays[i].getFeatureType() === featureType) {
                layers.push(this._overlays[i]);
            }
        }

        return layers;
    }

    /**
     * 根据地图上加载的图层获得加载的所有类型的数据类型.
     * @returns {Array} types - 数据的类别数组
     */
    getLoadedFeatureTypes() {
        const types = [];
        let i;
        let type;
        for (i = 0; i < this._backgrounds.length; i++) {
            type = this._backgrounds[i].getFeatureType();
            if (type) {
                types.push(type);
            }
        }

        for (i = 0; i < this._sceneLayers.length; i++) {
            type = this._sceneLayers[i].getFeatureType();
            if (type) {
                types.push(type);
            }
        }

        for (i = 0; i < this._overlays.length; i++) {
            type = this._overlays[i].getFeatureType();
            if (type) {
                types.push(type);
            }
        }

        return Util.uniq(types);
    }

    /**
     * 根据地图上加载的图层获得加载的所有可编辑数据类型.
     * @returns {Array} types - 数据的类别数组
     */
    getEditableFeatureTypes() {
        const types = [];
        let type;
        let i;
        let editable = true;

        for (i = 0; i < this._backgrounds.length; i++) {
            type = this._backgrounds[i].getFeatureType();
            editable = this._backgrounds[i].isEditable();

            if (type && editable) {
                types.push(type);
            }
        }

        for (i = 0; i < this._sceneLayers.length; i++) {
            type = this._sceneLayers[i].getFeatureType();
            editable = this._sceneLayers[i].isEditable();

            if (type && editable) {
                types.push(type);
            }
        }

        for (i = 0; i < this._overlays.length; i++) {
            type = this._overlays[i].getFeatureType();
            editable = this._overlays[i].isEditable();

            if (type && editable) {
                types.push(type);
            }
        }

        return Util.uniq(types);
    }

    /**
     * 切换场景方法.
     * @param {String} sceneId - 要切换的场景id值
     * @returns {Object} scene - 返回新切换的场景对象
     */
    changeScene(sceneId) {
        let i;
        if (this._currentScene && this._currentScene.id === sceneId) {
            return null;
        }

        const oldScene = this._currentScene;

        this._clearScene();

        const scene = this.getSceneById(sceneId);
        for (i = 0; i < scene.layers.length; i++) {
            this._addToScene(scene.layers[i]);
        }

        this.refreshOverlay();

        this._currentScene = scene;

        this._map._leafletMap.fire('SceneChanged', {
            oldScene: oldScene,
            newScene: scene,
        });

        return scene;
    }

    /**
     * 重置当前场景
     * @returns {undefined}
     */
    _resetScene() {
        let i;
        for (i = 0; i < this._sceneLayers.length; i++) {
            this._map.removeLayer(this._sceneLayers[i]);
        }

        for (i = 0; i < this._sceneLayers.length; i++) {
            this._map.addLayer(this._sceneLayers[i]);
        }
    }

    /**
     * 重新刷新当前场景
     * @returns {undefined}
     */
    refreshScene() {
        this._resetScene();

        this._resetBackground();

        this._resetOverlay();

        this._map.refresh();
    }

    /**
     * 判断一个图层是否加载到地图上了.
     * @param {String} layerId - 场景图层的唯一标识
     * @returns {boolean} - 是返回true,否则返回false
     */
    isLayerLoaded(layerId) {
        let i;
        for (i = 0; i < this._backgrounds.length; i++) {
            if (this._backgrounds[i].visible() && this._backgrounds[i].id === layerId) {
                return true;
            }
        }

        for (i = 0; i < this._sceneLayers.length; i++) {
            if (this._sceneLayers[i].visible() && this._sceneLayers[i].id === layerId) {
                return true;
            }
        }

        for (i = 0; i < this._overlays.length; i++) {
            if (this._overlays[i].visible() && this._overlays[i].id === layerId) {
                return true;
            }
        }

        return false;
    }

    /**
     * 重新绘地图
     * @returns {undefined}
     */
    refreshMap() {
        this._map.refresh();
    }

    /**
     * 根据传入的数据类型，重新绘制该种数据类型下所有加载到地图上的图层.
     * @param {Array} featureTypes - 数据类型数组
     * @returns {undefined}
     */
    redrawLayerByGeoLiveTypes(featureTypes) {
        const layers = [];
        const temp = this.getLoadedLayers();
        let type;
        for (let i = 0; i < temp.length; i++) {
            type = temp[i].getFeatureType();
            if (type && featureTypes.indexOf(type) >= 0) {
                layers.push(temp[i]);
            }
        }

        if (layers.length > 0) {
            this._map.redraw(layers);
        }
    }

    /**
     * 单例销毁方法.
     * @return {undefined}
     */
    destroy() {
        SceneController.instance = null;
    }

    /**
     * 获取场景图层控制器单例的静态方法.
     * @example
     * const SceneController = SceneController.getInstance();
     * @returns {Object} 返回 SceneController.instance单例对象.
     */
    static getInstance() {
        if (!SceneController.instance) {
            SceneController.instance = new SceneController();
        }
        return SceneController.instance;
    }
}
