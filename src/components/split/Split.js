import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SplitJS from 'split.js';

import stores from 'Stores/stores';
import navinfo from 'navinfo';

export default class Split extends PureComponent {
    static propTypes = {
        children: PropTypes.node,
        config: PropTypes.object,
        onCreated: PropTypes.func,
    };

    static defaultProps = {
        children: null,
        config: null,
        onCreated: null,
    };

    constructor(props) {
        super(props);
        this.split = null;
        this.splitIds = null;
    }

    componentDidMount() {
        this.updateSplit();
    }

    componentDidUpdate() {
        this.updateSplit();
    }

    computeSplitIds(children) {
        const ids = [];
        children.forEach(item => {
            if (!item.key) {
                return;
            }
            ids.push(`#${item.key}`);
        });

        return ids;
    }

    destroySplit() {
        if (!this.split) {
            return;
        }

        this.split.destroy();
        this.split = null;
    }

    updateSplit() {
        const { children, config, onCreated } = this.props;
        if (!children && !config) {
            return;
        }

        if (!navinfo.common.Util.isArray(children)) {
            return;
        }

        const splitIds = this.computeSplitIds(children);
        this.split = SplitJS(splitIds, config);

        if (onCreated) {
            onCreated();
        }
    }

    render() {
        this.destroySplit();

        const { children } = this.props;
        return (
            children
        );
    }
}
