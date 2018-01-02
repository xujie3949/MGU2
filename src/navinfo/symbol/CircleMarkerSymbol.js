import MarkerSymbol from './MarkerSymbol';
import GeometryFactory from '../geometry/GeometryFactory';

/**
 * 圆形点符号.
 */
export default class CircleMarkerSymbol extends MarkerSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);
        /**
         * 符号类型
         * @type {string}
         */
        this.type = 'CircleMarkerSymbol';
        /**
         * 圆半径
         * @type {number}
         */
        this.radius = 10;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('radius', json.radius);
    }

    toJson() {
        const json = super.toJson();

        json.radius = this.radius;

        return json;
    }

    /**
     * 重写父类方法,以圆圈绘制点符号.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawContent(ctx) {
        // 设置绘制环境
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;

        // 绘制
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    /**
     * 描边填充的圆.
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
