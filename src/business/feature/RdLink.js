import Feature from '../../navinfo/mapApi/render/Feature';

/**
 * 道路线的前端数据模型
 */
class RdLink extends Feature {
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    constructor() {
        super();

        this.type = 'RDLINK';
    }

    setAttribute(data) {
        if (!data) {
            return;
        }
        this.id = data.i;
        this._getGeometry(data);
        this._getProperties(data);
    }

    _getGeometry(data) {
        this.geometry = {
            type: 'LineString',
            coordinates: data.g,
        };
    }

    _getProperties(data) {
        this.properties = {};
        this.properties.kind = data.m.a;
        this.properties.name = data.m.b;
        this.properties.direct = data.m.d;
        this.properties.snode = data.m.e;
        this.properties.enode = data.m.f;
        this.properties.limit = data.m.c || '';
        this.properties.form = data.m.h;
        this.properties.fc = data.m.i;
        this.properties.length = data.m.k;
        this.properties.imiCode = data.m.j;
        this.properties.special = data.m.l;
        this.properties.LaneNum = data.m.m;
    }

    clone() {
        const newFeature = new RdLink();
        this.copyProperties(newFeature);
        return newFeature;
    }
}

function createFeature(data) {
    const feature = new RdLink();
    feature.setAttribute(data);
    return feature;
}

export default createFeature;
