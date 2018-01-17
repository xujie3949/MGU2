import SymbolFactory from '../../symbol/SymbolFactory';
import GeometryFactory from '../../geometry/GeometryFactory';
import GeometryAlgorithm from '../../geometry/GeometryAlgorithm';
import SourceController from '../source/SourceController';
import FeedbackController from '../feedback/FeedbackController';
import Feedback from '../feedback/Feedback';
import SceneController from '../scene/SceneController';
import GeojsonTransform from '../GeojsonTransform';
import FeatureSelector from '../FeatureSelector';

/**
 * 捕捉行为类的基类，不同的捕捉行为具有不同的捕捉数据结构.
 */
export default class SnapActor {
    /**
     * 捕捉行为类初始化方法.
     * @returns {undefined}
     */
    constructor() {
        this.type = '';
        // commented by chenx on 2017-8-9
        // 为了解决按照最近距离捕捉的算法，图幅线捕捉永远距离最近的问题（坐标转换精度导致）
        // 对于优先级在0及以上的捕捉器，采用最近距离捕捉
        // 对于优先级小于0的捕捉器，采用有无捕捉，即优先级高的捕捉器捕捉到要素后就停止捕捉
        this.priority = 0;
        this.point = null;
        this.isSnapped = false;
        this.map = null;

        this.symbolFactory = SymbolFactory.getInstance();
        this.geometryFactory = GeometryFactory.getInstance();
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();
        this.sourceController = SourceController.getInstance();
        this.sceneController = SceneController.getInstance();
        this.geojsonTransform = GeojsonTransform.getInstance();
        this.featureSelector = FeatureSelector.getInstance();
        this.feedbackController = FeedbackController.getInstance();
        this.feedback = new Feedback();
        this.feedback.priority = 999999;

        this.startup();
    }

    /**
     * 根据鼠标移动的位置，以及构造出来的查找范围捕捉该范围内的数据.
     * @mehtod snap
     * @param {Object} point - 鼠标移动的点集合
     * @param {Object} box - 查找的范围的面几何
     * @returns {Object} - 捕捉到的数据结果.
     */
    snap(point, box) {
        this.isSnapped = false;
        this.point = null;
        return this.getSnapResult();
    }

    /**
     * 绘制当前捕捉的捕捉符号反馈.
     * @return {undefined}
     */
    draw() {
        this.feedback.clear();

        if (!this.isSnapped) {
            this.feedbackController.refresh();
            return;
        }

        const symbol = this.symbolFactory.getSymbol('snap_pt_cross');
        this.feedback.add(this.point, symbol);

        this.feedbackController.refresh();
    }

    /**
     * 清空捕捉要行为反馈对象的符号
     * 并更新捕捉反馈,实时绘制捕捉光标.
     * @return {undefined}
     */
    clear() {
        this.feedback.clear();
        this.feedbackController.refresh();
    }

    /**
     * 关闭当前捕捉行为,在反馈容器中删除该反馈行为对应的反馈对象
     * 并更新地图上的反馈.
     * @return {undefined}
     */
    shutdown() {
        this.feedbackController.del(this.feedback);
        this.feedbackController.refresh();
    }

    /**
     * 开始捕捉要素数据
     * 并更新捕捉反馈,实时绘制捕捉光标.
     * @return {undefined}
     */
    startup() {
        this.feedbackController.add(this.feedback);
        this.feedbackController.refresh();
    }

    /**
     * 获得计算得到的最终捕捉数据结构.
     * @returns {Object}.
     */
    getSnapResult() {
        if (!this.isSnapped) {
            return null;
        }

        return {
            type: this.type,
            point: this.point,
        };
    }

    /**
     * 获得该捕捉的优先级.
     * @returns {number} priority
     */
    getPriority() {
        return this.priority;
    }

    /**
     * 设置FM地图对象.
     * @param {Object} map - FM地图对象
     * @returns {undefined}
     */
    setMap(map) {
        this.map = map;
    }

    /**
     * 获得FM地图对象.
     * @param {Object} map - FM地图对象
     * @returns {Object} map - FM地图对象
     */
    getMap(map) {
        return this.map;
    }

