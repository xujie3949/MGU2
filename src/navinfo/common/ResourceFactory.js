import EventController from './EventController';

/**
 * 该类是渲染图片资源管理类，用于对渲染要素的图片资源进行统一管理.
 */
class ResourceFactory {
    /**
     * 初始化图片资源管理的数据容器.
     */
    constructor() {
        this.resources = {};
        this._eventController = EventController.getInstance();
        this._eventController.once('DestroySingleton', () => this.destroy());
    }

    /**
     * 增加一个图片资源到图片资源管理容器对象中去.
     * @param {string} key - 图片的url地址
     * @param {object} resource - image对象
     */
    add(key, resource) {
        if (!key || !resource) {
            return;
        }

        if (this.resources[key]) {
            return;
        }

        this.resources[key] = resource;
    }

    /**
     * 删除一个给定的图片资源.
     * @param {string} key - 图片的url地址
     */
    del(key) {
        if (!key) {
            return;
        }

        if (!this.resources.hasOwnProperty(key)) {
            return;
        }

        delete this.resources[key];
    }

    /**
     * 删除一个给定的图片资源.
     * @param {string} key - 图片的url地址
     */
    getResource(key) {
        return this.resources[key];
    }

    /**
     * 判断给定的图片资源是否存在.
     * @param key
     * @returns {boolean}
     */
    containResource(key) {
        return this.resources.hasOwnProperty(key);
    }

    /**
     * 清空图片资源容器.
     */
    clear() {
        this.resources = {};
    }

    /**
     * 销毁图片资源管理器.
     */
    destroy() {
        ResourceFactory.instance = null;
    }

    /**
     * 获取图片资源管理器单例的静态方法.
     * @example
     * const MeshAlgorithm = ResourceFactory.getInstance();
     * @returns {Object} 返回 ResourceFactory.instance 单例对象.
     */
    static getInstance() {
        if (!ResourceFactory.instance) {
            ResourceFactory.instance =
                new ResourceFactory();
        }
        return ResourceFactory.instance;
    }
}

ResourceFactory.instance = null;

export default ResourceFactory;

