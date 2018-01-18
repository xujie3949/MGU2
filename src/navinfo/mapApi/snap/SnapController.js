import FeedbackController from '../feedback/FeedbackController';
import SceneController from '../scene/SceneController';
import GeometryAlgorithm from '../../geometry/GeometryAlgorithm';
import GeometryFactory from '../../geometry/GeometryFactory';
import GeojsonTransform from '../GeojsonTransform';
import SymbolFactory from '../../symbol/SymbolFactory';
import EventController from '../../common/EventController';
import MercatorTransform from '../../transform/MercatorTransform';

/**
 * 捕捉控制器类，用于管理所有的捕捉行为.
 */
export default class SnapController {
    static instance = null;
    /**
     * 捕捉控制器类初始化方法.
     * @param {undefined} options - 没有接收参数
     * @returns {undefined}
     */
    constructor(options) {
        this.feedbackController = FeedbackController.getInstance();
        this.symbolFactory = SymbolFactory.getInstance();
        this.geometryFactory = GeometryFactory.getInstance();
        this.geojsonTransform = GeojsonTransform.getInstance();
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
        /**
         * FM地图对象，默认值为null
         * @type {Object|null}
         */
        this.map = SceneController.getInstance().getMap().getLeafletMap();
        /**
         * 墨卡托转换
         * @type {Object|null}
         */
        this.mercator = new MercatorTransform();
        /**
         * FM地图对象，默认值为null
         * @type {Object|null}
         */
        this.snapActors = [];
        /**
         * 当前捕捉对象对应的捕捉行为对象
         * @type {Object|null} activeSnapActor
         */
        this.activeSnapActor = null;
        /**
         * 捕捉控制器是否运行的标志
         * @type {Boolean} isRunning
         */
        this.isRunning = false;
        /**
         * 捕捉点的容差范围
         * @type {Number} tolerance
         */
        this.tolerance = 20;

        this._eventController = EventController.getInstance();
        this._eventController.once('DestroySingleton', () => this.destroy());
    }

    /**
     * 向捕捉控制器的捕捉行为容器中添加新的捕捉行为对象.
     * @param {Object} snapActor - 捕捉行为对象
     * @return {undefined}
     */
    add(snapActor) {
        for (let i = 0; i < this.snapActors.length; ++i) {
            if (snapActor === this.snapActors[i]) {
                return;
            }
        }

        snapActor.setMap(this.map);
        this.snapActors.push(snapActor);

        this.snapActors = this.snapActors.sort((a, b) => b.priority - a.priority);
    }

    /**
     * 从捕捉控制器的捕捉行为容器中删除给定的捕捉行为对象
     * 并更新捕捉反馈.
     * @param {Object} snapActor - 捕捉行为对象
     * @return {undefined}
     */
    del(snapActor) {
        for (let i = 0; i < this.snapActors.length; ++i) {
            if (snapActor === this.snapActors[i]) {
                snapActor.shutdown();
                this.snapActors.splice(i, 1);
                return;
            }
        }
    }

    /**
     * 从捕捉控制器的捕捉行为容器中删清除所有的的捕捉行为对象
     * 并更新捕捉反馈.
     * @return {undefined}
     */
    clear() {
        for (let i = 0; i < this.snapActors.length; ++i) {
            const snapActor = this.snapActors[i];
            snapActor.shutdown();
        }

        this.snapActors = [];
    }

    /**
     * 启动捕捉控制器，开启捕捉行为
     * 一般在工具启动时调用.
     * @return {undefined}
     */
    startup() {
        for (let i = 0; i < this.snapActors.length; ++i) {
            const snapActor = this.snapActors[i];
            snapActor.startup();
        }
        this.isRunning = true;
    }

    /**
     * 关闭捕捉控制器，停止捕捉行为
     * 一般在工具停止时调用.
     * @return {undefined}
     */
    shutdown() {
        for (let i = 0; i < this.snapActors.length; ++i) {
            const snapActor = this.snapActors[i];
            snapActor.shutdown();
        }
        this.isRunning = false;
    }

