import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    Button,
    Icon,
} from 'antd';
import Viewer from 'viewerjs';

import 'viewerjs/dist/viewer.css';

import stores from 'Stores/stores';
import Panel from 'Components/panel/Panel';
import navinfo from 'Navinfo';
import testImage from 'Images/test.jpg';
import style from './styles/style.styl';

const { Group: ButtonGroup } = Button;

@observer
export default class ImageViewer extends Component {
    constructor(props) {
        super(props);
        this.viewer = null;
    }

    componentDidMount() {
        // this.updateViewer();
    }

    componentDidUpdate() {
        // this.updateViewer();
    }

    onFirstClick = e => {
        stores.imageViewerStore.first();
    };

    onPrevClick = e => {
        stores.imageViewerStore.prev();
    };

    onReversePlayClick = e => {
        stores.imageViewerStore.reversePlay();
    };

    onPauseClick = e => {
        stores.imageViewerStore.pause();
    };

    onPlayClick = e => {
        stores.imageViewerStore.play();
    };

    onNextClick = e => {
        stores.imageViewerStore.next();
    };

    onLastClick = e => {
        stores.imageViewerStore.last();
    };

    destroyViewer() {
        if (!this.viewer) {
            return;
        }

        this.viewer.destroy();
        this.viewer = null;
    }

    updateViewer() {
        if (!this.image) {
            return;
        }

        const options = {
            minZoomRatio: 0.1,
            maxZoomRatio: 10,
            zoomRatio: 0.5,
            minWidth: 200,
            minHeight: 200,
            toolbar: {
                zoomIn: 1,
                zoomOut: 1,
                oneToOne: 1,
                reset: 1,
                prev: 0,
                play: 0,
                next: 0,
                rotateLeft: 0,
                rotateRight: 0,
                flipHorizontal: 0,
                flipVertical: 0,
            },
            title: false,
            navbar: false,
            button: false,
            inline: true,
            viewed: function () {
                this.viewer.zoomTo(1);
            },
        };

        this.viewer = new Viewer(this.image, options);
    }

    render() {
        this.destroyViewer();

        const enable = stores.trajectoryListStore.selected
            && !stores.imageViewerStore.playing
            && !stores.imageViewerStore.loading;

        return (
            <Panel
                { ...this.props }
                title="轨迹回放"
            >
                <div className={ style.container }>
                    <div className={ style.viewer }>
                        <img
                            className={ style.image }
                            ref={ el => {
                                this.image = el;
                            } }
                            src={ stores.imageViewerStore.src }
                        />
                    </div>
                    <div className={ style.toolBar }>
                        <ButtonGroup>
                            <Button
                                type="primary"
                                size="small"
                                disabled={ !stores.imageViewerStore.hasPrev || !enable }
                                onClick={ this.onFirstClick }
                            >
                                <Icon type="double-left"/>
                                首张
                            </Button>
                            <Button
                                type="primary"
                                size="small"
                                disabled={ !stores.imageViewerStore.hasPrev || !enable }
                                onClick={ this.onPrevClick }
                            >
                                <Icon type="left"/>
                                上一张
                            </Button>
                            <Button
                                type="primary"
                                size="small"
                                disabled={ !stores.imageViewerStore.hasPrev || !enable }
                                onClick={ this.onReversePlayClick }
                            >
                                <Icon type="step-backward"/>
                                倒播
                            </Button>
                            <Button
                                type="primary"
                                size="small"
                                disabled={ !stores.imageViewerStore.playing || !stores.trajectoryListStore.selected }
                                onClick={ this.onPauseClick }
                            >
                                <Icon type="pause-circle"/>
                                暂停
                            </Button>
                            <Button
                                type="primary"
                                size="small"
                                disabled={ !stores.imageViewerStore.hasNext || !enable }
                                onClick={ this.onPlayClick }
                            >
                                前播
                                <Icon type="step-forward"/>
                            </Button>
                            <Button
                                type="primary"
                                size="small"
                                disabled={ !stores.imageViewerStore.hasNext || !enable }
                                onClick={ this.onNextClick }
                            >
                                下一张
                                <Icon type="right"/>
                            </Button>
                            <Button
                                type="primary"
                                size="small"
                                disabled={ !stores.imageViewerStore.hasNext || !enable }
                                onClick={ this.onLastClick }
                            >
                                尾张
                                <Icon type="double-right"/>
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
            </Panel>
        );
    }
}
