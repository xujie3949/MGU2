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
        stores.mapStore.startup('editorMap');
    }

    componentWillUnmount() {
        stores.mapStore.shutdown();
    }

    render() {
        return (
            <div
                id="editorMap"
                className={ style.container }
            />
        );
    }
}