    /**
     * 判断捕捉控制器是否开启捕捉状态.
     * @returns {boolean} isRunning
     */
    isSnapping() {
        return this.isRunning;
    }

    /**
     * 根据移动鼠标所在的点位进行对应捕捉行为下数据或者是要素的捕捉.
     * @param {Object} point - geoJson点几何对象
     * @returns {Object} snapResult - 捕捉结果
     */
    snap(point) {
        if (!this.isRunning) {
            return null;
        }

        if (this.snapActors.length === 0) {
            return null;
        }

        if (this.activeSnapActor) {
            this.activeSnapActor.clear();
            this.activeSnapActor = null;
        }

        const box = this.getBox(point, this.tolerance);
        let snapResult = null;
        let minDis = Number.MAX_VALUE;

        for (let i = 0; i < this.snapActors.length; ++i) {
            const snapActor = this.snapActors[i];

            // 这里调用每个捕捉器的绘制方法,让捕捉器自己决定是否绘制
            this.drawSnapActor(snapActor);

            // add by chenx on 2017-8-9
            // 请参考SnapActor中的priority的注释
            if (this.activeSnapActor && snapActor.priority < 0) {
                break;
            }
            const tmpSnapResult = snapActor.snap(point, box);
            if (!tmpSnapResult) {
                continue;
            }

            const dis = this.geometryAlgorithm.distance(tmpSnapResult.point, point);
            if (dis < minDis) {
                this.activeSnapActor = snapActor;
                snapResult = tmpSnapResult;
                minDis = dis;
            }
        }

        return snapResult;
    }

    /**
     * 获取捕捉查找数据的范围.
     * @param {Object} point - geoJson点几何对象
     * @param {Number} tolerance - 鼠标点的捕捉范围，单位为像素
     * @returns {Object} geojson - 返回查找数据的面范围geoJson对象
     */
    getBox(point, tolerance) {
        const x = point.coordinates[0];
        const y = point.coordinates[1];
        const zoom = this.map.getZoom();
        const pixelPoint = this.mercator.geographic2Pixel(x, y, zoom);
        const left = pixelPoint[0] - tolerance;
        const right = pixelPoint[0] + tolerance;
        const top = pixelPoint[1] - tolerance;
        const bottom = pixelPoint[1] + tolerance;

        const coordinates = [];
        const leftTop = this.mercator.pixel2Geographic(left, top, zoom);
        const rightTop = this.mercator.pixel2Geographic(right, top, zoom);
        const rightBottom = this.mercator.pixel2Geographic(right, bottom, zoom);
        const leftBottom = this.mercator.pixel2Geographic(left, bottom, zoom);

        coordinates.push(leftTop);
        coordinates.push(rightTop);
        coordinates.push(rightBottom);
        coordinates.push(leftBottom);
        coordinates.push(leftTop);

        const geojson = {
            type: 'Polygon',
            coordinates: [coordinates],
        };

        return geojson;
    }

    /**
     * 获取当前捕捉到的要素对应的捕捉行为对象.
     * @return {Object} activeSnapActor - 捕捉行为对象
     */
    getActiveSnapActor() {
        return this.activeSnapActor;
    }

    /**
     * 调用捕捉器绘制方法绘制捕捉反馈
     * @return {undefined}
     */
    drawSnapActor(snapActor) {
        if (!this.isRunning) {
            return;
        }

        snapActor.draw();
    }

    /**
     * 单例销毁方法.
     * @return {undefined}
     */
    destroy() {
        SnapController.instance = null;
    }

    /**
     * 获取捕捉控制器单例的静态方法.
     * @example
     * const SnapController = SnapController.getInstance();
     * @returns {Object} 返回 SnapController.instance单例对象.
     */
    static getInstance() {
        if (!SnapController.instance) {
            SnapController.instance = new SnapController();
        }
        return SnapController.instance;
    }
}
