import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import {
    Row,
    Button,
    Icon,
    Menu,
} from 'antd';

import style from './styles/style.styl';

const { SubMenu, Item, Divider } = Menu;

@observer
export default class MenuPanel extends Component {
    static propTypes = {
        items: PropTypes.array,
        width: PropTypes.string,
    };

    static defaultProps = {
        items: [
            {
                title: '菜单项',
                type: 'item',
                items: [
                    {
                        title: '菜单项',
                        type: 'item',
                    },
                    {
                        title: '菜单项',
                        type: 'item',
                    },
                    {
                        type: 'divider',
                    },
                    {
                        title: '菜单项',
                        type: 'item',
                    },
                ],
            },
            {
                title: '菜单项',
                type: 'item',
                items: [
                    {
                        title: '菜单项',
                        type: 'item',
                    },
                    {
                        title: '菜单项',
                        type: 'item',
                    },
                    {
                        type: 'divider',
                    },
                    {
                        title: '菜单项',
                        type: 'item',
                    },
                ],
            },
            {
                type: 'divider',
            },
            {
                title: '菜单项',
                type: 'item',
                items: [
                    {
                        title: '菜单项',
                        type: 'item',
                    },
                    {
                        title: '菜单项',
                        type: 'item',
                    },
                    {
                        type: 'divider',
                    },
                    {
                        title: '菜单项',
                        type: 'item',
                    },
                ],
            },
        ],
        width: '150px',
    };

    constructor(props) {
        super(props);
        this.state = {
            mouseOnButton: false,
        };
    }

    onMouserEnter = e => {
        this.setState(
            {
                mouseOnButton: true,
            },
        );
    };

    onMouserLeave = e => {
        this.setState(
            {
                mouseOnButton: false,
            },
        );
    };

    renderItem(item, index) {
        if (item.items && item.items.length > 0) {
            return (
                <SubMenu
                    key={ index }
                    title={ <span><Icon type="setting"/><span>{ item.title }</span></span> }
                >
                    { this.renderItems(item.items) }
                </SubMenu>
            );
        }

        return (
            <Item key={ index }>
                <Icon type="setting"/>
                { item.title }
            </Item>
        );
    }

    renderItems(items) {
        return items.map((item, index) => {
            if (item.type === 'item') {
                return this.renderItem(item, index);
            }
            return (
                <Divider key={ index }/>
            );
        });
    }

    render() {
        const { items, width, ...other } = this.props;
        return (
            <Menu
                { ...other }
                style={ {
                    width: width,
                    position: 'relative',
                    zIndex: 100,
                } }
            >
                { this.renderItems(items) }
            </Menu>
        );
    }
}
