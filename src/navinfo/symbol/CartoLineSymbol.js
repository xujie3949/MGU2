import LineSymbol from './LineSymbol';
import Template from '../geometry/Template';

/**
 * 自定义线符号,可以通过指定模式来自定义线样式,从LineSymbol类派生.
 */
export default class CartoLineSymbol extends LineSymbol {
    constructor(options) {
        // 执行父类,初始化继承的属性
        super(options);
        /**
         * 重写父类属性,符号类型'CartoLineSymbol'
         * @type {String} CartoLineSymbol
         * */
        this.type = 'CartoLineSymbol';
        /**
         * 线宽度,默认值1
         * @type {Number}
         * */
        this.width = 1;
        /**
         * 线颜色,默认值'black'
         * @type {string}
         */
        this.color = 'black';
        /**
         * 线条透明度,默认值1
         * @type {Number}
         * */
        this.opacity = 1;
        /**
         * 线条端点样式,默认值'cap',可选值有'butt','round','square''
         * @type {string}
         */
        this.cap = 'butt';
        /**
         * 线模式,详见template类
         * @type {Array}
         */
        this.pattern = [];
        /**
         * 起始位置
         * @type {number}
         */
        this.startOffset = 0;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('width', json.width);
        this.setValue('color', json.color);
        this.setValue('opacity', json.opacity);
        this.setValue('cap', json.cap);
        this.setValue('pattern', json.pattern);
        this.setValue('startOffset', json.startOffset);
    }


    toJson() {
        const json = super.toJson();

        json.width = this.width;
        json.color = this.color;
        json.opacity = this.opacity;
        json.cap = this.cap;
        json.pattern = this.pattern;
        json.startOffset = this.startOffset;

        return json;
    }

    /**
     * 在设备上下文中绘制符号
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

        if (!this.pattern) {
            return;
        }

        // 保存当前状态，方便绘制完成后恢复状态
        ctx.save();

        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.globalAlpha = this.opacity;
        ctx.lineCap = this.cap;

        const template = new Template();
        template.startOffset = this.startOffset;
        template.pattern = this.pattern;
        template.lineString = this.geometry;
        const segments = template.getSegments();

        ctx.beginPath();
        for (let i = 0; i < segments.length; ++i) {
            this.drawSegment(ctx, segments[i], template);
        }
        if (this.geometry.isClosed()) {
            ctx.closePath();
        }
        ctx.stroke();

        // 绘制完成后恢复到上次保存的状态，避免影响以后的绘制
        ctx.restore();
    }

    /**
     * 绘制一个小段,绘制前先将线按照template的pattern属性切成N段,然后绘制每一段
     * @param {object} ctx - 设备上下文
     * @param {object} segment
     * @param [template]{@link Template} template - template对象
     * @return {undefined}
     */
    drawSegment(ctx, segment, template) {
        const marks = template.getMarks(segment);
        for (let i = 0; i < marks.length; ++i) {
            this.drawLineString(ctx, marks[i]);
        }
    }
}
