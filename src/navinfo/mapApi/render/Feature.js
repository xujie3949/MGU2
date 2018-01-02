import Util from '../../common/Util';

/**
 * 要素基类
 */
export default class Feature {
    /**
     * 初始化构造函数.
     * @param {Object}  data    - 接收渲染数据模型格式数据
     * @returns {undefined}
     */
    constructor(data) {
        this.id = null;
        this.type = null;
        this.geometry = null;
        this.properties = null;
    }

    /**
     * 复制方法
     * @return {Object} 克隆的新对象
     */
    clone() {
        throw new Error('未实现clone方法');
    }

    copyProperties(obj) {
        obj.id = Util.clone(this.id);
        obj.type = Util.clone(this.type);
        obj.geometry = Util.clone(this.geometry);
        obj.properties = Util.clone(this.properties);
    }
}
