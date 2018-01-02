import MarkerSymbol from './MarkerSymbol';
import SymbolFactory from './SymbolFactory';
import Bound from '../geometry/Bound';
import Point from '../geometry/Point';

/**
 * 复合点符号,支持将任意类型的点符号进行组合.
 */
export default class CompositeMarkerSymbol extends MarkerSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.type = 'CompositeMarkerSymbol';

        this.symbols = [];

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        if (!json.symbols) {
            return;
        }

        const symbolFactory = SymbolFactory.getInstance();
        for (let i = 0; i < json.symbols.length; ++i) {
            this.symbols.push(symbolFactory.createSymbol(json.symbols[i]));
        }
    }

    toJson() {
        const json = super.toJson();

        json.symbols = [];
        for (let i = 0; i < this.symbols.length; ++i) {
            json.symbols.push(this.symbols[i].toJson());
        }

        return json;
    }

    draw(ctx) {
        if (!this.symbols.length) {
            return;
        }

        if (this.symbols.length === 0) {
            return;
        }

        super.draw(ctx);
    }

    /**
     * 重写父类方法,绘制复合点符号.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawContent(ctx) {
        for (let i = 0; i < this.symbols.length; ++i) {
            const symbol = this.symbols[i];
            symbol.resetTransform = false;
            symbol.geometry = new Point(0, 0);
            symbol.draw(ctx);
            symbol.resetTransform = true;
        }
    }

    /**
     * 返回符号在局部坐标系下的bound
     * x方向为宽度，y方向为高度
     * @returns {Object} bound
     */
    getOriginBound() {
        this.transformation.save();
        let bound = new Bound();
        for (let i = 0; i < this.symbols.length; ++i) {
            this.transformation.resetTransform();
            const symbol = this.symbols[i];
            const symbolBound = symbol.getOriginBound();
            this.transformation.translate(symbol.offsetX, symbol.offsetY);
            this.transformation.rotate(symbol.angle);
            let lineString = symbolBound.toLineString();
            lineString = this.transformation.transform(lineString);
            bound = bound.extend(lineString.getBound());
        }
        this.transformation.restore();
        return bound;
    }
}
