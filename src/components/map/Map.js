import React, { PrueComponent } from 'react';
import { observer } from 'mobx-react';
import mapInit from './MapInit';
import style from './styles/style.styl';

@observer
export default class Map extends PrueComponent {
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
            <div
                id="editorMap"
                className={ style.container }
            />
        );
    }
}
