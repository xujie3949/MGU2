import WholeLayer from './WholeLayer';
import GeometryTransform from '../../geometry/GeometryTransform';
import SymbolFactory from '../../symbol/SymbolFactory';
import GeometryFactory from '../../geometry/GeometryFactory';

/**
 * @class
 * 代表整体的图层
 */
export default class TileBoundsLayer extends WholeLayer {
    /** *
     *
     * @param options 初始化可选options
     */
    constructor(options) {
        super(options);

        this.options = options || {};
        this._tiles = {};

        this._transform = GeometryTransform.getInstance();
    }

    /** *
     * 绘制图层内容
     */
    _redraw(features) {
        this.clear();
        this._updateTiles();
        this._resetCanvasPosition();
        this._drawTiles(this._tiles);
    }

    /** *
     * 清空图层
     */
    clear() {
        this._ctx.clearRect(0, 0, this.canv.width, this.canv.height);
        this._tiles = {};
    }

    _createTileSymbol(tile) {
        const symbolData = {
            type: 'CompositeFillSymbol',
            symbols: [
                {
                    type: 'CenterMarkerFillSymbol',
                    marker: {
                        type: 'TextMarkerSymbol',
                        font: '微软雅黑',
                        size: 20,
                        color: 'red',
                        text: `${tile.x}/${tile.y}/${tile.z}`,
                    },
                },
                {
                    type: 'SimpleFillSymbol',
                    color: 'transparent',
                    outLine: {
                        type: 'SimpleLineSymbol',
                        color: 'red',
                        width: 1,
                    },
                },
            ],
        };
        const symbolFactory = SymbolFactory.getInstance();
        const symbol = symbolFactory.createSymbol(symbolData);
        const geometryFactory = GeometryFactory.getInstance();
        symbol.geometry = geometryFactory.fromGeojson(tile.bounds);
        return symbol;
    }

    _drawTiles(tiles) {
        this._transform.setEnviroment(this.map, null, this._convertGeometry);
        const g = this._ctx.canvas.getContext('2d');
        const keys = Object.getOwnPropertyNames(this._tiles);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const tile = this._tiles[key];
            const symbol = this._createTileSymbol(tile);
            const convertedGeometry = this._transform.convertGeometry(symbol.geometry);
            symbol.geometry = convertedGeometry;
            symbol.draw(g);
        }
    }

    _updateTiles() {
        const map = this.map;
        const bounds = map.getPixelBounds();
        const zoom = map.getZoom();
        const tileSize = this.options.tileSize;

        const tileBounds = L.bounds(
            bounds.min.divideBy(tileSize)._floor(),
            bounds.max.divideBy(tileSize)._floor(),
        );

        this._addTilesFromCenterOut(tileBounds);
    }

    _addTilesFromCenterOut(bounds) {
        const queue = [];
        const center = bounds.getCenter();
        const zoom = this.map.getZoom();

        for (let j = bounds.min.y; j <= bounds.max.y; j++) {
            for (let i = bounds.min.x; i <= bounds.max.x; i++) {
                const point = new L.Point(i, j);
                queue.push(point);
            }
        }

        // load tiles in order of their distance to center
        queue.sort((a, b) => a.distanceTo(center) - b.distanceTo(center));

        for (let i = 0; i < queue.length; i++) {
            const x = queue[i].x;
            const y = queue[i].y;
            const tile = this._createTile(x, y, zoom);
            this._tiles[tile.name] = tile;
        }
    }

    _createTile(x, y, z) {
        const bounds = this._getTileBounds(x, y);
        const tile = {
            name: `${x}:${y}`,
            x: x,
            y: y,
            z: z,
            size: this.options.tileSize,
            bounds: bounds,
        };
        return tile;
    }

    _getTileBounds(x, y) {
        const tileSize = this.options.tileSize;
        const tilePoint = new L.Point(x, y);
        const nwPoint = tilePoint.multiplyBy(tileSize);
        const sePoint = nwPoint.add([tileSize, tileSize]);
        const nw = this.map.unproject(nwPoint);
        const se = this.map.unproject(sePoint);

        const bounds = {
            type: 'Polygon',
            coordinates: [
                [
                    [nw.lng, nw.lat],
                    [se.lng, nw.lat],
                    [se.lng, se.lat],
                    [nw.lng, se.lat],
                    [nw.lng, nw.lat],
                ],
            ],
        };

        return bounds;
    }

    _convertGeometry(map, tile, geometry) {
        const point = map.latLngToContainerPoint([geometry.y, geometry.x]);
        geometry.x = point.x;
        geometry.y = point.y;
        return geometry;
    }
}
