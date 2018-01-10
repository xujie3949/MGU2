/**
 * Created by xujie3949 on 2016/12/8.
 * polygon平滑修行工具
 */

fastmap.uikit.shapeEdit.PolygonSmoothTool = fastmap.uikit.shapeEdit.PolygonTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.PolygonTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PolygonSmoothTool';
        this.threshold = null;
        this.dashLineFeedback = null;
        this.dashLine = null;
        this.isSelectedVertex = false;
        this.selectedVertexIndex = null;
        this.selectedEdgeIndex = null;
        this.isDragging = false;
        this.nearestPoint = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.shapeEdit.PolygonTool.prototype.startup.apply(this, arguments);

        this.threshold = 10;
        this.dashLineFeedback = new fastmap.mapApi.Feedback();
        this.dashLineFeedback.priority = 0;
        this.defaultFeedback.priority = 1;
        this.installFeedback(this.dashLineFeedback);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.shapeEdit.PolygonTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.PolygonTool.prototype.resetStatus.apply(this, arguments);

        this.threshold = null;
        this.dashLineFeedback = null;
        this.dashLine = null;
        this.isSelectedVertex = false;
        this.selectedVertexIndex = null;
        this.selectedEdgeIndex = null;
        this.isDragging = false;
        this.nearestPoint = null;
    },

    refresh: function () {
        this.resetDashLine();
        this.resetDashLineFeedback();
        this.resetFeedback();
        this.resetMouseInfo();
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        this.drawFill();

        this.drawFinalGeometry();

        this.drawFinalGeometryVertex();

        this.drawMouseNearestPoint();

        this.refreshFeedback();
    },

    drawMouseNearestPoint: function () {
        if (!this.isDragging || !this.nearestPoint) {
            return;
        }

        var symbol = this.symbolFactory.getSymbol('shapeEdit_pt_selected_vertex');

        this.defaultFeedback.add(this.nearestPoint, symbol);
    },

    resetDashLineFeedback: function () {
        if (!this.dashLineFeedback) {
            return;
        }

        this.dashLineFeedback.clear();
        this.refreshFeedback();

        if (this.dashLine) {
            var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
            this.dashLineFeedback.add(this.dashLine, lineSymbol);
        }

        this.refreshFeedback();
    },

    resetDashLine: function () {
        this.dashLine = null;

        if (!this.isDragging) {
            return;
        }

        if (this.isSelectedVertex) {
            this.dashLine = this.getDashLineByVertexIndex(this.selectedVertexIndex);
        } else {
            this.dashLine = this.getDashLineByEdgeIndex(this.selectedEdgeIndex);
        }
    },

    resetMouseInfo: function () {
        this.setMouseInfo('');

        if (!this.shapeEditor.editResult.isClosed) {
            this.setMouseInfo('不能对未闭合的面进行平滑修形操作，请切换到延长线工具');
            return;
        }
    },

    getDashLineByVertexIndex: function (index) {
        var dashLine = {
            type: 'LineString',
            coordinates: []
        };

        var ls = this.shapeEditor.editResult.finalGeometry;

        var prevCoordinate = null;
        var nextCoordinate = null;
        var mouseCoordinate = null;

        if (index === 0 || index === ls.coordinates.length - 1) {
            prevCoordinate = ls.coordinates[1];
            nextCoordinate = ls.coordinates[ls.coordinates.length - 2];
            mouseCoordinate = this.mousePoint.coordinates;
            dashLine.coordinates.push(prevCoordinate);
            dashLine.coordinates.push(mouseCoordinate);
            dashLine.coordinates.push(nextCoordinate);
        } else {
            prevCoordinate = ls.coordinates[index - 1];
            nextCoordinate = ls.coordinates[index + 1];
            mouseCoordinate = this.mousePoint.coordinates;
            dashLine.coordinates.push(prevCoordinate);
            dashLine.coordinates.push(mouseCoordinate);
            dashLine.coordinates.push(nextCoordinate);
        }

        return dashLine;
    },

    getDashLineByEdgeIndex: function (index) {
        var dashLine = {
            type: 'LineString',
            coordinates: []
        };

        var ls = this.shapeEditor.editResult.finalGeometry;

        var prevCoordinate = ls.coordinates[index];
        var nextCoordinate = ls.coordinates[index + 1];
        var mouseCoordinate = this.mousePoint.coordinates;
        dashLine.coordinates.push(prevCoordinate);
        dashLine.coordinates.push(mouseCoordinate);
        dashLine.coordinates.push(nextCoordinate);

        return dashLine;
    },

    getNearestLocations: function (point) {
        if (!point) {
            return null;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        return this.geometryAlgorithm.nearestLocations(point, ls);
    },

    getPointByIndex: function (index, nearestLocations) {
        if (index === nearestLocations.previousIndex) {
            return nearestLocations.previousPoint;
        }
        if (index === nearestLocations.nextIndex) {
            return nearestLocations.nextPoint;
        }
        return null;
    },

    getSelectedVertexIndex: function (point) {
        if (!point) {
            return null;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        var points = [];
        for (var i = 0; i < ls.coordinates.length; ++i) {
            var tmpPoint = this.coordinatesToPoint(ls.coordinates[i]);
            this.addPoint(tmpPoint, i, points);
        }

        var pixelPoint = this.lonlatToPixel(point);
        var selectedItem = this.findNearestPoint(pixelPoint, points);
        if (!selectedItem) {
            return null;
        }

        var dis = this.geometryAlgorithm.distance(pixelPoint, selectedItem.key);
        if (dis < this.threshold) {
            return selectedItem.value;
        }

        return null;
    },

    getNearestVertexIndex: function (index, point) {
        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        var length = ls.coordinates.length;
        var prevIndex = 0;
        var nextIndex = 0;
        if (index === 0) {
            prevIndex = length - 2;
            nextIndex = index + 1;
        } else if (index === length - 1) {
            prevIndex = index - 1;
            nextIndex = 1;
        } else {
            prevIndex = index - 1;
            nextIndex = index + 1;
        }
        var points = [];

        var prevPoint = this.coordinatesToPoint(ls.coordinates[prevIndex]);
        this.addPoint(prevPoint, prevIndex, points);

        var nextPoint = this.coordinatesToPoint(ls.coordinates[nextIndex]);
        this.addPoint(nextPoint, nextIndex, points);

        var pixelPoint = this.lonlatToPixel(point);
        var selectedItem = this.findNearestPoint(pixelPoint, points);
        if (!selectedItem) {
            return null;
        }

        var dis = this.geometryAlgorithm.distance(pixelPoint, selectedItem.key);
        if (dis < this.threshold) {
            return selectedItem.value;
        }

        return null;
    },

    addPoint: function (point, value, points) {
        var pixelPoint = this.lonlatToPixel(point);
        points.push({
            key: pixelPoint,
            value: value
        });
    },

    findNearestPoint: function (point, points) {
        var selectedItem = null;
        var minDis = Number.MAX_VALUE;
        for (var i = 0; i < points.length; ++i) {
            var item = points[i];
            var tmpPoint = item.key;
            var dis = this.geometryAlgorithm.distance(point, tmpPoint);
            if (dis < minDis) {
                minDis = dis;
                selectedItem = item;
            }
        }

        return selectedItem;
    },

    coordinatesToPoint: function (coordinates) {
        var point = {
            type: 'Point',
            coordinates: coordinates
        };
        return point;
    },

    lonlatToPixel: function (point) {
        var pixelPoint = this.map.project([point.coordinates[1], point.coordinates[0]]);
        var newPoint = this.coordinatesToPoint([pixelPoint.x, pixelPoint.y]);
        return newPoint;
    },

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.shapeEdit.PolygonTool.prototype.onLeftButtonDown.apply(this, arguments)) {
            return false;
        }

        if (!this.shapeEditor.editResult.isClosed) {
            return true;
        }

        this.isDragging = true;

        var ls = this.shapeEditor.editResult.finalGeometry;

        var nearestLocations = this.getNearestLocations(this.mousePoint);
        var index = this.getSelectedVertexIndex(nearestLocations.point);
        if (index !== null) {
            this.isSelectedVertex = true;
            this.selectedVertexIndex = index;
            this.nearestPoint = this.getPointByIndex(this.selectedVertexIndex, nearestLocations);
        } else {
            this.isSelectedVertex = false;
            this.selectedEdgeIndex = nearestLocations.previousIndex;
            this.nearestPoint = nearestLocations.point;
        }

        this.refresh();

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.PolygonTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        if (!this.shapeEditor.editResult.isClosed) {
            return true;
        }

        if (!this.isDragging) {
            return false;
        }

        this.resetDashLine();
        this.resetDashLineFeedback();

        if (this.isSelectedVertex) {
            var ls = this.shapeEditor.editResult.finalGeometry;
            var index = this.getNearestVertexIndex(this.selectedVertexIndex, this.mousePoint);
            if (index !== null && ls.coordinates.length > 4) {
                if (index === ls.coordinates.length - 1) {
                    this.selectedVertexIndex -= 1;
                } else if (index < this.selectedVertexIndex) {
                    this.selectedVertexIndex -= 1;
                }
                this.delVertex(index);
            }
        }

        return true;
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.shapeEdit.PolygonTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        if (!this.shapeEditor.editResult.isClosed) {
            return true;
        }

        if (!this.isDragging) {
            return false;
        }

        this.isDragging = false;
        var res = this.snapController.snap(this.mousePoint);
        if (this.isSelectedVertex) {
            this.moveVertex(this.selectedVertexIndex, this.mousePoint, res);
        } else {
            this.addVertex(this.selectedEdgeIndex + 1, this.mousePoint, res);
        }

        return true;
    }
});

