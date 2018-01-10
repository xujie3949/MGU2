import CheckController from '../check/CheckController';

/**
 * Created by xujie3949 on 2016/12/8.
 */

class EditResult {
    constructor(type) {
        this.type = type;
        this.originObject = null;
        this.geoLiveType = 'unknown';

        this.checkController = CheckController.getInstance();
    }

    clone() {
        throw new Error('未实现clone方法');
    }

    cloneProperties(editResult) {
        if (!editResult) {
            return;
        }

        editResult.type = this.type;
        editResult.originObject = this.originObject;
        editResult.geoLiveType = this.geoLiveType;
    }

    check(situation) {
        let errMsg = '';
        const engine = this.checkController.getCheckEngine(this.geoLiveType, situation);
        if (engine && !engine.check(this)) {
            const length = engine.lastErrors.length;
            for (let i = 0; i < length; ++i) {
                const err = engine.lastErrors[i];
                errMsg += err.message;
                if (i !== length - 1) {
                    errMsg += '\n';
                }
            }
        }

        return errMsg;
    }
}

export default EditResult;
