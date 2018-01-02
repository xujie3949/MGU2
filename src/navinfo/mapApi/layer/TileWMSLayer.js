/**
 * @class
 */
export default class TileWMSLayer extends L.TileLayer {
    defaultWmsParams = {
        service: 'WMS',
        request: 'GetMap',
        version: '1.1.1',
        layers: '',
        styles: '',
        format: 'image/jpeg',
        transparent: false,
    };

    constructor(url, options) {
        super();
        // (String, Object)
        this.shifx = 0;
        this.shify = 0;
        this._url = url;

        const wmsParams = L.extend({}, this.defaultWmsParams);
        const tileSize = options.tileSize || this.options.tileSize;

        if (options.detectRetina && L.Browser.retina) {
            wmsParams.width = tileSize * 2;
            wmsParams.height = tileSize * 2;
        } else {
            wmsParams.width = tileSize;
            wmsParams.height = tileSize;
        }

        for (const i in options) {
            // all keys that are not TileLayer options go to WMS params
            if (!this.options.hasOwnProperty(i) && i !== 'crs') {
                wmsParams[i] = options[i];
            }
        }

        this.wmsParams = wmsParams;

        L.setOptions(this, options);
    }

    onAdd(map) {
        this._crs = this.options.crs || map.options.crs;

        this._wmsVersion = parseFloat(this.wmsParams.version);

        const projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
        this.wmsParams[projectionKey] = this._crs.code;

        L.TileLayer.prototype.onAdd.call(this, map);
    }

    setShif(x, y) {
        this.shifx += x;
        this.shify += y;
    }

    getTileUrl(tilePoint) { // (Point, Number) -> String
        const map = this._map;
        const tileSize = this.options.tileSize;
        const nwPoint = tilePoint.multiplyBy(tileSize);
        const sePoint = nwPoint.add([tileSize, tileSize]);
        const nw = this._crs.project(map.unproject(nwPoint, tilePoint.z));
        const se = this._crs.project(map.unproject(sePoint, tilePoint.z));
        const bbox = this._wmsVersion >= 1.3 && this._crs === L.CRS.EPSG4326 ?
            [se.y, nw.x, nw.y, se.x].join(',') :
            [nw.x, se.y, se.x, nw.y].join(',');
        const url = L.Util.template(this._url, { s: this._getSubdomain(tilePoint) });
        const paramString = L.Util.getParamString(
            this.wmsParams,
            url,
            true,
        );
        return `${url}${paramString}&BBOX=${bbox}&time=${new Date().getTime()}`;
    }

    _update() {
        if (!this._map) {
            return;
        }

        const map = this._map;
        let bounds = map.getPixelBounds();
        const ld = bounds.getBottomLeft().add(L.point(this.shifx, this.shify));
        const ru = bounds.getTopRight().add(L.point(this.shifx, this.shify));
        bounds = L.bounds(ld, ru);
        const zoom = map.getZoom();
        const tileSize = this._getTileSize();

        if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
            return;
        }

        const tileBounds = L.bounds(
            bounds.min.divideBy(tileSize)._floor(),
            bounds.max.divideBy(tileSize)._floor(),
        );

        this._addTilesFromCenterOut(tileBounds);

        if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
            this._removeOtherTiles(tileBounds);
        }
    }

    setParams(params, noRedraw) {
        L.extend(this.wmsParams, params);

        if (!noRedraw) {
            this.redraw();
        }

        return this;
    }
}
