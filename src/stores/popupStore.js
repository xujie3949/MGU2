import {
  observable,
  action,
  computed,
} from 'mobx';

class PopupStore {
  @observable isVisible;
  @observable type;
  @observable title;
  @observable message;
  @observable confirmButton;
  @observable confirmButtonText;
  @observable confirmButtonFunc;
  @observable cancelButton;
  @observable cancelButtonText;
  @observable cancelButtonFunc;

  constructor() {
    this.isVisible = false;
    this.type = 'info';
    this.title = '信息';
    this.message = '';
    this.confirmButton = true;
    this.confirmButtonText = '确定';
    this.confirmButtonFunc = null;
    this.cancelButton = true;
    this.cancelButtonText = '取消';
    this.cancelButtonFunc = null;
  }

  @action
  show(options) {
    this.isVisible = true;
    this.type = options.type || 'info';
    this.title = options.title || '信息';
    this.message = options.message || '';
    this.confirmButton = options.confirmButton || true;
    this.confirmButtonText = options.confirmButtonText || '确定';
    this.confirmButtonFunc = options.confirmButtonFunc || null;
    this.cancelButton = options.cancelButton || true;
    this.cancelButtonText = options.cancelButtonText || '取消';
    this.cancelButtonFunc = options.cancelButtonFunc || null;
  }

  @action
  close() {
    this.isVisible = false;
  }

  showError(message, confirmFunc) {
    this.show({
      type: 'error',
      title: '错误',
      message: message,
      confirmButton: true,
      confirmButtonText: '确定',
      confirmButtonFunc: confirmFunc,
      cancelButton: false,
    });
  }

  showWarning(message, confirmFunc, cancelFunc) {
    this.show({
      type: 'warning',
      title: '警告',
      message: message,
      confirmButton: true,
      confirmButtonText: '确定',
      confirmButtonFunc: confirmFunc,
      cancelButton: true,
      cancelButtonText: '取消',
      cancelButtonFunc: cancelFunc,
    });
  }

  showInfo(message, confirmFunc, cancelFunc) {
    this.show({
      type: 'error',
      title: '信息',
      message: message,
      confirmButton: true,
      confirmButtonText: '确定',
      confirmButtonFunc: confirmFunc,
      cancelButton: true,
      confirmButtonText: '取消',
      confirmButtonFunc: cancelFunc,
    });
  }
}

const popupStore = new PopupStore();
export default popupStore;
