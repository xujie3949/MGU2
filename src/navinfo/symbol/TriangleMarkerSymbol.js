import MarkerSymbol from './MarkerSymbol';
import Vector from '../math/Vector';
import Matrix from '../math/Matrix';
import Point from '../geometry/Point';
import LineString from '../geometry/LineString';
import GeometryFactory from '../geometry/GeometryFactory';

/**
 * 三角形点符号,可以设置尾部凹陷变成箭头符号.
 */
export default class TriangleMarkerSymbol extends MarkerSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.type = 'TriangleMarkerSymbol';

        this.width = 10;
        this.height = 20;
        // 箭头尾部凹陷的长度
        this.sunken = 0;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('width', json.width);
        this.setValue('height', json.height);
        this.setValue('sunken', json.sunken);
    }

    toJson() {
        const json = super.toJson();

        json.width = this.width;
        json.height = this.height;
        json.sunken = this.sunken;

        return json;
    }

    /**
     * 重写父类方法,以三角绘制点符号.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawContent(ctx) {
        // 设置绘制环境
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;

        // 获取绘制内容
        const geometry = this.getContentGeometry();

        ctx.beginPath();

        // 绘制
        this.drawLineString(ctx, geometry);
        ctx.closePath();

        ctx.fill();
    }

    /**
     * 描边填充的三角形.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawOutLine(ctx) {
        // 设置绘制环境
        ctx.lineWidth = this.outLine.width;
        ctx.strokeStyle = this.outLine.color;

        // 绘制
        ctx.stroke();
    }

    /**
     * 获得三角形的几何.
     * @returns {Object} geometry.
     */
    getContentGeometry() {
        // 构造箭头形状
        const fPoint = new Point(0, -this.height / 2);
        const vY = new Vector(0, 1);
        const matrix = new Matrix();

        // 将y轴正方向单位向量分别向左右旋转一个角度得到左右两边的单位向量vL，vR
        const angle = Math.atan(this.width / 2 / this.height) * 180 / Math.PI;
        let vL = vY.crossMatrix(matrix.makeRotate(-angle));
        let vR = vY.crossMatrix(matrix.makeRotate(angle));

        // vL，vR分别乘以模长度
        const triangleLength = Math.sqrt(this.width / 2 * this.width / 2 + this.height * this.height);
        vL = vL.multiNumber(triangleLength);
        vR = vR.multiNumber(triangleLength);

        // 起点加上vL，vR得到左右两个点
        const lPoint = fPoint.plusVector(vL);
        const rPoint = fPoint.plusVector(vR);

        // 处理尾部凹陷，凹陷长度必须在0到length之间
        // 如果超出这个范围则当成无尾部凹陷处理
        let remainder = this.height - this.sunken;
        if (this.sunken < 0 || this.sunken > this.height) {
            remainder = this.height;
        }

        // 起点加上尾部向量得到尾部点
        const vC = vY.multiNumber(remainder);
        const cPoint = fPoint.plusVector(vC);

        // 用顶点，左右点，尾部点构造几何
        const geometry = new LineString();
        geometry.coordinates.push(fPoint);
        geometry.coordinates.push(lPoint);
        geometry.coordinates.push(cPoint);
        geometry.coordinates.push(rPoint);
        geometry.coordinates.push(fPoint);

        return geometry;
    }

    /**
     * 返回符号在局部坐标系下的bound
     * x方向为宽度，y方向为高度
     * @returns {Object} bound
     */
    getOriginBound() {
        const gf = GeometryFactory.getInstance();
        const bound = gf.createBound(null, this.width, this.height);
        return bound;
    }
}
