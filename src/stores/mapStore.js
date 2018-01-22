import {
    observable,
    action,
    computed,
} from 'mobx';

import navinfo from 'Navinfo/index';
import symbols from 'Business/config/symbolsFile';
import sourceConfig from 'Business/config/sourceConfig';
import featureLayers from 'Business/config/featureLayers';
import referenceLayers from 'Business/config/referenceLayers';
import scenes from 'Business/config/scenes';
import mapConfig from 'Business/config/mapConfig';
import registerFeatures from 'Business/feature/registerFeatures';
import registerRenders from 'Business/render/registerRenders';
import registerCommands from 'Business/command/registerCommands';
import registerTools from 'Business/tool/registerTools';
import registerEditControls from 'Business/editControl/registerEditControls';

class MapStore {
    @observable mapToken;
    @observable.ref map;

    constructor() {
        this.mapToken = null;
        this.map = null;
    }

    @action
    setMapToken(value) {
        this.mapToken = value;
        navinfo.common.BrowserStore.setItem('mapToken', this.mapToken);
        this.updateSourceUrl();
    }

    @action
    setMap(value) {
        this.map = value;
    }

    addTo(parent) {
        if (parent) {
            parent.appendChild(this.map.getContainer());
            // 让地图调整大小适应父节点
            this.map.resize();
        }
    }

    remove() {
        const container = this.map.getContainer();
        const parent = container.parentNode;
        if (parent) {
            parent.removeChild(container);
        }
    }

    initialize() {
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';

        const options = {
            tileSize: 256,
            container: container,
            // center: [39.9875113076756, 116.44224643707275],
            center: [24.486069, 118.095716],
            zoom: 17,
        };
        const map = new navinfo.mapApi.Map(options);

        this.initModule(map);

        registerFeatures();

        registerRenders();

        registerCommands();

        registerTools();

        registerEditControls();

        this.loadConfig();

        // 必须在加载数据源配置后调用
        this.loadMapToken();

        this.setMap(map);
    }

    unInitialize() {
        this.remove();
        this.destroySingleton();
        this.setMap(null);
        this.clearMapToken();
    }

    loadMapToken() {
        if (!navinfo.common.BrowserStore.hasItem('mapToken')) {
            return;
        }

        const mapToken = navinfo.common.BrowserStore.getItem('mapToken');
        this.setMapToken(mapToken);
    }

    clearMapToken() {
        if (!navinfo.common.BrowserStore.hasItem('mapToken')) {
            return;
        }

        navinfo.common.BrowserStore.removeItem('mapToken');
    }

    destroySingleton() {
        const eventController = navinfo.common.EventController.getInstance();
        eventController.fire('DestroySingleton');
    }

    initModule(map) {
        const toolController = navinfo.framework.tool.ToolController.getInstance();

        toolController.bindEvent();
    }

    loadConfig() {
        const sceneController = navinfo.mapApi.scene.SceneController.getInstance();
        const sourceController = navinfo.mapApi.source.SourceController.getInstance();
        const symbolFactory = navinfo.symbol.SymbolFactory.getInstance();
        symbolFactory.loadSymbols(symbols);
        sourceController.loadConfig(sourceConfig);
        sceneController.setDefaultZoom(mapConfig.zooms);
        sceneController.loadLayers(referenceLayers);
        sceneController.loadLayers(featureLayers);
        sceneController.loadBackground(scenes.background);
        sceneController.loadOverlay(scenes.overlay);
        sceneController.loadScenes(scenes.scenes);
    }

    updateSourceUrl() {
        const sourceController = navinfo.mapApi.source.SourceController.getInstance();
        const sources = sourceController.getAllSources();
        sources.forEach(item => {
            const url = item.getSourceUrl().replace('{token}', this.mapToken);
            item.setSourceUrl(url);
        });
    }
}

const mapStore = new MapStore();
export default mapStore;
