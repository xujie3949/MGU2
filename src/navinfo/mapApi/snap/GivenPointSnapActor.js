import SnapActor from './SnapActor';
import jsts from '../../algorithm/jsts';

/**
 * 用于捕捉给定的几何点的捕捉行为类.
 */
export default class GivenPointSnapActor extends SnapActor {
    constructor() {
        super();
        /**
         * 捕捉行为类型
         * @type {string}
         */
        this.type = 'GivenPointSnapActor';
        /**
         * 当前捕捉点数据结构的value值
         * @type {*}
         */
        this.value = null;
        /**
         * 待捕捉点索引
         * @type {Array}
         */
        this.index = new jsts.index.quadtree.Quadtree();
    }

    snap(point, box) {
        super.snap(point, box);
        this.value = null;

        if (!this.index) {
            return null;
        }

        this.geojsonTransform.setEnviroment(null, null, this.latlngToMercator);
        const mercatorPoint = this.geojsonTransform.convertGeometry(point);
        const mercatorBox = this.geojsonTransform.convertGeometry(box);
        const reader = new jsts.io.GeoJSONReader();
        const jstBox = reader.read(mercatorBox);
        const values = this.index.query(jstBox.getEnvelopeInternal()).toArray();

        this.geojsonTransform.setEnviroment(null, null, this.mercatorToLatlng);
        let minDis = Number.MAX_VALUE;
        for (let i = 0; i < values.length; ++i) {
            const pair = values[i];
            const tmpPoint = pair.key;
            const tmpValue = pair.value;
            const dis = this.geometryAlgorithm.distance(mercatorPoint, tmpPoint);
            if (dis < minDis) {
                minDis = dis;
                this.point = this.geojsonTransform.convertGeometry(tmpPoint);
                this.value = tmpValue;
                this.isSnapped = true;
            }
        }

        return this.getSnapResult();
    }

    getSnapResult() {
        if (!this.isSnapped) {
            return null;
        }

        const result = super.getSnapResult();
        result.value = this.value;
        return result;
    }

    draw() {
        this.feedback.clear();

        if (!this.isDrawFeedback) {
            this.feedbackController.refresh();
            return;
        }

        this.geojsonTransform.setEnviroment(null, null, this.mercatorToLatlng);
        const pairs = this.index.queryAll().toArray();
        if (pairs) {
            for (let i = 0; i < pairs.length; ++i) {
                const pair = pairs[i];
                const point = this.geojsonTransform.convertGeometry(pair.key);
                const symbol = this.symbolFactory.getSymbol('snap_pt_given_point');
                this.feedback.add(point, symbol);
            }
        }

        if (this.isSnapped) {
            this.drawSnapSymbol();
        }

        this.feedbackController.refresh();
    }

    /**
     * 增加要捕捉的点位.
     * @param {Object} point - 要捕捉的点位
     * @param {*} value - 这里的value主要在工具里使用
     * @return {undefined}
     */
    addPair(point, value) {
        this.geojsonTransform.setEnviroment(null, null, this.latlngToMercator);
        const mercatorPoint = this.geojsonTransform.convertGeometry(point);
        const jstsCoordinate = new jsts.geom.Coordinate(mercatorPoint.coordinates[0], mercatorPoint.coordinates[1]);
        const envelope = new jsts.geom.Envelope(jstsCoordinate);
        this.index.insert(envelope, {
            key: mercatorPoint,
            value: value,
        });
    }

    /**
     * 清除要捕捉的点位.
     * @return {undefined}
     */
    clearPairs() {
        this.index = new jsts.index.quadtree.Quadtree();
    }
}
