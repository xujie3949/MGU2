import MeshLayer from './MeshLayer';

/**
 * @class
 * 1:25000图幅图层
 */
export default class GridLayer extends MeshLayer {
    /** *
     * 初始化可选参数
     * @param {Object}options
     */
    constructor(options) {
        super(options);
        this.minZoom = this.options.minZoom || 9;
        this.maxZoom = this.options.maxZoom || 20;
        this.divideX = this.options.divideX || 0;
        this.divideY = this.options.divideY || 0;
    }

    /** *
     * 图层添加到地图时调用
     * @param{L.Map} map
     */
    onAdd(map) {
        this.map = map;
        this._initContainer(this.options);
        map.on('moveend', this._redraw, this);
        this._redraw();
    }

    /** *
     * 根据bounds绘制图幅
     * @param {L.Bounds}bounds
     */
    draw(bounds) {
        const pointDL = bounds.getSouthWest();
        // 右上角点
        const pointUR = bounds.getNorthEast();
        // const ret= this.CalculateMeshIds(pointDL.lng, pointUR.lng, pointDL.lat, pointUR.lat);
        const minPoint = this.Calculate25TMeshCorner(pointDL);
        let minLon = minPoint.lng;
        const minLat = minPoint.lat;
        this.gridArr = [];
        const labelArr = [];
        while (minLon <= pointUR.lng) {
            const gridObj = this.createGrid(minLon, minLon + 0.125, minLat, pointUR.lat);
            this.gridArr = this.gridArr.concat(gridObj);
            minLon += 0.125;
        }
        for (let i = 0, len = this.gridArr.length; i < len; i++) {
            const latlngbounds = this.gridArr[i].getBounds();
            const bound = L.bounds(
                this.map.latLngToContainerPoint(latlngbounds.getNorthWest()),
                this.map.latLngToContainerPoint(latlngbounds.getSouthEast()),
            );
            const size = bound.getSize();
            this.drawRect(this._ctx, this.gridArr[i], {
                x: bound.min.x,
                y: bound.min.y,
                width: size.x,
                height: size.y,
            });
        }
    }

    /** *
     * 绘制格网
     * @param {Object}context canvas context
     * @param meshId 图幅id
     * @param options 可选参数
     */
    drawRect(context, grid, options) {
        context.globalAlpha = 0.3;
        context.linewidth = 1; // 边框宽
        context.strokeStyle = '#000AFF'; // 边框颜色
        context.strokeRect(options.x, options.y, options.width, options.height);
    }

    /** *
     * 重绘
     * @returns {fastmap.mapApi.MeshLayer}
     */
    _redraw() {
        this._resetCanvasPosition();
        this.clear();
        if (this.map.getZoom() >= this.minZoom && this.map.getZoom() <= this.maxZoom) {
            this.draw(this.map.getBounds());
        }
        return this;
    }

    /** *
     * 生成图幅格网
     * @param {number}minLon 最小经度
     * @param {number}maxLon 最大经度
     * @param {number}origin 原点
     * @param {number}destination 最大经度
     * @returns {Array}
     */
    createGrid(minLon, maxLon, origin, destination) {
        // 保存生成的网格
        const grid = [];
        const labels = [];
        let newOrigin = origin;
        const plusOri = () => {
            newOrigin += 0.083333333333333;
        };
        while (origin <= destination) {
            const components = [];
            components.push([origin, minLon]);
            components.push([origin + 0.083333333333333, minLon]);
            components.push([origin + 0.083333333333333, maxLon]);
            components.push([origin, maxLon]);
            const meshId = this.Calculate25TMeshId(
                {
                    lng: (minLon + maxLon) / 2,
                    lat: (origin + origin + 0.083333333333333) / 2,
                },
            );
            const bound = this.Calculate25TMeshBorder(meshId);

            this.createSubGrid(grid, bound, meshId, plusOri);
        }
        return grid;
    }

    createSubGrid(grid, bound, meshId, callback) {
        let differenceY = bound.maxLat - bound.minLat;
        if (this.divideY > 0) {
            differenceY = (bound.maxLat - bound.minLat) / this.divideY;
        }
        let differenceX = bound.maxLon - bound.minLon;
        if (this.divideX > 0) {
            differenceX = (bound.maxLon - bound.minLon) / this.divideX;
        }
        for (let i = 0; i < this.divideX; i++) {
            const boundXmin = bound.minLon + differenceX * i;
            const boundXmax = bound.minLon + differenceX * (i + 1);
            for (let j = 0; j < this.divideY; j++) {
                const boundYmin = bound.minLat + differenceY * j;
                const boundYmax = bound.minLat + differenceY * (j + 1);
                const b = L.latLngBounds([boundYmin, boundXmin], [boundYmax, boundXmax]);
                const polygon = L.rectangle(b, {
                    meshId: meshId,
                    gridId: `${meshId}_${j}${i}`,
                });
                grid.push(polygon);
            }
        }
        callback();
    }

