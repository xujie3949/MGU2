import {
    observable,
    action,
    computed,
} from 'mobx';
import Map from 'Components/map/Map';

class EditorStore {
    @observable.ref splitParameter;
    @observable.ref main;

    constructor() {
        this.splitParameter = null;
        this.main = null;
    }

    @action
    setSplitParameter(value) {
        this.splitParameter = value;
    }

    @action
    setMain(value) {
        this.main = value;
    }
}

const editorStore = new EditorStore();
export default editorStore;
