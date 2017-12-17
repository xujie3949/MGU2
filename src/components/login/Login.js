import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  View,
  Text,
  TextInput,
  Checkbox,
  Button,
} from 'react-desktop/macOs';

import stores from 'Stores/stores';
import style from './styles/style.styl';
import userIcon from './images/user_icon.png';
import passwordIcon from './images/password_icon.png';

@observer
export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.refs.test);
  }

  onLoginClick = e => {
    stores.userStore.login();
  };

  onChange = e => {
    if (e.target.id === 'username') {
      stores.userStore.setUsername(e.target.value);
    }
    if (e.target.id === 'password') {
      stores.userStore.setPassword(e.target.value);
    }
    if (e.target.id === 'rememberMe') {
      stores.userStore.setRememberMe(e.target.value);
    }
  };

  renderIcon(src) {
    return (
      <div className={style.iconContainer}>
        <img
          className={style.icon}
          src={src}
        />
      </div>
    );
  }

  render() {
    return (
      <div
        className={style.container}
      >
        <div
          className={style.loginForm}
        >
          <div
            className={style.loginContent}
            width="365px"
          >
            <div className={style.title}>
              <Text size="30">欢迎使用MGU2系统</Text>
              <div className={style.titleLine}/>
            </div>
            <div className={style.inputContainer}>
              <TextInput
                style={{
                  paddingLeft: '62px',
                }}
                id="username"
                placeholder="用户名"
                size="25"
                width="100%"
                value={stores.userStore.username}
                onChange={this.onChange}
              />
              {this.renderIcon(userIcon)}
            </div>
            <div className={style.inputContainer}>
              <TextInput
                style={{
                  paddingLeft: '62px',
                }}
                id="password"
                placeholder="密码"
                password
                size="25"
                width="100%"
                value={stores.userStore.password}
                onChange={this.onChange}
              />
              {this.renderIcon(passwordIcon)}
            </div>
            <div className={style.rememberMe}>
              <Checkbox
                id="rememberMe"
                label="记住我"
                defaultValue={stores.userStore.rememberMe}
                onChange={this.onChange}
              />
            </div>
            <Button
              className={style.loginButton}
              color="blue"
              size="25"
              paddingTop="10"
              paddingBottom="10"
              onClick={this.onLoginClick}
            >
              登录
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
