import EventController from '../common/EventController';

/**
 * 该类是一个单例类，定义1:25000的图幅。提供了有关图幅计算的各种方法，
 * 包括根据经纬度计算图幅号；根据图幅号计算图幅范围；点位和图幅的关系等.
 */
export default class MeshAlgorithm {
    static instance = null;

    constructor() {
        this._eventController = EventController.getInstance();
        this._eventController.once('DestroySingleton', () => this.destroy());
    }

    /**
     * 根据纬度计算该点位于理想图幅分割的行序号.
     * @param {number} lat 纬度单位(度)
     * @param {number} remainder 余数单位(千秒)
     * @returns {{value: number, reminder: (number|*)}}
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

    /**
     * 根据纬度计算该点位于实际图幅分割的行序号.
     * @param {number} lat 纬度单位(度)
     * @param {number} remainder 余数单位(千秒)
     * @returns {*|{value, reminder}|{value: number, reminder: (number|*)}}
     */
    CalculateRealRowIndex(lat, remainder) {
        // 获得理想行号
        const idealRow = this.CalculateIdealRowIndex(lat, remainder);
        switch (idealRow % 3) {
            case 0: // 第一行
                if (300000 - idealRow.remainder <= 12) {
                    idealRow.value++;
                }
                break;
            case 1: // 第二行
                break;
            case 2: // 第三行
                if (idealRow.remainder < 12) {
                    idealRow.value--;
                }
                break;
            default:
                break;
        }
        return idealRow;
    }

    /**
     * 根据经度计算该点位于实际图幅分割的列序号
     * @param {Number} lon       经度，单位“度”
     * @param {Number} remainder [description]
     * @returns {*|{value, reminder}}
     */
    CalculateRealColumnIndex(lon, remainder) {
        return this.CalculateIdealColumnIndex(lon, remainder);
    }

