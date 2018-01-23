import navinfo from 'navinfo';

/**
 * 道路点的前端数据模型
 */
class RdNode extends navinfo.mapApi.render.Feature {
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    constructor(data) {
        super(data);

        this.type = 'RDNODE';
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
            type: 'Point',
            coordinates: data.g,
        };
    }

    _getProperties(data) {
        this.properties = {};
        this.properties = {};
        if (data.m.a) {
            this.properties.links = data.m.a.split(',').map(item => parseInt(item, 10));
        } else {
            this.properties.links = [];
        }
        this.properties.forms = data.m.b;
        this.properties.kind = data.m.c;
    }

    clone() {
        const newFeature = new RdNode();
        this.copyProperties(newFeature);
        return newFeature;
    }

    copyProperties(obj) {
        super.properties(obj);
    }
}

function createFeature(data) {
    const feature = new RdNode();
    feature.setAttribute(data);
    return feature;
}

export default createFeature;
