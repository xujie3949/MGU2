import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import stores from 'Stores/stores';
import Login from 'Components/login/Login';
import Editor from 'Components/editor/Editor';
import Loading from 'Components/loading/Loading';
import initApp from './initApp';
import style from './styles/style.styl';

import 'Styles/common.styl';
import 'antd/dist/antd.css';

@observer
export default class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        initApp.startup();
    }

    componentWillUnmount() {
        initApp.shutdown();
    }

  onSelectStart = e => {
      e.preventDefault();
  };

  renderComponent() {
      if (!stores.userStore.user) {
          return (
            <Login/>
          );
      }

      return (
        <Editor/>
      );
  }

  renderLoading() {
      if (!stores.loadingStore.isVisible) {
          return null;
      }

      return (
        <Loading/>
      );
  }

  render() {
      return (
        <LocaleProvider
            locale={zhCN}
          >
            <div className={style.container}>
                { this.renderComponent() }
                { this.renderLoading() }
              </div>
          </LocaleProvider>
      );
  }
}
