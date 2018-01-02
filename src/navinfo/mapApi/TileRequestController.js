/**
 * 瓦片请求管理器,管理当前渲染的数据的所有瓦片异步请求对象
 */
export default class TileRequestController {
    static instance = null;
    /**
     * 初始化数据源管理类.
     * @returns {undefined}
     */
    constructor() {
        /**
         * 瓦片请求容器.
         * @type {Object}
         */
        this.tiles = {};
    }

    /**
     * 向瓦片请求容器中增加一个新的渲染请求.
     * @param {String} tileName - 当前请求瓦片的全名，由瓦片行列号以及缩放等级组成
     * @param {Object} request - ajax请求返回的异步对象.
     * @return {undefined}
     */
    add(tileName, request) {
        if (!tileName || !request) {
            return;
        }

        if (!this.tiles[tileName]) {
            this.tiles[tileName] = [];
        }

        this.tiles[tileName].push(request);
    }

    /**
     * 根据瓦片名称删除当前改瓦片下的所有数据请求对象.
     * @param {String} tileName - 当前请求瓦片的全名，由瓦片行列号以及缩放等级组成
     * @return {undefined}
     */
    del(tileName) {
        if (!tileName) {
            return;
        }

        if (!this.tiles.hasOwnProperty(tileName)) {
            return;
        }

        this.abortTileRequests(tileName);

        delete this.tiles[tileName];
    }

    /**
     * 根据瓦片名称获取当前改瓦片下的所有数据请求对象.
     * @param {String} tileName - 当前请求瓦片的全名，由瓦片行列号以及缩放等级组成
     * @return {Array} - 当前改瓦片下的所有数据请求对象
     */
    getRequests(tileName) {
        return this.tiles[tileName];
    }

    /**
     * 判断瓦片容器是否包含某个瓦片的请求.
     * @param {String} tileName - 当前请求瓦片的全名，由瓦片行列号以及缩放等级组成
     * @returns {boolean} - 返回是否包含的布尔值
     */
    containTile(tileName) {
        return this.tiles.hasOwnProperty(tileName);
    }

    /**
     * 终止当前某个瓦片下的所有请求.
     * @param {String} tileName - 当前请求瓦片的全名，由瓦片行列号以及缩放等级组成
     * @return {undefined}
     */
    abortTileRequests(tileName) {
        const requests = this.tiles[tileName];
        for (let i = 0; i < requests.length; ++i) {
            const request = requests[i];
            request.abort();
        }
    }

    /**
     * 清除瓦片请求容器
     * @return {undefined}
     */
    clear() {
        const keys = Object.getOwnPropertyNames(this.tiles);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            this.del(key);
        }
        this.tiles = {};
    }

    /**
     * 销毁单例对象
     * @returns {undefined}
     */
    destroy() {
        TileRequestController.instance = null;
    }

    /**
     * 获取瓦片请求管理器类单例对象的静态方法.
     * @example
     * const TileRequestController = TileRequestController.getInstance();
     * @returns {Object} 返回TileRequestController.instance单例对象.
     */
    static getInstance() {
        if (!TileRequestController.instance) {
            TileRequestController.instance = new TileRequestController();
        }
        return TileRequestController.instance;
    }
}
