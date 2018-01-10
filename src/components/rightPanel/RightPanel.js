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
        children: PropTypes.element,
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
                width: '14px',
                ease: 'easeInQuad',
            };
        }

        return {
            width: '20%',
            ease: 'easeOutQuad',
        };
    }

    renderContent() {
        if (stores.rightPanelStore.isShow) {
            return (
                <div className={ style.emptyContent }/>
            );
        }

        return (
            <div className={ style.content }>
                { this.props.children }
            </div>
        );
    }

    renderHandle() {
        if (stores.rightPanelStore.isShow) {
            return (
                <Icon
                    className={ style.handle }
                    type="left-square"
                    onClick={ this.onHandleClick }
                />
            );
        }

        return (
            <Icon
                className={ style.handle }
                type="right-square"
                onClick={ this.onHandleClick }
            />
        );
    }

    render() {
        const animation = this.computeAnimation();

        return (
            <TweenOne
                className={ style.container }
                animation={ animation }
            >
                { this.renderHandle() }
                { this.renderContent() }
            </TweenOne>
        );
    }
}
