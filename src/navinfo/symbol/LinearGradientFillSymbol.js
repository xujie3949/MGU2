import FillSymbol from './FillSymbol';

/**
 * 线型渐变填充符号,可以指定渐变方向和颜色.
 */
export default class LinearGradientFillSymbol extends FillSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);
        /**
         * 符号类型
         * @type {string}
         */
        this.type = 'LinearGradientFillSymbol';
        /**
         * 渐变填充方向
         * @type {string}
         */
        this.direction = 't2b';
        /**
         * 渐变起始颜色
         * @type {string}
         */
        this.startColor = 'gray';
        /**
         * 渐变终止颜色
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
     * 通过渐变色绘制面并填充颜色,创建渐变填充的CanvasGradient对象.
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
     * 设置渐变填充的方式.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @returns {Object} gradient CanvasGradient对象
     */
    createGradient(ctx) {
        const bound = this.getBound();
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        switch (this.direction) {
            case 't2b':
                startX = 0;
                startY = bound.top;
                endX = 0;
                endY = bound.bottom;
                break;
            case 'b2t':
                startX = 0;
                startY = bound.bottom;
                endX = 0;
                endY = bound.top;
                break;
            case 'l2r':
                startX = 0;
                startY = bound.left;
                endX = 0;
                endY = bound.right;
                break;
            case 'r2l':
                startX = 0;
                startY = bound.right;
                endX = 0;
                endY = bound.left;
                break;
            case 'lt2rb':
                startX = bound.left;
                startY = bound.top;
                endX = bound.right;
                endY = bound.bottom;
                break;
            case 'rb2lt':
                startX = bound.right;
                startY = bound.bottom;
                endX = bound.left;
                endY = bound.top;
                break;
            case 'lb2rt':
                startX = bound.left;
                startY = bound.bottom;
                endX = bound.right;
                endY = bound.top;
                break;
            case 'rt2lb':
                startX = bound.right;
                startY = bound.top;
                endX = bound.left;
                endY = bound.bottom;
                break;
            default:
                throw new Error('线性填充方向设置错误');
        }

        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, this.startColor);
        gradient.addColorStop(1, this.endColor);

        return gradient;
    }
}
