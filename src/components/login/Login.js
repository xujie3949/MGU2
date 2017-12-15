import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  View,
  Text,
  TextInput,
  Checkbox,
  Button
} from 'react-desktop/macOs';

import stores from 'Stores/stores';
import style from './styles/style.styl';
import bg from './images/map.jpg';
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
      <View
        height="100%"
        width="100%"
        horizontalAlignment="left"
        verticalAlignment="center"
      >
        <img
          className={ style.icon }
          src={ src }
        />
      </View>
    );
  }

  render() {
    return (
      <View
        width="100%"
        height="100%"
        horizontalAlignment='center'>
        <View className={ style.loginForm }
              width="463px"
              paddingTop="30px"
              paddingBottom="50px"
              layout="column"
              horizontalAlignment='center'>
          <View className={ style.loginContent }
                width="365px"
                layout="column">
            <View width="100%">
              <Text size="30">欢迎使用MGU2系统</Text>
              <View marginTop="10px"
                    height="1px"
                    background="#2E71F2"/>
            </View>
            <View marginTop="40px"
                  width="100%">
              <TextInput
                id="username"
                placeholder="用户名"
                size="25"
                width="100%"
                value={ stores.userStore.username }
                onChange={ this.onChange }
              />
              { this.renderIcon(userIcon) }
            </View>
            <View marginTop="40px"
                  width="100%">
              <TextInput
                id="password"
                placeholder="密码"
                password
                size="25"
                width="100%"
                value={ stores.userStore.password }
                onChange={ this.onChange }
              />
              { this.renderIcon(passwordIcon) }
            </View>
            <Checkbox
              id="rememberMe"
              label="记住我"
              checked={ stores.userStore.rememberMe }
              onChange={ this.onChange }
            />
            <Button
              className={ style.loginButton }
              onClick={ this.onLoginClick }
            >
              登录
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
