/**
 * 检查结果
 * @class CheckResult
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class CheckResult {
    /**
     * 初始化方法
     * @method constructor
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    constructor() {
        this.situation = 'unknown';
        this.geoLiveType = 'unknown';
        this.message = '';
    }

    /**
     * 比较方法
     * @method equal
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} other 另一个检查结果
     * @return {boolean} 通过比较返回true，不通过返回false
     */
    equal(other) {
        if (this.situation !== other.situation) {
            return false;
        }

        if (this.geoLiveType !== other.geoLiveType) {
            return false;
        }

        if (this.message !== other.message) {
            return false;
        }

        return true;
    }
}

export default CheckResult;
