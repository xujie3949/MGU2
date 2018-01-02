import LineSymbol from './LineSymbol';
import SymbolFactory from './SymbolFactory';
import Vector from '../math/Vector';
import Matrix from '../math/Matrix';

/**
 * 将点符号绘制在线的中间,只绘制一遍,
 * 相对于CenterMarkerLineSymbol,此类针对文本做了专门优化,考虑了文本的显示方向等
 */
export default class CenterTextLineSymbol extends LineSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);
        /**
         * 重写父类属性,符号类型'CenterTextLineSymbol'
         * @type {String} CenterTextLineSymbol
         * */
        this.type = 'CenterTextLineSymbol';
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
        this.times = 2;
        /**
         * 是否与link垂直的标记.
         * @type {boolean}
         */
        this.alwaysisVerticalToLine = false;
        /**
         * 文本点符号,默认值null
         * @type {null}
         */
        this.marker = null;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);

        this.setValue('text', json.text);
        this.setValue('spaceCount', json.spaceCount);
        this.setValue('offset', json.offset);
        this.setValue('times', json.times);
        this.setValue('alwaysisVerticalToLine', json.alwaysisVerticalToLine);
        const symbolFactory = SymbolFactory.getInstance();
        if (json.marker) {
            this.marker = symbolFactory.createSymbol(json.marker);
        }
    }

    toJson() {
        const json = super.toJson();

        json.text = this.text;
        json.spaceCount = this.spaceCount;
        json.offset = this.offset;
        json.times = this.times;
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

        if (length < textLength * this.times) {
            return;
        }

        // 去除所有文本长度后gap应该占用的长度
        const remainderLength = length - textLength;

        // 计算文本绘制的开始坐标
        const position = remainderLength / 2;

        // 根据文本中间点坐标所在形状边的斜率决定是否反转文字内容
        const info = this.getTextDirection(this.geometry, position + textLength / 2);
        if (info.isReverse) {
            text = text.split('')
                .reverse()
                .join('');
        }

        this.drawTextAtPosition(ctx, this.geometry, position, text, info.isVerticalToLine);
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
     * 在指定位置绘制一遍文本
     * @param {object} ctx - 设备上下文,通过canvas.getContext('2d')方法获得.
     * @param {Object} geometry - geoJson格式的几何对象
     * @param {Number} position - 位置
     * @param {String} text - 文本字符串
     * @param {Boolean} isVerticalToLine - isVerticalToLine参数决定每个字符是否垂直于线绘制私有方法
     */
    drawTextAtPosition(ctx, geometry, position, text, isVerticalToLine) {
        let curPos = position;
        const vY = new Vector(0, 1);
        for (let i = 0; i < text.length; ++i) {
            const size = this.getTextSize(text[i]);
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

            if (isVerticalToLine) {
                curPos += size.width;
            } else {
                curPos += size.height;
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
            throw new Error('计算错误，错标不在Link内');
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
     * @param {Char} char - 单个字符
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
