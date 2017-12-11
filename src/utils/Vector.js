class Vector {
  constructor(x, y) {
    if (x === undefined) {
      this.x = 0;
    } else {
      this.x = x;
    }

    if (y === undefined) {
      this.y = 0;
    } else {
      this.y = y;
    }
  }

  /**
   * 向量减法
   * 返回结果为向量
   * @method minus
   * @param v
   * @return Vector
   */
  minus(v) {
    const x = this.x - v.x;
    const y = this.y - v.y;
    return new Vector(x, y);
  }

  /**
   * 向量加法
   * 返回结果为向量
   * @method plus
   * @param v
   * @return Vector
   */
  plus(v) {
    const x = this.x + v.x;
    const y = this.y + v.y;
    return new Vector(x, y);
  }

  /**
   * 向量和数字的乘法
   * 返回结果为向量
   * @method multiNumber
   * @param n
   * @return Vector
   */
  multiNumber(n) {
    const x = this.x * n;
    const y = this.y * n;
    return new Vector(x, y);
  }

  /**
   * 向量和数字的除法
   * 返回结果为向量
   * @method dividNumber
   * @param n
   * @return Vector
   */
  dividNumber(n) {
    const x = this.x / n;
    const y = this.y / n;
    return new Vector(x, y);
  }

  /**
   * 向量和向量的叉乘
   * 返回结果为叉乘结果的模长
   * 符号表示方向，符号为正表示与Z同向，否则反向
   * @method cross
   * @param v
   * @return Number
   */
  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  /**
   * 向量和向量的点积
   * 返回结果为数字
   * @method dot
   * @param v
   * @return Number
   */
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * 向量模长的平方
   * 返回结果为数字
   * @method length2
   * @return Number
   */
  length2() {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * 向量模长
   * 返回结果为数字
   * @method length
   * @return Number
   */
  length() {
    return Math.sqrt(this.length2());
  }

  /**
   * 单位化向量
   * @method normalize
   */
  normalize() {
    const length = this.length();
    this.x = this.x / length;
    this.y = this.y / length;
  }

  /**
   * 求向量之间的夹角
   * 返回结果为角度，单位度
   * @method angleTo
   * @param v
   * @return Number
   */
  angleTo(v) {
    const cos = this.dot(v) / (this.length() * v.length());
    const arcA = Math.acos(cos);

    return arcA * 180 / Math.PI;
  }
}

export default Vector;

