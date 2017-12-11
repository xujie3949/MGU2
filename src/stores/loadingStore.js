import {
  observable,
  action,
  computed,
} from 'mobx';

class LoadingStore {
  @observable isVisible;

  constructor() {
    this.isVisible = false;
  }

  @action
  show() {
    this.isVisible = value;
  }

  @action
  close() {
    this.isVisible = value;
  }
}

const loadingStore = new LoadingStore();
export default loadingStore;
