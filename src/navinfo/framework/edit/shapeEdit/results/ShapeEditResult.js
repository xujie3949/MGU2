import EditResult from '../../EditResult';
import Util from '../../../../common/Util';

/**
 * Created by xujie3949 on 2016/12/8.
 */

class ShapeEditResult extends EditResult {
    constructor() {
        super();

        this.finalGeometry = null;
        this.snapResults = {};
    }

    clone() {
        const editResult = new ShapeEditResult();
        this.cloneProperties(editResult);
        return editResult;
    }

    cloneProperties(editResult) {
        super.cloneProperties(editResult);
        editResult.finalGeometry = Util.clone(this.finalGeometry);
        editResult.snapResults = Util.clone(this.snapResults);
    }
}

export default ShapeEditResult;
