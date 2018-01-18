import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    Row,
    Table,
    Icon,
    Divider,
} from 'antd';

import navinfo from 'Navinfo';
import stores from 'Stores/stores';
import Panel from 'Components/panel/Panel';
import OperationCell from './OperationCell';
import style from './styles/style.styl';

const { Column } = Table;

@observer
export default class TrajectoryQuery extends Component {
    constructor(props) {
        super(props);
        this.eventController = navinfo.common.EventController.getInstance();
        this.feedbackController = navinfo.mapApi.feedback.FeedbackController.getInstance();
        this.feedback = null;
    }

    componentWillMount() {
        this.installFeedback();

        this.eventController.on('SelectedTrajectoryLineChanged', this.onSelectedTrajectoryLineChanged);
        this.eventController.on('SelectedTrajectoryPointChanged', this.onSelectedTrajectoryPointChanged);

        const bounds = stores.mapStore.map.getBounds();
        stores.trajectoryListStore.fetchTrajectoryLineList(bounds.getNorthWest(), bounds.getSouthEast());
    }

    componentWillUnmount() {
        this.eventController.off('SelectedTrajectoryLineChanged', this.onSelectedTrajectoryLineChanged);
        this.eventController.off('SelectedTrajectoryPointChanged', this.onSelectedTrajectoryPointChanged);

        this.uninstallFeedback();
    }

    onSelectedTrajectoryLineChanged = event => {
        this.updateTrajectoryFeedback();
    };

    onSelectedTrajectoryPointChanged = event => {
        this.jumpToTrajectoryPoint();

        this.updateTrajectoryFeedback();
    };

    jumpToTrajectoryPoint() {
        const bounds = stores.mapStore.map.getBounds();
        const west = bounds.getWest();
        const north = bounds.getNorth();
        const east = bounds.getEast();
        const sourth = bounds.getSouth();
        const coordinates = [];
        coordinates.push([west, north]);
        coordinates.push([east, north]);
        coordinates.push([east, sourth]);
        coordinates.push([west, sourth]);
        coordinates.push([west, north]);

        const ring = {
            type: 'Polygon',
            coordinates: [coordinates],
        };

        const selectedLine = stores.trajectoryListStore.selected;
        if (!selectedLine) {
            return;
        }

        const point = selectedLine.points[stores.imageViewerStore.index];
        if (!point) {
            return;
        }

        const geojsonPoint = {
            type: 'Point',
            coordinates: [point.longitude, point.latitude],
        };

        const geometryAlgorithm = navinfo.geometry.GeometryAlgorithm.getInstance();
        const zoom = stores.mapStore.map.getZoom();
        if (!geometryAlgorithm.contains(ring, geojsonPoint)) {
            stores.mapStore.map.flyTo([point.latitude, point.longitude], zoom);
        }
    }

    installFeedback() {
        this.feedback = new navinfo.mapApi.feedback.Feedback();
        this.feedbackController.add(this.feedback);
    }

    updateTrajectoryFeedback() {
        if (!this.feedback) {
            return;
        }

        this.feedback.clear();

        this.drawTrajectoryLine();

        this.drawTrajectoryPoint();

        this.feedbackController.refresh();
    }

    drawTrajectoryLine() {
        const selectedLine = stores.trajectoryListStore.selected;
        if (!selectedLine) {
            return;
        }

        const points = selectedLine.points;
        const symbolData = {
            type: 'CircleMarkerSymbol',
            radius: 3,
            color: 'blue',
        };
        const geometryFactory = navinfo.geometry.GeometryFactory.getInstance();
        const symbolFactory = navinfo.symbol.SymbolFactory.getInstance();
        const symbol = symbolFactory.createSymbol(symbolData);
        points.forEach(item => {
            const geometry = {
                type: 'Point',
                coordinates: [item.longitude, item.latitude],
            };
            this.feedback.add(geometry, symbol);
        });
    }

    drawTrajectoryPoint() {
        const selectedLine = stores.trajectoryListStore.selected;
        if (!selectedLine) {
            return;
        }

        const point = selectedLine.points[stores.imageViewerStore.index];
        if (!point) {
            return;
        }

        const geometry = {
            type: 'Point',
            coordinates: [point.longitude, point.latitude],
        };
        const symbolFactory = navinfo.symbol.SymbolFactory.getInstance();
        const symbol = symbolFactory.getSymbol('trajectory_currentPoint');
        const cloneSymbol = navinfo.common.Util.clone(symbol);
        cloneSymbol.angle = point.direction;
        this.feedback.add(geometry, cloneSymbol);
    }

    uninstallFeedback() {
        if (!this.feedback) {
            return;
        }

        this.feedback.clear();
        this.feedbackController.del(this.feedback);
        this.feedbackController.refresh();
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
                        dataSource={ stores.trajectoryListStore.data }
                    >
                        <Column
                            title="采集员"
                            dataIndex="worker"
                            key="worker"
                        />
                        <Column
                            title="平台"
                            dataIndex="platform"
                            key="platform"
                        />
                        <Column
                            title="日期"
                            dataIndex="date"
                            key="date"
                        />
                        <Column
                            title="操作"
                            key="action"
                            render={ (text, record, index) => <OperationCell trajectoryLine={ record }/> }
                        />
                    </Table>
                </div>
            </Panel>
        );
    }
}