    /**
     * 根据经度计算该点位于理想图幅分割的列序号.
     * @param {number} lon 经度单位(度)
     * @param {number} remainder 余数单位(千秒)
     * @returns {{value: number, reminder: (number|*)}}
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

    /**
     * 计算一个经纬度点所在的图幅(传入的经纬度坐标不能是图廓点，图廓点计算出来的不准确).
     * @param {number} lon 经度
     * @param {number} lat 纬度
     * @returns {string}
     */
    CalculateMesh25T(lon, lat) {
        const remainder = 0;
        const rowResult = this.CalculateRealRowIndex(lat, remainder);
        const colResult = this.CalculateRealColumnIndex(lon, rowResult.reminder);
        // 第1、2位 : 纬度取整拉伸1.5倍
        const M1M2 = Math.floor(lat * 1.5);
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

    /**
     * 计算一个经纬度点所在的图幅，角点和图廓点都返回其右上的图幅.
     * @param {number} lon 经度
     * @param {number} lat 纬度
     * @returns {string}
     */
    MeshLocator25T(lon, lat) {
        let newLat = lat;
        // 为了保证它总返回右上的图幅
        if ((this.GetBorderModel25T(lon, lat) & 0x0F) === 0x01) {
            newLat += 0.00001;
        }
        const remainder = 0;
        const rowResult = this.CalculateRealRowIndex(newLat, remainder);
        const colResult = this.CalculateRealColumnIndex(lon, rowResult.reminder);
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

    /**
     * 获取坐标点所在的25T图幅，图幅内的点返回一个，图廓线上的点返回两个，图幅角点返回四个.
     * @param {object} latlng 经纬度
     * @returns {Array}
     */
    GetMeshes25T(latlng) {
        const lon = latlng.lng;
        const lat = latlng.lat;
        const meshes = [];
        let meshId;
        const borderModal = this.GetBorderModel25T(lon, lat);
        let tmpLat;
        let tmpLon;
        // 横向图幅线上的点，以及角点
        if ((borderModal & 0x0F) === 0x01) {
            tmpLat = lat + 0.00001;
            meshId = this.CalculateMesh25T(lon, tmpLat);
            meshes.push(meshId);

            tmpLat = lat - 0.00001;
            meshId = this.CalculateMesh25T(lon, tmpLat);
            meshes.push(meshId);

            if ((borderModal & 0xF0) === 0x10) {
                tmpLon = lon - 0.00001;
                tmpLat = lat + 0.00001;
                meshId = this.CalculateMesh25T(tmpLon, tmpLat);
                meshes.push(meshId);

                tmpLat = lat - 0.00001;
                meshId = this.CalculateMesh25T(tmpLon, tmpLat);
                meshes.push(meshId);
            }
        } else if ((borderModal & 0xF0) === 0x10) { // 纵向图幅线上的点，
            tmpLat = lat;
            tmpLon = lon + 0.00001;
            meshId = this.CalculateMesh25T(tmpLon, tmpLat);
            meshes.push(meshId);

            tmpLon = lon - 0.00001;
            meshId = this.CalculateMesh25T(tmpLon, tmpLat);
            meshes.push(meshId);
        }

        // 图幅内的点
        if (borderModal === 0) {
            meshes.push(this.CalculateMesh25T(lon, lat));
        }

        return meshes;
    }

    /**
     * 点所在的图幅号,如果点在图幅边界上,返回右上的图幅号
     * @param {object} point 经纬度点
     * @returns {*|string}
     */
    Calculate25TMeshId(point) {
        const mesh = this.MeshLocator25T(point.lng, point.lat);
        return mesh;
    }

    /**
     * 快速计算点所在的图幅左下角点.
     * @param {object} point 经纬度点
     * @returns {*}
     */
    Calculate25TMeshCorner(point) {
        return this.Calculate25TMeshCornerByMeshId(this.Calculate25TMeshId(point));
    }

    /**
     * 根据图幅号计算图幅左下角点坐标.
     * @param {string} mesh 图幅号
     * @returns {object}
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

    /**
     * 根据图幅号计算图幅范围.
     * @param {string} mesh 图幅号
     * @returns {{minLon: number, minLat: number, maxLon: number, maxLat: number}}
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

    /**
     * 计算点与图幅边线的位置关系模式
     * @param{number}lon               经度
     * @param{number}lat               纬度
     */
    GetBorderModel25T(lon, lat) {
        let model = 0;
        const remainder = 0;
        const rowResult = this.CalculateIdealRowIndex(lat, remainder);
        switch (rowResult.value % 3) {
            case 0: // 第一行
                if (300000 - rowResult.reminder === 12) {
                    model |= 0x01;
                } else if (rowResult.reminder === 0) model |= 0x01;
                break;
            case 1: // 第二行由于上下边框均不在其内，因此不在图框上
                break;
            case 2: // 第三行
                if (rowResult.reminder === 12) {
                    model |= 0x01;
                }
                break;
            default:
                break;
        }
        const colResult = this.CalculateRealColumnIndex(lon, rowResult.reminder);
        if (colResult.reminder === 0) model |= 0x10;
        return model;
    }

    /**
     * 判断一个坐标点是否在25T图幅的边框上
     * @param {LatLng} latlng 经纬度坐标点
     * @return {Boolean}
     */
    IsOnMeshBorder25T(latlng) {
        const model = this.GetBorderModel25T(latlng.lng, latlng.lat);
        return (model & 0x0F) === 0x01 || (model & 0xF0) === 0x10;
    }

    /**
     * 单例销毁方法.
     * @return {undefined}
     */
    destroy() {
        MeshAlgorithm.instance = null;
    }

    /**
     * 获取图幅单例的静态方法.
     * @example
     * const MeshAlgorithm = MeshAlgorithm.getInstance();
     * @returns {Object} 返回 MeshAlgorithm.instance 单例对象.
     */
    static getInstance() {
        if (!MeshAlgorithm.instance) {
            MeshAlgorithm.instance = new MeshAlgorithm();
        }
        return MeshAlgorithm.instance;
    }
}
