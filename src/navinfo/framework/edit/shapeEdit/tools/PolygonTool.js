import ShapeTool from './ShapeTool';
import PolygonVertexAddOperation from '../../../operation/PolygonVertexAddOperation';
import PolygonVertexMoveOperation from '../../../operation/PolygonVertexMoveOperation';
import PolygonVertexRemoveOperation from '../../../operation/PolygonVertexRemoveOperation';
import Util from '../../../../common/Util';

/**
 * Created by xujie3949 on 2016/12/8.
 * polygon工具基类
 */

class PolygonTool extends ShapeTool {
    constructor() {
        super();

        this.name = 'PolygonTool';
    }

    drawFinalGeometry() {
        const ls = Util.clone(this.shapeEditor.editResult.finalGeometry);
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

        const vertexSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_vertex');

        let n = ls.coordinates.length;
        if (this.shapeEditor.editResult.isClose) {
            n -= 1;
        }

        for (let i = 0; i < n; ++i) {
            const vertex = this.coordinatesToPoint(ls.coordinates[i]);
            this.defaultFeedback.add(vertex, vertexSymbol);
        }
    }

    drawFill() {
        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        const length = ls.coordinates.length;
        if (length < 3) {
            return;
        }

        const ring = Util.clone(ls);
        if (!this.shapeEditor.editResult.isClosed) {
            this.geometryAlgorithm.close(ring);
        }

        const polygon = {
            type: 'Polygon',
            coordinates: [ring.coordinates],
        };

        const symbol = this.symbolFactory.getSymbol('shapeEdit_py_red');
        this.defaultFeedback.add(polygon, symbol);
    }

    getTwoPointDashLine() {
        const ls = this.shapeEditor.editResult.finalGeometry;
        const length = ls.coordinates.length;

        const dashLine = {
            type: 'LineString',
            coordinates: [],
        };

        const prevCoordinate = ls.coordinates[0];
        const mouseCoordinate = this.mousePoint.coordinates;
        dashLine.coordinates.push(prevCoordinate);
        dashLine.coordinates.push(mouseCoordinate);

        return dashLine;
    }

    getThreePointDashLine() {
        const ls = this.shapeEditor.editResult.finalGeometry;
        const length = ls.coordinates.length;

        const dashLine = {
            type: 'LineString',
            coordinates: [],
        };

        const prevCoordinate = ls.coordinates[0];
        const nextCoordinate = ls.coordinates[ls.coordinates.length - 1];
        const mouseCoordinate = this.mousePoint.coordinates;
        dashLine.coordinates.push(prevCoordinate);
        dashLine.coordinates.push(mouseCoordinate);
        dashLine.coordinates.push(nextCoordinate);

        return dashLine;
    }

    coordinatesToPoint(coordinates) {
        const point = {
            type: 'Point',
            coordinates: coordinates,
        };
        return point;
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
        const opereation = new PolygonVertexAddOperation(
            this.shapeEditor,
            index,
            point,
        );

        this.createOperation(opereation);
    }

    delVertex(index) {
        const opereation = new PolygonVertexRemoveOperation(
            this.shapeEditor,
            index,
            null,
        );

        this.createOperation(opereation);
    }

    moveVertex(index, point, snap) {
        const opereation = new PolygonVertexMoveOperation(
            this.shapeEditor,
            index,
            point,
        );

        this.createOperation(opereation);
    }
}

export default PolygonTool;

