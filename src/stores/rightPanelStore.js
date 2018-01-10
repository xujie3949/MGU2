import {
    observable,
    action,
    computed,
} from 'mobx';

class RightPanelStore {
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

const rightPanelStore = new RightPanelStore();
export default rightPanelStore;
