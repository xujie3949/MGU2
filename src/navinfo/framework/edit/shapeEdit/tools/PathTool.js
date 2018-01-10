import ShapeTool from './ShapeTool';
import Feedback from '../../../../mapApi/feedback/Feedback';
import PathVertexAddOperation from '../../../operation/PathVertexAddOperation';
import PathVertexMoveOperation from '../../../operation/PathVertexMoveOperation';
import PathVertexRemoveOperation from '../../../operation/PathVertexRemoveOperation';

/**
 * Created by xujie3949 on 2016/12/8.
 * link平滑修行工具
 */
class PathTool extends ShapeTool {
    constructor() {
        super();

        this.name = 'PathTool';
        this.nodeSnapActor = null;
        this.linkSnapActor = null;
        this.dashLineFeedback = null;
        this.threshold = null;
        this.nearestPoint = null;
        this.dashLine = null;
        this.isDragging = false;
    }

    startup() {
        this.resetStatus();

        super.startup();

        this.dashLineFeedback = new Feedback();
        this.dashLineFeedback.priority = 0;
        this.defaultFeedback.priority = 1;
        this.installFeedback(this.dashLineFeedback);
        this.threshold = 10;

        this.refresh();
    }

    shutdown() {
        super.shutdown();

        this.resetStatus();
    }

    resetStatus() {
        super.resetStatus();

        this.nodeSnapActor = null;
        this.linkSnapActor = null;
        this.dashLineFeedback = null;
        this.threshold = null;
        this.nearestPoint = null;
        this.dashLine = null;
        this.isDragging = false;
    }

    refresh() {
        this.resetFeedback();
    }

    resetSnapActor() {
        const actorInfos = this.shapeEditor.editResult.snapActors;
        for (let i = 0; i < actorInfos.length; ++i) {
            const actorInfo = actorInfos[i];
            if (!actorInfo.enable) {
                continue;
            }
            if (!actorInfo.tool !== this.name) {
                continue;
            }
            const snapActor = this.createFeatureSnapActor(actorInfo.geoLiveType, actorInfo.exceptions);
            snapActor.priority = actorInfo.priority;
            this.installSnapActor(snapActor);
        }
    }

    resetMouseInfo() {
    }

    resetFeedback() {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        this.drawFinalGeometry();

        this.drawFinalGeometryVertex();

        this.drawSnapPoint();

        this.drawMouseNearestPoint();

        this.refreshFeedback();
    }

    drawFinalGeometry() {
        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        const lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_edge');
        this.defaultFeedback.add(ls, lineSymbol);
    }

    drawFinalGeometryVertex() {
        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        const sVertexSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_start_vertex');
        const eVertexSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_end_vertex');
        const vertexSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_vertex');

        for (let i = 0; i < ls.coordinates.length; ++i) {
            const vertex = this.coordinatesToPoint(ls.coordinates[i]);
            let symbol = null;
            if (i === 0) {
                symbol = sVertexSymbol;
            } else if (i === ls.coordinates.length - 1) {
                symbol = eVertexSymbol;
            } else {
                symbol = vertexSymbol;
            }
            this.defaultFeedback.add(vertex, symbol);
        }
    }

    drawSnapPoint() {
        if (!this.shapeEditor.editResult.snapResults) {
            return;
        }

        const snapPointSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_snap_point');
        const snapLinkSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_snap_link');

        const results = this.shapeEditor.editResult.snapResults;
        const keys = Object.getOwnPropertyNames(results);
        for (let i = 0; i < keys.length; ++i) {
            const snapObj = results[keys[i]];
            if (!snapObj.feature) {
                continue;
            }

            let symbol = null;
            const geomType = snapObj.feature.geometry.type;
            if (geomType === 'Point') {
                symbol = snapPointSymbol;
            } else {
                symbol = snapLinkSymbol;
            }

            const point = snapObj.point;
            this.defaultFeedback.add(point, symbol);
        }
    }

    drawMouseNearestPoint() {
        if (!this.isDragging || !this.nearestPoint) {
            return;
        }

        const symbol = this.symbolFactory.getSymbol('shapeEdit_pt_selected_vertex');

        this.defaultFeedback.add(this.nearestPoint, symbol);
    }

    resetDashLineFeedback() {
        if (!this.dashLineFeedback) {
            return;
        }

        this.dashLineFeedback.clear();
        this.refreshFeedback();

        if (!this.isDragging) {
            return;
        }

        if (this.dashLine) {
            const lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
            this.dashLineFeedback.add(this.dashLine, lineSymbol);
        }

        this.refreshFeedback();
    }

    getDashLineByVertexIndex(index) {
        const dashLine = {
            type: 'LineString',
            coordinates: [],
        };

        const ls = this.shapeEditor.editResult.finalGeometry;

        let prevCoordinate = null;
        let nextCoordinate = null;
        let mouseCoordinate = null;

        if (index === 0) {
            nextCoordinate = ls.coordinates[index + 1];
            mouseCoordinate = this.mousePoint.coordinates;
            dashLine.coordinates.push(mouseCoordinate);
            dashLine.coordinates.push(nextCoordinate);
        } else if (index === ls.coordinates.length - 1) {
            prevCoordinate = ls.coordinates[index - 1];
            mouseCoordinate = this.mousePoint.coordinates;
            dashLine.coordinates.push(prevCoordinate);
            dashLine.coordinates.push(mouseCoordinate);
        } else {
            prevCoordinate = ls.coordinates[index - 1];
            nextCoordinate = ls.coordinates[index + 1];
            mouseCoordinate = this.mousePoint.coordinates;
            dashLine.coordinates.push(prevCoordinate);
            dashLine.coordinates.push(mouseCoordinate);
            dashLine.coordinates.push(nextCoordinate);
        }

        return dashLine;
    }

