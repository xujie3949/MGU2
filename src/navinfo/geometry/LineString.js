import LineSegment from './LineSegment';
import Bound from './Bound';

/**
 * 该类是一个symbol.LineString（线符号）类，是由多个像素坐标点组成的线.
 */
export default class LineString {
    /**
     * 初始化LineString对象
     * 还可以通过GeometryFactory的createLineString()方法创建.
     */
    constructor() {
        this.type = 'LineString';

        this.coordinates = [];
    }

    /**
     * 克隆当前前对象,返回新对象
     * @return {object} cloneLineString - 返回克隆的对象
     */
    clone() {
        const cloneLineString = new LineString();
        for (let i = 0; i < this.coordinates.length; ++i) {
            const point = this.coordinates[i].clone();
            cloneLineString.coordinates.push(point);
        }

        return cloneLineString;
    }

    /**
     * 计算当前LineString对象长度
     * @return {Number} length - 线长度
     */
    length() {
        if (this.coordinates.length < 2) {
            return 0;
        }

        let length = 0;

        for (let i = 1; i < this.coordinates.length; ++i) {
            const prePoint = this.coordinates[i - 1];
            const point = this.coordinates[i];
            length += point.distance(prePoint);
        }

        return length;
    }

    /**
     * 计算线几何在指定长度处的点（不一定是形状点），以及前后点索引
     * 当指定长度小于等于0时，返回['start']
     * 当指定长度大于或等于两点之间总长度时，返回['end']
     * 当指定长度处的点刚好是形状点时，返回['vertex',i-1，i+1， [xi, yi]]
     * 当指定长度处的点不是形状点时，返回['betweenVertex',i-1，i， [xn, yn]]
     * @param {Number} length - 要切分的长度
     * @return {Array} result - 返回点坐标信息
     */
    getPointByLength(length) {
        const result = [];

        if (length <= 0) {
            result.push('start');
            return result;
        }

        const geometryLength = this.length();
        if (length >= geometryLength) {
            result.push('end');
            return result;
        }

        let tmpLength = 0;

        for (let i = 1; i < this.coordinates.length; ++i) {
            const prePoint = this.coordinates[i - 1];

            const curPoint = this.coordinates[i];
            const segmentLength = curPoint.distance(prePoint);
            if (tmpLength + segmentLength < length) {
                tmpLength += segmentLength;
            } else if (tmpLength + segmentLength === length) {
                result.push('vertex');
                result.push(i - 1);
                result.push(i + 1);
                result.push(curPoint.clone());
                break;
            } else {
                const remainLength = length - tmpLength;
                const line = new LineSegment(prePoint, curPoint);
                const point = line.getPointByLength(remainLength);
                result.push('betweenVertex');
                result.push(i - 1);
                result.push(i);
                result.push(point);

                break;
            }
        }

        return result;
    }

    /**
     * 在指定长度处将线几何切分成两段
     * 当指定长度大于几何长度时，返回[LineString,null]
     * 当指定长度小于等于0时，返回[null,LineString]
     * @param {Number} length - 要切分的长度
     * @return {Array} 返回线分割后的数组
     */
    splitByLength(length) {
        const result = this.getPointByLength(length);

        let subLineString1;
        let subLineString2;
        switch (result[0]) {
            case 'start':
                subLineString1 = null;
                subLineString2 = this.clone();
                break;
            case 'end':
                subLineString1 = this.clone();
                subLineString2 = null;
                break;
            case 'vertex':
            case 'betweenVertex':
                subLineString1 = this.slice(0, result[1] + 1);// 获取从0到result[1]部分
                subLineString1.coordinates.push(result[3]);
                subLineString2 = this.slice(result[2]);// 获取从result[1]到结束部分
                subLineString2.coordinates.unshift(result[3]);// 在subGeometry2起始出插入result[2]
                break;
            default :
                throw new Error('运行时未知错误');
        }

        return [subLineString1, subLineString2];
    }

    /**
     * 拷贝LineString指定位置，坐标深拷贝，[start，end）
     * 如果end是undefined，则拷贝[start,length - 1]
     * @param start
     * @param end
     * @return {object} newLineString - 返回LineString的实例对象
     */
    slice(start, end) {
        if (end === undefined || end > this.coordinates.length) {
            end = this.coordinates.length;
        }

        if (start < 0) {
            start = 0;
        }

        const newLineString = new LineString();
        for (let i = start; i < end; ++i) {
            newLineString.coordinates.push(this.coordinates[i].clone());
        }

        return newLineString;
    }

    /**
     * 判断两个LineString坐标是否相等.
     * @param {object} lineString 传入的LineString对象
     * @return {boolean}
     */
    equal(lineString) {
        if (this.coordinates.length !== lineString.coordinates.length) {
            return false;
        }

        for (let i = 0; i < this.coordinates.length; ++i) {
            if (!this.coordinates[i].equal(lineString.coordinates[i])) {
                return false;
            }
        }

        return true;
    }

    /**
     * 翻转linestring坐标，返回新对象.
     * @return {object} newLineString - 返回LineString的实例对象
     */
    reverse() {
        const newLineString = this.clone();
        newLineString.coordinates.reverse();
        return newLineString;
    }

    /**
     * 判断LineString是否闭合.
     * @returns {boolean}
     */
    isClosed() {
        const length = this.coordinates.length;
        return this.coordinates[0].equal(this.coordinates[length - 1]);
    }

    /**
     * 获取lineString的最小包含范围.
     * @returns {object} bound
     */
    getBound() {
        let bound = new Bound();
        for (let i = 0; i < this.coordinates.length; ++i) {
            const point = this.coordinates[i];
            const pointBound = point.getBound();
            bound = bound.extend(pointBound);
        }

        return bound;
    }
}
