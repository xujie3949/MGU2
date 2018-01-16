import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    Row,
    Table,
    Icon,
    Divider,
} from 'antd';

import stores from 'Stores/stores';
import Panel from 'Components/panel/Panel';
import navinfo from 'Navinfo';
import style from './styles/style.styl';

const { Column } = Table;

@observer
export default class TrajectoryQuery extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const bounds = stores.mapStore.map.getBounds();
        stores.trajectoryListStore.fetchData(bounds.getNorthWest(), bounds.getSouthEast());
    }

    onLoadClick = async e => {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        stores.trajectoryListStore.setSelectedIndex(index);
        await stores.trajectoryListStore.fetchSelectedTrajectoryPoints();
        stores.trajectoryListStore.updateTrajectoryFeedback();
    }

    onPlayClick = async e => {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        const commandFactory = navinfo.framework.command.CommandFactory.getInstance();
        const command = commandFactory.getCommand('TrajectoryPlayback');
        if (command) {
            command.execute();
        }
    }

    onTrajectoryPointSelectedToolFinish(editResult) {
        this.updateEditorMain();
    }

    getRowKey = record => `${record.collectUser}-${record.plateform}-${record.utcdate}`;

    renderOperationColumn = (text, record, index) => {
        let canLoad = false;
        let canPlay = false;
        if (!record.points) {
            canLoad = true;
            canPlay = false;
        } else {
            canLoad = false;
            canPlay = true;
        }

        return (
            <span>
                <a
                    data-index={ index }
                    disabled={ !canLoad }
                    onClick={ this.onLoadClick }
                >
                    加载
                </a>
                <Divider type="vertical"/>
                <a
                    data-index={ index }
                    disabled={ !canPlay }
                    onClick={ this.onPlayClick }
                >
                    播放
                </a>
            </span>
        );
    }

    render() {
        return (
            <Panel
                { ...this.props }
                title="轨迹查询"
            >
                <div className={ style.container }>
                    <Table
                        size="small"
                        pagination={ {
                            pageSize: 10,
                            size: 'small',
                        } }
                        rowKey={ this.getRowKey }
                        dataSource={ stores.trajectoryListStore.data }
                        className={ 'testfdsfds' }
                    >
                        <Column
                            title="采集员"
                            dataIndex="collectUser"
                            key="collectUser"
                        />
                        <Column
                            title="平台"
                            dataIndex="plateform"
                            key="plateform"
                        />
                        <Column
                            title="日期"
                            dataIndex="utcdate"
                            key="utcdate"
                        />
                        <Column
                            title="操作"
                            key="action"
                            render={ this.renderOperationColumn }
                        />
                    </Table>
                </div>
            </Panel>
        );
    }
}
