import Vector from '../math/Vector';
import Bound from './Bound';

/**
 * Point类，代表一个坐标点.
 */
export default class Point {
    /**
     * 初始化Point对象x,y为坐标点,如果为undefined,则会使用默认值0.
     * @param {Number}[x=0] - 点符号x坐标位置
     * @param {Number}[y=0] - 点符号y坐标位置
     */
    constructor(x, y) {
        this.type = 'Point';
        this.x = x || 0;
        this.y = y || 0;
    }

    /**
     * 克隆点符号对象,返回新对象.
     * @return {object} Point 克隆的对象
     */
    clone() {
        const clonePt = new Point();
        clonePt.x = this.x;
        clonePt.y = this.y;

        return clonePt;
    }

    /**
     * 计算当前点与目标点之间的距离.
     * @param {object} p - 目标点位
     * @return {Number} - 当前点与目标点之间的距离
     */
    distance(p) {
        return Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
    }

    /**
     * 计算目标点位到当前点的向量.
     * @param {object} p - 目标点位
     * @return {object} - 返回p到当前点的向量
     */
    minus(p) {
        const x = this.x - p.x;
        const y = this.y - p.y;
        return new Vector(x, y);
    }

    /**
     * 叉乘矩阵变换坐标主要用于点平移，旋转，缩放等操作.
     * @example
     * const point = new Point(0, -1);
     * const matrix = new Matrix();
     * //将点进行旋转,平移,缩放
     * point = point.crossMatrix(matrix.makeRotate(90));
     * point = point.crossMatrix(matrix.makeTranslate(1, 0));
     * point = point.crossMatrix(matrix.makeScale(2, 2));
     * @param {object} m
     * @return {object} newVec - 变换之后的坐标
     */
    crossMatrix(m) {
        const tmpVec = [this.x, this.y, 1];
        const newVec = new Point(0, 0);
        newVec.x = (tmpVec[0] * m.data[0][0]) +
                   (tmpVec[1] * m.data[1][0]) +
                   (tmpVec[2] * m.data[2][0]);
        newVec.y = (tmpVec[0] * m.data[0][1]) +
                   (tmpVec[1] * m.data[1][1]) +
                   (tmpVec[2] * m.data[2][1]);

        return newVec;
    }

    /**
     * 判断两个点坐标是否相等.
     * @param {object} p - 传入的点位
     * @return {boolean} - 返回boolean值表示点坐标是否相等
     */
    equal(p) {
        if (this.x !== p.x) {
            return false;
        }

        if (this.y !== p.y) {
            return false;
        }

        return true;
    }

    /**
     * 定义点和向量的加法，返回结果为点
     * 代表的几何意义是将点按照向量平移
     * @param {object} v - Vector的实例对象
     * @return {object} Point - 返回向量求和后的点位
     */
    plusVector(v) {
        const point = new Point();
        point.x = this.x + v.x;
        point.y = this.y + v.y;

        return point;
    }

    /**
     * 获取点符号的范围.
     * @returns {object} - 该点位生成的Bound实例对象
     */
    getBound() {
        return new Bound(
            this.x,
            this.y,
            this.x,
            this.y,
        );
    }
}
