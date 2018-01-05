import FeedbackController from '../feedback/FeedbackController';
import GeometryAlgorithm from '../../geometry/GeometryAlgorithm';
import GeometryFactory from '../../geometry/GeometryFactory';
import GeometryTransform from '../../geometry/GeometryTransform';
import SymbolFactory from '../../symbol/SymbolFactory';
import EventController from '../../common/EventController';

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
        this.geometryTransform = GeometryTransform.getInstance();
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
        /**
         * FM地图对象，默认值为null
         * @type {Object|null}
         */
        this.map = null;
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
         * 是否绘制捕捉十字的标志属性
         * @type {Boolean} drawSnapCross
         */
        this.drawSnapCross = true;
        /**
         * 捕捉点的容差范围
         * @type {Number} tolerance
         */
        this.tolerance = 20;

        this._eventController = EventController.getInstance();
        this._eventController.once('DestroySingleton', () => this.destroy());
    }

    /**
     * 设置FM地图对象.
     * @param {Object} map - fastMap地图对象.
     * @return {undefined}
     */
    setMap(map) {
        this.map = map;
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

        this.draw();

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
        const pixelPoint = this.map.project([y, x]);
        const left = pixelPoint.x - tolerance;
        const right = pixelPoint.x + tolerance;
        const top = pixelPoint.y - tolerance;
        const bottom = pixelPoint.y + tolerance;

        const geojson = {
            type: 'Polygon',
            coordinates: [],
        };

        const coordinates = [];
        const leftTop = this.map.unproject([left, top]);
        const rightTop = this.map.unproject([right, top]);
        const rightBottom = this.map.unproject([right, bottom]);
        const leftBottom = this.map.unproject([left, bottom]);

        coordinates.push([leftTop.lng, leftTop.lat]);
        coordinates.push([rightTop.lng, rightTop.lat]);
        coordinates.push([rightBottom.lng, rightBottom.lat]);
        coordinates.push([leftBottom.lng, leftBottom.lat]);
        coordinates.push([leftTop.lng, leftTop.lat]);

        geojson.coordinates = [coordinates];

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
     * 设置当前捕捉样式是否十字形.
     * @param {Boolean} value - 布尔值
     * @return {undefined}
     */
    setDrawSnapCross(value) {
        this.drawSnapCross = value;
    }

    /**
     * 获取当前捕捉样式是否十字形.
     * @param {Boolean} value - 布尔值
     * @return {Boolean} drawSnapCross.
     */
    getDrawSnapCross(value) {
        return this.drawSnapCross;
    }

    /**
     * 对于当前捕捉到要素绘制捕捉十字光标
     * 绘制的位置是捕捉到距离捕捉要素最近的点.
     * @return {undefined}
     */
    draw() {
        if (!this.isRunning) {
            return;
        }

        if (!this.drawSnapCross) {
            return;
        }

        if (!this.activeSnapActor) {
            return;
        }

        this.activeSnapActor.draw();
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
