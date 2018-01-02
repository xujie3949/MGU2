import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    Row,
    Layout,
} from 'antd';

import stores from 'Stores/stores';
import Panel from 'Components/panel/Panel';
import mapInit from './MapInit';
import style from './styles/style.styl';

@observer
export default class Map extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        mapInit.initialize('editorMap');
    }

    componentWillUnmount() {
        mapInit.unInitialize();
    }

    render() {
        return (
            <div id="editorMap" className={ style.container }/>
        );
    }
}
