import LineSymbol from './LineSymbol';
import Vector from '../math/Vector';
import SymbolFactory from './SymbolFactory';

/**
 * 将点符号绘制在线的端点,只绘制一遍
 */
export default class EndMarkerLineSymbol extends LineSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.type = 'EndMarkerLineSymbol';

        this.marker = null;
        this.position = 'e';
        this.times = 10;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('position', json.position);
        this.setValue('times', json.times);
        const symbolFactory = SymbolFactory.getInstance();
        if (json.marker) {
            this.marker = symbolFactory.createSymbol(json.marker);
        }
    }

    toJson() {
        const json = super.toJson();

        json.position = this.position;
        json.times = this.times;
        if (this.marker) {
            json.marker = this.marker.toJson();
        }

        return json;
    }

    /**
     * 在设备上下文中绘制符号
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

        if (!this.marker) {
            return;
        }

        const length = this.geometry.length();
        const size = this.marker.getOriginBound().getSize();
        const maxSize = size.height > size.width ? size.height : size.width;

        if (length < maxSize * this.times) {
            return;
        }

        // 为了让marker不超出线，marker向线内移动半个高度
        const offset = size.height / 2;
        let geometry = this.geometry;
        if (this.position === 's') {
            geometry = geometry.reverse();
        }
        const res = geometry.getPointByLength(length - offset);
        let sP = null;
        let eP = null;
        if (res[0] === 'vertex') {
            sP = geometry.coordinates[res[1]];
            eP = res[3];
        } else if (res[0] === 'betweenVertex') {
            sP = geometry.coordinates[res[1]];
            eP = res[3];
        } else {
            throw new Error('计算错误，坐标不在Link内');
        }

        this.drawMarker(ctx, sP, eP);
    }

    /**
     * 绘制点符号，私有方法.
     * @param {object} ctx - 设备上下文
     * @param {Object} sP
     * @param {Object} eP
     * @returns {undefined}
     */
    drawMarker(ctx, sP, eP) {
        const vY = new Vector(0, -1);
        const vN = eP.minus(sP);
        let angle = vY.angleTo(vN);
        const signal = vY.cross(vN);

        if (signal < 0) {
            angle = -angle;
        }

        this.marker.angle = angle;
        this.marker.geometry = eP;
        this.marker.draw(ctx);
    }
}
