import Util from '../../common/Util';

/**
 * 场景图层类，SceneLayer表示场景中的一个场景图层
 * 一个场景图层总是和一个要素对应.
 */
export default class SceneLayer {
    /**
     * 场景图层的初始化属性,
     * visible 控制图层的显示隐藏
     * editable控制图层的编辑与否
     */
    options = {
        /**
         * 标识场景图层是否可见
         * @type {String} visible
         */
        visible: true,
        /**
         * 标识场景图层是否可编辑
         * @type {String} editable
         */
        editable: true,
    };

    /**
     * 创建场景图层的构造方法.
     * @param {String} id - App.Config.map下各个图层配置对象的键
     * @param {Object} config - App.Config.map下各个图层配置对象的键值
     * @returns {undefined}
     */
    constructor(id, config) {
        this.options = Util.merge(this.options, config.options);
        /**
         * 场景图层的唯一标识
         * @type {String}
         */
        this.id = id;
        /**
         * 场景图层的（中文）名称
         * @type {String}
         */
        this.name = config.name || '未命名';
        /**
         * 场景图层的类型
         * @type {String}
         */
        this.type = config.type;
        /**
         * 场景图层的label标记取值包括feature,tip,thematic
         * @type {String}
         */
        this.label = config.label || '未定义';
    }

    /**
     * 设置场景图层的options属性.
     * @param {Object} options - changing图层属性配置包括数据源类型，渲染模型接口，显示缩放级别等.
     * @returns {Object} options - 返回该场景图层的options配置
     */
    setOptions(options) {
        this.options = Util.merge(this.options, options);
    }

    /**
     * 设置当前场景图层的leaflet图层.
     * @param {Object} leafletLayer - 根据场景图层的类型创建的leaflet图层
     * @returns {undefined}
     */
    setLeafletLayer(leafletLayer) {
        this._leafletLayer = leafletLayer;
    }

    /**
     * 设置场景图层的label属性
     * @param {String} label - label属性
     * @returns {undefined}
     */
    setLabel(label) {
        this.label = label || '未定义';
    }

    /**
     * 设置场景图层的visible属性.
     * @param {Boolean} flag - 图层显隐标记
     * @returns {undefined}
     */
    setVisible(flag) {
        this.options.visible = flag === undefined ? true : flag;
    }

    /**
     * 获得场景图层的options信息.
     * @returns {Object} options
     */
    getOptions() {
        return this.options;
    }

    /**
     * 获取当前场景图层的leaflet图层
     * @returns {Object} - leaflet图层
     */
    getLeafletLayer() {
        return this._leafletLayer;
    }

    /**
     * 获取当前场景图层对应的要素数据类型
     * @returns {String} - 要素数据类型,即要素的geoLiveType
     */
    getFeatureType() {
        return this.options.featureType || null;
    }

    /**
     * 获取该场景图层的要素数据对应的渲染数据模型接口.
     * @returns {Function|null} - 渲染数据模型接口
     */
    getRender() {
        return this.options.render || null;
    }

    /**
     * 获取该场景图层的数据源名称.
     * @returns {String|null} source - 对应的数据源名称
     */
    getSourceName() {
        return this.options.source || null;
    }

    /**
     * 判断场景图层是否显示.
     * @returns {boolean} - 如果options.visible未定义返回true，否则返回定义的值.
     */
    visible() {
        return this.options.visible === undefined ? true : this.options.visible;
    }

    /**
     * 判断该场景图层在特定显示级别是否可绘制
     * @param {Number} zoom - 地图的缩放等级
     * @returns {boolean} - 不满足条件返回false,否则返回false
     */
    canDraw(zoom) {
        if (this.type !== 'vector') {
            // 非vector的图层是否显示直接交给leaflet图层控制
            return true;
        }
        if (!this.options) {
            // vector图层如果无Opitions，则不允许绘制
            return false;
        }
        const sourceName = this.options.source;
        const visible = this.options.visible;
        const featureType = this.options.featureType;
        if (!visible || !sourceName || !featureType) {
            return false;
        }

        const minZoom = this.options.minZoom;
        const maxZoom = this.options.maxZoom;
        if (zoom < minZoom || zoom > maxZoom) {
            return false;
        }

        return true;
    }

    /**
     * 判断两个场景图层是否使用相同的数据.
     * @param {Object} layer - 传入的另一个场景图层对象
     * @returns {boolean} - 两个场景图层的图层类型，数据源，以及要素数据类型都想同返回true
     * 否则返回false
     */
    useSameData(layer) {
        if (this.type !== layer.type) {
            return false;
        }
        if (this.options.source !== layer.options.source) {
            return false;
        }
        if (this.options.featureType !== layer.options.featureType) {
            return false;
        }

        return true;
    }

    /**
     * 克隆场景图层，返回新的场景图层.
     * @returns {Object} - 克隆的场景图层
     */
    clone() {
        const options = {
            name: this.name,
            type: this.type,
            label: this.label,
            options: this.options,
        };
        return new SceneLayer(this.id, options);
    }

    /**
     * 判断该场景图层是否可编辑.
     * @returns {boolean} - 可编辑返回true,否则返回false
     */
    isEditable() {
        return this.options.editable;
    }
}
