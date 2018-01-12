import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Layout,
} from 'antd';

import stores from 'Stores/stores';
import style from './styles/style.styl';

export default class Panel extends Component {
    static propTypes = {
        title: PropTypes.string,
        children: PropTypes.element,
    };

    static defaultProps = {
        title: '面板',
        children: null,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { title, children, ...other } = this.props;
        return (
            <div
                { ...other }
                className={ style.container }
            >
                <div
                    className={ style.title }
                >
                    { title }
                </div>
                <div className={ style.content }>
                    { children }
                </div>
            </div>
        );
    }
}
