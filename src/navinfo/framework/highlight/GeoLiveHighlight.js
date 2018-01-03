import SymbolFactory from '../../symbol/SymbolFactory';
import Feedback from '../../mapApi/feedback/Feedback';
import MarkerSymbol from '../../symbol/MarkerSymbol';
import TextMarkerSymbol from '../../symbol/TextMarkerSymbol';
import CompositeMarkerSymbol from '../../symbol/CompositeMarkerSymbol';
import SceneController from '../../mapApi/scene/SceneController';
import GeometryAlgorithm from '../../geometry/GeometryAlgorithm';
import FeatureSelector from '../../mapApi/FeatureSelector';

/**
 * 实现要素模型的高亮.可以按照高亮规则来高亮要素模型的指定部分.
 */
export default class GeoLiveHighlight {
    /**
     * 初始化构造函数.
     * @param {Object} options - 模型对象高亮类
     * @param {Object} rule - 模型对象高亮规则
     * @return {undefined}
     */
    constructor(geoLiveObject, rule) {
        this.geoLiveObject = geoLiveObject;
        this.rule = rule;
        this.items = [];
        this.feedback = new Feedback();

        this.symbolFactory = SymbolFactory.getInstance();

        this.featureSelector = FeatureSelector.getInstance();
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
        this.sceneController = SceneController.getInstance();
    }

    /**
     * 按照当前要素数据模型，加载对应的高亮规则，构造该要素的高亮的各个指定部分.
     * 然后将高亮的各个部分构造成符号放入该要素高亮的反馈符号容器中.
     * @returns {undefined}
     */
    highlight() {
        // 每次调用highlight方法时先清空feedback
        this.items = [];
        this.feedback.clear();

        if (!this.geoLiveObject) {
            return;
        }

        // 高亮要素
        this.highlightObject(this.geoLiveObject, this.rule);

        this.addToFeedback();
    }

    /**
     * 清除当前高亮，重新绘制高亮.
     * @return {undefined}
     */
    refresh() {
        this.items = [];
        this.feedback.clear();
        this.highlight();
    }

    /**
     * 将要素要高亮的各个部分的几何和高亮样式注入该要素的反馈容器中.
     * @return {undefined}
     */
    addToFeedback() {
        this.items = this.items.sort(function (a, b) {
            return a.zIndex - b.zIndex;
        });

        this.items.forEach(function (item, index, array) {
            if (item.geometry) {
                this.feedback.add(item.geometry, item.symbol);
            } else {
                this.feedback.addPid(item.pid, item.featureType, item.symbol);
            }
        }, this);
    }

    /**
     * 根据要素数据的geoLiveType获得高亮配置文件中对应的高亮配置.
     * @param {String} type - 根据要素数据的geoLiveType
     * @return {Object}.
     */
    getRuleByType(type) {
        return this.highlightConfig[type];
    }

    /**
     * 根据高亮规则高亮数据对象.
     * @param {Object} geoLiveObject - 要高亮的数据对象.
     * @param {Object} rule - 传入的数据对象对应的高亮规则
     * @return {undefined}
     */
    highlightObject(geoLiveObject, rule) {
        // 高亮要素主要部分
        this.highlightMain(geoLiveObject, rule);

        // 高亮其他topo要素
        if (rule.topo) {
            this.highlightTopo(geoLiveObject, rule.topo);
        }
    }

    /**
     * 高亮要素主要(非topo)部分.
     * @param {Object} value - 该要素的数据要素数据模型.
     * @param {Object} main - 要素对应的高亮规则
     * @return {undefined}.
     */
    highlightMain(value, main) {
        const type = main.type;
        if (!type) {
            return;
        }
        switch (type) {
            case 'geoLiveObject':
                this.highlightGeoLiveObject(value, main);
                break;
            case 'pid':
                this.highlightPid(value, main);
                break;
            case 'symbol':
                this.highlightSymbol(value, main);
                break;
            case 'geometry':
                this.highlightGeometry(value, main);
                break;
            case 'Text':
                this.highlightText(value, main);
                break;
            default:
                throw new Error(`不支持的高亮对象类型：【${type}】`);
        }
    }

    /**
     * 根据要素的数据模型以及要素的高亮规则高亮要素.
     * @param {Object} geoLiveObject - 要素的数据模型
     * @param {Object} main - 要素的高亮规则
     * @returns {undefined}
     */
    highlightGeoLiveObject(geoLiveObject, main) {
        if (!geoLiveObject) {
            return;
        }
        const layerId = main.layer;
        const key = main.key;
        const zIndex = main.zIndex;
        let symbolName = '';
        const pid = geoLiveObject[key];

        if (!layerId || !key || !pid) {
            return;
        }

        symbolName = this.getSymbolNameFromMain(geoLiveObject, main);

        const symbol = FM.Util.clone(this.symbolFactory.getSymbol(symbolName));
        if (!symbol) {
            return;
        }

        const feature = this.featureSelector.selectByFeatureId(pid, layerId);
        if (!feature) {
            return;
        }

        const geometryType = this.symbolFactory.getGeometryTypeBySymbol(symbol);

        const geometries = this.geometryAlgorithm.getGeometriesByType(feature.geometry, geometryType);

        geometries.forEach((item, index) => {
            this.addItem(item, symbol, index);
        });
    }

