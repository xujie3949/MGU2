import Editor from '../Editor';
import ToolController from '../../tool/ToolController';
import OperationController from '../../operation/OperationController';
import CheckController from '../../check/CheckController';
import EventController from '../../../common/EventController';

/**
 * Created by xujie3949 on 2016/12/8.
 */
class RelationEditor extends Editor {
    constructor(options) {
        super();

        this.checkController = CheckController.getInstance();
        this.toolController = ToolController.getInstance();
        this.operationController = OperationController.getInstance();
        this.eventController = EventController.getInstance();

        this.isEditing = false;
        this.editResult = null;
        this.onFinish = null;

        this.eventController.once('DestroySingleton', () => this.destroy());
    }

    start(editResult, onFinish) {
        if (this.isEditing) {
            return;
        }

        this.isEditing = true;

        this.editResult = editResult;
        this.onFinish = onFinish;

        const type = this.editResult.type;
        const value = this.edirResultMapping[type];
        if (!value) {
            throw new Error(`不支持的关系编辑类型:${type}`);
        }

        const toolName = value.toolName;

        this.toolController.resetCurrentTool(toolName, this.onToolFinish, {
            editResult: editResult,
            toolOptions: this.options,
        });
    }

    stop() {
        if (!this.isEditing) {
            return;
        }

        this.isEditing = false;

        this.toolController.resetCurrentTool('PanTool', null, null);
    }

    abort() {
        if (!this.isEditing) {
            return;
        }

        this.isEditing = false;

        this.toolController.resetCurrentTool('PanTool', null, null);
    }

    onToolFinish(editResult) {
        if (!this.onFinish) {
            return;
        }

        this.editResult = editResult;

        this.onFinish(this.editResult);
    }

    destroy() {
        RelationEditor.instance = null;
    }

    static instance = null;

    static getInstance() {
        if (!RelationEditor.instance) {
            RelationEditor.instance = new RelationEditor();
        }
        return RelationEditor.instance;
    }
}

export default RelationEditor;