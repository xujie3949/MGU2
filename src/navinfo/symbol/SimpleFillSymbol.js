import FillSymbol from './FillSymbol';

/**
 * 简单面符号,只支持纯色填充.
 */
export default class SimpleFillSymbol extends FillSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.type = 'SimpleFillSymbol';

        this.color = 'black';

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);
        this.setValue('color', json.color);
    }

    toJson() {
        const json = super.toJson();
        json.color = this.color;
        return json;
    }

    /**
     * 通过单一色绘制面并填充颜色.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @returns {undefined}
     */
    drawContent(ctx) {
        // 设置绘制环境
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;

        // 绘制
        ctx.beginPath();
        this.drawLineString(ctx, this.geometry.coordinates[0]);
        ctx.fill();
    }
}
