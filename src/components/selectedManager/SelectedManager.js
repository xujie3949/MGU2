import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    Row,
    Layout,
} from 'antd';

import stores from 'Stores/stores';
import Panel from 'Components/panel/Panel';
import style from './styles/style.styl';

@observer
export default class SelectedManager extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <Panel title="当前对象">
              <div className={style.container}/>
            </Panel>
        );
    }
}
