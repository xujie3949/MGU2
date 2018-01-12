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
export default class TrajectoryQuery extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { title } = this.props;
        return (
          <Panel title="轨迹查询"/>
        );
    }
}
