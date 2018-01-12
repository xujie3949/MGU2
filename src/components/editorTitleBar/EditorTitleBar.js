import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    Row,
    Col,
    Icon,
    Avatar,
} from 'antd';

import stores from 'Stores/stores';
import style from './styles/style.styl';

@observer
export default class EditorTitleBar extends Component {
    constructor(props) {
        super(props);
    }

    onCloseClick = e => {
        stores.loginStore.logout();
    };

    render() {
        return (
            <Row
                { ...this.props }
                className={ style.container }
                type="flex"
                justify="space-between"
                align="middle"
            >
                <Row
                    type="flex"
                    align="middle"
                >
                    <Icon type="global"/>
                    <div style={ { marginLeft: '5px' } }>MGU2</div>
                </Row>
                <Row
                    type="flex"
                    align="middle"
                >
                    <Row
                        type="flex"
                    >
                        <Avatar
                            style={ {
                                backgroundColor: '#87d068',
                            } }
                            size="small"
                            icon="user"
                        />
                        <div style={ { marginLeft: '5px' } }>
                            { stores.userStore.user.name }
                        </div>
                    </Row>
                    <Icon
                        style={ { marginLeft: '100px' } }
                        type="logout"
                        onClick={ this.onCloseClick }
                    />
                </Row>
            </Row>
        );
    }
}
