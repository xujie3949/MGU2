import Point from './Point';

/**
 * 线段分割类
 */
export default class LineSegment {
    /**
     * 初始化方法.
     * @param {@link link Point} start - 起始点
     * @param {@link link Point} end - 起始点
     */
    constructor(start, end) {
        this.type = 'LineSegment';

        this.start = start ? start.clone() : new Point();
        this.end = end ? end.clone() : new Point();
    }

    /**
     * 克隆对象.
     * @returns {object} cloneLineSegment - LineSegment克隆的对象
     */
    clone() {
        const cloneLineSegment = new LineSegment(this.start, this.end);
        return cloneLineSegment;
    }

    /**
     * 计算两点之间线段长度.
     * @return {Number} - 线段长度.
     */
    length() {
        return this.start.distance(this.end);
    }

    /**
     * 计算线段指定长度处的点
     * 当指定长度小于等于0时，返回start.clone
     * 当指定长度大于或等于两点之间总长度时，返回end.clone
     * @param {Number} length - 要切分的长度
     * @return {@link Point} Point - 坐标点
     */
    getPointByLength(length) {
        if (length <= 0) {
            return this.start.clone();
        }

        const lineLength = this.length();

        if (length >= lineLength) {
            return this.end.clone();
        }

        let vector = this.end.minus(this.start);
        vector.normalize();

        vector = vector.multiNumber(length);

        const point = this.start.plusVector(vector);

        return point;
    }
}
