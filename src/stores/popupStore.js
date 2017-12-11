import {
  observable,
  action,
  computed,
} from 'mobx';

class PopupStore {
  @observable isVisible;
  @observable options;

  constructor() {
    this.isVisible = false;
    this.options = null;
  }

  @action
  show(options) {
    this.isVisible = true;
    this.options = options
  }

  @action
  close() {
    this.isVisible = false;
    this.options = null;
  }

  showPopup(options){
    const defaultOptions = {
      type: 'info',
      title: '信息',
      message: '',
      confirmButton: true,
      confirmButtonText: '确定',
      confirmButtonFunc: null,
      cancelButton: true,
      confirmButtonText: '取消',
      confirmButtonFunc: null,
    };

    const res = Object.assign(options, defaultOptions);

    this.show(res);
  }

  showError(message, confirmFunc) {
    this.showPopup({
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
    this.showPopup({
      type: 'warning',
      title: '警告',
      message: message,
      confirmButton: true,
      confirmButtonText: '确定',
      confirmButtonFunc: confirmFunc,
      cancelButton: true,
      confirmButtonText: '取消',
      confirmButtonFunc: cancelFunc,
    });
  }

  showInfo(message, confirmFunc, cancelFunc) {
    this.showPopup({
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
