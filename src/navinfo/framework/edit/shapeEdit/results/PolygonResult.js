import ShapeEditResult from './ShapeEditResult';
import Util from '../../../../common/Util';

/**
 * Created by xujie3949 on 2016/12/8.
 */
class PolygonResult extends ShapeEditResult {
    constructor() {
        super('PolygonResult');

        this.finalGeometry = {
            type: 'LineString',
            coordinates: [],
        };

        this.isClosed = false;
    }

    clone() {
        const editResult = new PolygonResult();
        this.cloneProperties(editResult);
        return editResult;
    }

    cloneProperties(editResult) {
        super.cloneProperties(editResult);
        editResult.isClosed = Util.clone(this.isClosed);
    }
}

export default PolygonResult;
