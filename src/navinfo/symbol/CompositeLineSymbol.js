import LineSymbol from './LineSymbol';
import SymbolFactory from './SymbolFactory';

/**
 * 复合线符号,允许任意线符号进行组合.常用于特殊线型,绘制道路名,道路方向等场景
 */
export default class CompositeLineSymbol extends LineSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);
        this.type = 'CompositeLineSymbol';
        /**
         * 线符号
         * @type {Array}
         */
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

    /**
     * 重写父类方法,绘制接口
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

        if (this.symbols.length === 0) {
            return;
        }

        for (let i = 0; i < this.symbols.length; ++i) {
            this.symbols[i].geometry = this.geometry;
            this.symbols[i].draw(ctx);
        }
    }
}
