import {
  observable,
  action,
  computed,
} from 'mobx';

import service from 'Services/service';
import BrowserStore from 'Utils/browserStore';
import delay from 'Utils/delay';
import User from 'Models/User';
import popupStore from 'Stores/popupStore';
import loadingStore from 'Stores/loadingStore';

class UserStore {
  @observable rememberMe;
  @observable user;

  constructor() {
    this.rememberMe = false;
    this.user = new User();
    this.loadUserInfo();
  }

  @action
  setRememberMe(value) {
    this.rememberMe = value;
  }

  @action
  setUser(user) {
    this.user = value;
  }

  saveUserInfo() {
    BrowserStore.setItem('userInfo', this.user.toJson());
  }

  clearUserInfo() {
    BrowserStore.removeItem('userInfo');
  }

  async login() {
    try {
      loadingStore.show();

      const start = Date.now();

      const data = await service.login(this.username, this.password);

      const diff = Date.now() - start;

      if (diff < 2000) {
        await delay(2000 - diff);
      }

      loadingStore.close();

      if (data.errcode === 0) {
        this.user.setToken(data.data.token);
        if (this.rememberMe) {
          this.saveUserInfo();
        }
      } else {
        popupStore.showError(data.errmsg);
      }
    } catch (err) {
      loadingStore.close();
      popupStore.showError(err.message);
    }
  }

  logout() {
    this.user.setToken(null);
    this.clearUserInfo();
  }

  @action
  loadUserInfo() {
    if (BrowserStore.hasItem('userInfo')) {
      const userInfo = BrowserStore.getItem('userInfo');
      this.user.fromJson(userInfo);
    }
  }
}

const userStore = new UserStore();
export default userStore;
