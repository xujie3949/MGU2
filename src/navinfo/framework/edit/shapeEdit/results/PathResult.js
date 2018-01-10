import ShapeEditResult from './ShapeEditResult';
import Util from '../../../../common/Util';

/**
 * Created by xujie3949 on 2016/12/8.
 */
class PathResult extends ShapeEditResult {
    constructor() {
        super('PathResult');

        this.snapActors = [];
        this.changeDirection = true;
    }

    clone() {
        const editResult = new PathResult();
        this.cloneProperties(editResult);
        return editResult;
    }

    cloneProperties(editResult) {
        super.cloneProperties(editResult);
        editResult.snapActors = Util.clone(this.snapActors);
        editResult.changeDirection = Util.clone(this.changeDirection);
    }
}

export default PathResult;
