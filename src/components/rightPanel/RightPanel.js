import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Icon } from 'antd';
import TweenOne from 'rc-tween-one';

import stores from 'Stores/stores';
import style from './styles/style.styl';

@observer
export default class RightPanel extends Component {
    static propTypes = {
        children: PropTypes.node,
    };

    static defaultProps = {
        children: null,
    };

    constructor(props) {
        super(props);
    }

    onHandleClick = e => {
        stores.rightPanelStore.switch();
    };

    computeAnimation() {
        if (stores.rightPanelStore.isShow) {
            return {
                right: '0',
                ease: 'easeInQuad',
            };
        }

        return {
            right: '-20%',
            ease: 'easeOutQuad',
        };
    }

    renderHandle() {
        if (stores.rightPanelStore.isShow) {
            return (
                <Icon
                    className={ style.handle }
                    type="right-square"
                    onClick={ this.onHandleClick }
                />
            );
        }

        return (
            <Icon
                className={ style.handle }
                type="left-square"
                onClick={ this.onHandleClick }
            />
        );
    }

    render() {
        const animation = this.computeAnimation();
        const { children, ...other } = this.props;
        return (
            <TweenOne
                { ...other }
                className={ style.container }
                animation={ animation }
            >
                { this.renderHandle() }
                <div className={ style.content }>
                    { this.props.children }
                </div>
            </TweenOne>
        );
    }
}
