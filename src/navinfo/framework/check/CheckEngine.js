import CheckResult from './CheckResult';
import Logger from '../../common/Logger';
import Util from '../../common/Util';

/**
 * 检查引擎，每个要素的 geoLiveType 和 situation 唯一标识一个引擎对象
 * @class CheckEngine
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class CheckEngine {
    /**
     * 初始化方法
     * @method initialize
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} geoLiveType 要素类型
     * @param  {string} situation 触发检查规则的情形
     * @return {undefined}
     */
    constructor(geoLiveType, situation) {
        this.geoLiveType = geoLiveType;
        this.situation = situation;
        this.checkRules = [];
        this.lastErrors = [];
        this.logger = Logger.getInstance();
    }

    /**
     * 检查editResult是否符合所有规则
     * @method check
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} editResult 待检查的编辑结果
     * @return {boolean} 通过所有检查返回true,否则返回false
     */
    check(editResult) {
        this.lastErrors = [];

        for (let i = 0; i < this.checkRules.length; ++i) {
            const rule = this.checkRules[i];
            this.checkRule(rule, editResult, this.geoLiveType);
        }

        return this.lastErrors.length === 0;
    }

    /**
     * 检查editResult是否符合规则
     * @method checkRule
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} rule 检查规则
     * @param  {object} editResult 待检查的编辑结果
     * @param  {object} geoLiveType 要素类型
     * @return {undefined}
     */
    checkRule(rule, editResult, geoLiveType) {
        try {
            const result = rule.check(editResult, geoLiveType);
            if (!result) {
                return;
            }

            if (Util.isArray(result)) {
                this.lastErrors = Util.concat(this.lastErrors, result);
            } else {
                this.lastErrors.push(result);
            }
        } catch (err) {
            this.logger.log(err.message);
        }
    }

    /**
     * 向检查引擎中添加检查规则
     * @method addRule
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} checkRule 检查规则对象
     * @return {undefined}
     */
    addRule(checkRule) {
        const index = this.checkRules.findIndex(rule => rule.id === checkRule.id);
        if (index !== -1) {
            throw new Error(`检查规则已经存在:${checkRule.id}`);
        }
        this.checkRules.push(checkRule);
    }
}
