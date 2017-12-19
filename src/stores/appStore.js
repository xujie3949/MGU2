import {
  observable,
  action,
  computed,
} from 'mobx';

class AppState {
  @observable viewWidth;
  @observable viewHeight;
  @observable windowWidth;
  @observable windowHeight;

  constructor() {
    this.viewWidth = 1920;
    this.viewHeight = 1080;
    this.windowWidth = 0;
    this.windowHeight = 0;
  }

  @action
  setViewWidth(value) {
    this.viewWidth = value;
  }

  @action
  setViewHeight(value) {
    this.viewHeight = value;
  }

  @action
  setWindowWidth(value) {
    this.windowWidth = value;
  }

  @action
  setWindowHeight(value) {
    this.windowHeight = value;
  }

  @computed
  get scaleX() {
    return this.windowWidth / this.viewWidth;
  }

  @computed
  get scaleY() {
    return this.windowHeight / this.viewHeight;
  }

  @computed
  get bestScale() {
    return Math.min(this.scaleX, this.scaleY);
  }
}

const appState = new AppState();
export default appState;
