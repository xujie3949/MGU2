import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  Row,
  Spin
} from 'antd';

import stores from 'Stores/stores';
import style from './styles/style.styl';

@observer
export default class Loading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row
        className={ style.container }
        type="flex"
        justify="center"
        align="middle"
      >
        <Spin
          size="large"
          tip={ stores.loadingStore.message }
        />
      </Row>
    );
  }
}
