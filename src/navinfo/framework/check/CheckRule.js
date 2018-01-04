import FeatureSelector from '../../mapApi/FeatureSelector';
import GeometryAlgorithm from '../../geometry/GeometryAlgorithm';
import CheckResult from './CheckResult';

/**
 * 检查规则基类,所有检查规则都从此类派生
 * @class CheckRule
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class CheckRule {
    /**
     * 初始化方法
     * @method constructor
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    constructor() {
        this.id = '';
        this.description = '';
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
        this.featureSelector = FeatureSelector.getInstance();
    }

    /**
     * 子类需要重写此方法
     * @method check
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} editResult 待检查的编辑结果
     * @return {array} 检查结果数组
     */
    check(editResult) {
        throw new Error(`检查规则未重写check方法:${this.id}`);
    }

    /**
     * 获取检查结果
     * @method getCheckResult
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} description 错误描述
     * @param  {string} geoLiveType 要素类型
     * @param  {string} situation 触发检查规则的情形
     * @return {array} 检查结果
     */
    getCheckResult(description, geoLiveType, situation) {
        const result = new CheckResult();
        result.message = description;
        result.geoLiveType = geoLiveType;
        result.situation = situation;
        return result;
    }
}

export default CheckRule;
