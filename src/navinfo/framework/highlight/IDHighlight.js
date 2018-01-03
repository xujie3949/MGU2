import Feedback from '../../mapApi/feedback/Feedback';
import SymbolFactory from '../../symbol/SymbolFactory';
import SceneController from '../../mapApi/scene/SceneController';
import GeometryAlgorithm from '../../geometry/GeometryAlgorithm';
import FeatureSelector from '../../mapApi/FeatureSelector';
import Util from '../../common/Util';

/**
 * 包主要实现要素模型的高亮.可以按照高亮规则来高亮要素模型的指定部分.
 */
export default class IDHighlight {
    /**
     * 初始化构造函数.
     * @param {Object} options - ID高亮类
     * @return {undefined}
     */
    constructor(value, options = {}) {
        if (Util.isArray(value)) {
            this.items = value;
        } else {
            this.items = [value];
        }

        this.feedback = new Feedback(options);

        this.symbolFactory = SymbolFactory.getInstance();
        this.featureSelector = FeatureSelector.getInstance();
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
        this.sceneController = SceneController.getInstance();
    }

    /**
     * 根据id和type查询要素几何,并组成反馈
     * @returns {undefined}
     */
    highlight() {
        // 每次调用highlight方法时先清空feedback
        this.feedback.clear();

        this.items.forEach(item => {
            this.highlightItem(item);
        });
    }

    /**
     * 高亮一个item
     * @param {Object} item - ID高亮数据结构
     * @return {undefined}
     */
    highlightItem(item) {
        if (!item.id || !item.type || !item.symbolName) {
            return;
        }

        const symbol = this.symbolFactory.getSymbol(item.symbolName);
        if (!symbol) {
            return;
        }

        const feature = this.featureSelector.selectByFeatureId(item.id, item.type);
        if (!feature) {
            return;
        }

        const geomType = this.symbolFactory.getGeometryTypeBySymbol(symbol);
        const geometries = this.geometryAlgorithm.getGeometriesByType(feature.geometry, geomType);

        geometries.forEach(geometry => {
            this.feedback.add(geometry, symbol);
        });
    }

    /**
     * 清除当前高亮，重新绘制高亮.
     * @return {undefined}
     */
    refresh() {
        this.feedback.clear();
        this.highlight();
    }
}
