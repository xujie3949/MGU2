import LineSymbol from './LineSymbol';
import Matrix from '../math/Matrix';
import Template from '../geometry/Template';
import LineString from '../geometry/LineString';
import SymbolFactory from './SymbolFactory';

/**
 * 离散线符号
 */
export default class HashLineSymbol extends LineSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);
        /**
         * 重写父类属性,符号类型'HashLineSymbol'
         * @type {String} HashLineSymbol
         * */
        this.type = 'HashLineSymbol';
        /**
         * 离散符号高度
         * @type {number}
         */
        this.hashHeight = 10;
        /**
         * 离散符号偏移距离
         * @type {number}
         */
        this.hashOffset = 0;
        /**
         * 离散符号旋转角度
         * @type {number}
         */
        this.hashAngle = -90;
        /**
         * 离散线符号,可以接受任意线符号
         * @type {null}
         */
        this.hashLine = null;
        /**
         * 线模式
         * @type {number[]}
         */
        this.pattern = [2, 5];
        /**
         * 起始位置
         * @type {number}
         */
        this.startOffset = 0;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('hashHeight', json.hashHeight);
        this.setValue('hashOffset', json.hashOffset);
        this.setValue('hashAngle', json.hashAngle);
        this.setValue('pattern', json.pattern);
        this.setValue('startOffset', json.startOffset);
        const symbolFactory = SymbolFactory.getInstance();
        if (json.hashLine) {
            this.hashLine = symbolFactory.createSymbol(json.hashLine);
        }
    }

    toJson() {
        const json = super.toJson();

        json.hashHeight = this.hashHeight;
        json.hashOffset = this.hashOffset;
        json.hashAngle = this.hashAngle;
        json.pattern = this.pattern;
        json.startOffset = this.startOffset;
        if (this.hashLine) {
            json.hashLine = this.hashLine.toJson();
        }

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

        if (!this.hashLine) {
            return;
        }

        if (!this.pattern) {
            return;
        }

        const template = new Template();
        template.startOffset = this.startOffset;
        template.pattern = this.pattern;
        template.lineString = this.geometry;

        const segments = template.getSegments();

        for (let i = 0; i < segments.length; ++i) {
            this.drawSegment(ctx, segments[i], template);
        }
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
            const mark = marks[i];

            // 以mark的前两个点构造向量
            let vector = mark.coordinates[1].minus(mark.coordinates[0]);
            vector.normalize();

            // 将向量顺时针旋转指定角度
            let matrix = new Matrix();
            matrix = matrix.makeRotate(this.hashAngle);
            vector = vector.crossMatrix(matrix);

            // hash的偏移向量
            const hashOffsetVector = vector.multiNumber(this.hashOffset);

            // 单位向量乘以hash长度
            vector = vector.multiNumber(this.hashHeight);

            const startPoint = mark.coordinates[0].plusVector(hashOffsetVector);
            const endPoint = startPoint.plusVector(vector);

            // 用计算出的起点和终点构造hash几何
            const hashGeo = new LineString();
            hashGeo.coordinates.push(startPoint);
            hashGeo.coordinates.push(endPoint);

            // 设置hashSymbol的geometry并调用draw方法
            this.hashLine.geometry = hashGeo;
            this.hashLine.draw(ctx);
        }
    }
}
