import {
    observable,
    action,
    computed,
} from 'mobx';

import service from 'Services/service';
import delay from 'Utils/delay';
import User from 'Models/User';
import loadingStore from 'Stores/loadingStore';
import userStore from 'Stores/userStore';

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
      if (userStore.user) {
          this.username = userStore.user.name;
          this.password = userStore.user.password;
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
          loadingStore.show();

          const start = Date.now();

          const data = await service.login(this.username, this.password);

          const diff = Date.now() - start;

          if (diff < 1000) {
              await delay(1000 - diff);
          }

          loadingStore.close();

          if (data.errcode === 0) {
              const user = new User();
              user.fromJson({
                  name: this.username,
                  password: this.password,
                  token: data.data.token,
              });
              userStore.setUser(user);
              if (this.rememberMe) {
                  userStore.saveUserInfo();
              } else {
                  userStore.clearUserInfo();
              }
          } else {
              // popupStore.showError(data.errmsg);
          }
      } catch (err) {
          loadingStore.close();
      // popupStore.showError(err.message);
      }
  }

  logout() {
      userStore.setUser(null);
      userStore.clearUserInfo();
  }
}

const loginStore = new LoginStore();
export default loginStore;
