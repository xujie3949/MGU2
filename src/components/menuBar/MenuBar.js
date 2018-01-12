import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    Row,
    Button,
} from 'antd';

import stores from 'Stores/stores';
import MenuPanel from 'Components/menuPanel/MenuPanel';
import style from './styles/style.styl';

@observer
export default class MenuBar extends Component {
    constructor(props) {
        super(props);
    }

    onMouseEnter = e => {
        stores.menuBarStore.setItemId(e.currentTarget.id);
        const top = e.currentTarget.offsetTop + e.currentTarget.clientHeight;
        const left = e.currentTarget.offsetLeft;
        stores.menuBarStore.setMenuPanelPosition(left, top);
    };

    onMouseLeave = e => {
        if (stores.menuBarStore.menuPanelOpen) {
            return;
        }
        stores.menuBarStore.setItemId(null);
    };

    onClick = e => {
        e.stopPropagation();

        stores.menuBarStore.switchMenuPanel();

        if (stores.menuBarStore.menuPanelOpen) {
            const top = e.currentTarget.offsetTop + e.currentTarget.clientHeight;
            const left = e.currentTarget.offsetLeft;
            stores.menuBarStore.setMenuPanelPosition(left, top);
        }
    };

    onBlur = e => {
        stores.menuBarStore.setMenuPanelOpen(false);
        stores.menuBarStore.setItemId(null);
    };

    renderButton(id, name) {
        const mouseOnButton = stores.menuBarStore.itemId === id;
        return (
            <button
                id={ id }
                onMouseEnter={ this.onMouseEnter }
                onMouseLeave={ this.onMouseLeave }
                onClick={ this.onClick }
                onBlur={ this.onBlur }
                style={ {
                    fontSize: '14px',
                    border: 'none',
                    background: mouseOnButton ? '#0050b3' : 'none',
                    color: mouseOnButton ? '#ffffff' : '#000000',
                    cursor: 'default',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                } }
            >
                { name }
            </button>
        );
    }

    renderMenuPanel() {
        if (!stores.menuBarStore.menuPanelOpen) {
            return null;
        }

        return (
            <Row
                style={ {
                    position: 'absolute',
                    left: stores.menuBarStore.menuPanelLeft,
                    top: stores.menuBarStore.menuPanelTop,
                } }
            >
                <MenuPanel/>
            </Row>
        );
    }

    render() {
        return (
            <Row
                { ...this.props }
                className={ style.container }
                type="flex"
                align="middle"
            >
                { this.renderButton('item1', '菜单项') }
                { this.renderButton('item2', '菜单项') }
                { this.renderButton('item3', '菜单项') }
                { this.renderMenuPanel() }
            </Row>
        );
    }
}
