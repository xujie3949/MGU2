/**
 * 场景类，场景由若干相关的场景图层构成,每种要素对应一个场景图层.
 */
export default class Scene {
    /**
     * 场景类初始化方法.
     * @param {String} id - App.Config.map.Scenes.scenes全局对象的键
     * @param {Object} config  - App.Config.map.Scenes.scenes全局对象的键所对应的值
     * @returns {undefined}
     */
    constructor(id, config) {
        /**
         * 场景的名称，唯一标识一个场景
         * @type {String}
         */
        this.id = id;
        /**
         * 场景的（中文）名称
         * @type {String}
         */
        this.name = config.name || '未命名';
        /**
         * 场景的类型
         * @type {String}
         */
        this.type = config.type;
        /**
         * 场景的标记属性
         * @type {String}
         */
        this.label = config.label;
        /**
         * 场景的图层容器
         * @type {Array}
         */
        this.layers = [];
    }

    /**
     * 将场景图层加入到当前场景的图层容器中.
     * @param {Object} sceneLayer -场景图层对象
     * @returns {undefined}
     */
    addLayer(sceneLayer) {
        this.layers.push(sceneLayer);
    }

    /**
     * 删除场景的图层容器基于给定的场景图层.
     * @param {Object} sceneLayer -场景图层对象
     * @returns {undefined}
     */
    removeLayer(sceneLayer) {
        const index = this.layers.indexOf(sceneLayer);

        this.layers.splice(index, 1);
    }

    /**
     * 根据给定的场景图层Id，查询当前场景下对应的场景图层
     * 没有找到则返回null.
     * @param {String} sceneLayerId - 取值范围包括各个全局图层配置对象的键
     * @returns {null|Object} layer - 返回对应的场景图层
     */
    getLayerById(sceneLayerId) {
        let layer;
        for (let i = 0; i < this.layers.length; ++i) {
            layer = this.layers[i];
            if (layer.id === sceneLayerId) {
                return layer;
            }
        }

        return null;
    }

    /**
     * 根据给定的场景图层Id，查询当前场景下是否存在对应的场景图层.
     * @param {String} layerId - 取值范围包括各个全局图层配置对象的键
     * @returns {Boolean} false - 存在返回true,否则返回false
     */
    contains(layerId) {
        let layer;
        for (let i = 0; i < this.layers.length; ++i) {
            layer = this.layers[i];
            if (layer.id === layerId) {
                return true;
            }
        }

        return false;
    }
}
