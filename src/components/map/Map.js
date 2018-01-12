import React, { Component } from 'react';
import { observer } from 'mobx-react';

import stores from 'Stores/stores';
import style from './styles/style.styl';

@observer
export default class Map extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        stores.mapStore.addTo(this.mapContainer);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // 不需要重新渲染
        return false;
    }

    componentWillUnmount() {
        stores.mapStore.remove();
    }

    render() {
        return (
            <div
                ref={ el => {
                    this.mapContainer = el;
                } }
                className={ style.container }
            />
        );
    }
}
