import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    Layout,
    Row,
    Button,
    Input,
} from 'antd';

import navinfo from 'navinfo';
import stores from 'Stores/stores';
import style from './styles/style.styl';

const { Footer } = Layout;

@observer
export default class StatusBar extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        stores.statusBarStore.setZoom(stores.mapStore.map.getZoom());

        const eventController = navinfo.common.EventController.getInstance();
        eventController.on('ChangeCoordnites', this.onChangeCoordnites);
        eventController.on('zoomend', this.onZoomChanged);
    }

    componentWillUnmount() {
        const eventController = navinfo.common.EventController.getInstance();
        eventController.off('ChangeCoordnites', this.onChangeCoordnites);
        eventController.off('zoomend', this.onZoomChanged);
    }

    onChangeCoordnites = point => {
        stores.statusBarStore.setMousePoint(point);
    };

    onZoomChanged = event => {
        stores.statusBarStore.setZoom(stores.mapStore.map.getZoom());
    };

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
                    <span>当前工具: { stores.statusBarStore.toolName }</span>
                    <span>鼠标位置: { stores.statusBarStore.coordinates }</span>
                    <span>地图等级: { stores.statusBarStore.zoom }</span>
                </Row>
            </Footer>
        );
    }
}
