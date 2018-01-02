import SnapActor from './SnapActor';

/**
 * 全视口要素捕捉行为类,用于对指定要素类型进行捕捉
 * 对应的指定要素类型一般是通过传入指定要素的场景图层id实现.
 */
export default class FullScreenFeatureSnapActor extends SnapActor {
    constructor() {
        super();
        /**
         * 捕捉行为类型
         * @type {string}
         */
        this.type = 'FullScreenFeatureSnapActor';
        /**
         * 当前捕捉到的要素数据
         * @type {null|Object}
         */
        this.feature = null;
        /**
         * 捕捉要素的场景图层id
         * @type {string}
         */
        this.layerId = '';
        /**
         * 排除的捕捉要素数据
         * @type {Array}
         */
        this.snapExceptions = [];
        /**
         * 捕捉函数
         * @type {Function}
         */
        this.snapFunction = null;
    }

    snap(point, box) {
        super.snap(point, box);
        this.feature = null;

        if (!this.layerId) {
            return null;
        }

        const features = this.featureSelector.selectByGeoLiveType(this.layerId);

        if (features.length === 0) {
            return null;
        }

        let minDis = Number.MAX_VALUE;
        for (let i = 0; i < features.length; ++i) {
            const feature = features[i];
            if (this.isSnapException(feature.properties.id)) {
                continue;
            }

            if (this.snapFunction && !this.snapFunction(feature)) {
                continue;
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

    getSnapResult() {
        if (!this.isSnapped) {
            return null;
        }

        const result = super.getSnapResult();
        result.feature = this.feature;
        return result;
    }

    /**
     * 添加该类型要素要排除捕捉的要素数据id.
     * @param {Number} id - 排除捕捉要素的id
     * @return {undefined}
     */
    addSnapException(id) {
        for (let i = 0; i < this.snapExceptions.length; ++i) {
            if (id === this.snapExceptions[i]) {
                return;
            }
        }

        this.snapExceptions.push(id);
    }

    /**
     * 删除该类型要素要排除捕捉的要素数据id.
     * @param {Number} id - 排除不捕捉要素的id
     * @return {undefined}
     */
    delSnapException(id) {
        for (let i = 0; i < this.snapExceptions.length; ++i) {
            if (id === this.snapExceptions[i]) {
                this.snapExceptions.splice(i, 1);
                return;
            }
        }
    }

    /**
     * 清除要排除捕捉的要素数据id容器.
     * @return {undefined}
     */
    clearSnapException() {
        this.snapExceptions = [];
    }

    /**
     * 判断一个要素是否不要进行捕捉.
     * @param {Number} id - 判断的要素的id值
     * @returns {boolean} - 返回是否标志
     */
    isSnapException(id) {
        for (let i = 0; i < this.snapExceptions.length; ++i) {
            if (id === this.snapExceptions[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * 设置捕捉函数.
     * @param {Function} func - 捕捉要素的方法
     * @returns {undefined}.
     */
    setSnapFunction(func) {
        this.snapFunction = func;
    }
}
