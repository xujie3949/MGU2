import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    Layout,
    Row,
    Button,
    Input,
} from 'antd';

import stores from 'Stores/stores';
import style from './styles/style.styl';

const { Footer } = Layout;

@observer
export default class StatusBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Footer
                { ...this.props }
                style={ {
                    borderTop: '1px solid rgba(0, 0, 0, 0.45)',
                    height: '24px',
                    padding: '0 10px',
                } }
            >
                <Row
                    type="flex"
                    justify="space-between"
                    align="middle"
                >
                    <span>当前工具: 选择</span>
                    <span>鼠标位置: 116.3214, 34.3432</span>
                    <span>地图等级: 15</span>
                </Row>
            </Footer>
        );
    }
}
