import MarkerSymbol from './MarkerSymbol';
import GeometryFactory from '../geometry/GeometryFactory';

/**
 * 文字点符号类.
 */
export default class TextMarkerSymbol extends MarkerSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.type = 'TextMarkerSymbol';

        this.text = '';
        this.font = '微软雅黑';
        this.size = 10;
        this.align = 'center';
        this.baseline = 'middle';
        this.direction = 'ltr';

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('text', json.text);
        this.setValue('font', json.font);
        this.setValue('size', json.size);
        this.setValue('align', json.align);
        this.setValue('baseline', json.baseline);
        this.setValue('direction', json.direction);
    }

    toJson() {
        const json = super.toJson();

        json.text = this.text;
        json.font = this.font;
        json.size = this.size;
        json.align = this.align;
        json.baseline = this.baseline;
        json.direction = this.direction;

        return json;
    }

    draw(ctx) {
        if (this.text === null || this.text === undefined || this.text.length === 0) {
            return;
        }

        super.draw(ctx);
    }

    /**
     * 重写父类方法,以文字绘制点符号.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawContent(ctx) {
        // 设置绘制环境
        ctx.font = `${this.size}px ${this.font}`;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;
        ctx.direction = this.direction;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;

        // 绘制
        ctx.fillText(this.text, 0, 0);
    }

    /**
     * measureText的兼容版本
     * 如果measureText返回的只有width属性，把字符近似看做一个正方形.
     * @returns {Object}。
     */
    measureText() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.save();

        ctx.font = `${this.size}px ${this.font}`;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;
        ctx.direction = this.direction;

        const m = ctx.measureText(this.text);
        const width = m.width / 2;
        const height = this.size / 2;
        const newM = {
            width: m.width,
            actualBoundingBoxLeft: m.actualBoundingBoxLeft !== undefined ?
                m.actualBoundingBoxLeft : width,
            actualBoundingBoxRight: m.actualBoundingBoxRight !== undefined ?
                m.actualBoundingBoxRight : width,
            actualBoundingBoxAscent: m.actualBoundingBoxAscent !== undefined ?
                m.actualBoundingBoxAscent : height,
            actualBoundingBoxDescent: m.actualBoundingBoxDescent !== undefined ?
                m.actualBoundingBoxDescent : height,
        };

        ctx.restore();

        return newM;
    }

    /**
     * 返回符号在局部坐标系下的bound
     * x方向为宽度，y方向为高度
     * @returns {Object} bound
     */
    getOriginBound() {
        const m = this.measureText();
        const width = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
        const height = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        const gf = GeometryFactory.getInstance();
        const bound = gf.createBound(null, width, height);
        return bound;
    }
}
