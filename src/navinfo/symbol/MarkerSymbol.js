import Symbol from './Symbol';
import Transformation from '../geometry/Transformation';
import GeometryFactory from '../geometry/GeometryFactory';

/**
 * 点符号基类,所有点符号均从此类派生,支持符号旋转和平移,先旋转后平移.
 */
export default class MarkerSymbol extends Symbol {
    /**
     * 重写父类初始化方法
     * @param {Object} options - 符号设置的属性
     * @returns {undefined}
     */
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.color = 'black';
        this.opacity = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.angle = 0;
        this.outLine = null;

        // 默认重置变换矩阵
        this.resetTransform = true;

        this.transformation = Transformation.getInstance();
    }

    /**
     * 重写父类方法,设置符号属性.
     * @param {Object} json - 符号设置的属性
     * @returns {undefined}
     */
    fromJson(json) {
        super.fromJson(json);

        this.setValue('color', json.color);
        this.setValue('opacity', json.opacity);
        this.setValue('offsetX', json.offsetX);
        this.setValue('offsetY', json.offsetY);
        this.setValue('angle', json.angle);
        this.setValue('outLine', json.outLine);
    }

    /**
     * 重写父类方法,导出符号属性.
     * @returns {Object} json - 符号的属性
     */
    toJson() {
        const json = super.toJson();

        json.color = this.color;
        json.opacity = this.opacity;
        json.offsetX = this.offsetX;
        json.offsetY = this.offsetY;
        json.angle = this.angle;
        json.outLine = this.outLine;
        return json;
    }

    /**
     * 覆盖父类方法，绘制符号
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @returns {undefined}
     */
    draw(ctx) {
        if (!this.geometry) {
            return;
        }

        // 保存当前状态，方便绘制完成后恢复状态
        this.save(ctx);

        this.setTransformation(ctx);

        this.drawSymbol(ctx);

        // 绘制完成后恢复到上次保存的状态，避免影响以后的绘制
        this.restore(ctx);
    }

    /**
     * 设置变换矩阵.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    setTransformation(ctx) {
        if (this.resetTransform) {
            this.transformation.resetTransform();
            ctx.resetTransform();
        }

        this.transformation.translate(this.geometry.x, this.geometry.y);
        this.transformation.translate(this.offsetX, this.offsetY);
        this.transformation.rotate(this.angle);

        ctx.translate(this.geometry.x, this.geometry.y);
        ctx.translate(this.offsetX, this.offsetY);
        ctx.rotate(this.angle * Math.PI / 180);
    }

    /**
     * 保存绘制环境状态.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    save(ctx) {
        this.transformation.save();
        ctx.save();
    }

    /**
     * 恢复绘制环境状态.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    restore(ctx) {
        this.transformation.restore();
        ctx.restore();
    }

    /**
     * 绘制符号,先绘制符号内容，再绘制符号轮廓.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawSymbol(ctx) {
        // 绘制符号内容
        this.drawContent(ctx);

        // 绘制符号轮廓线
        if (this.outLine) {
            this.drawOutLine(ctx);
        }
    }

    /**
     * 绘制符号内容
     * @abstract
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawContent(ctx) {
        
    }

    /**
     * 绘制符号轮廓.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawOutLine(ctx) {
        // 设置绘制环境
        ctx.strokeStyle = this.outLine.color;
        ctx.lineWidth = this.outLine.width;

        // 获取绘制内容
        const geometry = this.getOutLineGeometry();

        ctx.beginPath();

        // 绘制
        this.drawLineString(ctx, geometry);
        ctx.closePath();

        ctx.stroke();
    }

    /**
     * 创建符号内容几何.
     * @abstract
     * @returns {Object} null
     */
    getContentGeometry() {
        return null;
    }

    /**
     * 返回符号轮廓线.
     * @returns {String} lineString
     */
    getOutLineGeometry() {
        const gf = GeometryFactory.getInstance();

        // 构造符号外包框
        const bound = this.getOriginBound();
        const lineString = bound.toLineString();

        return lineString;
    }

    /**
     * 返回符号在局部坐标系下的bound
     * x方向为宽度，y方向为高度.
     * @returns {Object}.
     */
    getOriginBound() {
        return null;
    }

    /**
     * 返回符号旋转，平移后的外包框.
     * @returns {Object} bound
     */
    getBound() {
        const gf = GeometryFactory.getInstance();

        // 构造符号外包框
        const originBound = this.getOriginBound();
        const lineString = originBound.toLineString();

        // 转换外包框坐标
        const geomtry = this.transformation.transform(lineString);

        // 获取转换后外包框
        const bound = geomtry.getBound();

        return bound;
    }
}
