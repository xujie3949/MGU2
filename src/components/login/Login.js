import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  Form,
  Row,
  Col,
  Icon,
  Input,
  Button,
  Checkbox
} from 'antd';

import stores from 'Stores/stores';
import style from './styles/style.styl';

@observer
export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  onLoginClick = e => {
    stores.loginStore.checkUsername();
    stores.loginStore.checkPassword();
    if (stores.loginStore.usernameStatus === 'success' &&
      stores.loginStore.passwordStatus === 'success') {
      stores.loginStore.login();
    }
  };

  onUsernameChange = e => {
    stores.loginStore.setUsername(e.target.value);
  };

  onUsernameBlur = e => {
    stores.loginStore.checkUsername();
  };

  onPasswordChange = e => {
    stores.loginStore.setPassword(e.target.value);
  };

  onPasswordBlur = e => {
    stores.loginStore.checkPassword();
  };

  onRememberMeChange = e => {
    stores.loginStore.setRememberMe(e.target.value);
  };

  renderIcon(iconType) {
    return (
      <Icon
        type="lock"
        className={ style.icon }
      />
    );
  }

  render() {
    return (
      <Row
        className={ style.container }
        type="flex"
        justify="center"
        align="middle"
      >
        <Row
          className={ style.loginForm }
          type="flex"
          justify="center"
        >
          <Col className={ style.loginContent }>
            <Row
              className={ style.title }
              type="flex"
              justify="center"
              align="middle"
            >
              <div>
                <div className={ style.titleText }>
                  欢迎使用MGU2系统
                </div>
                <div className={ style.titleLine }/>
              </div>
            </Row>
            <Form.Item
              validateStatus={ stores.loginStore.usernameStatus }
              help={ stores.loginStore.usernameMsg }
            >
              <Input
                prefix={ this.renderIcon('user') }
                placeholder="用户名"
                value={ stores.loginStore.username }
                onChange={ this.onUsernameChange }
                onBlur={ this.onUsernameBlur }
              />
            </Form.Item>
            <Form.Item
              className={ style.inputContainer }
              validateStatus={ stores.loginStore.passwordStatus }
              help={ stores.loginStore.passwordMsg }
            >
              <Input
                prefix={ this.renderIcon('lock') }
                type="password"
                placeholder="密码"
                value={ stores.loginStore.password }
                onChange={ this.onPasswordChange }
                onBlur={ this.onPasswordBlur }
              />
            </Form.Item>
            <Form.Item>
              <Row
                type="flex"
                justify="end"
              >
                <Checkbox
                  value={ stores.loginStore.rememberMe }
                  onChange={ this.onRememberMeChange }
                >
                  记住我
                </Checkbox>
              </Row>
              <Button
                className={ style.loginButton }
                type="primary"
                htmlType="button"
                onClick={ this.onLoginClick }
              >
                登录
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Row>
    );
  }
}
