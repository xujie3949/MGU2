import Matrix from '../math/Matrix';
import EventController from '../common/EventController';

/**
 * 几何坐标变换类,可以通过此类将点线面的几何进行平移,缩放,旋转,
 * MarkerSymbol类使用此类对绘制内容进行缩放,平移旋转
 */
class Transformation {
    /**
     * 初始化matrix和stack属性.
     */
    constructor() {
        // 基本矩阵,被用来构造平移,旋转,缩放矩阵
        this.matrix = new Matrix();
        this.finalMatrix = this.matrix;
        // 变换矩阵组成的数组,默认值[]
        this.stack = [];

        this._eventController = EventController.getInstance();
        this._eventController.once('DestroySingleton', () => this.destroy());
    }

    /**
     * 清空变换矩阵数组.
     */
    resetTransform() {
        this.finalMatrix = this.matrix;
    }

    /**
     * 将几何按照变换矩阵进行坐标变换,geometry支持Point,LineString,Polygon
     * @param {object} geometry - 传入的要进行转换的几何（geoJson）
     * @returns {object} - 返回转换后的几何（geoJson）
     */
    transform(geometry) {
        let res = geometry;
        const type = res.type;
        switch (type) {
            case 'Point':
                res = res.crossMatrix(this.finalMatrix);
                return res;
            case 'LineString':
                res.coordinates = res.coordinates.map(point => this.transform(point));
                return res;
            case 'Polygon':
                res.coordinates = res.coordinates.map(
                    lineString => lineString.coordinates.map(point => this.transform(point)),
                );
                return res;
            default:
                throw new Error(`不支持的类型:${type}`);
        }
    }

    /**
     * 平移变换方法.
     * @param {Number} x - x轴方向平移距离
     * @param {Number} y - y轴方向平移距离
     */
    translate(x, y) {
        this.finalMatrix = this.matrix.makeTranslate(x, y).cross(this.finalMatrix);
    }

    /**
     * 旋转变换方法.
     * @param {Number} a - 旋转角度，单位度
     */
    rotate(a) {
        this.finalMatrix = this.matrix.makeRotate(a).cross(this.finalMatrix);
    }

    /**
     * 缩放变换方法.
     * @param {Number} x - x轴方向缩放比例
     * @param {Number} y - y轴方向缩放比例
     */
    scale(x, y) {
        this.finalMatrix = this.matrix.makeScale(x, y).cross(this.finalMatrix);
    }

    /**
     * 将当前的变换矩阵压入栈.
     */
    save() {
        this.stack.push(this.finalMatrix);
    }

    /**
     * 弹出栈顶的变换矩阵.
     */
    restore() {
        if (this.stack.length > 0) {
            this.finalMatrix = this.stack.pop();
            return;
        }

        this.finalMatrix = this.matrix;
    }

    /**
     * 销毁几何坐标变换实例.
     */
    destroy() {
        Transformation.instance = null;
    }

    /**
     * 获取几何坐标变换单例的静态方法.
     * @example
     * const transformation = Transformation.getInstance();
     * @returns {Object} 返回Transformation单例对象.
     */
    static getInstance() {
        if (!Transformation.instance) {
            Transformation.instance =
                new Transformation();
        }
        return Transformation.instance;
    }
}

Transformation.instance = null;

export default Transformation;
