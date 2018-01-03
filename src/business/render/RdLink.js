import navinfo from 'Navinfo';

/**
 * 道路线 的前端渲染模型
 */
export default class RdLink extends navinfo.mapApi.render.Render {
    /**
     * 要素渲染初始化函数
     * @return {undefined}
     */
    constructor() {
        super();

        this._colors = [
            '#646464', '#FFAAFF', '#E5C8FF', '#FF6364', '#FFC000', '#0E7892',
            '#63DC13', '#C89665', '#C8C864', '#000000', '#00C0FF', '#DCBEBE',
            '#000000', '#7364C8', '#000000', '#DCBEBE',
        ];
        this._color = null;
        this._width = null;
        this._opacity = null;
        this._symbol = null;
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
        this._color = this._colors[parseInt(this._feature.properties.kind, 10)];
        this._width = 1;
        this._opacity = 1;

        const compositeSymbol = this._symbolFactory.createSymbol({ type: 'CompositeLineSymbol' });
        compositeSymbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        this._symbol = compositeSymbol;

        if (this._feature.properties.form && this._feature.properties.form.indexOf('36') !== -1) {
            this._addNormalSymbol();
            this._addForm36Symbol(); // POI连接路
        } else if (this._feature.properties.form && this._feature.properties.form.indexOf('20') !== -1) {
            this._addForm20Symbol(); // 步行街
            this._addNormalSymbol();
        } else if (this._feature.properties.limit && this._feature.properties.limit.indexOf('4') !== -1) {
            this._addLimit4Symbol(); // 施工中道路
            this._addNormalSymbol();
        } else if (this._feature.properties.limit && this._feature.properties.limit.indexOf('0') !== -1) {
            this._addLimit0Symbol(); // 维修
            this._addNormalSymbol();
        } else if (this._feature.properties.form && this._feature.properties.form.indexOf('15') !== -1) {
            this._addForm15Symbol(); // 匝道
        } else if (this._feature.properties.form && this._feature.properties.form.indexOf('31') !== -1) {
            this._addForm31Symbol(); // 隧道
        } else if (this._feature.properties.form && this._feature.properties.form.indexOf('30') !== -1) {
            this._addForm30Symbol(); // 桥
            this._addNormalSymbol();
        } else if (this._feature.properties.form && this._feature.properties.form.indexOf('52') !== -1) {
            this._addForm52Symbol(); // 区域内道路
        } else {
            this._addNormalSymbol();
        }
        this._addArrowMarkerSymbol();
        this._addNameSymbol();

        return this._symbol;
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
            type: 'SimpleLineSymbol',
            color: '#00ffff',
            width: 3,
        };
        const symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }

    /**
     * 要素渲染辅助函数,返回要素渲染时的箭头符号对象
     * @return {object} 符号对象
     */
    _addArrowMarkerSymbol() {
        if (this._zoom <= 14) {
            return;
        }

        if (this._feature.properties.direct !== 2 && this._feature.properties.direct !== 3) {
            return;
        }

        let times = 10;

        if (this._zoom === 17) {
            times = 5;
        } else if (this._zoom > 17) {
            times = 1;
        }

        let direction = 's2e';
        if (this._feature.properties.direct === 3) {
            direction = 'e2s';
        }
        const symbolData = {
            type: 'CenterMarkerLineSymbol',
            direction: direction,
            times: times,
            marker: {
                type: 'TriangleMarkerSymbol',
                color: 'red',
                width: 4,
                height: 4,
                sunken: 2,
                outLine: {
                    color: 'red',
                    width: 2,
                },
            },
        };
        const symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    }

    /**
     * 要素渲染辅助函数,返回要素渲染时的线几何符号对象
     * @return {object} 符号对象
     */
    _addNormalSymbol() {
        const symbolData = {
            type: 'SimpleLineSymbol',
            color: this._color,
            width: this._width,
            opacity: this._opacity,
            style: 'solid',
        };
        const symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    }

    /**
     * 要素渲染辅助函数,返回要素渲染时的文字符号对象
     * @return {object} 符号对象
     */
    _addNameSymbol() {
        if (this._zoom <= 14) {
            return;
        }

        if (!this._feature.properties.name) {
            return;
        }

        // 道路名末尾包含街或者路的要用不同颜色
        let color = '#A6A3A0';

        if (this._feature.properties.name.substr(-1, 1) === '街') {
            color = '#BF4F4F';
        } else if (this._feature.properties.name.substr(-1, 1) === '路') {
            color = '#17A908';
        }

        const symbolData = {
            type: 'TextLineSymbol',
            text: this._feature.properties.name,
            gap: 300,
            marker: {
                type: 'TextMarkerSymbol',
                font: '微软雅黑',
                size: 10,
                color: color,
            },
        };
        const symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    }

    /**
     * 要素渲染辅助函数,返回要素渲染时的线几何符号对象
     * @return {object} 符号对象
     */
    _addForm36Symbol() {
        if (this._zoom <= 14) {
            return;
        }
        const symbolData = {
            type: 'TextLineSymbol',
            text: 'POI',
            offset: 20,
            marker: {
                type: 'TextMarkerSymbol',
                font: '微软雅黑',
                size: 14,
                color: 'black',
            },
        };
        const symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    }

    /**
     * 要素渲染辅助函数,返回要素渲染时的线几何符号对象
     * @return {object} 符号对象
     */
    _addForm30Symbol() {
        const symbolData = {
            type: 'HashLineSymbol',
            hashHeight: 6,
            hashLine: {
                type: 'SimpleLineSymbol',
                color: this._color,
                width: this._width,
                opacity: this._opacity,
                style: 'solid',
            },
            pattern: [2, 5],
        };
        const symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    }

    /**
     * 要素渲染辅助函数,返回要素渲染时的线几何符号对象
     * @return {object} 符号对象
     */
    _addForm31Symbol() {
        const symbolData = {
            type: 'CartoLineSymbol',
            color: this._color,
            width: this._width,
            opacity: this._opacity,
            pattern: [4, 4],
        };
        const symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    }

    /**
     * 要素渲染辅助函数,返回要素渲染时的线几何符号对象
     * @return {object} 符号对象
     */
    _addLimit4Symbol() {
        const symbolData = {
            type: 'MarkerLineSymbol',
            marker: {
                type: 'TiltedCrossMarkerSymbol',
                size: 6,
                color: 'red',
                width: this._width,
                opacity: this._opacity,
            },
            pattern: [10, 10],
        };
        const symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    }

    /**
     * 要素渲染辅助函数,返回要素渲染时的线几何符号对象
     * @return {object} 符号对象
     */
    _addForm20Symbol() {
        const symbolData = {
            type: 'MarkerLineSymbol',
            startOffset: 10,
            offset: -20,
            marker: {
                type: 'CircleMarkerSymbol',
                radius: 2,
                color: '#009ef9',
                offsetY: 2,
                outLine: {
                    width: this._width,
                    color: '#009ef9',
                },
            },
            pattern: [20, 20],
        };
        const symbolData1 = {
            type: 'MarkerLineSymbol',
            startOffset: 10,
            offset: -20,
            marker: {
                type: 'CircleMarkerSymbol',
                radius: 2,
                color: '#009ef9',
                offsetY: 2,
                outLine: {
                    width: this._width,
                    color: '#009ef9',
                },
            },
            pattern: [20, 20],
        };
        const json = {
            type: 'CompositeLineSymbol',
            symbols: [symbolData, symbolData1],
        };
        const symbol = this._symbolFactory.createSymbol(json);
        this._symbol.symbols.push(symbol);
    }

    /**
     * 要素渲染辅助函数,返回要素渲染时的线几何符号对象
     * @return {object} 符号对象
     */
    _addLimit0Symbol() {
        const symbolData = {
            type: 'MarkerLineSymbol',
            marker: {
                type: 'TiltedCrossMarkerSymbol',
                size: 6,
                color: '#666666',
                opacity: this._opacity,
            },
            pattern: [10, 10],
        };
        const symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    }

    /**
     * 要素渲染辅助函数,返回要素渲染时的线几何符号对象
     * @return {object} 符号对象
     */
    _addForm15Symbol() {
        const symbolData = {
            type: 'CartoLineSymbol',
            color: this._color,
            width: this._width,
            opacity: this._opacity,
            pattern: [4, 4, 12, 4],
        };
        const symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    }

    /**
     * 要素渲染辅助函数,返回要素渲染时的线几何符号对象
     * @return {object} 符号对象
     */
    _addForm52Symbol() {
        const symbolData = {
            type: 'CartoLineSymbol',
            color: this._color,
            width: this._width,
            opacity: this._opacity,
            pattern: [4, 4, 12, 4],
        };
        const symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    }
}
