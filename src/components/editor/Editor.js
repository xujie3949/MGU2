import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    Layout,
    Row,
    Col,
    Icon,
    Avatar,
} from 'antd';
import Split from 'split.js';

import stores from 'Stores/stores';
import EditorTitleBar from 'Components/editorTitleBar/EditorTitleBar';
import MenuBar from 'Components/menuBar/MenuBar';
import ToolBar from 'Components/toolBar/ToolBar';
import LeftPanel from 'Components/leftPanel/LeftPanel';
import RightPanel from 'Components/rightPanel/RightPanel';
import TrajectoryQuery from 'Components/trajectoryQuery/TrajectoryQuery';
import SelectedManager from 'Components/selectedManager/SelectedManager';
import Map from 'Components/map/Map';
import PropertyEdit from 'Components/propertyEdit/PropertyEdit';
import StatusBar from 'Components/statusBar/StatusBar';
import navinfo from 'Navinfo';

import style from './styles/style.styl';

const { Header, Footer, Sider, Content } = Layout;

@observer
export default class Editor extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        stores.editorStore.setMain(<Map/>);
    }

    componentDidMount() {
        this.updateSplit();
    }

    componentDidUpdate() {
        this.updateSplit();
    }

    updateSplit() {
        if (stores.editorStore.splitParameter) {
            stores.editorStore.splitParameter.config.onDragEnd = () => {
                stores.mapStore.map.resize();
            };
            Split(
                stores.editorStore.splitParameter.children,
                stores.editorStore.splitParameter.config,
            );
            stores.mapStore.map.resize();
        }
    }

    renderHeader() {
        const headerStyle = {
            backgroundColor: 'initial',
            padding: '0',
            height: 'auto',
        };
        return (
            <Header style={ headerStyle }>
                <EditorTitleBar/>
                <MenuBar/>
                <ToolBar/>
            </Header>
        );
    }

    render() {
        return (
            <div className={ style.container }>
                { this.renderHeader() }
                <div className={ style.middleContainer }>
                    { stores.editorStore.main }
                    <LeftPanel>
                        <TrajectoryQuery/>
                    </LeftPanel>
                    <RightPanel>
                        <div className={ style.right }>
                            <div className={ style.rightTop }>
                                <SelectedManager/>
                            </div>
                            <div className={ style.rightBottom }>
                                <PropertyEdit/>
                            </div>
                        </div>
                    </RightPanel>
                </div>
                <StatusBar/>
            </div>
        );
    }
}
