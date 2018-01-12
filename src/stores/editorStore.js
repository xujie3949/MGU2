import {
    observable,
    action,
    computed,
} from 'mobx';

class EditorStore {
    @observable.ref left;
    @observable.ref right;
    @observable.ref main;

    constructor() {
        this.left = null;
        this.right = null;
        this.main = null;
    }

    @action
    setLeft(value) {
        this.left = value;
    }

    @action
    setRight(value) {
        this.right = value;
    }

    @action
    setMain(value) {
        this.main = value;
    }
}

const editorStore = new EditorStore();
export default editorStore;
