import Util from '../../common/Util';

/**
 * 数据源类代表了若干地图要素的集合
 * 其中通常会按照瓦片和要素类型来组织数据,可能还包含有各种类型的索引,
 * 该类提供各种对数据查询的方法.
 */
export default class Source {
    /**
     * 数据源对象的初始化方法.
     * @param {String} name - 数据源名称，系统中可选值包括：
     * objSource要素数据源名称；
     * tipSource tips数据原名称；
     * thematicSource 专题图数据源名称
     * @param {Object} config - 数据原配置文件中的定义数据
     * @returns {undefined}
     */
    constructor(name, config) {
        /**
         * 数据源名称
         * @type {String}
         */
        this.name = name;
        /**
         * 数据解析器
         * @type {null|Function}
         */
        this.parsor = config.parsor || null;
        /**
         * 数据源请求地址
         * @type {null|String}
         */
        this._sourceUrl = config.sourceUrl || null;
        /**
         * 数据源的子域名配置
         * @type {Array}
         */
        this._subdomains = config.subdomains || [];
        /**
         * 请求服务的参数
         * property {Object}
         */
        this._requestParameter = Util.clone(config.requestParameter);
        /**
         * 以瓦片为单位，进行要素数据的组织
         * @type {Object}
         * @type
         */
        this._data = {};
    }

    /**
     * 根据瓦片信息创建要素数据请求的参数。参数报错瓦片的x轴编号，y轴编号和z缩放等级.
     * @param {Object} tile - 瓦片对象
     * @returns {Object} parameter - 请求参数对象
     */
    createParameter(tile) {
        const parameter = Util.clone(this._requestParameter);
        parameter.x = tile.x;
        parameter.y = tile.y;
        parameter.z = tile.z;
        return parameter;
    }

    /**
     * 设置数据源请求地址.
     * @param {String} value - url地址
     * @returns {undefined} - 返回值为undefined
     */
    setSourceUrl(value) {
        this._sourceUrl = value;
    }

    /**
     * 获取数据源请求地址.
     * @returns {String} - 返回数据源的请求url地址
     */
    getSourceUrl(value) {
        return this._sourceUrl;
    }

    /**
     * 设置瓦片请求参数.
     * @param {String} key - 请求参数的键
     * @param {Number} value - 请求参数对应的值
     * @returns {undefined} - 返回值为undefined
     */
    setParameter(key, value) {
        this._requestParameter[key] = value;
    }

    /**
     * 根据键值获取瓦片请求参数.
     * @param {String} key - 根据键获取请求参数对象的值
     * @returns {*|String} - 返回请求的参数对应键的值
     */
    getParameter(key) {
        return this._requestParameter[key];
    }

    /**
     * 设置当前类型数据源所包含的数据类型.
     * @param {Array} types - 当前数据源的所有数据类型
     * @returns {undefined} - 无返回值
     */
    setFeatureTypes(types) {
        this.setParameter('types', types);
    }

    /**
     * 给数据源中增加具体的要素数据.
     * @param {Object} feature - 要素渲染模型
     * @param {Object} tileName - 瓦片数据对
     * @returns {undefined}
     */
    add(feature, tileName) {
        if (!feature) {
            throw new Error('feature参数缺失');
        }
        if (!tileName) {
            throw new Error('tileName参数缺失');
        }
        if (!feature.properties) {
            throw new Error('feature缺少properties属性');
        }

        const type = feature.type;
        if (!type) {
            throw new Error('feature缺少type属性');
        }

        if (!this._data.hasOwnProperty(tileName)) {
            this._data[tileName] = {};
        }

        if (!this._data[tileName].hasOwnProperty(type)) {
            this._data[tileName][type] = {
                features: [],
                index: {},
            };
        }

        const id = feature.id;
        if (!id) {
            throw new Error('feature缺少id属性');
        }

        const length = this._data[tileName][type].features.push(feature);

        // 插入索引
        if (!this._data[tileName][type].index.hasOwnProperty(id)) {
            this._data[tileName][type].index[id] = [];
        }
        this._data[tileName][type].index[id].push(length - 1);
    }

    /**
     * 删除特定瓦片下的指定要素.
     * @param {Object} feature - 要素渲染模型
     * @param {Object} tileName - 瓦片的名称
     * @returns {undefined} - 返回值为undefined
     */
    del(feature, tileName) {
        if (!feature) {
            throw new Error('feature参数缺失');
        }
        if (!tileName) {
            throw new Error('tileName参数缺失');
        }
        if (!feature.properties) {
            throw new Error('feature缺少properties属性');
        }

        const type = feature.type;
        if (!type) {
            throw new Error('feature缺少type属性');
        }

        if (!this._data.hasOwnProperty(tileName)) {
            return;
        }

        if (!this._data[tileName].hasOwnProperty(type)) {
            return;
        }

        const id = feature.id;
        if (!id) {
            throw new Error('feature缺少id属性');
        }

        if (!this._data[tileName][type].index.hasOwnProperty(id)) {
            return;
        }

        const posArray = this._data[tileName][type].index[id];
        const features = this._data[tileName][type].features;
        for (let i = 0; i < posArray.length; ++i) {
            const pos = posArray[i];
            features.splice(pos, 1);
        }
        delete this._data[tileName][type].index[id];
    }

