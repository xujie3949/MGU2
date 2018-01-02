import SnapActor from './SnapActor';

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
         * 要捕捉点的数据容器
         * @type {Array}
         */
        this.pairs = [];
    }
    snap(point, box) {
        super.snap(point, box);
        this.value = null;

        if (!this.pairs) {
            return null;
        }

        let minDis = Number.MAX_VALUE;
        for (let i = 0; i < this.pairs.length; ++i) {
            const pair = this.pairs[i];
            const tmpPoint = pair.key;
            const tmpValue = pair.value;
            const dis = this.distance(point, tmpPoint);
            if (dis < minDis) {
                minDis = dis;
                this.point = tmpPoint;
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
        super.draw();

        if (!this.isSnapped) {
            return;
        }

        if (this.pairs) {
            for (let i = 0; i < this.pairs.length; ++i) {
                const pair = this.pairs[i];
                const symbol = this.symbolFactory.getSymbol('snap_pt_given_point');
                this.feedback.add(pair.key, symbol);
            }
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
        const pair = {
            key: point,
            value: value,
        };
        this.pairs.push(pair);
    }

    /**
     * 清除要捕捉的点位.
     * @return {undefined}
     */
    clearPairs() {
        this.pairs = [];
    }
}
