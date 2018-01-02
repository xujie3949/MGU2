import FillSymbol from './FillSymbol';

/**
 * 自定义填充符号,可以通过svg的path语法自定义填充的样式.
 */
export default class PatternFillSymbol extends FillSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);
        /**
         * 符号类型
         * @type {string}
         */
        this.type = 'PatternFillSymbol';
        /**
         * 填充单元的宽度
         * @type {Number}
         */
        this.patternWidth = 10;
        /**
         * 填充单元的高度
         * @type {Number}
         */
        this.patternHeight = 10;
        /**
         * 填充单元的图案数据,注意要使用大写指令,大写指令表示绝对定位.
         * @type {string}
         */
        this.patternPath = '';
        /**
         * 填充单元图案的颜色
         * @type {string}
         */
        this.patternColor = 'black';
        /**
         * 填充单元虚线数组,空数组表示使用实线
         * @type {string}
         */
        this.patternLineDash = [];
        /**
         * 填充单元图案线条宽度
         * @type {Number}
         */
        this.patternLineWidth = 1;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);
        this.setValue('patternWidth', json.patternWidth);
        this.setValue('patternHeight', json.patternHeight);
        this.setValue('patternPath', json.patternPath);
        this.setValue('patternColor', json.patternColor);
        this.setValue('patternLineDash', json.patternLineDash);
        this.setValue('patternLineWidth', json.patternLineWidth);
    }

    toJson() {
        const json = super.toJson();
        json.patternWidth = this.patternWidth;
        json.patternHeight = this.patternHeight;
        json.patternPath = this.patternPath;
        json.patternColor = this.patternColor;
        json.patternLineDash = this.patternLineDash;
        json.patternLineWidth = this.patternLineWidth;
        return json;
    }

    /**
     * 重写父类绘制符号方法,使用自定义填充样式.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawContent(ctx) {
        // 获取填充的pattern
        const pattern = this.getPattern(ctx);

        // 设置绘制环境
        ctx.fillStyle = pattern;
        ctx.globalAlpha = this.opacity;

        // 绘制
        ctx.beginPath();
        this.drawLineString(ctx, this.geometry.coordinates[0]);
        ctx.fill();
    }

    /**
     * 设定自定义填充模式.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @returns {CanvasPattern} pattern
     */
    getPattern(ctx) {
        const canvas = document.createElement('canvas');
        canvas.width = this.patternWidth;
        canvas.height = this.patternHeight;
        const ctx1 = canvas.getContext('2d');
        ctx1.setLineDash(this.patternLineDash);
        ctx1.lineWidth = this.patternLineWidth;
        ctx1.strokeStyle = this.patternColor;

        // 使用白色作为背景色
        ctx1.fillStyle = 'white';
        ctx1.fillRect(0, 0, this.patternWidth, this.patternHeight);

        const path = new Path2D(this.patternPath);
        ctx1.stroke(path);

        const pattern = ctx.createPattern(canvas, 'repeat');

        return pattern;
    }
}
