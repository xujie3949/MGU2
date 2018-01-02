import MapTool from './MapTool';

/**
 * Created by xujie3949 on 2016/12/8.
 */
class PanTool extends MapTool {
    constructor() {
        super();

        this.name = 'PanTool';
    }

    onActive(map, onFinish, options) {
        if (!super.onActive(map, onFinish, options)) {
            return false;
        }

        this.map.getContainer().style.cursor = 'pointer';
        this.map.dragging.enable();
        this.map.touchZoom.enable();
        this.map.boxZoom.enable();
        this.map.keyboard.enable();

        return true;
    }

    onDeactive() {
        this.map.dragging.disable();
        this.map.touchZoom.disable();
        this.map.boxZoom.disable();
        this.map.keyboard.disable();
        return super.onDeactive();
    }
}

export default PanTool;

