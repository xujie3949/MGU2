import navinfo from 'navinfo';

/**
 * 道路点 的前端渲染模型
 */
export default class RdNode extends navinfo.mapApi.render.Render {
    /**
     * 要素渲染初始化函数
     * @return {undefined}
     */
    constructor() {
        super();
    }

    /**
     * 要素渲染主函数,返回要素对应的符号对象
     * @param  {object} feature 需要渲染的要素
     * @param  {number} zoom 地图缩放等级
     * @return {object} 符号对象
     */
    getSymbol(feature, zoom) {
        this._feature = feature;
        this._zoom = zoom;

        const symbolData = {
            type: 'CircleMarkerSymbol',
            radius: 2,
            color: '#9c8c89',
            opacity: 1,
        };
        const symbolData2 = {
            type: 'CircleMarkerSymbol',
            radius: 2,
            color: 'red',
            opacity: 1,
        };
        let symbol;
        if (this._feature.properties.forms.split(';').indexOf('3') > -1) {
            symbol = this._symbolFactory.createSymbol(symbolData2);
        } else {
            symbol = this._symbolFactory.createSymbol(symbolData);
        }
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }

    /**
     * 鼠标划过要素时，将要素高亮的渲染方法，返回要素的高亮符号对象
     * @param  {object} feature 需要渲染的要素
     * @param  {number} zoom 地图缩放等级
     * @return {object} 高亮符号对象
     */
    getHighlightSymbol(feature, zoom) {
        this._feature = feature;
        this._zoom = zoom;

        const symbolData = {
            type: 'CircleMarkerSymbol',
            radius: 3,
            color: 'blue',
        };
        const symbolData2 = {
            type: 'CircleMarkerSymbol',
            radius: 3,
            color: 'red',
        };
        let symbol;
        if (this._feature.properties.forms.split(';').indexOf('3') > -1) {
            symbol = this._symbolFactory.createSymbol(symbolData2);
        } else {
            symbol = this._symbolFactory.createSymbol(symbolData);
        }
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
}

