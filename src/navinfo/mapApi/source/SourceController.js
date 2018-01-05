import TileRequestController from '../TileRequestController';
import Source from './InfoSource';
import ajax from '../../common/ajax';
import Util from '../../common/Util';
import EventController from '../../common/EventController';

/**
 * 数据源控制管理类
 * 用于管理所有的数据源,解析数据源配置文件,请求服务数据等
 */
export default class SourceController {
    /**
     * 初始化数据源管理类.
     * @returns {undefined}
     */
    constructor() {
        /**
         * 数据源容器
         * @type {Object} _sources
         */
        this._sources = {};
        /**
         * 瓦片请求的管理类实例对象
         * @type {Object} tileRequestController
         */
        this.tileRequestController = TileRequestController.getInstance();

        this._eventController = EventController.getInstance();
        this._eventController.once('DestroySingleton', () => this.destroy());
    }

    /**
     * 增加数据源方法
     * @param {Object} source - 数据源对象
     * @return {undefined}
     */
    add(source) {
        if (this._sources.hasOwnProperty(source.name)) {
            throw new Error(`已经存在数据源:${source.name}`);
        }

        this._sources[source.name] = source;
    }

    /**
     * 根据数据源的名称删除数据源.
     * @param {String} sourceName - 数据源对象
     * @returns {undefined}
     */
    del(sourceName) {
        if (this._sources.hasOwnProperty(sourceName)) {
            delete this._sources[sourceName];
        }
    }

