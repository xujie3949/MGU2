import CheckEngine from './CheckEngine';
import Util from '../../common/Util';
import EventController from '../../common/EventController';

/**
 * 检查模块的总控制器
 * @class CheckController
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class CheckController {
    /**
     * 初始化方法
     * @method constructor
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} options 可选对象
     * @return {undefined}
     */
    constructor(options) {
        this.checkEngines = {};
        this._eventController = EventController.getInstance();
        this._eventController.once('DestroySingleton', () => this.destroy());
    }

    register(geoLiveType, situation, checkEngine) {
        if (!Util.has(this.checkEngines, geoLiveType)) {
            this.checkEngines[geoLiveType] = {};
        }
        const featureEngines = this.checkEngines[geoLiveType];

        if (Util.has(featureEngines, situation)) {
            throw new Error(`检查引擎已经存在:${geoLiveType}-${situation}`);
        }
        featureEngines[situation] = checkEngine;
    }

    clear() {
        this.checkEngines = {};
    }

    /**
     * 获取检查引擎对象
     * @method getCheckEngine
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} geoLiveType 要素类型
     * @param  {string} situation 触发检查规则的情形
     * @return {object} 检查引擎对象
     */
    getCheckEngine(geoLiveType, situation) {
        if (!Util.has(this.checkEngines, geoLiveType)) {
            return null;
        }
        const featureEngines = this.checkEngines[geoLiveType];

        if (!Util.has(featureEngines, situation)) {
            return null;
        }
        const checkEngine = featureEngines[situation];

        return checkEngine;
    }

    /**
     * 销毁实例对象
     * @method destroy
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    destroy() {
        this.clear();
        CheckController.instance = null;
    }

    static instance = null;

    /**
     * 获取实例对象
     * @method getInstance
     * @author XuJie
     * @date   2017-09-11
     * @return {object} 单例对象
     */
    static getInstance() {
        if (!CheckController.instance) {
            CheckController.instance = new CheckController();
        }
        return CheckController.instance;
    }
}

export default CheckController;