    /**
     * 根据要素的Pid高亮要素.
     * @param {Number} pid - 要素的pid
     * @param {Object} main - 要素的高亮规则
     * @return {undefined}
     */
    highlightPid(pid, main) {
        const layerId = main.layer;
        const key = main.key;
        const zIndex = main.zIndex;
        const symbolName = main.defaultSymbol;

        if (!layerId || !pid) {
            return;
        }

        const symbol = FM.Util.clone(this.symbolFactory.getSymbol(symbolName));
        if (!symbol) {
            return;
        }

        const feature = this.featureSelector.selectByFeatureId(pid, layerId);
        if (!feature) {
            return;
        }

        this.addItem(feature.geometry, symbol, zIndex);
    }

    getBorderSymbol(symbol) {
        if (!(symbol instanceof MarkerSymbol)) {
            return null;
        }

        if (symbol instanceof TextMarkerSymbol && symbol.text.length === 0) {
            return null;
        }

        const bound = symbol.getOriginBound();
        const size = bound.getSize();
        const centerPoint = bound.getCenter();
        let symbolData = null;
        if (symbol instanceof CompositeMarkerSymbol) {
            symbolData = {
                type: 'CompositeMarkerSymbol',
                symbols: [
                    {
                        type: 'RectangleMarkerSymbol',
                        width: size.width,
                        height: size.height,
                        offsetX: centerPoint.x,
                        offsetY: centerPoint.y,
                        color: 'transparent'
                    }
                ],
                angle: symbol.angle
            };
        } else {
            symbolData = {
                type: 'RectangleMarkerSymbol',
                width: size.width,
                height: size.height,
                offsetX: centerPoint.x + symbol.offsetX,
                offsetY: centerPoint.y + symbol.offsetY,
                color: 'transparent',
                angle: symbol.angle
            };
        }

        return this.symbolFactory.createSymbol(symbolData);
    }

    getBorderSymbols(feature) {
        const symbols = this.getFeatureSymbol(feature);
        const res = [];

        for (let i = 0, len = symbols.length; i < len; i++) {
            const borderSymbol = this.getBorderSymbol(symbols[i]);

            if (borderSymbol) {
                res.push(borderSymbol);
            }
        }

        return res;
    }

    highlightSymbol(geoLiveObject, main) {
        if (!geoLiveObject) {
            return;
        }
        const layerId = main.layer;
        const key = main.key;
        const zIndex = main.zIndex;
        const pid = geoLiveObject[key];

        if (!layerId || !key || !pid) {
            return;
        }

        const symbolName = this.getSymbolNameFromMain(geoLiveObject, main);
        const symbol = FM.Util.clone(this.symbolFactory.getSymbol(symbolName));

        if (!symbol || !symbol.width || !symbol.color) {
            return;
        }

        const outLine = {
            width: symbol.width,
            color: symbol.color
        };

        const feature = this.featureSelector.selectByFeatureId(pid, layerId);
        if (!feature) {
            return;
        }

        const geometry = feature.geometry;
        const symbols = this.getBorderSymbols(feature);

        symbols.forEach((item, index) => {
            item.outLine = outLine;
            this.addItem(geometry, item, zIndex);
        });
    }

    /**
     * 高亮一个几何.
     * @param {Object} geometry - geoJson的几何对象
     * @param {Object} main - 对该几何的高亮规则
     * @returns {undefined}
     */
    highlightGeometry(geometry, main) {
        const zIndex = main.zIndex;
        const symbolName = main.defaultSymbol;
        const symbol = FM.Util.clone(this.symbolFactory.getSymbol(symbolName));
        if (!symbol) {
            return;
        }
        const type = geometry.type;
        let item;
        switch (type) {
            case 'Point':
            case 'LineString':
            case 'Polygon':
                this.addItem(geometry, symbol, zIndex);
                break;
            case 'MultiPoint':
                this.highlightMultiGeometry('Point', geometry.coordinates, symbol, zIndex);
                break;
            case 'MultiLineString':
                this.highlightMultiGeometry('LineString', geometry.coordinates, symbol, zIndex);
                break;
            case 'MultiPolygon':
                this.highlightMultiGeometry('Polygon', geometry.coordinates, symbol, zIndex);
                break;
            default:
                throw new Error(`无法处理几何类型:${type}`);
        }
    }