    /**
     * 清除所有数据源中的数据.
     * @returns {undefined}
     */
    clear() {
        const keys = Object.getOwnPropertyNames(this._sources);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            this._sources[key].clear();
        }
    }

    /**
     * 根据数据源名称获取数据源.
     * @param {String} sourceName - 数据源名称
     * @returns {Object} - 返回已sourceName为键值的数据源
     */
    getSource(sourceName) {
        if (!this._sources.hasOwnProperty(sourceName)) {
            return null;
        }

        return this._sources[sourceName];
    }

    /**
     * 获取所有数据源
     * @returns {Object[]} sources
     */
    getAllSources() {
        const sources = [];
        const keys = Object.getOwnPropertyNames(this._sources);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            sources.push(this._sources[key]);
        }
        return sources;
    }

    /**
     * 请求当前瓦片的数据源方法.
     * method requestTileData
     * @param {Object} tile - 当前要请求加载的瓦片
     * @param {Number} tileIndex - 当前瓦片请求索引
     * @param {Object} urlObject - 根据请求的所有数据类型组成的请求url对象
     * 数据结构为以数据源名称为键，以该类型数据源中所有要素数据类型组成的数组为值的hash表.
     * @returns {Promise} - Promise对象代表该瓦片下所有类型数据源(基于当前场景的配置)的请求.
     */
    requestTileData(tile, tileIndex, urlObject) {
        const promises = this._createPromises(tile, tileIndex, urlObject);
        return Promise.all(promises)
            .then(res => {
                this._tilePromiseSuccess(tile, res);
                return tile;
            });
    }

    /**
     * 根据App.Config.map.SourceConfig配置文件初始化所有类型的数据源.
     * @param {Object} config - sourceConfig配置
     * @returns {undefined}
     */
    loadConfig(config) {
        const keys = Object.getOwnPropertyNames(config);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const value = config[key];
            if (this._sources[key]) {
                throw new Error(`数据源名称存在重复:${key}`);
            }
            this._sources[key] = new Source(key, value);
        }
    }

    /**
     * 遍历数据源请求urlObject对象，创建各自数据源的异步请求对象，然后返回异步对象数组.
     * @param {Object} tile - 瓦片信息
     * @param {Number} tileIndex - 当前瓦片的请求索引
     * @param {Object} urlObject - 请求要数据源对象
     * @returns {Promise[]} promises - promises数组代表了该瓦片所有数据要素的请求
     */
    _createPromises(tile, tileIndex, urlObject) {
        this._uniqueFeatureType(urlObject);

        const promises = [];
        const keys = Object.getOwnPropertyNames(urlObject);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const value = urlObject[key];
            if (!value.length) {
                continue;
            }
            const source = this.getSource(key);
            source.setFeatureTypes(value);
            const url = source.createUrl(tile, tileIndex);
            const parameter = source.createParameter(tile);
            const promise = this._createAjaxPromise(tile, url, parameter, key);
            promises.push(promise);
        }

        return promises;
    }

    /**
     * 遍历数据源请求urlObject对象，去除其中重复的请求类型.
     * @param {Object} urlObject - 请求要数据源对象
     * @returns {undefined}
     */
    _uniqueFeatureType(urlObject) {
        const keys = Object.getOwnPropertyNames(urlObject);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const value = urlObject[key];
            urlObject[key] = Util.uniq(value);
        }
    }

    /**
     * 创建单个数据源请求的Promise实例.
     * @param {Object} tile - 瓦片信息
     * @param {String} url - 数据源请求url
     * @param {Object} requestParameter - 请求参数
     * @param {Array} additionParameter - 请求的数据类型
     * @returns {promise} promise - 返回单个数据源数据异步请求实例
     */
    _createAjaxPromise(tile, url, requestParameter, additionParameter) {
        const self = this;
        const promise = new Promise((resolve, reject) => {
            const options = {
                url: url,
                requestParameter: requestParameter,
                parameter: additionParameter,
                timeout: 100000,
                responseType: 'json',
                // debug: true,
                onSuccess(json, parameter) {
                    if (json.errcode === 0) { // 操作成功
                        resolve(
                            {
                                data: json.data,
                                parameter: parameter,
                            },
                        );
                    } else {
                        reject(
                            {
                                errmsg: json.errmsg,
                                parameter: parameter,
                            },
                        );
                    }
                },
                onFail(errmsg, parameter) {
                    reject(
                        {
                            errmsg: errmsg,
                            parameter: parameter,
                        },
                    );
                },
                onError(errmsg, parameter) {
                    reject(
                        {
                            errmsg: errmsg,
                            parameter: parameter,
                        },
                    );
                },
                onTimeout(errmsg, parameter) {
                    reject(
                        {
                            errmsg: errmsg,
                            parameter: parameter,
                        },
                    );
                },
            };
            const request = ajax.get(options);
            self.tileRequestController.add(tile.fullName, request);
        });

        return promise;
    }

    /**
     * 瓦片的所有数据请求成功后,解析数据并存入数据源中
     * @param {Object} tile - 瓦片信息
     * @param {Object} res - 服务返回的瓦片数据结果
     * @returns {undefined}
     */
    _tilePromiseSuccess(tile, res) {
        const allFeatures = {};
        for (let i = 0; i < res.length; ++i) {
            const item = res[i];
            const data = item.data;
            const parameter = item.parameter;
            const source = this.getSource(parameter);
            const features = source.parsor(data, tile);
            this._addFeaturesToDataSource(source, features, tile);
        }
    }

    /**
     * 将数据存入数据源中.
     * @param {Object} source - 数据源对象
     * @param {Object} features - 渲染数据对象
     * @param {Object} tile - 瓦片信息
     * @return {undefined}
     */
    _addFeaturesToDataSource(source, features, tile) {
        for (let i = 0; i < features.length; ++i) {
            const feature = features[i];
            source.add(feature, tile.fullName);
        }
    }

    /**
     * 销毁单例对象
     * @returns {undefined}
     */
    destroy() {
        SourceController.instance = null;
    }

    /**
     * 获取数据源控制管理类单例对象的静态方法.
     * @example
     * const SourceController = SourceController.getInstance();
     * @returns {Object} 返回SourceController.instance 单例对象.
     */
    static getInstance() {
        if (!SourceController.instance) {
            SourceController.instance = new SourceController();
        }
        return SourceController.instance;
    }
}
