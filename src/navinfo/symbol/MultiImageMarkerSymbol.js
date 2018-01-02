import MarkerSymbol from './MarkerSymbol';
import Point from '../geometry/Point';
import GeometryFactory from '../geometry/GeometryFactory';
import SymbolFactory from './SymbolFactory';

/**
 * 多图片点符号,支持显示多行多列图片,可以自定义图片之间的水平间距和垂直间距.
 */
export default class MultiImageMarkerSymbol extends MarkerSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.type = 'MultiImageMarkerSymbol';

        this.width = 10;
        this.height = 10;
        this.hGap = 0;
        this.vGap = 0;
        this.urls = [];

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('width', json.width);
        this.setValue('height', json.height);
        this.setValue('hGap', json.hGap);
        this.setValue('vGap', json.vGap);
        this.setValue('urls', json.urls);
    }

    toJson() {
        const json = super.toJson();

        json.width = this.width;
        json.height = this.height;
        json.hGap = this.hGap;
        json.vGap = this.vGap;
        json.urls = this.urls;

        return json;
    }

    draw(ctx) {
        if (!this.urls) {
            return;
        }

        if (this.urls.length === 0) {
            return;
        }

        super.draw(ctx);
    }

    /**
     * 重写父类方法,以多个图片绘制点符号.
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @return {undefined}
     */
    drawContent(ctx) {
        const geometries = this.getGeometries();

        const json = {
            type: 'ImageMarkerSymbol',
            width: this.width,
            height: this.height,
        };
        const symbolFactory = SymbolFactory.getInstance();
        const symbol = symbolFactory.createSymbol(json);
        symbol.resetTransform = false;

        for (let i = 0; i < this.urls.length; ++i) {
            for (let j = 0; j < this.urls[i].length; ++j) {
                const geometry = geometries[i][j];
                const url = this.urls[i][j];
                if (!url) {
                    continue;
                }
                this.drawImage(url, geometry, ctx, symbol);
            }
        }

        symbol.resetTransform = true;
    }

    /**
     * 根据属性配置,计算每个图片的绘制点位.
     * @returns {Array}.
     */
    getGeometries() {
        const info = this.getRowAndColumn();
        const actualHGap = this.hGap ? this.hGap : this.width;
        const actualVGap = this.vGap ? this.vGap : this.height;
        const totalWidth = this.width + actualHGap * (info.col - 1);
        const totalHeight = this.height + actualVGap * (info.row - 1);
        const startX = -totalWidth / 2;
        const startY = -totalHeight / 2;
        const geometries = [];
        for (let i = 0; i < info.row; ++i) {
            const y = startY + actualVGap * i + this.height / 2;
            const row = [];
            for (let j = 0; j < info.col; ++j) {
                const x = startX + actualHGap * j + this.width / 2;
                const geometry = new Point(x, y);
                row.push(geometry);
            }
            geometries.push(row);
        }

        return geometries;
    }

    /**
     * 计算图片的最大行数和列数
     * @returns {{row: Number, col: number}}.
     */
    getRowAndColumn() {
        const row = this.urls.length;
        let col = 0;
        for (let i = 0; i < this.urls.length; ++i) {
            const temCol = this.urls[i].length;
            if (col < temCol) {
                col = temCol;
            }
        }

        return {
            row: row,
            col: col,
        };
    }

    /**
     * 在ctx中绘制图片,options中指定了图片的旋转和平移参数.
     * @param {String} url - 图片的地址
     * @param {Object} geometry - 绘制点的几何
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @param {Object} symbol - 点符号symbol对象
     * @return {undefined}
     */
    drawImage(url, geometry, ctx, symbol) {
        symbol.url = url;
        symbol.geometry = geometry;
        symbol.draw(ctx);
    }

    /**
     * 返回符号在局部坐标系下的bound
     * x方向为宽度，y方向为高度
     * @returns {Object} bound
     */
    getOriginBound() {
        const info = this.getRowAndColumn();
        const actualHGap = this.hGap ? this.hGap : this.width;
        const actualVGap = this.vGap ? this.vGap : this.height;
        const totalWidth = this.width + actualHGap * (info.col - 1);
        const totalHeight = this.height + actualVGap * (info.row - 1);
        const gf = GeometryFactory.getInstance();
        const bound = gf.createBound(null, totalWidth, totalHeight);
        return bound;
    }
}