    highlightText(geoLiveObject, main) {
        if (!geoLiveObject) {
            return;
        }
        const textPropertyName = main.text;
        const geometryPropertyName = main.geometry;
        const zIndex = main.zIndex;

        if (!textPropertyName || !geometryPropertyName || !zIndex) {
            return;
        }

        const text = geoLiveObject[textPropertyName];
        const geometry = geoLiveObject[geometryPropertyName];
        if (!text || !geometry) {
            return;
        }

        const symbolName = this.getSymbolNameFromMain(geoLiveObject, main);

        const symbol = FM.Util.clone(this.symbolFactory.getSymbol(symbolName));
        if (!symbol) {
            return;
        }

        this.setSymbolTextProperty(symbol, text);

        const geometryType = this.symbolFactory.getGeometryTypeBySymbol(symbol);

        const geometries = this.geometryAlgorithm.getGeometriesByType(geometry, geometryType);

        geometries.forEach((item, index) => {
            this.addItem(item, symbol, zIndex);
        });
    }

    setSymbolTextProperty(symbol, text) {
        const type = symbol.type;
        switch (type) {
            case 'TextMarkerSymbol':
            case 'TextLineSymbol':
            case 'CenterTextLineSymbol':
            case 'TextFillSymbol':
                symbol.text = text;
                break;
            case 'CompositeMarkerSymbol':
            case 'CompositeLineSymbol':
            case 'CompositeFillSymbol':
                for (let i = 0; i < symbol.symbols.length; i++) {
                    const subSymbol = symbol.symbols[i];
                    this.setSymbolTextProperty(subSymbol, text);
                }
                break;
            default:
                break;
        }
    }

    highlightMultiGeometry(type, coordinates, symbol, zIndex) {
        for (let i = 0; i < coordinates.length; ++i) {
            const geometry = {
                type: type,
                coordinates: coordinates[i]
            };
            this.addItem(geometry, symbol, zIndex);
        }
    }

    addItem(geometry, symbol, zIndex) {
        if (!geometry || !symbol) {
            return;
        }

        this.items.push({
            geometry: geometry,
            symbol: symbol,
            zIndex: zIndex
        });
    }

    getSymbolNameFromMain(geoLiveObject, main) {
        let symbolName = '';
        if (main.rule) {
            symbolName = this.getSymbolNameFromRule(geoLiveObject, main.rule);
        }

        if (!symbolName) {
            symbolName = main.defaultSymbol;
        }

        return symbolName;
    }

    highlightTopo(geoLiveObject, topo) {
        for (let i = 0; i < topo.length; ++i) {
            const part = topo[i];
            const joinKey = part.joinKey;
            const rule = part.highlight;
            const topoObject = geoLiveObject[joinKey];
            if (FM.Util.isArray(topoObject)) {
                this.highlightObjects(topoObject, rule);
            } else {
                this.highlightObject(topoObject, rule);
            }
        }
    }

    highlightObjects(objectArray, rule) {
        objectArray.forEach(item => {
            this.highlightObject(item, rule);
        });
    }

    getSymbolNameFromRule(geoLiveObject, rule) {
        const attribute = rule.attribute;
        const value = geoLiveObject[attribute];
        let symbolName = this.getSymbolNameFromForks(rule.forks, value);
        if (!symbolName) {
            symbolName = rule.defaultSymbol;
        }
        return symbolName;
    }

    getSymbolNameFromForks(forks, value) {
        for (let i = 0; i < forks.length; ++i) {
            const fork = forks[i];
            if (value === fork.value) {
                return fork.symbol;
            }
        }

        return null;
    }

    getFeatureSymbol(feature) {
        const renders = this.getRendersByGeoLiveType(feature.properties.geoLiveType);
        let symbols = [];

        for (let j = 0, len = renders.length; j < len; j++) {
            const RenderClass = renders[j];
            const render = new RenderClass();
            const symbol = render.getSymbol(feature, this.sceneController.getZoom());
            if (!symbol) {
                continue;   // 如果要素在某种情况下不需要绘制会返回null
            }
            if (FM.Util.isArray(symbol)) {
                symbols = symbols.concat(symbol);
            } else {
                symbols.push(symbol);
            }
        }

        return symbols;
    }

    getRendersByGeoLiveType(geoLiveType) {
        const renders = [];
        const layers = this.sceneController.getLoadedLayersByFeatureType(geoLiveType);
        for (let i = 0; i < layers.length; i++) {
            if (layers[i].getFeatureType() === geoLiveType) {
                renders.push(layers[i].getRender());
            }
        }

        return FM.Util.unique(renders);
    }
}