    getDashLineByEdgeIndex(index) {
        const dashLine = {
            type: 'LineString',
            coordinates: [],
        };

        const ls = this.shapeEditor.editResult.finalGeometry;

        const prevCoordinate = ls.coordinates[index];
        const nextCoordinate = ls.coordinates[index + 1];
        const mouseCoordinate = this.mousePoint.coordinates;
        dashLine.coordinates.push(prevCoordinate);
        dashLine.coordinates.push(mouseCoordinate);
        dashLine.coordinates.push(nextCoordinate);

        return dashLine;
    }

    onLeftButtonDown(event) {
        if (!super.onLeftButtonDown(event)) {
            return false;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 2) {
            return false;
        }

        return true;
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        return true;
    }

    onLeftButtonUp(event) {
        if (!super.onLeftButtonUp(event)) {
            return false;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 2) {
            return false;
        }

        return true;
    }

    onKeyUp(event) {
        const key = event.key;
        switch (key) {
            case 'Escape':
                this.isDragging = false;
                const newEditResult = this.shapeEditor.originEditResult.clone();
                this.shapeEditor.createOperation('恢复初始状态', newEditResult);
                break;
            case ' ':
                this.isDragging = false;
                if (this.onFinish) {
                    this.onFinish(null);
                }
                break;
            case 'z':
                if (event.ctrlKey) {
                    this.isDragging = false;
                    this.operationController.undo();
                }
                break;
            case 'x':
                if (event.ctrlKey) {
                    this.isDragging = false;
                    this.operationController.redo();
                }
                break;
            default:
                break;
        }

        return true;
    }

    getNearestLocations(point) {
        if (!point) {
            return null;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        return this.geometryAlgorithm.nearestLocations(point, ls);
    }

    getPointByIndex(index, nearestLocations) {
        if (index === nearestLocations.previousIndex) {
            return nearestLocations.previousPoint;
        }
        if (index === nearestLocations.nextIndex) {
            return nearestLocations.nextPoint;
        }
        return null;
    }

    getSelectedVertexIndex(point) {
        if (!point) {
            return null;
        }

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        const points = [];
        for (let i = 0; i < ls.coordinates.length; ++i) {
            const tmpPoint = this.coordinatesToPoint(ls.coordinates[i]);
            this.addPoint(tmpPoint, i, points);
        }

        const pixelPoint = this.lonlatToPixel(point);
        const selectedItem = this.findNearestPoint(pixelPoint, points);
        if (!selectedItem) {
            return null;
        }

        const dis = this.geometryAlgorithm.distance(pixelPoint, selectedItem.key);
        if (dis < this.threshold) {
            return selectedItem.value;
        }

        return null;
    }

    getNearestVertexIndex(index, point) {
        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        const points = [];
        const prevIndex = index - 1;
        const nextIndex = index + 1;

        if (prevIndex > 0) {
            const prevPoint = this.coordinatesToPoint(ls.coordinates[prevIndex]);
            this.addPoint(prevPoint, prevIndex, points);
        }

        if (nextIndex < ls.coordinates.length - 1) {
            const nextPoint = this.coordinatesToPoint(ls.coordinates[nextIndex]);
            this.addPoint(nextPoint, nextIndex, points);
        }

        const pixelPoint = this.lonlatToPixel(point);
        const selectedItem = this.findNearestPoint(pixelPoint, points);
        if (!selectedItem) {
            return null;
        }

        const dis = this.geometryAlgorithm.distance(pixelPoint, selectedItem.key);
        if (dis < this.threshold) {
            return selectedItem.value;
        }

        return null;
    }

    addPoint(point, value, points) {
        const pixelPoint = this.lonlatToPixel(point);
        points.push(
            {
                key: pixelPoint,
                value: value,
            },
        );
    }

    findNearestPoint(point, points) {
        let selectedItem = null;
        let minDis = Number.MAX_VALUE;
        for (let i = 0; i < points.length; ++i) {
            const item = points[i];
            const tmpPoint = item.key;
            const dis = this.geometryAlgorithm.distance(point, tmpPoint);
            if (dis < minDis) {
                minDis = dis;
                selectedItem = item;
            }
        }

        return selectedItem;
    }

    coordinatesToPoint(coordinates) {
        const point = {
            type: 'Point',
            coordinates: coordinates,
        };
        return point;
    }

    lonlatToPixel(point) {
        const pixelPoint = this.map.project([point.coordinates[1], point.coordinates[0]]);
        const newPoint = this.coordinatesToPoint([pixelPoint.x, pixelPoint.y]);
        return newPoint;
    }

    createOperation(operation) {
        if (!operation.canDo()) {
            this.refresh();
            const err = operation.getError();
            this.setCenterError(err, 2000);
            return;
        }
        this.operationController.add(operation);
    }

    addVertex(index, point, snap) {
        const opereation = new PathVertexAddOperation(
            this.shapeEditor,
            index,
            point,
            snap,
        );

        this.createOperation(opereation);
    }

    delVertex(index) {
        const opereation = new PathVertexRemoveOperation(
            this.shapeEditor,
            index,
            null,
            null,
        );

        this.createOperation(opereation);
    }

    moveVertex(index, point, snap) {
        const opereation = new PathVertexMoveOperation(
            this.shapeEditor,
            index,
            point,
            snap,
        );

        this.createOperation(opereation);
    }
}

export default PathTool;

