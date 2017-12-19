import {
  observable,
  action,
  computed,
} from 'mobx';

import BrowserStore from 'Utils/browserStore';
import User from 'Models/User';

class UserStore {
  @observable user;

  constructor() {
    this.user = null;
    this.loadUserInfo();
  }

  @action
  setUser(value) {
    this.user = value;
  }

  saveUserInfo() {
    BrowserStore.setItem('userInfo', this.user.toJson());
  }

  clearUserInfo() {
    BrowserStore.removeItem('userInfo');
  }

  @action
  loadUserInfo() {
    if (BrowserStore.hasItem('userInfo')) {
      const userInfo = BrowserStore.getItem('userInfo');
      const user = new User();
      user.fromJson(userInfo);
    }
  }
}

const userStore = new UserStore();
export default userStore;