    /** *
     * 清空图层
     */
    clear() {
        this.canv.getContext('2d').clearRect(0, 0, this.canv.width, this.canv.height);
    }

    /** *
     * 重新调整图层位置
     */
    _resetCanvasPosition() {
        const bounds = this.map.getBounds();
        const topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
        L.DomUtil.setPosition(this._div, topLeft);
    }

    /*
     *  根据纬度计算该点位于理想图幅分割的行序号
     *
     *  @param{number}lat                 纬度      单位‘度’
     *  @param{number}remainder           余数      单位‘千秒’
     */
    CalculateIdealRowIndex(lat, remainder) {
        // 相对区域纬度 = 绝对纬度 - 0.0
        const regionLatitude = lat - 0.0;
        // 相对的以秒为单位的纬度
        const secondLatitude = regionLatitude * 3600;
        let longsecond;
        // 为避免浮点数的内存影响，将秒*10的三次方(由于0.00001度为0.036秒)
        if (secondLatitude * 1000 < 0) {
            longsecond = Math.ceil(secondLatitude * 1000);
        } else {
            longsecond = Math.floor(secondLatitude * 1000);
        }

        return {
            value: Math.floor(longsecond / 300000),
            reminder: longsecond % 300000,
        };
    }

    /*
     *  根据纬度计算该点位于实际图幅分割的行序号
     *
     *  @param{number}lat                 纬度      单位‘度’
     *  @param{number}remainder           余数      单位‘千秒’
     */
    CalculateRealRowIndex(lat, remainder) {
        // 理想行号
        const idealRow = this.CalculateIdealRowIndex(lat, remainder);
        switch (idealRow % 3) { // 三个一组的余数
            case 0: // 第一行
                // 余数距离上框小于0.012秒
                if (300000 - idealRow.remainder <= 12) {
                    idealRow.value++;
                }
                break;
            case 1: // 第二行
                break;
            case 2: // 第三行
                // 余数距离下框小于等于0.012秒
                if (idealRow.remainder < 12) {
                    idealRow.value--;
                }
                break;
            default:
                break;
        }
        return idealRow;
    }

    /*
     *  根据经度计算该点位于实际图幅分割的列序号
     *
     *  @param{number}lon                经度，单位“度”
     */
    CalculateRealColumnIndex(lon, remainder) {
        return this.CalculateIdealColumnIndex(lon, remainder);
    }

    /*
     * 根据经度计算该点位于理想图幅分割的列序号
     *
     *  @param{number}lon                经度，单位“度”
     *  @param{number}reminder           余数 单位“千秒”
     */
    CalculateIdealColumnIndex(lon, remainder) {
        // 相对区域经度 = 绝对经度 - 60.0
        const regionLongitude = lon - 60.0;
        // 相对的以秒为单位的经度
        const secondLongitude = regionLongitude * 3600;
        // 为避免浮点数的内存影响，将秒*10的三次方(由于0.00001度为0.036秒)
        const longsecond = Math.floor(secondLongitude * 1000);

        return {
            value: Math.floor(longsecond / 450000),
            reminder: Math.floor(longsecond % 450000),
        };
    }

    MeshLocator25T(lon, lat) {
        let newLat = lat;
        // 为了保证它总返回右上的图幅
        if ((this.IsAt25TMeshBorder(lon, lat) & 0x0F) === 0x01) {
            newLat += 0.00001;
        }
        const remainder = 0;
        const rowResult = this.CalculateRealRowIndex(newLat, remainder);
        const colResult = this.CalculateRealColumnIndex(lon, rowResult.remainder);
        // 第1、2位 : 纬度取整拉伸1.5倍
        const M1M2 = Math.floor(newLat * 1.5);
        // 第3、4位 : 经度减去日本角点 60度
        const M3M4 = Math.floor(lon) - 60;
        // 第5位 :
        const M5 = rowResult.value % 8;
        // 第6位 : 每列450秒，每度包含8列
        const M6 = colResult.value % 8;
        // 连接以上数字,组成图幅号
        let sMeshId = `${M1M2}${M3M4}${M5}${M6}`;
        while (sMeshId.length < 6) {
            sMeshId = `0${sMeshId}`;
        }
        return sMeshId;
    }

