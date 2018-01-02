import LineSymbol from './LineSymbol';

/**
 * 简单线符号,预定的几种线符号
 */
export default class SimpleLineSymbol extends LineSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.type = 'SimpleLineSymbol';
        /**
         * 线宽度，默认值1
         * @type {number}
         */
        this.width = 1;
        /**
         * 线颜色，默认值'black'
         * @type {string}
         */
        this.color = 'black';
        /**
         * 线风格，默认值'solid'，可选值有'dash','dot','dashDot','dashDotDot'
         * @type {string}
         */
        this.style = 'solid';
        /**
         * 线条透明度，默认值1
         * @type {number}
         */
        this.opacity = 1;
        /**
         * 线条端点样式，默认值'cap'，可选值有'butt','round','square'
         * @type {string}
         */
        this.cap = 'butt';
        /**
         * 线条阴影颜色
         * @type {null}
         */
        this.shadowColor = null;
        /**
         * 线条阴影模糊距离,默认为0
         * @type {number}
         */
        this.shadowBlur = 0;
        /**
         * x轴方向阴影的位置
         * @type {number}
         */
        this.shadowOffsetX = 0;
        /**
         * x轴方向阴影的位置
         * @type {number}
         */
        this.shadowOffsetY = 0;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('width', json.width);
        this.setValue('color', json.color);
        this.setValue('style', json.style);
        this.setValue('opacity', json.opacity);
        this.setValue('cap', json.cap);
        this.setValue('shadowColor', json.shadowColor || null);
        this.setValue('shadowBlur', json.shadowBlur || 0);
        this.setValue('shadowOffsetX', json.shadowOffsetX || 0);
        this.setValue('shadowOffsetY', json.shadowOffsetY || 0);
    }

    toJson() {
        const json = super.toJson();

        json.width = this.width;
        json.color = this.color;
        json.style = this.style;
        json.opacity = this.opacity;
        json.cap = this.cap;

        return json;
    }

    /**
     * 绘制接口.
     * @param {object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * returns {undefined}
     */
    draw(ctx) {
        if (!this.geometry || !this.geometry.coordinates) {
            return;
        }

        if (this.geometry.coordinates.length < 2) {
            return;
        }

        if (!this.style) {
            return;
        }

        // 保存当前状态，方便绘制完成后恢复状态
        ctx.save();

        const dashPattern = this.styleToPattern(this.style);
        ctx.setLineDash(dashPattern);// 设置虚线样式
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.globalAlpha = this.opacity;
        ctx.lineCap = this.cap;
        if (this.shadowColor) {
            ctx.shadowColor = this.shadowColor;
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowOffsetX = this.shadowOffsetX;
            ctx.shadowOffsetY = this.shadowOffsetY;
        }

        ctx.beginPath();
        this.drawLineString(ctx, this.geometry);
        if (this.geometry.isClosed()) {
            ctx.closePath();
        }
        ctx.stroke();

        // 绘制完成后恢复到上次保存的状态，避免影响以后的绘制
        ctx.restore();
    }

    /**
     * 根据字符串style转换成绘制的各种虚线的pattern模式.
     * @param {String} style
     * @returns {Array} dashPattern
     */
    styleToPattern(style) {
        let dashPattern = [];
        switch (style) {
            case 'solid':
                dashPattern = [];
                break;
            case 'dash':
                dashPattern = [10, 5];
                break;
            case 'dot':
                dashPattern = [2, 2];
                break;
            case 'dashDot':
                dashPattern = [10, 2, 2, 2];
                break;
            case 'dashDotDot':
                dashPattern = [10, 2, 2, 2, 2, 2];
                break;
            default:
                dashPattern = [];
                break;
        }

        return dashPattern;
    }
}
