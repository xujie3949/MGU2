import React, { Component } from 'react';
import { observer } from 'mobx-react';

import stores from 'Stores/stores';
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

  render() {
    this.updateBodyTransform();
    return (
      <div
        className={style.container}
      >
        App
      </div>
    );
  }
}
