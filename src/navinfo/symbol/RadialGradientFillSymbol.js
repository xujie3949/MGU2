import FillSymbol from './FillSymbol';

/**
 * 线型(辐射)渐变填充符号,可以指定渐变方向和颜色。
 */
export default class RadialGradientFillSymbol extends FillSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);
        /**
         * 符号类型
         * @type {string}
         */
        this.type = 'RadialGradientFillSymbol';
        /**
         * 渐变的方向， 默认值'c2o'.
         * @type {string} - 可选值有两个方向c2o = center to out，o2c = out to center
         */
        this.direction = 'c2o';
        /**
         * 渐变开始点颜色
         * @type {string}
         */
        this.startColor = 'gray';
        /**
         * 渐变结束点颜色
         * @type {string}
         */
        this.endColor = 'black';

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);
        this.setValue('direction', json.direction);
        this.setValue('startColor', json.startColor);
        this.setValue('endColor', json.endColor);
    }

    toJson() {
        const json = super.toJson();
        json.direction = this.direction;
        json.startColor = this.startColor;
        json.endColor = this.endColor;
        return json;
    }

    /**
     * 通过辐射渐变样式绘制面并填充颜色.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @returns {undefined}
     */
    drawContent(ctx) {
        // 获取渐变对象
        const gradient = this.createGradient(ctx);

        // 设置绘制环境
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = gradient;

        // 绘制
        ctx.beginPath();
        this.drawLineString(ctx, this.geometry.coordinates[0]);
        ctx.fill();
    }

    /**
     * 设置渐变填充的方式,创建辐射渐变填充的CanvasGradient对象.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @returns {Object} gradient CanvasGradient对象
     */
    createGradient(ctx) {
        const bound = this.getBound();
        const width = bound.right - bound.left;
        const length = bound.bottom - bound.top;
        let radius = length > width ? length : width;
        radius /= 2;
        let startRadius = 0;
        let endRadius = 0;
        switch (this.direction) {
            case 'c2o':
                startRadius = 0;
                endRadius = radius;
                break;
            case 'o2c':
                startRadius = radius;
                endRadius = 0;
                break;
            default:
                throw new Error('径向填充方向设置错误');
        }

        const centerX = bound.left + radius;
        const centerY = bound.top + radius;
        const gradient = ctx.createRadialGradient(centerX, centerY, startRadius, centerX, centerY, endRadius);
        gradient.addColorStop(0, this.startColor);
        gradient.addColorStop(1, this.endColor);

        return gradient;
    }
}
