import SnapActor from './SnapActor';

/**
 * 用于捕捉线上离鼠标最近的位置,不一定是形状点.
 */
export default class NearestLocationSnapActor extends SnapActor {
    constructor() {
        super();
        /**
         * 捕捉行为类型
         * @type {string}
         */
        this.type = 'NearestLocationSnapActor';
        /**
         * 捕捉计算出来的记录点位的对象
         * @type {null|Object}
         */
        this.loc = null;
        /**
         * 要捕捉的点几何对象
         * @type {null|Object}
         */
        this.geometry = null;
    }

    snap(point, box) {
        super.snap(point, box);
        this.value = null;

        if (!this.geometry) {
            return null;
        }

        this.loc = this.nearestLocations(point, this.geometry);
        this.point = this.loc.point;
        this.isSnapped = true;

        return this.getSnapResult();
    }

    getSnapResult() {
        if (!this.isSnapped) {
            return null;
        }

        const result = super.getSnapResult();
        result.nearestLoactions = this.loc;
        return result;
    }
}
