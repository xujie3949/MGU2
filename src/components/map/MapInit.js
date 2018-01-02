import navinfo from '../../navinfo/index';
import symbols from '../../business/config/symbolsFile';
import sourceConfig from '../../business/config/sourceConfig';
import featureLayers from '../../business/config/featureLayers';
import referenceLayers from '../../business/config/referenceLayers';
import scenes from '../../business/config/scenes';
import mapConfig from '../../business/config/mapConfig';
import registerFeatures from '../../business/feature/registerFeatures';
import registerRenders from '../../business/render/registerRenders';
import Map from '../../navinfo/mapApi/Map';

class MapInit {
    constructor() {
        this.singletons = [];
    }

    initialize(containerName) {
        const options = {
            tileSize: 256,
            container: containerName,
            center: [0, 0],
            zoom: 0,
        };
        const map = new Map(options);

        this.registerSingletons();

        this.initModule(map);

        registerFeatures();

        registerRenders();

        this.loadConfig();

        this.bindToolEvent(map);

        map.getLeafletMap().setView([39.931269763182634, 116.84355854988097], 17);
    }

    unInitialize() {
        this.destroySingletons();
    }

    registerSingletons() {
        this.singletons = [];
        this.singletons.push(navinfo.mapApi.scene.SceneController.getInstance());
        this.singletons.push(navinfo.mapApi.source.SourceController.getInstance());
        this.singletons.push(navinfo.mapApi.FeatureSelector.getInstance());
    }

    destroySingletons() {
        for (let i = 0; i < this.singletons.length; ++i) {
            if (!this.singletons[i].destroy) {
                throw new Error(`单例对象未提供destroy方法:${this.singletons[i]}`);
            }
            this.singletons[i].destroy();
        }

        this.singletons = [];
    }

    initModule(map) {
        const sceneController = navinfo.mapApi.scene.SceneController.getInstance();
        const featureSelector = navinfo.mapApi.FeatureSelector.getInstance();
        const toolController = navinfo.framework.tool.ToolController.getInstance();

        featureSelector.setMap(map.getLeafletMap());
        sceneController.setMap(map);
        toolController.setMap(map.getLeafletMap());
        toolController.resetCurrentTool('PanTool', null, null);
    }

    loadConfig() {
        const sceneController = navinfo.mapApi.scene.SceneController.getInstance();
        const sourceController = navinfo.mapApi.source.SourceController.getInstance();
        const symbolFactory = navinfo.symbol.SymbolFactory.getInstance();
        symbolFactory.loadSymbols(symbols);
        sceneController.setDefaultZoom(mapConfig.zooms);
        sceneController.loadLayers(referenceLayers);
        sceneController.loadLayers(featureLayers);
        sceneController.loadBackground(scenes.background);
        sceneController.loadOverlay(scenes.overlay);
        sceneController.loadScenes(scenes.scenes);
        sourceController.loadConfig(sourceConfig);
    }

    bindToolEvent(map) {
        const toolController = navinfo.framework.tool.ToolController.getInstance();

        const leafletMap = map.getLeafletMap();
        // 给工具绑定事件
        leafletMap.on('mousedown', toolController.onMouseDown);
        leafletMap.on('mousemove', toolController.onMouseMove);
        leafletMap.on('mouseup', toolController.onMouseUp);

        const tagNames = {
            INPUT: true,
            BUTTON: true,
            TEXTAREA: true,
        };

        // 将键盘事件绑定到body上，并根据event.target决定是否触发工具响应
        document.body.addEventListener('keydown', event => {
            if (!tagNames.hasOwnProperty(event.target.tagName)) {
                toolController.onKeyDown(event);
                // modified by chenx on 2017-8-31
                // 停止冒泡会导致hotkeys组件不可用
                // event.stopPropagation();
            }
        });

        document.body.addEventListener('keyup', event => {
            if (!tagNames.hasOwnProperty(event.target.tagName)) {
                toolController.onKeyUp(event);
                // event.stopPropagation();
            }
        });

        // 屏蔽掉默认的右键菜单
        leafletMap.getContainer().addEventListener('contextmenu', event => event.preventDefault());

        leafletMap.getContainer().addEventListener('wheel', event => {
            toolController.onWheel(event);
            event.stopPropagation();
        });

        // 阻止地图双击选中事件
        leafletMap.getContainer().addEventListener('selectstart', event => event.preventDefault());
    }
}

const mapInit = new MapInit();

export default mapInit;
