import {
    observable,
    action,
    computed,
} from 'mobx';

import service from 'Services/service';
import navinfo from 'Navinfo';
import User from 'Models/User';
import stores from 'Stores/stores';

class LoginStore {
  @observable username;
  @observable usernameStatus;
  @observable usernameMsg;
  @observable password;
  @observable passwordStatus;
  @observable passwordMsg;
  @observable rememberMe;

  constructor() {
      this.username = '';
      this.usernameStatus = 'success';
      this.usernameMsg = '';
      this.password = '';
      this.passwordStatus = 'success';
      this.passwordMsg = '';
      this.rememberMe = true;
  }

  @action
  initialize() {
      if (stores.userStore.user) {
          this.username = stores.userStore.user.name;
          this.password = stores.userStore.user.password;
      }
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
  setRememberMe(value) {
      this.rememberMe = value;
  }

  @action
  checkUsername() {
      if (this.username.length < 6 || this.username.length > 12) {
          this.usernameStatus = 'error';
          this.usernameMsg = '用户名长度应该在6-12个字符之间';
          return;
      }

      this.usernameStatus = 'success';
      this.usernameMsg = '';
  }

  @action
  checkPassword() {
      if (this.password.length < 6 || this.password.length > 12) {
          this.passwordStatus = 'error';
          this.passwordMsg = '密码长度应该在6-12个字符之间';
          return;
      }

      this.passwordStatus = 'success';
      this.passwordMsg = '';
  }

  async login() {
      try {
          stores.loadingStore.show();

          const start = Date.now();

          const data = await service.login(this.username, this.password);
          // const mapData = await service.loginMap('hanxuesong01664', '016640');
          const mapData = await service.loginMap('yanshouzhengmiao04057', 'fm04057031314');

          const diff = Date.now() - start;

          if (diff < 1000) {
              await navinfo.common.Util.delay(1000 - diff);
          }

          stores.loadingStore.close();

          if (data.errcode === 0) {
              const user = new User();
              user.fromJson({
                  name: this.username,
                  password: this.password,
                  token: data.data.token,
                  mapToken: mapData.data.access_token,
              });
              stores.userStore.setUser(user);
              if (this.rememberMe) {
                  stores.userStore.saveUserInfo();
              } else {
                  stores.userStore.clearUserInfo();
              }
          } else {
              stores.modalStore.error(data.errmsg);
          }
      } catch (err) {
          stores.loadingStore.close();
          stores.modalStore.error(err.message);
      }
  }

  logout() {
      stores.userStore.setUser(null);
      stores.userStore.clearUserInfo();
  }
}

const loginStore = new LoginStore();
export default loginStore;
