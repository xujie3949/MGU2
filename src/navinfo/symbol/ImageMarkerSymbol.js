import MarkerSymbol from './MarkerSymbol';
import ResourceFactory from '../common/ResourceFactory';
import GeometryFactory from '../geometry/GeometryFactory';

/**
 * 图片点符号.
 */
export default class ImageMarkerSymbol extends MarkerSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.type = 'ImageMarkerSymbol';

        this.url = '';
        this.width = 10;
        this.height = 10;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('url', json.url);
        this.setValue('width', json.width);
        this.setValue('height', json.height);
    }

    toJson() {
        const json = super.toJson();

        json.url = this.url;
        json.width = this.width;
        json.height = this.height;

        return json;
    }

    draw(ctx) {
        if (!this.url) {
            return;
        }

        super.draw(ctx);
    }

    /**
     * 重写父类方法,加载图片资源绘制符号内容.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawContent(ctx) {
        const resourceFactory = ResourceFactory.getInstance();
        const image = resourceFactory.getResource(this.url);
        if (!image) {
            return;
        }

        // 设置绘制环境
        ctx.globalAlpha = this.opacity;

        // 绘制
        ctx.drawImage(image, -this.width / 2, -this.height / 2, this.width, this.height);
    }

    /**
     * 返回符号在局部坐标系下的bound
     * x方向为宽度，y方向为高度
     * @returns {Object} bound
     */
    getOriginBound() {
        const gf = GeometryFactory.getInstance();
        const bound = gf.createBound(null, this.width, this.height);
        return bound;
    }
}
