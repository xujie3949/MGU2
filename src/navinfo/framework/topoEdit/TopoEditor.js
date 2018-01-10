import FeatureSelector from '../../mapApi/FeatureSelector';
import GeometryAlgorithm from '../../geometry/GeometryAlgorithm';

/**
 * Created by xujie3949 on 2016/12/28.
 * 要素编辑基类
 */

class TopoEditor {
    constructor(options) {
        this.map = options.map;
        this.dataService = options.dataTransform;
        this.featureSelector = FeatureSelector.getInstance();
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
    }
    
    /**
     * 创建工具需要使用的EditResult
     * 子类需要重写此方法
     * @param {Object} options options
     * @returns {Object} error
     */
    getCreateEditResult(options) {
        throw new Error('函数未实现');
    }
    
    /**
     * 修改工具需要使用的EditResult
     * 子类需要重写此方法
     * @param {Object} options options
     * @returns {Object} error
     */
    getModifyEditResult(options) {
        throw new Error('函数未实现');
    }
    
    /**
     * 转化geoLiveType变为主表名，如：分歧10种类型
     * 子类需要重写此方法
     * @param {Object} geoLiveType geoLiveType
     * @returns {Object} geoLiveType
     */
    getServerFeatureType(geoLiveType) {
        return geoLiveType;
    }
    
    /**
     * 根据服务器返回的log提取pid
     * 返回pid
     * @param {Object} log 日志
     * @return {Object} log
     */
    getPidFromLog(log) {
        return log.pid;
    }
    
    /**
     * 获取对象的标识
     * @param {Object} geoLiveObject geoLiveObject
     * @returns {Object} geoLiveObject
     */
    getId(geoLiveObject) {
        return geoLiveObject.pid;
    }
    
    /**
     * 查询要素详细信息接口
     * 返回模型对象
     * @param {Object} options options
     * @return {Object} dataService
     */
    query(options) {
        const pid = options.pid;
        const geoLiveType = options.geoLiveType;
        const dbId = options.dbId; // add by chenx on 2017-8-1
        return this.dataService.getByPid(pid, geoLiveType, dbId);
    }
    
    /**
     * 创建接口
     * 子类需要重写此方法
     * @param {Object} editResult 编辑结果
     * @returns {Object} error
     */
    create(editResult) {
        throw new Error('函数未实现');
    }
    
    /**
     * 更新接口
     * 子类需要重写此方法
     * @param {Object} editResult 编辑结果
     * @returns {Object} error
     */
    update(editResult) {
        throw new Error('函数未实现');
    }
    
    /**
     * 更新道路要素变化属性接口
     * 子类需要重写此方法
     * @param {Object} geoLiveObject 修改后的对象
     * @return {Object} updateChanges
     */
    updateChanges(geoLiveObject) {
        throw new Error('函数未实现');
    }
    
    /**
     * 查询删除操作确认信息接口
     * 子类需要重写此方法
     * @param {Object} geoLiveObject 需要删除的对象
     * @return {Object} getDeleteConfirmInfo
     */
    queryDeleteConfirmInfo(geoLiveObject) {
        throw new Error('函数未实现');
    }
    
    /**
     * 删除要素接口
     * 子类需要重写此方法
     * @param {Object} geoLiveObject 需要删除的对象
     * @return {Object} delete
     */
    delete(geoLiveObject) {
        throw new Error('函数未实现');
    }
    
    /**
     * 要素是否可以查询
     * 子类可以重写
     * @param {Object} geoLiveObject 要查询的对象
     * @returns {boolean} true
     */
    canQuery(geoLiveObject) {
        return true;
    }
    
    /**
     * 要素是否可以删除
     * 子类可以重写
     * @param {Object} geoLiveObject 要删除的对象
     * @returns {boolean} true
     */
    canDelete(geoLiveObject) {
        return true;
    }
    
    /**
     * 要素是否可以编辑
     * 子类可以重写
     * @param {Object} geoLiveObject 要编辑的对象
     * @returns {boolean} true
     */
    canEdit(geoLiveObject) {
        return true;
    }
}

export default TopoEditor;

