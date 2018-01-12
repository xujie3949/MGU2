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
import TrajectoryList from 'Components/trajectoryList/TrajectoryList';
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
        const main = {
            children: <Map/>,
        };
        stores.editorStore.setMain(main);

        const left = {
            children: <TrajectoryList/>,
        };
        stores.editorStore.setLeft(left);

        const right = {
            children: [
                <SelectedManager key="selectedManager" id="selectedManager"/>,
                <PropertyEdit key="propertyEdit" id="propertyEdit"/>,
            ],
            split: {
                children: ['#selectedManager', '#propertyEdit'],
                config: {
                    sizes: [30, 70],
                    direction: 'vertical',
                    cursor: 'row-resize',
                },
            },
        };
        stores.editorStore.setRight(right);
    }

    componentDidMount() {
        this.updateSplit();
    }

    componentDidUpdate() {
        this.updateSplit();
    }

    updateSplit() {
        if (stores.editorStore.left && stores.editorStore.left.split) {
            Split(
                stores.editorStore.left.split.children,
                stores.editorStore.left.split.config,
            );
        }

        if (stores.editorStore.right && stores.editorStore.right.split) {
            Split(
                stores.editorStore.right.split.children,
                stores.editorStore.right.split.config,
            );
        }

        if (stores.editorStore.main && stores.editorStore.main.split) {
            stores.editorStore.main.split.config.onDragEnd = () => {
                stores.mapStore.map.resize();
            };
            Split(
                stores.editorStore.main.split.children,
                stores.editorStore.main.split.config,
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
                    { stores.editorStore.main.children }
                    <LeftPanel>
                        { stores.editorStore.left.children }
                    </LeftPanel>
                    <RightPanel>
                        { stores.editorStore.right.children }
                    </RightPanel>
                    { /*<RightPanel>*/ }
                    { /*<div className={ style.right }>*/ }
                    { /*<div className={ style.rightTop }>*/ }
                    { /*<SelectedManager/>*/ }
                    { /*</div>*/ }
                    { /*<div className={ style.rightBottom }>*/ }
                    { /*<PropertyEdit/>*/ }
                    { /*</div>*/ }
                    { /*</div>*/ }
                    { /*</RightPanel>*/ }
                </div>
                <StatusBar/>
            </div>
        );
    }
}
