import MarkerSymbol from './MarkerSymbol';
import CircleMarkerSymbol from './CircleMarkerSymbol';
import SquareMarkerSymbol from './SquareMarkerSymbol';
import RectangleMarkerSymbol from './RectangleMarkerSymbol';
import CrossMarkerSymbol from './CrossMarkerSymbol';
import TiltedCrossMarkerSymbol from './TiltedCrossMarkerSymbol';
import TriangleMarkerSymbol from './TriangleMarkerSymbol';
import ImageMarkerSymbol from './ImageMarkerSymbol';
import MultiImageMarkerSymbol from './MultiImageMarkerSymbol';
import TextMarkerSymbol from './TextMarkerSymbol';
import CompositeMarkerSymbol from './CompositeMarkerSymbol';
import LineSymbol from './LineSymbol';
import SimpleLineSymbol from './SimpleLineSymbol';
import CartoLineSymbol from './CartoLineSymbol';
import MarkerLineSymbol from './MarkerLineSymbol';
import HashLineSymbol from './HashLineSymbol';
import TextLineSymbol from './TextLineSymbol';
import CenterTextLineSymbol from './CenterTextLineSymbol';
import EndMarkerLineSymbol from './EndMarkerLineSymbol';
import CenterMarkerLineSymbol from './CenterMarkerLineSymbol';
import CompositeLineSymbol from './CompositeLineSymbol';
import FillSymbol from './FillSymbol';
import SimpleFillSymbol from './SimpleFillSymbol';
import PatternFillSymbol from './PatternFillSymbol';
import LinearGradientFillSymbol from './LinearGradientFillSymbol';
import RadialGradientFillSymbol from './RadialGradientFillSymbol';
import CenterMarkerFillSymbol from './CenterMarkerFillSymbol';
import CompositeFillSymbol from './CompositeFillSymbol';
import EventController from '../common/EventController';

/**
 * 符号工厂,负责创建各种符号.并会加载SymbolFile.js中定义的符号,支持按名字查找符号.
 */
class SymbolFactory {
    static instance = null;

    symbolGallery = null;

    constructor() {
        this.symbolGallery = {};

        this._eventController = EventController.getInstance();
        this._eventController.once('DestroySingleton', () => this.destroy());
    }

    /**
     * 解析配置文件，创建符号.
     * @param {Object[]} symbolData - SymbolFile.js中定义的对象数组配置
     */
    loadSymbols(symbolData) {
        for (let i = 0; i < symbolData.length; ++i) {
            const data = symbolData[i];
            const symbol = this.createSymbol(data);
            this.addSymbol(data.name, symbol);
        }
    }

    /**
     * 创建符号对象.
     * @param {object} json - json是符号的json定义
     * returns {object} - 根据符号类型创建的具体符号实例对象
     */
    createSymbol(json) {
        const symbolType = json.type;
        switch (symbolType) {
            case 'CircleMarkerSymbol':
                return new CircleMarkerSymbol(json);
            case 'SquareMarkerSymbol':
                return new SquareMarkerSymbol(json);
            case 'RectangleMarkerSymbol':
                return new RectangleMarkerSymbol(json);
            case 'CrossMarkerSymbol':
                return new CrossMarkerSymbol(json);
            case 'TiltedCrossMarkerSymbol':
                return new TiltedCrossMarkerSymbol(json);
            case 'TriangleMarkerSymbol':
                return new TriangleMarkerSymbol(json);
            case 'ImageMarkerSymbol':
                return new ImageMarkerSymbol(json);
            case 'MultiImageMarkerSymbol':
                return new MultiImageMarkerSymbol(json);
            case 'TextMarkerSymbol':
                return new TextMarkerSymbol(json);
            case 'CompositeMarkerSymbol':
                return new CompositeMarkerSymbol(json);
            case 'SimpleLineSymbol':
                return new SimpleLineSymbol(json);
            case 'CartoLineSymbol':
                return new CartoLineSymbol(json);
            case 'MarkerLineSymbol':
                return new MarkerLineSymbol(json);
            case 'HashLineSymbol':
                return new HashLineSymbol(json);
            case 'TextLineSymbol':
                return new TextLineSymbol(json);
            case 'CenterTextLineSymbol':
                return new CenterTextLineSymbol(json);
            case 'EndMarkerLineSymbol':
                return new EndMarkerLineSymbol(json);
            case 'CenterMarkerLineSymbol':
                return new CenterMarkerLineSymbol(json);
            case 'CompositeLineSymbol':
                return new CompositeLineSymbol(json);
            case 'SimpleFillSymbol':
                return new SimpleFillSymbol(json);
            case 'PatternFillSymbol':
                return new PatternFillSymbol(json);
            case 'LinearGradientFillSymbol':
                return new LinearGradientFillSymbol(json);
            case 'RadialGradientFillSymbol':
                return new RadialGradientFillSymbol(json);
            case 'CenterMarkerFillSymbol':
                return new CenterMarkerFillSymbol(json);
            case 'CompositeFillSymbol':
                return new CompositeFillSymbol(json);
            default:
                throw new Error(`不支持的符号类型: ${symbolType}`);
        }
    }

