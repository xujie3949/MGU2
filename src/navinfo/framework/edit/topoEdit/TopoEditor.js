/**
 * Created by xujie3949 on 2016/12/28.
 * 要素编辑基类
 */

fastmap.uikit.topoEdit.TopoEditor = L.Class.extend({
    initialize: function (map) {
        // 绑定函数作用域
        FM.Util.bind(this);
        this.map = map;
        this.featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
        this.dataService = fastmap.service.DataServiceEdit.getInstance();
        this.dataServiceFcc = fastmap.service.DataServiceFcc.getInstance();
        this.dataServiceTips = fastmap.service.DataServiceTips.getInstance();
        this.uikitUtil = fastmap.uikit.Util.getInstance();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
    },

    /**
     * 创建工具需要使用的EditResult
     * 子类需要重写此方法
     * @param {Object} options options
     * @returns {Object} error
     */
    getCreateEditResult: function (options) {
        throw new Error('函数未实现');
    },

    /**
     * 修改工具需要使用的EditResult
     * 子类需要重写此方法
     * @param {Object} options options
     * @returns {Object} error
     */
    getModifyEditResult: function (options) {
        throw new Error('函数未实现');
    },

    /**
     * 转化geoLiveType变为主表名，如：分歧10种类型
     * 子类需要重写此方法
     * @param {Object} geoLiveType geoLiveType
     * @returns {Object} geoLiveType
     */
    getServerFeatureType: function (geoLiveType) {
        return geoLiveType;
    },

    /**
     * 根据服务器返回的log提取pid
     * 返回pid
     * @param {Object} log 日志
     * @return {Object} log
     */
    getPidFromLog: function (log) {
        return log.pid;
    },

    //  分歧类要素获取pid时用
    getDetailPidFromResponse: function (resp) {
        var log = resp.log[0];
        if (log.childPid) {
            return log.childPid;
        }

        if (log.rowId) {
            return log.rowId;
        }

        return resp.pid;
    },

    /**
     * 获取对象的标识
     * @param {Object} geoLiveObject geoLiveObject
     * @returns {Object} geoLiveObject
     */
    getId: function (geoLiveObject) {
        return geoLiveObject.pid;
    },

    /**
     * 查询要素详细信息接口
     * 返回模型对象
     * @param {Object} options options
     * @return {Object} dataService
     */
    query: function (options) {
        var pid = options.pid;
        var geoLiveType = options.geoLiveType;
        var dbId = options.dbId; // add by chenx on 2017-8-1
        return this.dataService.getByPid(pid, geoLiveType, dbId);
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param {Object} editResult 编辑结果
     * @returns {Object} error
     */
    create: function (editResult) {
        throw new Error('函数未实现');
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param {Object} editResult 编辑结果
     * @returns {Object} error
     */
    update: function (editResult) {
        throw new Error('函数未实现');
    },

    /**
     * 更新道路要素变化属性接口
     * 子类可以重写此方法
     * @param {Object} geoLiveObject 修改后的对象
     * @return {Object} updateChanges
     */
    updateChanges: function (geoLiveObject) {
        var pid = geoLiveObject.pid;
        var geoLiveType = geoLiveObject.geoLiveType;
        var changes = geoLiveObject.getChanges();
        if (!changes) {
            return Promise.resolve('属性无变化');
        }
        return this.dataService.updateChanges(pid, geoLiveType, changes);
    },
    /**
     * 更新index要素变化属性接口
     * @param {Object} geoLiveObject 对象类型
     * @returns {*} updateIndexChanges
     */
    updateIndexChanges: function (geoLiveObject) {
        var pid = geoLiveObject.pid;
        var geoLiveType = geoLiveObject.geoLiveType;
        var changes = geoLiveObject.getChanges();
        if (!changes) {
            return Promise.resolve('属性无变化');
        }
        return this.dataService.updateIndexChanges(pid, geoLiveType, changes);
    },
    /**
     * 查询删除操作确认信息接口
     * 子类可以重写此方法
     * @param {Object} geoLiveObject 需要删除的对象
     * @return {Object} getDeleteConfirmInfo
     */
    queryDeleteConfirmInfo: function (geoLiveObject) {
        var pid = geoLiveObject.pid;
        var geoLiveType = geoLiveObject.geoLiveType;
        return this.dataService.getDeleteConfirmInfo(pid, geoLiveType);
    },

    /**
     * 删除道路类要素接口
     * 子类可以重写此方法
     * @param {Object} geoLiveObject 需要删除的对象
     * @return {Object} delete
     */
    delete: function (geoLiveObject) {
        var pid = geoLiveObject.pid;
        var geoLiveType = geoLiveObject.geoLiveType;
        return this.dataService.delete(pid, geoLiveType);
    },

    /**
     * 删除index类要素接口
     * 子类可以重写此方法
     * @param {Object} geoLiveObject 需要删除的对象
     * @return {Object} deleteIndex
     */
    deleteIndex: function (geoLiveObject) {
        var pid = geoLiveObject.pid;
        var geoLiveType = geoLiveObject.geoLiveType;
        return this.dataService.deleteIndex(pid, geoLiveType);
    },

    /**
     * 要素是否可以查询
     * 子类可以重写
     * @param {Object} geoLiveObject 要查询的对象
     * @returns {boolean} true
     */
    canQuery: function (geoLiveObject) {
        return true;
    },

    /**
     * 要素是否可以删除
     * 子类可以重写
     * @param {Object} geoLiveObject 要删除的对象
     * @returns {boolean} true
     */
    canDelete: function (geoLiveObject) {
        return true;
    },

    /**
     * 要素是否可以编辑
     * 子类可以重写
     * @param {Object} geoLiveObject 要编辑的对象
     * @returns {boolean} true
     */
    canEdit: function (geoLiveObject) {
        return true;
    },

    /**
     * 获取数组中非空的数据
     * @param {Array} arr 数组
     * @returns {Array} list
     */
    getRealData: function (arr) {
        var list = [];
        for (var i = 0; i < arr.length; i++) {
            var temp = arr[i];
            if (temp) {
                list.push(temp);
            }
        }
        return list;
    },
    /**
     * 验证选择要素是否为情报点、线、面
     * @param {Object} feature 参数
     * @returns {boolean} flag
     */
    isInfo: function (feature) {
        var flag = false;
        if (feature.geoLiveType === 'PointInfo' || feature.geoLiveType === 'QPointInfo' || feature.geoLiveType === 'LineInfo' || feature.geoLiveType === 'QLineInfo' || feature.geoLiveType === 'PolygonInfo' || feature.geoLiveType === 'QPolygonInfo') {
            flag = true;
        }
        return flag;
    }
});

