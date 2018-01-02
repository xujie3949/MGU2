import Bound from './Bound';

/**
 * 该类代表一个多边形.
 */
export default class Polygon {
    /**
     * 初始化Polygon对象
     * 还可以通过GeometryFactory的createPolygon()方法创建.
     */
    constructor() {
        this.type = 'Polygon';

        this.coordinates = [];
    }

    /**
     * 克隆当前前对象,返回新对象
     * @return {object} clonePolygon - 返回克隆的对象
     */
    clone() {
        const clonePolygon = new Polygon();
        for (let i = 0; i < this.coordinates.length; ++i) {
            const lineString = this.coordinates[i].clone();
            clonePolygon.coordinates.push(lineString);
        }

        return clonePolygon;
    }

    /**
     * 计算面的周长.
     * @return {Number} length - 返回面的周长
     */
    length() {
        if (this.coordinates.length === 0) {
            return 0;
        }

        let length = 0;

        for (let i = 0; i < this.coordinates.length; ++i) {
            const lineString = this.coordinates[i];
            length += lineString.length();
        }

        return length;
    }

    /**
     * 判断两个Polygon坐标是否相等.
     * @param {object} polygon - 传入做对比的面对象
     * @return {boolean}
     */
    equal(polygon) {
        if (this.coordinates.length !== polygon.coordinates.length) {
            return false;
        }

        for (let i = 0; i < this.coordinates.length; ++i) {
            if (!this.coordinates[i].equal(polygon.coordinates[i])) {
                return false;
            }
        }

        return true;
    }

    /**
     * 获取Polygon的最小包含范围.
     * @returns {object} bound
     */
    getBound() {
        let bound = new Bound();
        for (let i = 0; i < this.coordinates.length; ++i) {
            const lineString = this.coordinates[i];
            const lineStringBound = lineString.getBound();
            bound = bound.extend(lineStringBound);
        }

        return bound;
    }
}
