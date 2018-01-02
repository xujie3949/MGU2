import SnapActor from './SnapActor';

/**
 * 捕捉最近形状点行为类，在鼠标移动的过程中捕捉最近形状点.
 */
export default class NearestVertexSnapActor extends SnapActor {
    /**
     * 捕捉最近形状点行为类的初始化方法.
     * @returns {undefined}
     */
    constructor() {
        super();
        /**
         * 捕捉行为类型
         * @type {string}
         */
        this.type = 'NearestVertexSnapActor';
        this.index = null;
        this.geometry = null;
        this.canSnapStart = true;
        this.canSnapEnd = true;
    }

    /**
     * 重写基类snap方法，实现对最近行转点的捕捉.
     * @mehtod snap
     * @param {Object} point - 鼠标移动的点集合
     * @param {Object} box - 查找的范围的面几何
     * @returns {Object} - 捕捉到的数据结果.
     */
    snap(point, box) {
        super.snap(point, box);
        this.value = null;

        if (!this.geometry) {
            return null;
        }

        let minDis = Number.MAX_VALUE;
        for (let i = 0; i < this.geometry.coordinates.length; i++) {
            if (!this.canSnapStart && i === 0) {
                continue;
            }
            if (!this.canSnapEnd && i === this.geometry.coordinates.length - 1) {
                continue;
            }
            const coordinates = this.geometry.coordinates[i];
            const vertex = this.coordinatesToPoint(coordinates);
            const dis = this.distance(point, vertex);
            if (dis < minDis) {
                minDis = dis;
                this.point = vertex;
                this.index = i;
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
        result.index = this.index;
        return result;
    }

    draw() {
        super.draw();

        if (!this.isSnapped) {
            return;
        }

        if (this.geometry) {
            for (let i = 0; i < this.geometry.coordinates.length; ++i) {
                if (!this.canSnapStart && i === 0) {
                    continue;
                }
                if (!this.canSnapEnd && i === this.geometry.coordinates.length - 1) {
                    continue;
                }
                const coordinates = this.geometry.coordinates[i];
                const vertex = this.coordinatesToPoint(coordinates);
                const symbol = this.symbolFactory.getSymbol('snap_pt_vertex');
                this.feedback.add(vertex, symbol);
            }
        }

        this.feedbackController.refresh();
    }

    /**
     * 将捕捉到的性装点的几何组标转换为点geoJson对象.
     * @param {Point} coordinates - 点几何坐标
     * @returns {Object} point - 转换后的点geoJson对象
     */
    coordinatesToPoint(coordinates) {
        const point = {
            type: 'Point',
            coordinates: coordinates,
        };
        return point;
    }
}
