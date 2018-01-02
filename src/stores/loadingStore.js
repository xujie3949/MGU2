import {
    observable,
    action,
    computed,
} from 'mobx';

class LoadingStore {
  @observable isVisible;
  @observable message;

  constructor() {
      this.isVisible = false;
      this.message = null;
  }

  @action
  show(message) {
      this.isVisible = true;
      this.message = message || '请稍等……';
  }

  @action
  close() {
      this.isVisible = false;
      this.message = null;
  }
}

const loadingStore = new LoadingStore();
export default loadingStore;
