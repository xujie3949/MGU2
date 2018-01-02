import Util from '../../navinfo/common/Util';
import FeatureFactory from '../../navinfo/mapApi/render/FeatureFactory';

/**
 * 将服务返回的数据转换为渲染要素
 * @param {Object} data - 服务返回的渲染数据
 * @param {Object} tile - 当前请求的瓦片信息
 * @returns {Array} list - 转换后的结果.
 */
function dataTransform(data, tile) {
    const featureFactory = FeatureFactory.getInstance();
    let list = [];
    if (Util.isObject(data)) {
        Util.forOwn(data, value => {
            value.forEach(item => {
                const res = featureFactory.createFeature(item.t, item, tile);
                if (Util.isObject(res)) {
                    list.push(res);
                } else if (Util.isArray(res)) {
                    list = list.concat(res);
                }
            });
        });
    } else if (Util.isArray(data)) {
        let temp = data;
        if (Util.isArray(data[0])) {
            temp = data[0];
        }
        for (let i = 0; i < temp.length; i++) {
            const res = featureFactory.createFeature(temp[i]);
            if (Util.isObject(res)) {
                list.push(res);
            } else if (Util.isArray(res)) {
                list = list.concat(res);
            }
        }
    }
    return list;
}

export default dataTransform;
