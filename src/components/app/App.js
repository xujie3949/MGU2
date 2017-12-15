import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-desktop/windows';

import stores from 'Stores/stores';
import Login from 'Components/login/Login';
import Editor from 'Components/editor/Editor';
import Loading from 'Components/loading/Loading';
import Popup from 'Components/popup/Popup';
import style from './styles/style.styl';

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
    const scaleX = `scaleX(${stores.appStore.scaleX})`;
    const scaleY = `scaleY(${stores.appStore.scaleY})`;
    document.body.style.width = `${stores.appStore.viewWidth}px`;
    document.body.style.height = `${stores.appStore.viewHeight}px`;
    document.body.style.transform = `${scaleX} ${scaleY}`;
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

  renderPopup() {
    if (!stores.popupStore.isVisible) {
      return null;
    }

    return (
      <Popup/>
    );
  }

  render() {
    this.updateBodyTransform();
    return (
      <View
        theme='dark'
        width={ `100%` }
        height={ `100%` }
      >
        { this.renderComponent() }
        { this.renderLoading() }
        { this.renderPopup() }
      </View>
    );
  }
}
