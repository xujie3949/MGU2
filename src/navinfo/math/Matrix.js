import Vector from './Vector';

/**
 * 代表矩阵,处理旋转,平移,缩放
 */
export default class Matrix {
    /**
     * 初始化矩阵为默认值.
     */
    constructor() {
        this.data = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }

    /**
     * 当前矩阵叉乘另一个矩阵,结果为矩阵.
     * @param {object} other - 传入的矩阵对象
     * @returns {object} m - 一个新矩阵
     */
    cross(other) {
        const m = new Matrix();

        m.data[0][0] = (this.data[0][0] * other.data[0][0]) +
                       (this.data[0][1] * other.data[1][0]) +
                       (this.data[0][2] * other.data[2][0]);
        m.data[0][1] = (this.data[0][0] * other.data[0][1]) +
                       (this.data[0][1] * other.data[1][1]) +
                       (this.data[0][2] * other.data[2][1]);
        m.data[0][2] = (this.data[0][0] * other.data[0][2]) +
                       (this.data[0][1] * other.data[1][2]) +
                       (this.data[0][2] * other.data[2][2]);

        m.data[1][0] = (this.data[1][0] * other.data[0][0]) +
                       (this.data[1][1] * other.data[1][0]) +
                       (this.data[1][2] * other.data[2][0]);
        m.data[1][1] = (this.data[1][0] * other.data[0][1]) +
                       (this.data[1][1] * other.data[1][1]) +
                       (this.data[1][2] * other.data[2][1]);
        m.data[1][2] = (this.data[1][0] * other.data[0][2]) +
                       (this.data[1][1] * other.data[1][2]) +
                       (this.data[1][2] * other.data[2][2]);

        m.data[2][0] = (this.data[2][0] * other.data[0][0]) +
                       (this.data[2][1] * other.data[1][0]) +
                       (this.data[2][2] * other.data[2][0]);
        m.data[2][1] = (this.data[2][0] * other.data[0][1]) +
                       (this.data[2][1] * other.data[1][1]) +
                       (this.data[2][2] * other.data[2][1]);
        m.data[2][2] = (this.data[2][0] * other.data[0][2]) +
                       (this.data[2][1] * other.data[1][2]) +
                       (this.data[2][2] * other.data[2][2]);

        return m;
    }

    /**
     * 构造一个平移矩阵.
     * @param {Number} x
     * @param {Number} y
     * @returns {object} m - 一个新矩阵
     */
    makeTranslate(x, y) {
        const m = new Matrix();

        m.data[0][0] = 1;
        m.data[0][1] = 0;
        m.data[0][2] = 0;

        m.data[1][0] = 0;
        m.data[1][1] = 1;
        m.data[1][2] = 0;

        m.data[2][0] = x;
        m.data[2][1] = y;
        m.data[2][2] = 1;

        return m;
    }

    /**
     * 构造一个旋转矩阵.
     * @param {Number} a - 单位为度
     * @returns {object} m - 一个新矩阵
     */
    makeRotate(a) {
        const arca = (Math.PI / 180) * a;
        const m = new Matrix();

        m.data[0][0] = Math.cos(arca);
        m.data[0][1] = Math.sin(arca);
        m.data[0][2] = 0;

        m.data[1][0] = -Math.sin(arca);
        m.data[1][1] = Math.cos(arca);
        m.data[1][2] = 0;

        m.data[2][0] = 0;
        m.data[2][1] = 0;
        m.data[2][2] = 1;

        return m;
    }

    /**
     * 构造一个缩放矩阵.
     * @param {Number} sx - sx表示x轴缩放因子
     * @param {Number} sy - sy表示y轴缩放因子
     * @returns {object} m - 一个新矩阵
     */
    makeScale(sx, sy) {
        const m = new Matrix();

        m.data[0][0] = sx;
        m.data[0][1] = 0;
        m.data[0][2] = 0;

        m.data[1][0] = 0;
        m.data[1][1] = sy;
        m.data[1][2] = 0;

        m.data[2][0] = 0;
        m.data[2][1] = 0;
        m.data[2][2] = 1;

        return m;
    }

    /**
     * 构造一个从y轴负方向旋转到Vector方向的矩阵.
     * @param {object} v - vector向量
     * @returns {Object}
     */
    makeRotateToVector(v) {
        const vY = new Vector(0, -1);
        let angle = vY.angleTo(v);
        const signal = vY.cross(v);

        if (signal < 0) {
            angle = -angle;
        }

        return this.makeRotate(angle);
    }
}
