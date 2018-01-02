import MarkerSymbol from './MarkerSymbol';
import GeometryFactory from '../geometry/GeometryFactory';

/**
 * 十字叉点符号.
 */
export default class CrossMarkerSymbol extends MarkerSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.type = 'CrossMarkerSymbol';

        this.size = 10;
        this.width = 1;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('size', json.size);
        this.setValue('width', json.width);
    }

    toJson() {
        const json = super.toJson();

        json.size = this.size;
        json.width = this.width;

        return json;
    }

    /**
     * 重写父类方法,以构造的十字几何绘制符号内容.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawContent(ctx) {
        // 设置绘制环境
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.globalAlpha = this.opacity;

        // 获取绘制内容
        const geometry = this.getContentGeometry();

        // 绘制
        ctx.beginPath();
        ctx.moveTo(geometry.coordinates[0].x, geometry.coordinates[0].y);
        ctx.lineTo(geometry.coordinates[1].x, geometry.coordinates[1].y);
        ctx.moveTo(geometry.coordinates[2].x, geometry.coordinates[2].y);
        ctx.lineTo(geometry.coordinates[3].x, geometry.coordinates[3].y);
        ctx.stroke();
    }

    /**
     * 返回十字叉几何.
     * @returns {Object} geometry
     */
    getContentGeometry() {
        // 构造十字叉几何
        const coordinates = [];
        coordinates.push([-this.size / 2, 0]);
        coordinates.push([this.size / 2, 0]);
        coordinates.push([0, -this.size / 2]);
        coordinates.push([0, this.size / 2]);

        const gf = GeometryFactory.getInstance();
        const geometry = gf.createLineString(coordinates);
        return geometry;
    }

    /**
     * 返回符号在局部坐标系下的bound
     * x方向为宽度，y方向为高度
     * @returns {Object} bound
     */
    getOriginBound() {
        const gf = GeometryFactory.getInstance();
        const bound = gf.createBound(null, this.size, this.size);
        return bound;
    }
}
