import SnapActor from './SnapActor';

/**
 * 用于捕捉自定义的捕捉对象上离鼠标最近的位置.
 */
export default class GivenObjectSnapActor extends SnapActor {
    constructor() {
        super();
        /**
         * 捕捉行为类型
         * @type {string}
         */
        this.type = 'GivenObjectSnapActor';
        /**
         * 当前捕捉到的要素数据
         * @type {null|Object}
         */
        this.feature = null;
        /**
         * 指定的捕捉要素数据对象容器
         * @type {Object[]}
         */
        this.features = [];
    }

    snap(point, box) {
        super.snap(point, box);
        this.feature = null;

        if (this.features.length === 0) {
            return null;
        }

        let minDis = Number.MAX_VALUE;
        for (let i = 0; i < this.features.length; ++i) {
            const feature = this.features[i];
            const res = this.nearestPoints(point, feature.geometry);
            if (res.distance < minDis) {
                minDis = res.distance;
                this.point = res.point2;
                this.feature = feature;
                this.isSnapped = true;
            }
        }

        return this.getSnapResult();
    }

    /**
     * 设置自定义捕捉要素/数据对象.
     * @param {Array} features - 传入的捕捉要素数据集
     * @return {undefined}
     */
    setObjects(features) {
        this.features = [];
        Array.prototype.push.apply(this.features, features);
    }

    getSnapResult() {
        if (!this.isSnapped) {
            return null;
        }

        const result = super.getSnapResult();
        result.feature = this.feature;
        return result;
    }
}
