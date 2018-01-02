import FillSymbol from './FillSymbol';
import SymbolFactory from './SymbolFactory';

/**
 * 复合符号面填充类.
 */
export default class CompositeFillSymbol extends FillSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.type = 'CompositeFillSymbol';

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
     * 以复合符号填充面。
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @returns {undefined}
     */
    drawContent(ctx) {
        for (let i = 0; i < this.symbols.length; ++i) {
            this.symbols[i].geometry = this.geometry;
            this.symbols[i].draw(ctx);
        }
    }
}
