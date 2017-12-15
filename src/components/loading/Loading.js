import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { View, ProgressCircle } from 'react-desktop/windows';

import stores from 'Stores/stores';
import style from './styles/style.styl';

@observer
export default class Loading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        width="100%"
        height="100%">
        <ProgressCircle/>
      </View>
    );
  }
}