    /*
     *  点所在的图幅号,如果点在图幅边界上,返回右上的图幅号
     *
     *  @param {L.Latlng}point   经纬度点
     */
    Calculate25TMeshId(point) {
        const mesh = this.MeshLocator25T(point.lng, point.lat);
        return mesh;
    }

    /*
     *  快速计算点所在的图幅左下角点
     *
     *  @param{L.Latlng}point          经纬度点
     */
    Calculate25TMeshCorner(point) {
        return this.Calculate25TMeshCornerByMeshId(this.Calculate25TMeshId(point));
    }

    /** *
     * 计算图幅角点坐标
     * @param {String}mesh
     * @returns {*}
     * @constructor
     */
    Calculate25TMeshCornerByMeshId(mesh) {
        const cc = mesh.split('');
        const M1 = parseInt(cc[0], 0);
        const M2 = parseInt(cc[1], 0);
        const M3 = parseInt(cc[2], 0);
        const M4 = parseInt(cc[3], 0);
        const M5 = parseInt(cc[4], 0);
        const M6 = parseInt(cc[5], 0);
        const x = (M3 * 10 + M4) * 3600 + M6 * 450 + 60 * 3600;
        const y = (M1 * 10 + M2) * 2400 + M5 * 300;
        const point = L.latLng(y / 3600.0, x / 3600.0);
        return point;
    }

    /** *
     *  计算图幅border
     * @param {String}mesh
     * @returns {{minLon:
     *     (*|a.lng|L.LatLng.lng|L.LatLngBounds._southWest.lng|L.LatLngBounds._northEast.lng|o.LatLngBounds._northEast.lng),
     *     minLat:
     *     (*|a.lat|L.LatLng.lat|L.LatLngBounds._southWest.lat|L.LatLngBounds._northEast.lat|o.LatLngBounds._northEast.lat),
     *     maxLon:
     *     (*|a.lng|L.LatLng.lng|L.LatLngBounds._southWest.lng|L.LatLngBounds._northEast.lng|o.LatLngBounds._northEast.lng),
     *     maxLat:
     *     (*|a.lat|L.LatLng.lat|L.LatLngBounds._southWest.lat|L.LatLngBounds._northEast.lat|o.LatLngBounds._northEast.lat)}}
     * @constructor
     */
    Calculate25TMeshBorder(mesh) {
        const cc = mesh.split('');
        const M1 = parseInt(cc[0], 0);
        const M2 = parseInt(cc[1], 0);
        const M3 = parseInt(cc[2], 0);
        const M4 = parseInt(cc[3], 0);
        const M5 = parseInt(cc[4], 0);
        const M6 = parseInt(cc[5], 0);
        const xConner = (M3 * 10 + M4) * 3600 + M6 * 450 + 60 * 3600;
        const yConner = (M1 * 10 + M2) * 2400 + M5 * 300;
        const xUpper = xConner + 450.0;
        const yUpper = yConner + 300.0;
        const leftBottom = L.latLng(yConner / 3600.0, xConner / 3600.0);
        const rightTop = L.latLng(yUpper / 3600.0, xUpper / 3600.0);
        return {
            minLon: leftBottom.lng,
            minLat: leftBottom.lat,
            maxLon: rightTop.lng,
            maxLat: rightTop.lat,
        };
    }

    /*
     *  点是否在图框上
     *
     *  @param{number}lon               经度
     *  @param{number}lat               纬度
     */
    IsAt25TMeshBorder(lon, lat) {
        let model = 0;
        const remainder = 0;
        const rowResult = this.CalculateIdealRowIndex(lat, remainder);
        switch (rowResult.value % 3) {
            case 0: // 第一行
                // 余数距离上框等于0.012秒
                if (300000 - rowResult.remainder === 12) {
                    model |= 0x01;
                } else if (rowResult.remainder === 0) model |= 0x01;
                break;
            case 1: // 第二行由于上下边框均不在其内，因此不在图框上
                break;
            case 2: // 第三行
                // 余数距离下框等于0.012秒
                if (rowResult.remainder === 12) {
                    model |= 0x01;
                }
                break;
            default:
                break;
        }
        const colResult = this.CalculateRealColumnIndex(lon, rowResult.remainder);
        if (colResult.remainder === 0) model |= 0x10;
        return model;
    }
}
