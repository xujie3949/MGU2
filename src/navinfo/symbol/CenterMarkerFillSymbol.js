import FillSymbol from './FillSymbol';
import SymbolFactory from './SymbolFactory';
import GeometryFactory from '../geometry/GeometryFactory';
import GeometryAlgorithm from '../geometry/GeometryAlgorithm';

/**
 * 将点符号绘制在面的中间,只绘制一遍
 */
export default class CenterMarkerFillSymbol extends FillSymbol {
    constructor(options) {
        // 执行父类初始化
        super(options);

        this.type = 'CenterMarkerFillSymbol';

        this.marker = null;

        this.fromJson(options);
    }

    fromJson(json) {
        super.fromJson(json);
        const symbolFactory = SymbolFactory.getInstance();
        if (json.marker) {
            this.marker = symbolFactory.createSymbol(json.marker);
        }
    }

    toJson() {
        const json = super.toJson();
        if (this.marker) {
            json.marker = this.marker.toJson();
        }

        return json;
    }

    /**
     * 将点符号绘制到面的质心位置
     * @param ctx
     */
    drawContent(ctx) {
        const geometryAlgorithm = GeometryAlgorithm.getInstance();
        const geometryFactory = GeometryFactory.getInstance();
        const geojsonPolygon = geometryFactory.toGeojson(this.geometry);
        const geojsonPoint = geometryAlgorithm.centroid(geojsonPolygon);
        this.marker.geometry = geometryFactory.fromGeojson(geojsonPoint);
        this.marker.draw(ctx);
    }
}
