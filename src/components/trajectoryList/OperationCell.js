import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
export default class OperationCell extends Component {
    static propTypes = {
        trajectoryLine: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
    }

    onLoadClick = async e => {
        try {
            stores.trajectoryListStore.setSelected(this.props.trajectoryLine);
            await this.props.trajectoryLine.fetchDetail();
            if (stores.imageViewerStore.total > 0) {
                stores.imageViewerStore.setIndex(0);
            }
        } catch (err) {
            stores.modalStore.error(err.message);
        }
    }

    onPlayClick = async e => {
        const commandFactory = navinfo.framework.command.CommandFactory.getInstance();
        const command = commandFactory.getCommand('TrajectoryPlayback');
        if (command) {
            command.execute();
        }
    }

    render() {
        const trajectoryLine = this.props.trajectoryLine;
        let canLoad = false;
        let canPlay = false;
        if (!trajectoryLine.points || trajectoryLine.points.length === 0) {
            canLoad = true;
            canPlay = false;
        } else {
            canLoad = false;
            canPlay = true;
        }

        return (
            <span>
                <a
                    disabled={ !canLoad }
                    onClick={ this.onLoadClick }
                >
                    加载
                </a>
                <Divider type="vertical"/>
                <a
                    disabled={ !canPlay }
                    onClick={ this.onPlayClick }
                >
                    播放
                </a>
            </span>
        );
    }
}
