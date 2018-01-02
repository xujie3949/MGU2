/**
 * 地图符号基类,所有符号均从此类派生.
 */
export default class Symbol {
    constructor(options) {
        /**
         * 符号类型，默认值空字符串.
         * @type {string}
         */
        this.type = '';
        /**
         * 符号名称,用于标识每个符号实例,默认值空字符串
         * @type {string}
         */
        this.name = '';
        /**
         * 符号几何,可以是Point,LineString,Polygon类型,默认值null.
         * @type {null|String}
         */
        this.geometry = null;
    }

    /**
     * 在设备上下文中绘制符号,未实现,需要在子类中重写.
     * @param {object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    draw(ctx) {
        return;
    }

    /**
     * 从json中读取符号属性.
     * @param {object} json - 符号属性json对象
     * @return {undefined}
     */
    fromJson(json) {
        this.setValue('type', json.type);
        this.setValue('name', json.name);
    }

    /**
     * 将符号属性导出为json对象.
     * @returns {object} 符号属性的json表达
     */
    toJson() {
        return {
            type: this.type,
            name: this.name
        };
    }

    /**
     * 绘制LineString对象,只负责绘制坐标
     * 因为使用频繁，所以封装到基类.
     * @param {object} ctx - 设备上下文
     * @param {Object} geometry - LineString对象
     * @returns {undefined}
     */
    drawLineString(ctx, geometry) {
        if (geometry.coordinates.length > 0) {
            ctx.moveTo(geometry.coordinates[0].x, geometry.coordinates[0].y);
            for (let i = 1; i < geometry.coordinates.length; ++i) {
                ctx.lineTo(geometry.coordinates[i].x, geometry.coordinates[i].y);
            }
        }
    }

    /**
     * 如果符号对象拥有对应名称的属性,则将值赋值给符号对象
     * 注意：这是个内部函数，不是公共接口
     * @param {String} property - 符号属性
     * @param {*} value - 符号属性对应的值
     * @returns {undefined}
     */
    setValue(property, value) {
        if (!this.hasOwnProperty(property)) {
            return;
        }

        // 允许0值
        if (value === undefined || value === null) {
            return;
        }

        this[property] = value;
    }
}