    /**
     * 删除某个瓦片下的所有数据.
     * @param {String} tileName - 瓦片的名字
     * @returns {undefined}
     */
    delByTile(tileName) {
        if (this._data.hasOwnProperty(tileName)) {
            delete this._data[tileName];
        }
    }

    /**
     * 删除指定瓦片下的给定要素数据.
     * @param {String} geoLiveType - 具体要素的数据类型
     * @param {String} tileName - 瓦片的名字例如："1725583:794203:21"
     * @returns {undefined}
     */
    delByType(type, tileName) {
        if (!this._data.hasOwnProperty(tileName)) {
            return;
        }

        if (!this._data[tileName].hasOwnProperty(type)) {
            return;
        }

        delete this._data[tileName][type];
    }

    /**
     * 清空当前数据源.
     * @returns {undefined}
     */
    clear() {
        this._data = {};
    }

    /**
     * 根据特定要素的id，获得要素所在的瓦片信息.
     * @param {String} type - 要素类型
     * @param {Number} id - 要素的唯一标识
     * @returns {Array} tileNames
     */
    queryTilesById(type, id) {
        if (!type || !id) {
            return [];
        }

        const tileNames = [];
        const keys = Object.getOwnPropertyNames(this._data);
        for (let i = 0; i < keys.length; ++i) {
            const tileName = keys[i];
            if (!this._data[tileName].hasOwnProperty(type)) {
                continue;
            }
            if (!this._data[tileName][type].index.hasOwnProperty(id)) {
                continue;
            }
            tileNames.push(tileName);
        }

        return tileNames;
    }

    /**
     * 在指定瓦片范围内获得根据某一要素的id获得其渲染数据模型.
     * @param {String} type - 要素类型
     * @param {Number} id - 要素的唯一标识
     * @param {String} tileName - 瓦片的名字例如："1725583:794203:21"
     * @returns {Object} feature - 该要素的渲染模型
     */
    queryFeatureById(type, id, tileName) {
        if (!this._data.hasOwnProperty(tileName)) {
            return null;
        }

        if (!this._data[tileName].hasOwnProperty(type)) {
            return null;
        }

        if (!this._data[tileName][type].index.hasOwnProperty(id)) {
            return null;
        }

        const features = this._data[tileName][type].features;
        const posArray = this._data[tileName][type].index[id];
        const feature = features[posArray[0]];

        return feature;
    }

    /**
     * 获取某一瓦片下一种特定类型的所有数据.
     * @param {String} type - 要素类型
     * @param {String} tileName - 瓦片的名字
     * @returns {Array} features
     */
    queryFeaturesByType(type, tileName) {
        if (!this._data.hasOwnProperty(tileName)) {
            return [];
        }

        if (!this._data[tileName].hasOwnProperty(type)) {
            return [];
        }

        const features = this._data[tileName][type].features;
        return features;
    }

    /**
     * 获得当前加载的所有瓦片信息.
     * @returns {Array} - 以数组的方式返回当前数据源所在的所有瓦片的名称
     */
    queryTiles() {
        return Object.getOwnPropertyNames(this._data);
    }

    /**
     * 创建请求url地址.
     * @param {Object} tile - 请求的瓦片信息
     * @param {Number} tileIndex - 索引
     * @returns {String} - 经过转化过后的请求url
     */
    createUrl(tile, tileIndex) {
        return this._template(this._sourceUrl, {
            s: this._getSubdomain(tileIndex),
            z: tile.z,
            x: tile.x,
            y: tile.y,
        });
    }

    /**
     * 分配请求子域名.
     * @param {Number} tileIndex - 请求索引
     * @returns {Number} - 子域名具体值
     */
    _getSubdomain(tileIndex) {
        if (this._subdomains.length === 0) {
            return null;
        }
        const index = tileIndex % this._subdomains.length;
        return this._subdomains[index];
    }

    /**
     * url地址转换方法，将url模板里的占位符替换成具体的请求参数.
     * @param {String} str - 请求url模板
     * @param {Object} data - 请求参数
     * @returns {string} value - 最终的请求Url
     */
    _template(str, data) {
        return str.replace(/\{ *([\w_]+) *\}/g, (matchStr, key) => {
            const value = data[key];
            if (!value) {
                throw new Error(`没有提供可用的值:${matchStr}`);
            }
            return value;
        });
    }
}
