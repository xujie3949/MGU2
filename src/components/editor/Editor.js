import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  Row
} from 'antd';

import stores from 'Stores/stores';
import style from './styles/style.styl';

@observer
export default class Editor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row className={style.container}
      >
        Editor
      </Row>
    );
  }
}
