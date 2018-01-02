import LineSymbol from './LineSymbol';
import SymbolFactory from './SymbolFactory';
import Vector from '../math/Vector';

/**
 * 将点符号绘制在线的中间,只绘制一遍
 */
export default class CenterMarkerLineSymbol extends LineSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.type = 'CenterMarkerLineSymbol';

        this.marker = null;
        this.direction = 's2e';
        this.times = 10;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('direction', json.direction);
        this.setValue('times', json.times);
        const symbolFactory = SymbolFactory.getInstance();
        if (json.marker) {
            this.marker = symbolFactory.createSymbol(json.marker);
        }
    }

    toJson() {
        const json = super.toJson();

        json.direction = this.direction;
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

        const res = this.geometry.getPointByLength(length / 2);
        let sP = null;
        let eP = null;
        if (res[0] === 'vertex') {
            sP = this.geometry.coordinates[res[1]];
            eP = res[3];
        } else if (res[0] === 'betweenVertex') {
            sP = this.geometry.coordinates[res[1]];
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
        let vN = null;
        if (this.direction === 's2e') {
            vN = eP.minus(sP);
        } else if (this.direction === 'e2s') {
            vN = sP.minus(eP);
        } else {
            throw new Error('direction属性只能是s2e或e2s');
        }
        const vY = new Vector(0, -1);
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
