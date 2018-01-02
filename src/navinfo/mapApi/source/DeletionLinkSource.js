import Source from './Source';
import Util from '../../common/Util';

/**
 * DeletionLinkSource类
 */
export default class DeletionLinkSource extends Source {
    /**
     * 重写父类的createParameter方法.
     * @param {Object} tile - 瓦片对象信息
     * @returns {Object} parameter
     */
    createParameter(tile) {
        const parameter = Util.clone(this._requestParameter);
        parameter.x = tile.x;
        parameter.y = tile.y;
        parameter.z = tile.z;
        return parameter;
    }
}

