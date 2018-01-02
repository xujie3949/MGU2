import MarkerSymbol from './MarkerSymbol';
import GeometryFactory from '../geometry/GeometryFactory';

/**
 * 正方形点符号.
 */
export default class SquareMarkerSymbol extends MarkerSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);
        /**
         * 符号类型
         * @type {String}
         */
        this.type = 'SquareMarkerSymbol';
        /**
         * 符号的大小
         * @type {Number}
         */
        this.size = 10;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('size', json.size);
    }

    toJson() {
        const json = super.toJson();

        json.size = this.size;

        return json;
    }

    /**
     * 重写父类方法,以正方形绘制点符号.
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
     * 描边填充的矩形.
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
     * 获得要绘制的几何.
     * @returns {Object}.
     */
    getContentGeometry() {
        return this.getOriginBound()
            .toLineString();
    }

    /**
     * 返回符号在局部坐标系下的bound
     * x方向为宽度，y方向为高度
     * @returns {Object} bound
     */
    getOriginBound() {
        const gf = GeometryFactory.getInstance();
        const bound = gf.createBound(null, this.size, this.size);
        return bound;
    }
}
