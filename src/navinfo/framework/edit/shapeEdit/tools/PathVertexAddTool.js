import PathTool from './PathTool';

/**
 * Created by xujie3949 on 2016/12/8.
 * link两端添加形状点工具
 */

class PathVertexAddTool extends PathTool {
    constructor() {
        super();

        this.name = 'PathVertexAddTool';
        this.addDirection = 'tail';
    }

    resetStatus() {
        super.resetStatus();

        this.addDirection = 'tail';
    }

    refresh() {
        this.resetDashLine();
        this.resetDashLineFeedback();
        this.resetFeedback();
        this.resetSnapActor();
    }

    resetSnapActor() {
        this.uninstallSnapActors();

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        super.resetSnapActor();
    }

    resetDashLine() {
        this.dashLine = null;

        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        const length = ls.coordinates.length;
        if (length === 0) {
            return;
        }

        if (!this.mousePoint) {
            return;
        }

        let startCoordinate = null;
        if (this.addDirection === 'tail') {
            startCoordinate = ls.coordinates[length - 1];
        } else {
            startCoordinate = ls.coordinates[0];
        }

        const endCoordinate = this.mousePoint.coordinates;

        this.dashLine = {
            type: 'LineString',
            coordinates: [startCoordinate, endCoordinate],
        };
    }

    resetDashLineFeedback() {
        if (!this.dashLineFeedback) {
            return;
        }

        this.dashLineFeedback.clear();
        this.refreshFeedback();

        if (this.dashLine !== null) {
            const lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
            this.dashLineFeedback.add(this.dashLine, lineSymbol);
            this.refreshFeedback();
        }
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        if (this.shapeEditor.editResult.changeDirection) {
            this.addDirection = this.getAddDirection(this.mousePoint);
        }

        this.resetDashLine();
        this.resetDashLineFeedback();

        return true;
    }

    getAddDirection(point) {
        const ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return 'tail';
        }

        const length = ls.coordinates.length;
        if (length < 2) {
            return 'tail';
        }

        const sPoint = this.coordinatesToPoint(ls.coordinates[0]);
        const ePoint = this.coordinatesToPoint(ls.coordinates[length - 1]);

        const sDis = this.geometryAlgorithm.distance(sPoint, point);
        const eDis = this.geometryAlgorithm.distance(ePoint, point);

        return eDis < sDis ? 'tail' : 'head';
    }
    
    coordinatesToPoint(coordinates) {
        const point = {
            type: 'Point',
            coordinates: coordinates,
        };
        return point;
    }

    onLeftButtonClick(event) {
        if (!super.onLeftButtonClick(event)) {
            return false;
        }

        const res = this.snapController.snap(this.mousePoint);

        if (this.addDirection === 'tail') {
            this.addPointToTail(res);
        } else {
            this.addPointToHead(res);
        }

        return true;
    }

    addPointToTail(res) {
        const ls = this.shapeEditor.editResult.finalGeometry;
        this.addVertex(ls.coordinates.length, this.mousePoint, res);
    }

    addPointToHead(res) {
        this.addVertex(0, this.mousePoint, res);
    }
}

export default PathVertexAddTool;
