import Layer from './Layer';

/**
 * @class
 * 整福地图图层由一个canvas组成
 */
export default class WholeLayer extends Layer {
    /** *
     *
     * @param options 初始化可选options
     */
    constructor(options) {
        super(options);
    }

    /** *
     * 图层添加到地图时调用
     * @param map
     */
    onAdd(map) {
        this.map = map;
        this._initContainer(this.options);
        map.on('moveend', this._redraw, this);
        this._redraw();
    }

    /** *
     * 图层被移除时调用
     * @param map
     */
    onRemove(map) {
        map.getPanes().overlayPane.removeChild(this._div);
        map.off('moveend', this._redraw, this);
    }

    /** *
     * 初始化图层容器
     * @param options
     */
    _initContainer(options) {
        this.options = options || {};
        const container = L.DomUtil.create('div', 'leaflet-canvas-container');
        container.id = options.id || '';
        container.style.position = 'absolute';
        container.style.width = `${this.map.getSize().x}px`;
        container.style.height = `${this.map.getSize().y}px`;
        this.canv = document.createElement('canvas');
        this._ctx = this.canv.getContext('2d');
        this.canv.width = this.map.getSize().x;
        this.canv.height = this.map.getSize().y;
        this.canv.style.width = `${this.canv.width}px`;
        this.canv.style.height = `${this.canv.height}px`;
        container.appendChild(this.canv);
        this._div = container;
        this.map.getPanes().overlayPane.appendChild(this._div);
        this._div.style.zIndex = this.options.zIndex;
    }

    setZIndex(zIndex) {
        this._div.style.zIndex = zIndex;
        return this;
    }

    bringToFront() {
        this._div.style.zIndex = 100;
        return this;
    }

    bringToBack() {
        this._div.style.zIndex = 0;
        return this;
    }

    _setAutoZIndex(pane, compare) {
        this.options.zIndex = 100;
        this._div.style.zIndex = 100;
    }

    /** *
     * 绘制图层内容
     */
    draw() {
    }

    /** *
     * 重绘图层
     */
    _redraw() {
        this._resetCanvasPosition();
    }

    /** *
     * 清空图层
     */
    clear() {
    }

    /** *
     * 重新调整图层位置
     */
    _resetCanvasPosition() {
        const bounds = this.map.getBounds();
        const topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
        L.DomUtil.setPosition(this._div, topLeft);
    }
}
