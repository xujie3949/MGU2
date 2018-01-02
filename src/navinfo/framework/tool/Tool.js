// import ToolController from './ToolController';

/**
 * Created by xujie3949 on 2016/12/8.
 */

class Tool {
    constructor() {
        this.name = '';
        this.isActive = false;
        this.map = null;
        this.onFinish = null;
        this.options = null;
        this.cursor = null;
    }

    onActive(map, onFinish, options) {
        if (this.isActive) {
            return true;
        }

        this.isActive = true;
        this.map = map;
        this.onFinish = onFinish;
        this.options = options;

        return true;
    }

    onDeactive() {
        if (!this.isActive) {
            return true;
        }

        this.isActive = false;
        this.map = null;
        this.onFinish = null;
        this.options = null;

        return true;
    }

    // deny() {
    //     const toolController = ToolController.getInstance();
    //     toolController.pause();
    //     this.cursor = this.map.getContainer().style.cursor;
    //     this.map.getContainer().style.cursor = 'not-allowed';
    // }
    //
    // pause() {
    //     const toolController = ToolController.getInstance();
    //     toolController.pause();
    //     this.cursor = this.map.getContainer().style.cursor;
    //     this.map.getContainer().style.cursor = 'wait';
    // }
    //
    // continue() {
    //     const toolController = ToolController.getInstance();
    //     toolController.continue();
    //     this.map.getContainer().style.cursor = this.cursor;
    //     this.cursor = null;
    // }

    onLeftButtonDown(event) {
        this.checkIsActive();
        return true;
    }

    onMiddleButtonDown(event) {
        this.checkIsActive();
        return true;
    }

    onRightButtonDown(event) {
        this.checkIsActive();
        return true;
    }

    onLeftButtonUp(event) {
        this.checkIsActive();
        return true;
    }

    onMiddleButtonUp(event) {
        this.checkIsActive();
        return true;
    }

    onRightButtonUp(event) {
        this.checkIsActive();
        return true;
    }

    onLeftButtonClick(event) {
        this.checkIsActive();
        return true;
    }

    onMiddleButtonClick(event) {
        this.checkIsActive();
        return true;
    }

    onRightButtonClick(event) {
        this.checkIsActive();
        return true;
    }

    onLeftButtonDblClick(event) {
        this.checkIsActive();
        return true;
    }

    onMiddleButtonDblClick(event) {
        this.checkIsActive();
        return true;
    }

    onRightButtonDblClick(event) {
        this.checkIsActive();
        return true;
    }

    onMouseMove(event) {
        this.checkIsActive();
        return true;
    }

    onWheel(event) {
        this.checkIsActive();
        return true;
    }

    onKeyDown(event) {
        this.checkIsActive();
        return true;
    }

    onKeyUp(event) {
        this.checkIsActive();
        return true;
    }

    onKeyPress(event) {
        this.checkIsActive();
        return true;
    }

    checkIsActive() {
        if (!this.isActive) {
            throw new Error(`工具[${this.name}]处于非激活状态!`);
        }
    }
}

export default Tool;
