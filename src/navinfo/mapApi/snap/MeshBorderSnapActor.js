import SnapActor from './SnapActor';
import MeshAlgorithm from '../../algorithm/MeshAlgorithm';

/**
 * 用于捕捉图幅线上离鼠标最近的位置.
 */
export default class MeshBorderSnapActor extends SnapActor {
    constructor() {
        super();
        /**
         * 图幅单例对象
         * @type {Object} meshAlgm
         */
        this.meshAlgm = MeshAlgorithm.getInstance();
        /**
         * 捕捉行为类型
         * @type {string} type
         */
        this.type = 'MeshBorderSnapActor';
    }

    snap(point, box) {
        super.snap(point, box);

        const borderLines = this._getMeshBorderLines(point);

        let minDist = Number.MAX_VALUE;
        for (let i = 0; i < borderLines.length; i++) {
            if (this.intersects(box, borderLines[i])) {
                const rest = this.nearestPoints(point, borderLines[i]);
                if (rest.distance < minDist) {
                    minDist = rest.distance;
                    this.point = rest.point2;
                    this.isSnapped = true;
                }
            }
        }

        return this.getSnapResult();
    }

    /**
     * 根据图幅的范围（是通过鼠标移动的点位计算的）将图幅的边界线转换为四条线几何.
     * @param {Object} point - 鼠标移动点的geoJson几何
     * @returns {Array} lines - 线几何数组
     */
    _getMeshBorderLines(point) {
        const latLon = {
            lng: point.coordinates[0],
            lat: point.coordinates[1],
        };
        const border = this.meshAlgm.Calculate25TMeshBorder(this.meshAlgm.Calculate25TMeshId(latLon));

        const lines = [];
        lines.push({
            type: 'LineString',
            coordinates: [
                [border.minLon, border.minLat],
                [border.minLon, border.maxLat],
            ],
        });
        lines.push({
            type: 'LineString',
            coordinates: [
                [border.minLon, border.maxLat],
                [border.maxLon, border.maxLat],
            ],
        });
        lines.push({
            type: 'LineString',
            coordinates: [
                [border.maxLon, border.maxLat],
                [border.maxLon, border.minLat],
            ],
        });
        lines.push({
            type: 'LineString',
            coordinates: [
                [border.maxLon, border.minLat],
                [border.minLon, border.minLat],
            ],
        });

        return lines;
    }
}
