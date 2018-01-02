import Symbol from './Symbol';

/**
 * 线符号基类,所有线符号均从此类派生.
 */

export default class LineSymbol extends Symbol {
    /**
     * 继承方法,继承自[Symbol]{@link Symbol}类.
     * @param {Object} options - 符号设置的属性
     * @returns {undefined}
     */
    constructor(options) {
        // 执行父类初始化
        super(options);
    }

    /**
     * 重写父类方法,设置符号属性.
     * @param {Object} json - 符号设置的属性
     * @returns {undefined}
     */
    fromJson(json) {
        super.fromJson(json);
    }

    /**
     * 重写父类方法,导出符号属性.
     * @returns {Object} json - 符号的属性
     */
    toJson() {
        const json = super.toJson();

        return json;
    }
}
