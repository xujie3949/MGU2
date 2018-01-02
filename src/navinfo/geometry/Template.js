/**
 * 模板类,主要功能是按照指定pattern参数切分[LineString]{@link LineString}.
 */
export default class Template {
    /**
     * 初始化Template对象各属性.
     * @param {Array} pattern
     * @param [LineString]{@link LineString} lineString - 线对象
     * @param {Number} startOffset segments - 起始位置
     */
    constructor(pattern, lineString, startOffset) {
        if (pattern !== undefined) {
            this.pattern = pattern;
        } else {
            this.pattern = [];
        }

        if (lineString !== undefined) {
            this.lineString = lineString;
        } else {
            this.lineString = null;
        }

        if (startOffset !== undefined) {
            this.startOffset = startOffset;
        } else {
            this.startOffset = 0;
        }
    }

    /**
     * 将传入的线几何坐标按照模式切分成若干小段
     * 如果pattern元素为0，则返回[LineString]
     * 如果线几何坐标元素小于2，返回[].
     * @return {Array} - 分割后的线数组
     */
    getSegments() {
        let segments = [];

        if (this.lineString.coordinates.length < 2) {
            return segments;
        }

        if (this.pattern.length === 0) {
            segments.push(this.lineString.clone());
            return segments;
        }

        // 处理pattern，确保包含偶数个元素
        const newPattern = this.processPattern(this.pattern);

        // 计算pattern的总长度
        const patternLength = this.getPatternLength(newPattern);

        // 切除掉起始偏移长度
        const lineString = this.cutStartOffset(this.startOffset, this.lineString);

        if (!lineString) {
            return [];
        }

        // 将线几何按照模式总长度打段
        segments = this.breakGeometry(patternLength, lineString);

        return segments;
    }

    /**
     * 将segment按照pattern每个元素依次打段返回下标为偶数的子段，不改变segment
     * segment长度必须小于等于pattern总长度超出部分将被忽略,pattern值为0的元素将被忽略.
     * @param {Object} segment - 要打断的几何
     * @return {Array} marks - 所有下标为偶数的子段
     */
    getMarks(segment) {
        const pattern = this.processPattern(this.pattern);

        const marks = [];
        if (pattern.length === 0) {
            marks.push(segment);
            return marks;
        }

        let sourceSegment = segment;
        for (let i = 0; i < pattern.length; ++i) {
            const subSegments = sourceSegment.splitByLength(pattern[i]);
            if (i % 2 === 0 && subSegments[0] !== null) {
                marks.push(subSegments[0]);// 取下标为偶数的subSegment作为mark
            }

            // 当segment长度小于等于pattern长度时，subSegments[1]为[]
            if (subSegments[1] === null) {
                break;
            }

            sourceSegment = subSegments[1];
        }

        return marks;
    }

    /**
     * 将几何按照startOffset切除
     * 此方法不会改变原始几何
     * 当startOffset为0时,返回原始几何的拷贝
     * 当原始几何长度小于startOffset时返回null.
     * @param {Number} startOffset
     * @param [LineString]{@link LineString} lineString - LineString对象
     * @returns [LineString]{@link LineString} - 切分后的结果
     */
    cutStartOffset(startOffset, lineString) {
        // 计算geometry长度
        const geometryLength = lineString.length();

        const segments = [];

        // geometry长度前置检查
        if (startOffset === 0) {
            const newGeometry = lineString.clone();// 拷贝geometry
            return newGeometry;
        }

        if (geometryLength <= startOffset) {
            return null;
        }

        // 切分几何
        const subLineStrings = lineString.splitByLength(startOffset);
        return subLineStrings[1];
    }

    /**
     * 将线几何按照pattern长度依次打段成若干段，不改变原几何
     * 当线长度小于或者等于length时，
     * segments包含一条几何，与原几何相等，但不是同一对象.
     * @param {Number} length 模式的总长度
     * @param [LineString]{@link LineString} lineString - 要切分的几何
     * @returns {Object[]} segments - 切分产生的结果
     */
    breakGeometry(length, lineString) {
        // 计算geometry长度
        const geometryLength = lineString.length();

        const segments = [];

        // geometry长度前置检查
        if (geometryLength <= length) {
            const newGeometry = lineString.clone();// 拷贝geometry
            return [newGeometry];
        }

        // 循环切分几何
        let i = 1;
        let tmpLineString = lineString;
        while (geometryLength > length * i) {
            const subLineStrings = tmpLineString.splitByLength(length);
            segments.push(subLineStrings[0]);
            tmpLineString = subLineStrings[1];
            ++i;
        }

        // 将最后剩下的一段加入结果集
        segments.push(tmpLineString);

        return segments;
    }

    /**
     * 计算模式长度.
     * @param {Array} patternArray - 模式
     * @return {Number} length - pattern总长度
     */
    getPatternLength(patternArray) {
        let length = 0;

        for (let i = 0; i < patternArray.length; ++i) {
            length += patternArray[i];
        }

        return length;
    }

    /**
     * 对模式进行处理，如果模式元素是奇数个，
     * 则将模式重复一遍以保证模式元素总是偶数个
     * @param {Array} patternArray - 模式
     * @returns {Array} patternArray - 模式
     */
    processPattern(patternArray) {
        if (patternArray.length % 2 !== 0) {
            return patternArray.concat(patternArray);
        }

        return patternArray;
    }
}
