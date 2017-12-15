import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { View, ProgressCircle } from 'react-desktop/windows';

import stores from 'Stores/stores';
import style from './styles/style.styl';
import info from './images/information.png';
import err from './images/error.png';
import warn from './images/warning.png';

@observer
export default class Loading extends Component {
  constructor(props) {
    super(props);
  }

  onConfirmButtonClick = e => {
    if (stores.popupStore.confirmButtonFunc) {
      stores.popupStore.confirmButtonFunc(e);
    }
  };

  onCancelButtonClick = e => {
    if (stores.popupStore.cancelButtonFunc) {
      stores.popupStore.cancelButtonFunc(e);
    }
  };

  renderHeaderIcon() {
    let icon = info;
    switch (stores.popupStore.type) {
      case 'error':
        icon = err;
        break;
      case 'warnning':
        icon = warn;
        break;
      default:
        icon = info;
        break;
    }

    return (
      <image className={ style.icon }
             src={ icon }/>
    );
  }

  renderConfirmButton() {
    if (stores.popupStore.confirmButton) {
      return null;
    }
    return (
      <div
        className={ style.button }
        onClick={ this.onConfirmButtonClick }
      >
        { stores.popupStore.confirmButtonText }
      </div>
    );
  }

  renderCancelButton() {
    if (stores.popupStore.cancelButton) {
      return null;
    }
    return (
      <div
        className={ style.button }
        onClick={ this.onCancelButtonClick }
      >
        { stores.popupStore.cancelButtonText }
      </div>
    );
  }

  render() {
    return (
      <View
        width="100%"
        height="100%">
        <div className={ style.container }>
          <div className={ style.header }>
            { this.renderHeaderIcon() }
            <div className={ style.title }>
              { stores.popupStore.title }
            </div>
          </div>
          <div className={ style.content }>
            { stores.popupStore.message }
          </div>
          <div className={ style.footer }>
            { this.renderConfirmButton() }
            { this.renderCancelButton() }
          </div>
        </div>
      </View>
    );
  }
}
