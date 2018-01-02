/**
 * 该类代表向量,适合做平移,旋转,计算夹角等运算.
 */
export default class Vector {
    /**
     * Vector,x, y如果为undefined,则会使用默认值0.
     * @param {Number}[x=0]
     * @param {Number}[y=0]
     */
    constructor(x, y) {
        if (x === undefined) {
            this.x = 0;
        } else {
            this.x = x;
        }

        if (y === undefined) {
            this.y = 0;
        } else {
            this.y = y;
        }
    }

    /**
     * 向量减法,返回结果为向量.
     * @param v
     * @return {object} 返回Vector实例对象
     */
    minus(v) {
        const x = this.x - v.x;
        const y = this.y - v.y;
        return new Vector(x, y);
    }

    /**
     * 向量加法返回结果为向量
     * @param v
     * @return {object} 返回Vector实例对象
     */
    plus(v) {
        const x = this.x + v.x;
        const y = this.y + v.y;
        return new Vector(x, y);
    }

    /**
     * 向量和数字的乘法(xy分别乘以数字)返回结果为向量
     * @param {Number} n
     * @return {object} 返回Vector实例对象
     */
    multiNumber(n) {
        const x = this.x * n;
        const y = this.y * n;
        return new Vector(x, y);
    }

    /**
     * 向量和数字的除法返回结果为向量
     * @param {Number} n
     * @return {object} 返回Vector实例对象
     */
    dividNumber(n) {
        const x = this.x / n;
        const y = this.y / n;
        return new Vector(x, y);
    }

    /**
     * 向量和向量的叉乘
     * 返回结果为叉乘结果的模长
     * 符号表示方向，符号为正表示与Z同向，否则反向
     * @param v
     * @return Number
     */
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    /**
     * 向量和向量的点积
     * @param v
     * @return {Number} 返回结果为数字
     */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * 向量模长的平方
     * @return {Number} 返回结果为数字
     */
    length2() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * 向量模长
     * @return {Number} 返回结果为数字.
     */
    length() {
        return Math.sqrt(this.length2());
    }

    /**
     * 单位化向量.
     */
    normalize() {
        const length = this.length();
        this.x = this.x / length;
        this.y = this.y / length;
    }

    /**
     * 向量和矩阵的叉乘
     * 返回结果为向量
     * 主要用于对向量进行平移，旋转，缩放等操作
     * @param {object} m
     * @return {object} newVec  Vector实例对象
     */
    crossMatrix(m) {
        const tmpVec = [this.x, this.y, 1];
        const newVec = new Vector(0, 0);
        newVec.x = tmpVec[0] * m.data[0][0] + tmpVec[1] * m.data[1][0] + tmpVec[2] * m.data[2][0];
        newVec.y = tmpVec[0] * m.data[0][1] + tmpVec[1] * m.data[1][1] + tmpVec[2] * m.data[2][1];

        return newVec;
    }

    /**
     * 求向量之间的夹角
     * @param v
     * @return {Number} 返回结果为角度，单位度
     */
    angleTo(v) {
        const cos = this.dot(v) / (this.length() * v.length());
        const arcA = Math.acos(cos);

        return arcA * 180 / Math.PI;
    }
}