    /**
     * 根据名称查找预定义的符号.
     * @param {String} symbolName - 符号名称
     * return {Object} - 具体的符号对象
     */
    getSymbol(symbolName) {
        return this.symbolGallery[symbolName];
    }

    /**
     * 检查符号库是否包含指定名字的符号.
     * @param {String} symbolName - 符号名称
     * returns {Boolean}
     */
    containSymbol(symbolName) {
        return this.symbolGallery.hasOwnProperty(symbolName);
    }

    /**
     * 返回符号库中所有的符号名字.
     * returns {String[]} symbols - 符号库中所有的符号名字，以数组表示
     */
    getSymbolNames() {
        const symbols = [];
        for (const p in this.symbolGallery) {
            if (this.symbolGallery.hasOwnProperty(p)) {
                symbols.push(p);
            }
        }
        return symbols;
    }

    /**
     * 向符号库中添加指定名字的符号
     * 如果已经存在同名符号，添加失败，返回false.
     * @param {Object} symbol - 符号对象
     * @param {String} symbolName - 符号名称
     * returns {Boolean}
     */
    addSymbol(symbolName, symbol) {
        if (this.symbolGallery.hasOwnProperty(symbolName)) {
            return false;
        }

        this.symbolGallery[symbolName] = symbol;
        return true;
    }

    /**
     * 根据名称删除符号，如果不存在指定名称的符号，什么也不做.
     * @param {String} symbolName - 符号名称
     */
    removeSymbol(symbolName) {
        if (this.symbolGallery.hasOwnProperty(symbolName)) {
            delete this.symbolGallery[symbolName];
        }
    }

    /**
     * 从符号中获取符号所依赖的图片urls.
     * @param {object} symbol - 符号对象
     * @returns {Array} urls - 一数组表示的符号图片地址url
     */
    getUrlsFromSymbol(symbol) {
        let urls = [];
        const type = symbol.type;
        switch (type) {
            case 'ImageMarkerSymbol':
                urls.push(symbol.url);
                break;
            case 'MultiImageMarkerSymbol':
                symbol.urls.forEach(item => {
                    item.forEach(it => {
                        if (it) {
                            urls.push(it);
                        }
                    });
                });
                break;
            case 'MarkerLineSymbol':
            case 'CenterMarkerLineSymbol':
            case 'EndMarkerLineSymbol':
                urls = this.getUrlsFromSymbol(symbol.marker);
                break;
            case 'CompositeMarkerSymbol':
            case 'CompositeLineSymbol':
                symbol.symbols.forEach(item => {
                    const itemUrls = this.getUrlsFromSymbol(item);
                    urls = urls.concat(itemUrls);
                });
                break;
            default:
                break;
        }

        return urls;
    }

    /**
     * 返回符号的几何类型.
     * @param {object} symbol - 符号对象
     * @returns {String} - 符号的类型
     */
    getGeometryTypeBySymbol(symbol) {
        if (symbol instanceof MarkerSymbol) {
            return 'Point';
        }
        if (symbol instanceof LineSymbol) {
            return 'LineString';
        }
        if (symbol instanceof FillSymbol) {
            return 'Polygon';
        }

        throw new Error('非法的符号类型!');
    }

    /**
     * 销毁符号管理器单例对象.
     */
    destroy() {
        this.symbolGallery = {};
        SymbolFactory.instance = null;
    }

    static instance = null;

    /**
     * 获取符号管理器单例的静态方法.
     * @example
     * const symbolFactory = SymbolFactory.getInstance();
     * @returns {Object} 返回SymbolFactory单例对象.
     */
    static getInstance() {
        if (!SymbolFactory.instance) {
            SymbolFactory.instance = new SymbolFactory();
        }
        return SymbolFactory.instance;
    }
}

// 为了兼容原来的API接口
const GetSymbolFactory = () => SymbolFactory.getInstance();

export {
    SymbolFactory as default,
    GetSymbolFactory,
};
