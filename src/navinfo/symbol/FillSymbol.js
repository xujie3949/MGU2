import Symbol from './Symbol';
import SymbolFactory from './SymbolFactory';
import GeometryFactory from '../geometry/GeometryFactory';

/**
 * 面符号基类,所有面符号均从此类派生.
 */
export default class FillSymbol extends Symbol {
    /**
     * 重写父类初始化方法
     * @param {Object} options - 符号设置的属性
     * @returns {undefined}
     */
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.opacity = 1;
        this.outLine = null;
    }

    /**
     * 重写父类方法,设置符号属性.
     * @param {Object} json - 符号设置的属性
     * @returns {undefined}
     */
    fromJson(json) {
        super.fromJson(json);

        this.setValue('opacity', json.opacity);
        const symbolFactory = SymbolFactory.getInstance();
        if (json.outLine) {
            this.outLine = symbolFactory.createSymbol(json.outLine);
        }
    }

    /**
     * 重写父类方法,导出符号属性.
     * @returns {Object} json - 符号的属性
     */
    toJson() {
        const json = super.toJson();

        json.opacity = this.opacity;
        if (this.outLine) {
            json.outLine = this.outLine.toJson();
        }
        return json;
    }

    /**
     * 绘制接口.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @returns {undefined}
     */
    draw(ctx) {
        if (!this.geometry || !this.geometry.coordinates) {
            return;
        }

        // 至少需要有一条闭合线
        if (this.geometry.coordinates.length === 0) {
            return;
        }

        // 面至少需要四个点
        if (this.geometry.coordinates[0].length < 4) {
            return;
        }

        // 保存当前状态，方便绘制完成后恢复状态
        ctx.save();

        this.drawSymbol(ctx);

        // 绘制完成后恢复到上次保存的状态，避免影响以后的绘制
        ctx.restore();
    }

    /**
     * 实际的绘制符号方法.
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
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawContent(ctx) {
    }

    /**
     * 绘制面的轮廓.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawOutLine(ctx) {
        this.outLine.geometry = this.geometry.coordinates[0];
        this.outLine.draw(ctx);
    }

    /**
     * 获得面符号的外包框.
     * @returns {Object} bound - 包含面的最小范围对象
     */
    getBound() {
        const gf = GeometryFactory.getInstance();

        const bound = this.geometry.getBound();

        return bound;
    }
}
