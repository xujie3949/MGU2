import Point from './Point';
import GeometryFactory from './GeometryFactory';

/**
 * 该类是一个symbol.Bound（范围符）号类，代表一个以像素坐标表示的矩形区域.
 */
export default class Bound {
    /**
   * 接收一个矩形区域四条边位置初始化Bound对象
   * @member {function} Bound#
   * @param {Number}[left=0] - 矩形区域的左边位置
   * @param {Number}[top=0] - 矩形区域的上边位置
   * @param {Number}[right=0] - 矩形区域的右边位置
   * @param {Number}[bottom=0] - 矩形区域的底边位置
   * @return {undefined}
   */
    constructor(left, top, right, bottom) {
        this.left = left || 0;
        this.top = top || 0;
        this.right = right || 0;
        this.bottom = bottom || 0;
    }

    /**
   * 根据给定的范围扩展当前的区域范围.
   * @member {function} Bound#
   * @param {object} bound - 给定的范围对象
   * @returns {object} newBound - Bound的实例
   */
    extend(bound) {
        const left = this.left < bound.left ? this.left : bound.left;
        const top = this.top < bound.top ? this.top : bound.top;
        const right = this.right > bound.right ? this.right : bound.right;
        const bottom = this.bottom > bound.bottom ? this.bottom : bound.bottom;
        const newBound = new Bound(left, top, right, bottom);
        return newBound;
    }

    /**
   * 返回当前返回的大小，即包含该区域宽和高的对象.
   * @member {function} Bound#
   * @returns {{width: number, height: number}}
   */
    getSize() {
        return {
            width: this.right - this.left,
            height: this.bottom - this.top,
        };
    }

    /**
   * 返回该区域中心点.
   * @member {function} Bound#
   * @returns {object} center - Point类实例对象
   */
    getCenter() {
        const size = this.getSize();
        const halfWidth = size.width / 2;
        const halfHeight = size.height / 2;
        const cX = this.left + halfWidth;
        const cY = this.top + halfHeight;
        const center = new Point(cX, cY);
        return center;
    }

    /**
   * 将bound转换成LineString,LineString为顺时针闭合环.
   * @member {function} Bound#
   * @returns {object} lineString - LineString类实例对象
   */
    toLineString() {
        const coordinates = [];
        coordinates.push([
            this.left,
            this.top,
        ]);
        coordinates.push([
            this.right,
            this.top,
        ]);
        coordinates.push([
            this.right,
            this.bottom,
        ]);
        coordinates.push([
            this.left,
            this.bottom,
        ]);
        coordinates.push([
            this.left,
            this.top,
        ]);

        const gf = GeometryFactory.getInstance();
        const lineString = gf.createLineString(coordinates);
        return lineString;
    }
}
