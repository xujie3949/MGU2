import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Window, TitleBar, Text } from 'react-desktop/windows';

import stores from 'Stores/stores';
import style from './styles/style.styl';

@observer
export default class Editor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Window
        theme='dark'
        width={ `100%` }
        height={ `100%` }
      >
        <TitleBar title="My Windows Application" controls/>
        <input value="Hello World"/>
      </Window>
    );
  }
}
