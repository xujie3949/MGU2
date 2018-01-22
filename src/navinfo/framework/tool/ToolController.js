import EventController from '../../common/EventController';
import SceneController from '../../mapApi/scene/SceneController';
import GeometryAlgorithm from '../../geometry/GeometryAlgorithm';
import Util from '../../common/Util';
import Logger from '../../common/Logger';
import PanTool from './PanTool';
import PointSelectTool from './selectTools/PointSelectTool';
import PolygonSelectTool from './selectTools/PolygonSelectTool';
import RectSelectTool from './selectTools/RectSelectTool';
import DistanceTool from './assistantTools/DistanceTool';
import AngleTool from './assistantTools/AngleTool';
import AreaTool from './assistantTools/AreaTool';
import LatlngTool from './backTools/LatlngTool';

/**
 * 单例对象,管理地图中所有的工具
 * @class ToolController
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
class ToolController {
    /**
     * 初始化方法
     * @method constructor
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    constructor() {
        this.eventController = EventController.getInstance();
        this.geometryAlgorithm = GeometryAlgorithm.getInstance();

        this.dblClickTimeInterval = 300;

        this.dblClickDisInterval = 1;

        this.lastClickTime = null;

        this.lastClickPos = null;

        this.map = SceneController.getInstance().getMap().getLeafletMap();

        // 所有注册的工具,不包含后台工具
        this.tools = {};

        // 所有的后台工具
        this.backTools = {};

        // 当前的工具
        this.currentTool = null;

        // 指示当前工具是否运行,对背景后台工具无效
        this.isRunning = true;

        this.logger = Logger.getInstance();

        this.tagNames = {
            INPUT: true,
            BUTTON: true,
            TEXTAREA: true,
        };

        this.loadTools();

        this.resetLastClickStatus();

        this.resetCurrentTool('PanTool', null, null);

        this.eventController.once('DestroySingleton', () => this.destroy());
    }

    bindEvent() {
        // 给工具绑定事件
        this.eventController.on('mousedown', this.onMouseDown);
        this.eventController.on('mousemove', this.onMouseMove);
        this.eventController.on('mouseup', this.onMouseUp);

        // 将键盘事件绑定到body上，并根据event.target决定是否触发工具响应
        document.body.addEventListener('keydown', this._onKeyDown);
        document.body.addEventListener('keyup', this._onKeyUp);

        this.map.getContainer().addEventListener('wheel', this.onWheel);
    }

    unBindEvent() {
        // 给工具解绑事件
        this.eventController.off('mousedown', this.onMouseDown);
        this.eventController.off('mousemove', this.onMouseMove);
        this.eventController.off('mouseup', this.onMouseUp);

        document.body.removeEventListener('keydown', this._onKeyDown);
        document.body.removeEventListener('keyup', this._onKeyUp);

        this.map.getContainer().removeEventListener('wheel', this.onWheel);
    }

    _onKeyDown = event => {
        if (!this.tagNames.hasOwnProperty(event.target.tagName)) {
            this.onKeyDown(event);
            // modified by chenx on 2017-8-31
            // 停止冒泡会导致hotkeys组件不可用
            // event.stopPropagation();
        }
    };

    _onKeyUp = event => {
        if (!this.tagNames.hasOwnProperty(event.target.tagName)) {
            this.onKeyUp(event);
            // event.stopPropagation();
        }
    };

    /**
     * 加载地图工具
     * @method loadTools
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    loadTools() {
        this.addTool(new PanTool());
        this.addTool(new PointSelectTool());
        this.addTool(new RectSelectTool());
        this.addTool(new PolygonSelectTool());
        this.addTool(new DistanceTool());
        this.addTool(new AngleTool());
        this.addTool(new AreaTool());
        this.addBackTool(new LatlngTool());
    }

    /**
     * 重新设置点击状态
     * @method resetLastClickStatus
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    resetLastClickStatus() {
        this.lastClickTime = 0;

        this.lastClickPos = {
            type: 'Point',
            coordinates: [-Number.MAX_VALUE, -Number.MAX_VALUE],
        };
    }

    /**
     * 添加工具,不激活工具, 如果工具已经存在则忽略
     * @method addTool
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} tool 地图工具
     * @return {undefined}
     */
    addTool(tool) {
        if (this.tools.hasOwnProperty(tool.name)) {
            return;
        }

        tool.setToolController(this);
        this.tools[tool.name] = tool;
    }

    /**
     * 根据名称删除工具，如果工具未注册则忽略，如果工具处于激活状态，先退出激活状态
     * @method delTool
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} toolName 地图工具名称
     * @return {undefined}
     */
    delTool(toolName) {
        if (!this.tools.hasOwnProperty(toolName)) {
            return;
        }

        if (toolName === this.currentTool.name) {
            this.currentTool.onDeactive();
            this.currentTool = null;
        }

        const tool = this.tools[toolName];
        tool.setToolController(null);

        delete this.tools[toolName];
    }

    /**
     * 添加后台工具，并激活工具。如果工具已经存在则忽略
     * @method addBackTool
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} tool 地图工具
     * @return {undefined}
     */
    addBackTool(tool) {
        if (this.backTools.hasOwnProperty(tool.name)) {
            return;
        }

        tool.setToolController(this);
        tool.onActive(this.map, null, null);
        this.backTools[tool.name] = tool;
    }

    /**
     * 根据名称删除后台工具，如果工具未注册则忽略，如果工具处于激活状态,先退出激活状态
     * @method delBackTool
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} toolName 地图工具
     * @return {undefined}
     */
    delBackTool(toolName) {
        if (!this.backTools.hasOwnProperty(toolName)) {
            return;
        }

        const tool = this.backTools[toolName];
        tool.onDeactive();
        tool.setToolController(null);

        delete this.backTools[toolName];
    }

    /**
     * 根据名称设置当前工具
     * @method resetCurrentTool
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} toolName 地图工具名称
     * @param  {object} onFinish 回调函数
     * @param  {object} options 可选对象
     * @return {boolean} 布尔值
     */
    resetCurrentTool(toolName, onFinish, options) {
        this.continue();

        if (!this.tools.hasOwnProperty(toolName)) {
            return false;
        }

        this.eventController.fire('ToolChanging', {
            currentTool: this.currentTool,
        });

        const tool = this.tools[toolName];

        if (this.currentTool) {
            this.currentTool.onDeactive();
        }

        if (!tool.onActive(this.map, onFinish, options)) {
            return false;
        }

        this.eventController.fire('ToolChanged', {
            oldCurrentTool: this.currentTool,
            newCurrentTool: tool,
        });

        this.currentTool = tool;

        return true;
    }

    /**
     * 如果当前工具存在，先退出激活，然后清空
     * @method clearCurrentTool
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    clearCurrentTool() {
        if (this.currentTool) {
            this.currentTool.onDeactive();
            this.currentTool = null;
        }
    }

    /**
     * 暂停当前工具
     * @method pause
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    pause() {
        this.isRunning = false;
    }

    /**
     * 继续当前工具
     * @method continue
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    continue() {
        this.isRunning = true;
    }

    /**
     * 事件响应函数
     * @method onMouseDown
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onMouseDown = event => {
        const buttonType = this.getButtonType(event.originalEvent.button);
        switch (buttonType) {
            case 'leftButton':
                this.dispatchEvent('onLeftButtonDown', event);
                break;
            case 'middleButton':
                this.dispatchEvent('onMiddleButtonDown', event);
                break;
            case 'rightButton':
                this.dispatchEvent('onRightButtonDown', event);
                break;
            default:
                throw new Error(`未知按键类型:${buttonType}`);
        }
    }

    /**
     * 事件响应函数
     * @method onMouseUp
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onMouseUp = event => {
        const buttonType = this.getButtonType(event.originalEvent.button);
        switch (buttonType) {
            case 'leftButton':
                this.dispatchEvent('onLeftButtonUp', event);
                break;
            case 'middleButton':
                this.dispatchEvent('onMiddleButtonUp', event);
                break;
            case 'rightButton':
                this.dispatchEvent('onRightButtonUp', event);
                break;
            default:
                throw new Error(`未知按键类型:${buttonType}`);
        }

        // 鼠标弹起的时候处理模拟click事件
        const now = new Date().getTime();
        const diffTime = now - this.lastClickTime;
        const pos = this.pointToGeojson(event.layerPoint);
        const diffDis = this.geometryAlgorithm.distance(pos, this.lastClickPos);
        if (diffTime < this.dblClickTimeInterval && diffDis < this.dblClickDisInterval) {
            this.onDblClick(event);
            // 双击触发后恢复状态
            this.resetLastClickStatus();
        } else {
            this.onClick(event);
            this.lastClickPos = pos;
            this.lastClickTime = now;
        }
    }

    /**
     * 事件响应函数
     * @method onMouseMove
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onMouseMove = event => {
        this.dispatchEvent('onMouseMove', event);
    }

    /**
     * 事件响应函数
     * @method onWheel
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onWheel = event => {
        this.dispatchEvent('onWheel', event);
    }

    /**
     * 事件响应函数
     * @method onClick
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onClick = event => {
        const buttonType = this.getButtonType(event.originalEvent.button);
        switch (buttonType) {
            case 'leftButton':
                this.dispatchEvent('onLeftButtonClick', event);
                break;
            case 'middleButton':
                this.dispatchEvent('onMiddleButtonClick', event);
                break;
            case 'rightButton':
                this.dispatchEvent('onRightButtonClick', event);
                break;
            default:
                throw new Error(`未知按键类型:${buttonType}`);
        }
    }

    /**
     * 事件响应函数
     * @method onDblClick
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onDblClick = event => {
        const buttonType = this.getButtonType(event.originalEvent.button);
        switch (buttonType) {
            case 'leftButton':
                this.dispatchEvent('onLeftButtonDblClick', event);
                break;
            case 'middleButton':
                this.dispatchEvent('onMiddleButtonDblClick', event);
                break;
            case 'rightButton':
                this.dispatchEvent('onRightButtonDblClick', event);
                break;
            default:
                throw new Error(`未知按键类型:${buttonType}`);
        }
    }

    /**
     * 事件响应函数
     * @method onKeyDown
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onKeyDown = event => {
        this.dispatchEvent('onKeyDown', event);
        this.onKeyPress(event);
    }

    /**
     * 事件响应函数
     * @method onKeyUp
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onKeyUp = event => {
        this.dispatchEvent('onKeyUp', event);
    }

    /**
     * 事件响应函数
     * @method onKeyPress
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onKeyPress = event => {
        this.dispatchEvent('onKeyPress', event);
    }

    /**
     * 获取按键类型
     * @method getButtonType
     * @author XuJie
     * @date   2017-09-11
     * @param  {number} button 按键类型
     * @return {string} 按键类型
     */
    getButtonType(button) {
        switch (button) {
            case 0:
                return 'leftButton';
            case 1:
                return 'middleButton';
            case 2:
                return 'rightButton';
            default:
                throw new Error(`未知按键类型:${button}`);
        }
    }

    /**
     * 事件派发函数
     * @method dispatchEvent
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} eventName 事件名
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    dispatchEvent(eventName, event) {
        const keys = Object.keys(this.backTools);
        for (let i = 0; i < keys.length; ++i) {
            const tool = this.backTools[keys[i]];
            this.callEventHandler(tool, eventName, event);
        }

        if (this.currentTool && this.isRunning) {
            this.callEventHandler(this.currentTool, eventName, event);
        }
    }

    /**
     * 触发事件处理函数
     * @method callEventHandler
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} tool 地图工具
     * @param  {string} eventName 事件名
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    callEventHandler(tool, eventName, event) {
        const eventMethod = tool[eventName];
        if (eventMethod) {
            try {
                eventMethod.call(tool, event);
            } catch (err) {
                this.logger.log(err);
            }
        }
    }

    /**
     * point转换为几何对象
     * @method pointToGeojson
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} point 点
     * @return {object} geojson
     */
    pointToGeojson(point) {
        const geojson = {
            type: 'Point',
            coordinates: [point.x, point.y],
        };
        return geojson;
    }

    /**
     * 销毁单例对象
     * @method destroy
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    destroy() {
        this.unBindEvent();
        ToolController.instance = null;
    }

    static instance = null

    /**
     * 获取单例对象
     * @method getInstance
     * @author XuJie
     * @date   2017-09-11
     * @return {object} 单例对象
     */
    static getInstance() {
        if (!ToolController.instance) {
            ToolController.instance =
                new ToolController();
        }
        return ToolController.instance;
    }
}

export default ToolController;

