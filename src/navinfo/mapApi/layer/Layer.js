import { Layer as LeafletLayer } from 'leaflet';
import Util from '../../common/Util';

/**
 * @class
 * Ilayer接口
 */
export default class Layer extends LeafletLayer {
    /** *
     * @param {Object}options
     * isVisiable图层是否可见，默认为false
     * isSelectable图层是否可选择，默认为false
     */
    constructor(options) {
        super(options);
        this.options = Util.merge({}, options);
        this.isVisiable = this.options.isVisiable;
        this.isSelectable = this.options.isSelectable;
    }

    /** *
     * 图层加入到地图时调用
     * onAdd所有继承Ilayer接口的类需要重写该方法
     * @param {L.Map}map
     */
    onAdd(map) {
        this._map = map;
        // map.addLayer(this)
    }

    /** *
     * 图层被移除时调用
     * onRemove所有继承Ilayer接口的类需要重写该方法
     * @param {L.Map}map
     */
    onRemove(map) {
        // map.removeLayer(this);
        this._map = null;
    }
}
