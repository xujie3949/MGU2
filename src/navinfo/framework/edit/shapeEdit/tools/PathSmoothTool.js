/**
 * Created by xujie3949 on 2016/12/8.
 * link平滑修行工具
 */

fastmap.uikit.shapeEdit.PathSmoothTool = fastmap.uikit.shapeEdit.PathTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.PathTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PathSmoothTool';
        this.isSelectedVertex = false;
        this.selectedVertexIndex = null;
        this.selectedEdgeIndex = null;
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.PathTool.prototype.resetStatus.apply(this, arguments);

        this.isSelectedVertex = false;
        this.selectedVertexIndex = null;
        this.selectedEdgeIndex = null;
    },

    refresh: function () {
        this.resetDashLine();
        this.resetDashLineFeedback();
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
    },

    resetDashLine: function () {
        if (!this.isDragging) {
            return;
        }

        if (this.isSelectedVertex) {
            this.dashLine = this.getDashLineByVertexIndex(this.selectedVertexIndex);
        } else {
            this.dashLine = this.getDashLineByEdgeIndex(this.selectedEdgeIndex);
        }
    },

    resetSnapActor: function () {
        this.uninstallSnapActors();

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        if (!this.isDragging || !this.isSelectedVertex) {
            return;
        }

        if (this.selectedVertexIndex !== 0 &&
            this.selectedVertexIndex !== ls.coordinates.length - 1) {
            return;
        }

        fastmap.uikit.shapeEdit.PathTool.prototype.resetSnapActor.apply(this, arguments);
    },

    resetMouseInfo: function () {
        this.setMouseInfo('');

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            this.setMouseInfo('不能对空几何进行平滑修形操作，请切换到延长线工具');
            return;
        }

        if (ls.coordinates.length < 2) {
            this.setMouseInfo('至少需要2个形状点才能进行平滑修形操作，请切换到延长线工具');
            return;
        }
    },

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.shapeEdit.PathTool.prototype.onLeftButtonDown.apply(this, arguments)) {
            return false;
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
        if (!fastmap.uikit.shapeEdit.PathTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        if (!this.isDragging) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        this.resetDashLine();
        this.resetDashLineFeedback();

        if (this.isSelectedVertex) {
            var ls = this.shapeEditor.editResult.finalGeometry;
            var index = this.getNearestVertexIndex(this.selectedVertexIndex, this.mousePoint);
            if (index && index > 0 && index < ls.coordinates.length - 1) {
                if (index < this.selectedVertexIndex) {
                    this.selectedVertexIndex -= 1;
                }
                this.delVertex(index);
            }
        }

        return true;
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.shapeEdit.PathTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
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

