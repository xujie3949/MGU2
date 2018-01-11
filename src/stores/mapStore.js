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
import registerEditControls from 'Business/editControl/registerEditControls';

class MapStore {
    @observable.ref map;

    constructor() {
        this.map = null;
    }

    @action
    setMap(value) {
        this.map = value;
    }

    startup(containerName) {
        const options = {
            tileSize: 256,
            container: containerName,
            center: [39.931269763182634, 116.84355854988097],
            zoom: 17,
        };
        const map = new navinfo.mapApi.Map(options);

        this.initModule(map);

        registerFeatures();

        registerRenders();

        registerCommands();

        registerEditControls();

        this.loadConfig();

        this.setMap(map);
    }

    shutdown() {
        this.destroySingleton();
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
}

const mapStore = new MapStore();
export default mapStore;
