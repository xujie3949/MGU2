import LineSymbol from './LineSymbol';
import Template from '../geometry/Template';
import Vector from '../math/Vector';
import SymbolFactory from './SymbolFactory';

/**
 * 由点符号构成的线符号,每隔指定间距绘制一遍点符号
 */
export default class MarkerLineSymbol extends LineSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.type = 'MarkerLineSymbol';

        this.pattern = [];
        this.startOffset = 0;
        this.direction = 's2e';
        this.marker = null;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('pattern', json.pattern);
        this.setValue('startOffset', json.startOffset);
        this.setValue('direction', json.direction);
        const symbolFactory = SymbolFactory.getInstance();
        if (json.marker) {
            this.marker = symbolFactory.createSymbol(json.marker);
        }
    }

    toJson() {
        const json = super.toJson();

        json.pattern = this.pattern;
        json.startOffset = this.startOffset;
        json.direction = this.direction;
        if (this.marker) {
            json.marker = this.marker.toJson();
        }

        return json;
    }

    /**
     * 绘制接口.
     * @param {object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @returns {undefined}
     */
    draw(ctx) {
        if (!this.geometry || !this.geometry.coordinates) {
            return;
        }

        if (this.geometry.coordinates.length < 2) {
            return;
        }

        if (!this.marker) {
            return;
        }

        if (!this.pattern) {
            return;
        }

        const template = new Template();
        template.startOffset = this.startOffset;
        template.pattern = this.pattern;
        if (this.direction === 's2e') {
            template.lineString = this.geometry;
        } else {
            template.lineString = this.geometry.reverse();
        }
        const segments = template.getSegments();

        for (let i = 0; i < segments.length; ++i) {
            this.drawSegment(ctx, segments[i], template);
        }
    }

    /**
     * 绘制一个小段,绘制前先将线按照template的pattern属性切成N段,然后绘制每一段.
     * @param {object} ctx - 设备上下文
     * @param {object} segment
     * @param [template]{@link Template} template - template对象
     * @return {undefined}
     */
    drawSegment(ctx, segment, template) {
        // 在每段mark的第一个坐标处绘制marker，方向取当前形状边方向
        const marks = template.getMarks(segment);
        for (let i = 0; i < marks.length; ++i) {
            const mark = marks[i];
            const vY = new Vector(0, -1);
            const vN = mark.coordinates[1].minus(mark.coordinates[0]);

            let angle = vY.angleTo(vN);
            const signal = vY.cross(vN);

            if (signal < 0) {
                angle = -angle;
            }

            this.drawMarker(ctx, angle, mark);
        }
    }

    /**
     * 私有方法.
     * @param {object} ctx - 设备上下文
     * @param {Number} angle - marker符号的角度
     * @param [marker]{@link MarkerSymbol} mark - marker对象
     */
    drawMarker(ctx, angle, mark) {
        this.marker.angle = angle;
        this.marker.geometry = mark.coordinates[0];
        this.marker.draw(ctx);
    }
}
