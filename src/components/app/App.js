import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import stores from 'Stores/stores';
import Login from 'Components/login/Login';
import Editor from 'Components/editor/Editor';
import Loading from 'Components/loading/Loading';
import style from './styles/style.styl';

import 'Styles/common.styl';
import 'antd/dist/antd.css';

@observer
export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.updateWindowSize();
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('selectstart', this.onSelectStart);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('selectstart', this.onSelectStart);
  }

  onWindowResize = () => {
    this.updateWindowSize();
  };

  onSelectStart = e => {
    e.preventDefault();
  };

  updateWindowSize() {
    stores.appStore.setWindowWidth(window.innerWidth);
    stores.appStore.setWindowHeight(window.innerHeight);
  }

  updateBodyTransform() {
    const scaleX = `scaleX(${stores.appStore.bestScale})`;
    const scaleY = `scaleY(${stores.appStore.bestScale})`;
    const tx = Math.abs(stores.appStore.windowWidth - stores.appStore.viewWidth * stores.appStore.bestScale) / 2;
    const ty = Math.abs(stores.appStore.windowHeight - stores.appStore.viewHeight * stores.appStore.bestScale) / 2;
    const translate = `translate(${tx}px, ${ty}px)`;
    document.body.style.width = `${stores.appStore.viewWidth}px`;
    document.body.style.height = `${stores.appStore.viewHeight}px`;
    document.body.style.transform = `${translate} ${scaleX} ${scaleY}`;
    document.body.style.transformOrigin = '0 0';
  }

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
    this.updateBodyTransform();
    return (
      <LocaleProvider
        locale={ zhCN }
      >
        <div className={ style.container }>
          { this.renderComponent() }
          { this.renderLoading() }
        </div>
      </LocaleProvider>
    );
  }
}
