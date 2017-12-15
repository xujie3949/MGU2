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
  @observable username;
  @observable password;
  @observable rememberMe;
  @observable user;

  constructor() {
    this.username = '';
    this.password = '';
    this.rememberMe = true;
    this.user = null;
    this.loadUserInfo();
  }

  @action
  setUsername(value) {
    this.username = value;
  }

  @action
  setPassword(value) {
    this.password = value;
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
        const user = new User();
        user.fromJson({
          name: this.username,
          password: this.password,
          token: data.data.token,
        });
        this.setUser(user);
        if (this.rememberMe) {
          this.saveUserInfo();
        }else {
          this.clearUserInfo();
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
    this.setUser(null);
    this.clearUserInfo();
  }

  @action
  loadUserInfo() {
    if (BrowserStore.hasItem('userInfo')) {
      const userInfo = BrowserStore.getItem('userInfo');
      const user = new User();
      user.fromJson(userInfo);
      this.user = user;
      this.username = this.user.name;
      this.password = this.user.password;
    }
  }
}

const userStore = new UserStore();
export default userStore;
