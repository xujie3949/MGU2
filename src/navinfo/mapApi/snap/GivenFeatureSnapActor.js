import SnapActor from './SnapActor';

/**
 * 用于捕捉给定的要素对象上离鼠标最近的位置.
 */
export default class GivenFeatureSnapActor extends SnapActor {
    constructor() {
        super();
        /**
         * 捕捉行为类型
         * @type {string}
         */
        this.type = 'GivenFeatureSnapActor';
        /**
         * 当前捕捉到的要素数据
         * @type {null|Object}
         */
        this.feature = null;
        /**
         * 指定的捕捉要素容器
         * @type {Object[]}
         */
        this.features = [];
    }

    snap(point, box) {
        super.snap(point, box);
        this.feature = null;

        if (!this.features) {
            return null;
        }

        if (this.features.length === 0) {
            return null;
        }

        let minDis = Number.MAX_VALUE;
        for (let i = 0; i < this.features.length; ++i) {
            let feature = this.features[i];
            // add by chenx on 2017-5-2，处理不在地图可视范围内的情况
            if (feature.unloaded) {
                feature = this.featureSelector.selectByFeatureId(feature.id, feature.geoLiveType);
                if (feature) {
                    this.features.splice(i, 1, feature);
                } else {
                    continue;
                }
            }
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
     * 设置给定的捕捉要素数据对象.
     * @param {Array} features - 传入的捕捉要素数据集
     * @return {undefined}
     */
    setFeatures(features) {
        const items = features;
        for (let i = 0; i < items.length; ++i) {
            const item = items[i];

            const feature = this.featureSelector.selectByFeatureId(item.id, item.geoLiveType);
            if (!feature) { // add by chenx on 2017-5-2，处理不在地图可视范围内的情况
                this.features.push({
                    id: item.id,
                    geoLiveType: item.geoLiveType,
                    unloaded: true
                });
            } else {
                this.features.push(feature);
            }
        }
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
