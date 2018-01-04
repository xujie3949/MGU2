/**
 * 操作模块的控制器
 * @class OperationController
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class OperationController {
    /**
     * 初始化方法
     * @method initialize
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    constructor() {
        this.step = 100;
        this.undoStack = [];
        this.redoStack = [];
    }

    /**
     * 向 undoStack 中添加本次操作结果
     * @method add
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} operation 操作结果
     * @return {undefined}
     */
    add(operation) {
        if (this.undoStack.length >= this.step) {
            this.undoStack.shift();
        }
        operation.do();
        this.redoStack = [];
        this.undoStack.push(operation);
    }

    /**
     * 从 undoStack 取出上一次的操作结果，向 redoStack 中添加本次操作结果
     * @method undo
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    undo() {
        if (!this.canUndo()) {
            return;
        }

        const operation = this.undoStack.pop();
        operation.undo();

        this.redoStack.push(operation);
    }

    /**
     * 从 redoStack 取出上一次的操作结果，向 undoStack 中添加本次操作结果
     * @method redo
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    redo() {
        if (!this.canRedo()) {
            return;
        }

        const operation = this.redoStack.pop();
        operation.do();

        this.undoStack.push(operation);
    }

    /**
     * 判断是否可以进行 undo 操作
     * @method canUndo
     * @author XuJie
     * @date   2017-09-11
     * @return {boolean} 可以进行 undo 操作返回true，否侧false
     */
    canUndo() {
        return this.undoStack.length !== 0;
    }

    /**
     * 判断是否可以进行 redo 操作
     * @method canRedo
     * @author XuJie
     * @date   2017-09-11
     * @return {boolean} 可以进行 redo 操作返回true，否侧false
     */
    canRedo() {
        return this.redoStack.length !== 0;
    }

    /**
     * 清空 undoStack,redoStack
     * @method clear
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    clear() {
        this.undoStack = [];
        this.redoStack = [];
    }

    /**
     * 销毁实例对象
     * @method destroy
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    destroy() {
        this.clear();
        OperationController.instance = null;
    }

    static instance = null;

    /**
     * 获取单例对象
     * @method getInstance
     * @author XuJie
     * @date   2017-09-11
     * @return {object} 实例对象
     */
    static getInstance() {
        if (!OperationController.instance) {
            OperationController.instance =
                new OperationController();
        }
        return OperationController.instance;
    }
}

export default OperationController;
