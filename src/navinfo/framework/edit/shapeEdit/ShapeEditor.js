import Editor from '../Editor';
import ToolController from '../../tool/ToolController';
import OperationController from '../../operation/OperationController';
import SnapController from '../../../mapApi/snap/SnapController';
import EventController from '../../../common/EventController';
import Util from '../../../common/Util';
import EditResultOperation from '../../operation/EditResultOperation';

/**
 * Created by xujie3949 on 2016/12/8.
 */
class ShapeEditor extends Editor {
    constructor() {
        super();

        this.toolController = ToolController.getInstance();
        this.operationController = OperationController.getInstance();
        this.snapController = SnapController.getInstance();
        this.eventController = EventController.getInstance();

        this.editResult = null;
        this.originEditResult = null;

        this.eventController.on('ShapeEditToolChanged', this.onShapeToolChanged);
        this.eventController.on('ShapeEditSnapActorChanged', this.onSnapActorChanged);
        this.eventController.once('DestroySingleton', () => this.destroy());
    }

    start(editResult, onFinish) {
        if (this.isEditing) {
            return;
        }

        this.isEditing = true;

        this.operationController.clear();

        this.editResult = editResult;

        this.originEditResult = editResult.clone();

        this.onFinish = onFinish;

        let isCreate = true;
        if (this.editResult.originObject) {
            isCreate = false;
        }
        const type = this.editResult.type;
        const value = this.edirResultMapping[type];
        if (!value) {
            throw new Error(`不支持的形状编辑类型:${type}`);
        }

        const defaultToolName = value.defaultToolName;
        const tools = value.tools;

        this.toolController.resetCurrentTool(defaultToolName, this.onToolFinish, {
            editResult: editResult,
            toolOptions: this.options,
        });

        this.checkTool(tools, defaultToolName);

        const snapActors = this.getSnapActors();

        this.eventController.fire('OpenShapeEditPanel');
        this.eventController.fire('RefreshShapeEditPanelTools', {
            tools: tools,
        });
        this.eventController.fire('RefreshShapeEditPanelSnapActors', {
            snapActors: snapActors,
        });
    }

    stop() {
        if (!this.isEditing) {
            return;
        }

        this.isEditing = false;
        this.editResult = null;
        this.originEditResult = null;
        this.onFinish = null;

        this.operationController.clear();

        this.eventController.fire('CloseShapeEditPanel');

        this.toolController.resetCurrentTool('PanTool', null, null);
    }

    abort() {
        if (!this.isEditing) {
            return;
        }

        this.isEditing = false;
        this.editResult = null;
        this.originEditResult = null;
        this.onFinish = null;

        this.operationController.clear();

        this.eventController.fire('CloseShapeEditPanel');

        this.toolController.resetCurrentTool('PanTool', null, null);
    }

    onShapeToolChanged(args) {
        const toolItem = args.tool;
        this.toolController.resetCurrentTool(toolItem.toolName, this.onToolFinish, {
            toolOptions: this.options,
        });

        const snapActors = this.getSnapActors();
        this.eventController.fire('RefreshShapeEditPanelSnapActors', {
            snapActors: snapActors,
        });
    }

    onSnapActorChanged(args) {
        const snapItem = args.snapActor;
        const snapActors = this.editResult.snapActors;
        snapActors[snapItem.index].enable = snapItem.enable;
        const currentTool = this.toolController.currentTool;
        currentTool.refresh();
    }

    onRedo(oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        const currentTool = this.toolController.currentTool;
        currentTool.refresh();
    }

    onUndo(oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        const currentTool = this.toolController.currentTool;
        currentTool.refresh();
    }

    createOperation(name, newEditResult) {
        const operation = new EditResultOperation(
            name,
            this.onRedo,
            this.onUndo,
            this.editResult,
            newEditResult,
        );
        if (!operation.canDo()) {
            const currentTool = this.toolController.currentTool;
            currentTool.refresh();
            const err = operation.getError();
            currentTool.setCenterError(err, 2000);
            return;
        }
        this.operationController.add(operation);
    }

    getLinkTools() {
        const tools = [];
        tools.push(this.createToolItem('平滑修形', '平滑修形', 'PathSmoothTool', false));
        // 只有刚创建的link才显示延长线功能；
        if (!this.editResult.originObject) {
            tools.push(this.createToolItem('延长线', '延长线', 'PathVertexAddTool', false));
        }
        tools.push(this.createToolItem('插入形状点', '插入形状点', 'PathVertexInsertTool', false));
        tools.push(this.createToolItem('移动形状点', '移动形状点', 'PathVertexMoveTool', false));
        tools.push(this.createToolItem('删除形状点', '删除形状点', 'PathVertexRemoveTool', false));
        return tools;
    }

    getPolygonTools() {
        const tools = [];
        tools.push(this.createToolItem('平滑修形', '平滑修形', 'PolygonSmoothTool', false));
        tools.push(this.createToolItem('绘制点', '绘制形状点', 'PolygonVertexAddTool', false));
        tools.push(this.createToolItem('插入形状点', '插入形状点', 'PolygonVertexInsertTool', false));
        tools.push(this.createToolItem('移动形状点', '移动形状点', 'PolygonVertexMoveTool', false));
        tools.push(this.createToolItem('删除形状点', '删除形状点', 'PolygonVertexRemoveTool', false));
        return tools;
    }

    createToolItem(title, text, toolName, checked) {
        const item = {
            title: title,
            text: text,
            toolName: toolName,
            checked: checked,
        };
        return item;
    }

    getSnapActors() {
        const snapItems = [];

        if (!this.editResult.snapActors) {
            return snapItems;
        }

        const currentTool = this.toolController.currentTool;
        const snapActors = this.editResult.snapActors;
        for (let i = 0; i < snapActors.length; ++i) {
            const snapActor = snapActors[i];
            if (snapActor.tool !== currentTool.toolName) {
                continue;
            }
            const snapItem = this.createSnapItem(i, snapActor.geoLiveType, snapActor.enable);
            snapItems.push(snapItem);
        }
        return snapItems;
    }

    createSnapItem(index, geoLiveType, enable) {
        const item = {
            index: index,
            geoLiveType: geoLiveType,
            enable: enable,
        };
        return item;
    }

    checkTool(tools, toolName) {
        for (let i = 0; i < tools.length; ++i) {
            const tool = tools[i];
            if (tool.toolName === toolName) {
                tool.checked = true;
                return;
            }
        }
    }

    onToolFinish() {
        if (!this.onFinish) {
            return;
        }

        this.onFinish(this.editResult);
    }

    /**
     * 销毁单例对象
     * @return {undefined}
     */
    destroy() {
        this.eventController.off('ShapeEditToolChanged', this.onShapeToolChanged);
        this.eventController.off('ShapeEditToolChanged', this.onSnapActorChanged);
        ShapeEditor.instance = null;
    }

    static instance = null;

    static getInstance() {
        if (!ShapeEditor.instance) {
            ShapeEditor.instance = new ShapeEditor();
        }
        return ShapeEditor.instance;
    }
}

export default ShapeEditor;
