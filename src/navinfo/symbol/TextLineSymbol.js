import LineSymbol from './LineSymbol';
import Vector from '../math/Vector';
import Matrix from '../math/Matrix';
import SymbolFactory from './SymbolFactory';

/**
 * 由文本构成的线符号,每隔一定间距绘制一遍文本,相对于MarkerLineSymbol,
 * 此类针对文本做了专门优化,考虑了文本的显示方向等
 */
export default class TextLineSymbol extends LineSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);
        /**
         * 重写父类属性,符号类型'TextLineSymbol'
         * @type {String} TextLineSymbol
         * */
        this.type = 'TextLineSymbol';
        /**
         * 要绘制的文本,默认值空字符串
         * @type {String}
         */
        this.text = '';
        /**
         * 文本中相邻文字之间插入的空格个数,默认值0
         * @type {Number}
         */
        this.spaceCount = 0;
        this.offset = 0;
        /**
         * 两段文本之间的间距,绘制的实际间距不一定会严格等于这个值
         * 程序会自动估算一个最靠近这个值的合理值
         * @type {number}
         */
        this.gap = 200;
        /**
         * 是否与link垂直的标记.
         * @type {boolean}
         */
        this.alwaysisVerticalToLine = false;
        /**
         * 文本点符号
         * @type {null}
         */
        this.marker = null;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('text', json.text);
        this.setValue('gap', json.gap);
        this.setValue('offset', json.offset);
        this.setValue('spaceCount', json.spaceCount);
        this.setValue('alwaysisVerticalToLine', json.alwaysisVerticalToLine);
        const symbolFactory = SymbolFactory.getInstance();
        if (json.marker) {
            this.marker = symbolFactory.createSymbol(json.marker);
        }
    }

    toJson() {
        const json = super.toJson();

        json.text = this.text;
        json.gap = this.gap;
        json.offset = this.offset;
        json.spaceCount = this.spaceCount;
        json.alwaysisVerticalToLine = this.alwaysisVerticalToLine;
        if (this.marker) {
            json.marker = this.marker.toJson();
        }

        return json;
    }

    /**
     * 绘制接口.
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

        if (!this.text) {
            return;
        }

        if (!this.marker) {
            return;
        }

        let text = this.text;
        if (this.spaceCount) {
            text = this.addSpaceToText(this.text);
        }

        // 粗略估算文本长度
        const size = this.getTextSize(text);
        const textLength = size.width > size.height ? size.width : size.height;

        // 计算link长度
        const length = this.geometry.length();

        if (length < textLength * 2) {
            return;
        }

        // 自动估算最合适的绘制次数
        const drawCount = this.getDrawCount(length, textLength, this.gap);

        // 去除所有文本长度后gap应该占用的长度
        const remainderLength = length - textLength * drawCount;

        // 每段由gap+文本组成
        const segLength = remainderLength / (drawCount + 1) + textLength;

        // 按照gap循环绘制文本
        let i = 1;
        while (i <= drawCount) {
            // 计算文本绘制的开始坐标
            const position = segLength * i - textLength;

            // 根据文本中间点坐标所在形状边的斜率决定是否反转文字内容
            const info = this.getTextDirection(this.geometry, position + textLength / 2);
            let drawText = text;
            if (info.isReverse) {
                drawText = text.split('')
                    .reverse()
                    .join('');
            }

            this.drawTextAtPosition(ctx, this.geometry, position, drawText, info.isVerticalToLine);
            ++i;
        }
    }

    /**
     * 向文本的文字间插入空格.
     * @param {String} text - 要插入空格的文本
     * @returns {string} textWithSpace - 新的文本
     */
    addSpaceToText(text) {
        const spaces = this.getSpaces(this.spaceCount);
        let textWithSpace = '';
        for (let i = 0; i < text.length; ++i) {
            textWithSpace = textWithSpace + text[i] + spaces;
        }
        textWithSpace = textWithSpace.substr(0, textWithSpace.length - spaces.length);
        return textWithSpace;
    }

    /**
     * 返回指定数量的空格
     * @param {Number} count - 构造空格的数量
     * @returns {string} spaces - 空格字符串
     */
    getSpaces(count) {
        let spaces = '';
        for (let i = 0; i < count; ++i) {
            spaces += ' ';
        }
        return spaces;
    }

    /**
     * 根据link总长度，字符总长度，间距智能决定绘制次数
     * 如果link总长度小于文本总长度，返回0
     * @param {Number} length - link总长度
     * @param {Number} textLength - 文本总长度
     * @param {Number} gap - 间距
     * @returns {number} bestCount - 绘制次数
     */
    getDrawCount(length, textLength, gap) {
        // 不重叠情况下最多可以绘制文本的次数
        let count = Math.floor(length / textLength);
        let bestCount = 0;
        let dMin = Number.MAX_VALUE;
        while (count > 0) {
            const remainderLength = length - textLength * count;
            const segLength = remainderLength / (count + 1);
            const d = Math.abs(segLength - gap);
            if (d < dMin) {
                bestCount = count;
                dMin = d;
            }

            --count;
        }

        return bestCount;
    }

    /**
     * 在指定位置绘制一遍文本
     * @param {object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @param {Object} geometry - geoJson格式的几何对象
     * @param {Number} position - 位置
     * @param {String} text - 文本字符串
     * @param {Boolean} isVerticalToLine - isVerticalToLine参数决定每个字符是否垂直于线绘制标志
     */
    drawTextAtPosition(ctx, geometry, position, text, isVerticalToLine) {
        let curPos = position;
        let lastLength = 0;
        const vY = new Vector(0, 1);
        for (let i = 0; i < text.length; ++i) {
            const size = this.getTextSize(text[i]);
            if (isVerticalToLine) {
                curPos += size.width / 2 + lastLength / 2;
                lastLength = size.width;
            } else {
                curPos += size.height / 2 + lastLength / 2;
                lastLength = size.height;
            }

            const res = geometry.getPointByLength(curPos);
            let sPoint = null;
            let ePoint = null;
            let curPoint = null;
            if (res[0] === 'vertex') {
                sPoint = geometry.coordinates[res[1]];
                ePoint = res[3];
                curPoint = ePoint;
            } else if (res[0] === 'betweenVertex') {
                sPoint = geometry.coordinates[res[1]];
                ePoint = geometry.coordinates[res[2]];
                curPoint = res[3];
            } else {
                continue;
            }

            const vN = ePoint.minus(sPoint);

            const angle = vY.angleTo(vN);
            let finalAngle = 0;

            if (vN.x === 0 && vN.y === 0) {
                // 处理零向量
                finalAngle = 0;
                if (isVerticalToLine) {
                    finalAngle += 90;
                }
            } else if (vN.x > 0 && vN.y === 0) {
                // x正轴上逆时针旋转
                finalAngle = -angle;
                if (isVerticalToLine) {
                    finalAngle += 90;
                }
            } else if (vN.x < 0 && vN.y === 0) {
                // x负轴上逆时针旋转
                finalAngle = angle;
                if (isVerticalToLine) {
                    finalAngle -= 90;
                }
            } else if (vN.x === 0 && vN.y > 0) {
                // y正轴上顺时针旋转
                finalAngle = angle;
                if (isVerticalToLine) {
                    finalAngle += 90;
                }
            } else if (vN.x === 0 && vN.y < 0) {
                // y负轴上顺时针旋转angle + 180
                finalAngle = angle + 180;
                if (isVerticalToLine) {
                    finalAngle += 90;
                }
            } else if (vN.x > 0 && vN.y > 0) {
                // 第一象限,逆时针旋转
                finalAngle = -angle;
                if (isVerticalToLine) {
                    finalAngle += 90;
                }
            } else if (vN.x < 0 && vN.y > 0) {
                // 第二象限,顺时针旋转
                finalAngle = angle;
                if (isVerticalToLine) {
                    finalAngle -= 90;
                }
            } else if (vN.x < 0 && vN.y < 0) {
                // 第三象限，顺时针旋转angle + 180
                finalAngle = angle + 180;
                if (isVerticalToLine) {
                    finalAngle += 90;
                }
            } else {
                // 第四象限，逆时针旋转angle + 180
                finalAngle = -angle + 180;
                if (isVerticalToLine) {
                    finalAngle -= 90;
                }
            }

            const matrix = new Matrix();
            let vV = vN.crossMatrix(matrix.makeRotate(90));
            vV.normalize();
            vV = vV.multiNumber(this.offset);
            curPoint = curPoint.plusVector(vV);

            this.drawChar(ctx, text[i], finalAngle, curPoint);
        }
    }

    /**
     * 决定文字的绘制方向和是否垂直于Link.
     * @param {Object} geometry - geoJson格式的几何对象
     * @param {Number} position - 位置
     * @returns {{isReverse: boolean, isVerticalToLine: boolean}}
     */
    getTextDirection(geometry, position) {
        const res = geometry.getPointByLength(position);
        let sPoint = null;
        let ePoint = null;
        let curPoint = null;
        if (res[0] === 'vertex') {
            sPoint = this.geometry.coordinates[res[1]];
            ePoint = res[3];
            curPoint = ePoint;
        } else if (res[0] === 'betweenVertex') {
            sPoint = this.geometry.coordinates[res[1]];
            ePoint = this.geometry.coordinates[res[2]];
            curPoint = res[3];
        } else {
            throw new Error('计算错误，坐标不在Link内');
        }

        const vN = ePoint.minus(sPoint);

        let isReverse = false;
        let isVerticalToLine = false;

        const vY = new Vector(0, 1);
        const angle = vY.angleTo(vN);

        if (vN.x === 0 && vN.y === 0) {
            // 零向量不需要翻转文字,文字不垂直于线
            isReverse = false;
            isVerticalToLine = false;
        } else if (vN.x === 0 && vN.y > 0) {
            // y正轴上不需要翻转文字,文字不垂直于线
            isReverse = false;
            isVerticalToLine = false;
        } else if (vN.x > 0 && vN.y === 0) {
            // x正轴上不需要翻转文字,文字垂直于线
            isReverse = false;
            isVerticalToLine = true;
        } else if (vN.x === 0 && vN.y < 0) {
            // y负轴上需要翻转文字,文字不垂直于线
            isReverse = true;
            isVerticalToLine = false;
        } else if (vN.x < 0 && vN.y === 0) {
            // x负轴上需要翻转文字,文字垂直于线
            isReverse = true;
            isVerticalToLine = true;
        } else if (vN.x > 0 && vN.y > 0) {
            // 第一象限不需要翻转文字
            if (angle < 45) {
                isVerticalToLine = false;
            } else {
                isVerticalToLine = true;
            }
            isReverse = false;
        } else if (vN.x < 0 && vN.y > 0) {
            // 第二象限
            if (angle < 45) {
                // 不需要翻转文字
                isReverse = false;
                isVerticalToLine = false;
            } else {
                // 翻转文字
                isReverse = true;
                isVerticalToLine = true;
            }
        } else if (vN.x < 0 && vN.y < 0) {
            // 第三象限需要翻转文字
            // 第一象限不需要翻转文字
            if (angle > 135) {
                isVerticalToLine = false;
            } else {
                isVerticalToLine = true;
            }

            isReverse = true;
        } else {
            // 第四象限
            // 不需要翻转文字
            isReverse = false;
            isVerticalToLine = true;

            if (angle > 135) {
                // 翻转文字
                isReverse = true;
                isVerticalToLine = false;
            }
        }

        // 忽略线走向,文字总是垂直于线
        if (this.alwaysisVerticalToLine) {
            isVerticalToLine = true;
        }

        return {
            isReverse: isReverse,
            isVerticalToLine: isVerticalToLine,
        };
    }

    /**
     * 绘制单个文字符号
     * @param {Object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得
     * @param {String} char - 单个字符
     * @param {Number} angle - 绘制字符的角度
     * @param {Object} geometry - 字符的几何
     */
    drawChar(ctx, char, angle, geometry) {
        this.marker.align = 'center';
        this.marker.baseline = 'middle';
        this.marker.direction = 'ltr';
        this.marker.text = char;
        this.marker.angle = angle;
        this.marker.geometry = geometry;
        this.marker.draw(ctx);
    }

    /**
     * 计算文本的宽度和高度.
     * @param {String} text - 要计算的文本
     * @returns {{width: number, height: number}} size
     */
    getTextSize(text) {
        this.marker.text = text;
        const size = this.marker.getOriginBound()
            .getSize();
        return size;
    }
}
