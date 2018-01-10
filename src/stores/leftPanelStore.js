import {
    observable,
    action,
    computed,
} from 'mobx';

class LeftPanelStore {
    @observable isShow;

    constructor() {
        this.isShow = false;
    }

    @action
    open() {
        this.isShow = true;
    }

    @action
    close() {
        this.isShow = false;
    }

    @action
    switch() {
        this.isShow = !this.isShow;
    }
}

const leftPanelStore = new LeftPanelStore();
export default leftPanelStore;