    /**
     * 计算鼠标移动点和目标几何之间的距离.
     * @param {Object} geometry1 - 鼠标点位几何
     * @param {Object} geometry2 - 目标对象几何
     * @returns {Object} - 返回计算的结果对象
     */
    distance(geometry1, geometry2) {
        const self = this;
        this.geojsonTransform.setEnviroment(this.map, null, this.latlngToMercator);
        const pGeometry1 = this.geojsonTransform.convertGeometry(geometry1);
        const pGeometry2 = this.geojsonTransform.convertGeometry(geometry2);
        return this.geometryAlgorithm.distance(pGeometry1, pGeometry2);
    }

    /**
     * 计算鼠标点位距离捕捉线数据几何最近的点.
     * @param {Object} geometry1 - 鼠标点位几何
     * @param {Object} geometry2 - 目标线对象几何
     * @returns {Object} - 返回计算的结果对象
     */
    nearestPoints(geometry1, geometry2) {
        const self = this;
        this.geojsonTransform.setEnviroment(this.map, null, this.latlngToMercator);
        const pGeometry1 = this.geojsonTransform.convertGeometry(geometry1);
        const pGeometry2 = this.geojsonTransform.convertGeometry(geometry2);
        const res = this.geometryAlgorithm.nearestPoints(pGeometry1, pGeometry2);
        this.geojsonTransform.setEnviroment(this.map, null, this.mercatorToLatlng);
        res.point1 = this.geojsonTransform.convertGeometry(res.point1);
        res.point2 = this.geojsonTransform.convertGeometry(res.point2);
        return res;
    }

    /**
     * 计算鼠标点位距离捕捉要素数据几何最近的点.
     * @param {Object} geometry1 - 鼠标点位几何
     * @param {Object} geometry2 - 目标对象几何
     * @returns {Object} - 返回计算的结果对象
     */
    nearestLocations(geometry1, geometry2) {
        const self = this;
        this.geojsonTransform.setEnviroment(this.map, null, this.latlngToMercator);
        const pGeometry1 = this.geojsonTransform.convertGeometry(geometry1);
        const pGeometry2 = this.geojsonTransform.convertGeometry(geometry2);
        const res = this.geometryAlgorithm.nearestLocations(pGeometry1, pGeometry2);
        this.geojsonTransform.setEnviroment(this.map, null, this.mercatorToLatlng);
        res.point = this.geojsonTransform.convertGeometry(res.point);
        res.previousPoint = this.geojsonTransform.convertGeometry(res.previousPoint);
        res.nextPoint = this.geojsonTransform.convertGeometry(res.nextPoint);
        return res;
    }

    /**
     * 地理坐标转换为web墨卡托平面投影坐标.
     * @param {Object} map - leaflet地图对象.
     * @param {Object} tile - 当前瓦片信息
     * @param {Array} coordinates - 几何的坐标
     * @returns {Array} - 返回转换后的新坐标数据.
     */
    latlngToMercator(map, tile, coordinates) {
        const x = coordinates[0];
        const y = coordinates[1];
        const point = map.project([y, x]);
        return [point.x, point.y];
    }

    /**
     * web墨卡托平面投影坐标转换为地理坐标.
     * @param {Object} map - leaflet地图对象.
     * @param {Object} tile - 当前瓦片信息
     * @param {Array} coordinates - 几何的坐标
     * @returns {Array} - 返回转换后的新坐标数据.
     */
    mercatorToLatlng(map, tile, coordinates) {
        const x = coordinates[0];
        const y = coordinates[1];
        const latlng = map.unproject([x, y]);
        return [latlng.lng, latlng.lat];
    }

    /**
     * 判断两个几何是否相交.
     * @param  {Object} geometry1 - 传入的几何对象
     * @param  {Object} geometry2 - 传入的几何对象
     * @return {Boolean} - 布尔值，反应两个几何是否相交
     */
    intersects(geometry1, geometry2) {
        const self = this;
        this.geojsonTransform.setEnviroment(this.map, null, this.latlngToMercator);
        const pGeometry1 = this.geojsonTransform.convertGeometry(geometry1);
        const pGeometry2 = this.geojsonTransform.convertGeometry(geometry2);
        return this.geometryAlgorithm.intersects(pGeometry1, pGeometry2);
    }
}
