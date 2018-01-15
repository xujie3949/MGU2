import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    Layout,
    Row,
    Col,
    Icon,
    Avatar,
} from 'antd';

import stores from 'Stores/stores';
import EditorTitleBar from 'Components/editorTitleBar/EditorTitleBar';
import MenuBar from 'Components/menuBar/MenuBar';
import ToolBar from 'Components/toolBar/ToolBar';
import LeftPanel from 'Components/leftPanel/LeftPanel';
import RightPanel from 'Components/rightPanel/RightPanel';
import Split from 'Components/split/Split';
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
            children: null,
        };
        stores.editorStore.setLeft(left);

        const right = {
            children: [
                <SelectedManager key="selectedManager" id="selectedManager"/>,
                <PropertyEdit key="propertyEdit" id="propertyEdit"/>,
            ],
            config: {
                sizes: [30, 70],
                direction: 'vertical',
                cursor: 'row-resize',
            },
        };
        stores.editorStore.setRight(right);
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
        const { children: leftChildren, ...leftOther } = stores.editorStore.left;
        const { children: rightChildren, ...rightOther } = stores.editorStore.right;
        const { children: mainChildren, ...mainOther } = stores.editorStore.main;
        return (
            <div className={ style.container }>
                { this.renderHeader() }
                <div className={ style.middleContainer }>
                    <Split { ...mainOther }>
                        { stores.editorStore.main && mainChildren }
                    </Split>
                    <LeftPanel>
                        <Split { ...leftOther }>
                            { stores.editorStore.left && leftChildren }
                        </Split>
                    </LeftPanel>
                    <RightPanel>
                        <Split { ...rightOther }>
                            { stores.editorStore.left && rightChildren }
                        </Split>
                    </RightPanel>
                </div>
                <StatusBar/>
            </div>
        );
    }
}
