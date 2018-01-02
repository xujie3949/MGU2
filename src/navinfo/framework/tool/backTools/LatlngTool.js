import Tool from '../Tool';
import EventController from '../../../common/EventController';

/**
 * Created by wcm05654 on 2017/10/25
 */

class LatlngTool extends Tool {
    constructor() {
        super();

        this.eventController = EventController.getInstance();
        this.name = 'LatLngTool';
        this.mouseDragging = false;
    }

    onActive(map, onFinish, options) {
        if (!super.onActive(map, onFinish, options)) {
            return false;
        }
        return true;
    }

    onMouseMove(event) {
        if (!super.onMouseMove(event)) {
            return false;
        }
        const isDragging = this.map.dragging.enabled();
        if (isDragging && this.mouseDragging) {
            return true;
        }
        const point = this.latlngToGeojson(event.latlng);
        this.eventController.fire('ChangeCoordnites', point);
        return true;
    }

    onLeftButtonDown(event) {
        if (!super.onLeftButtonDown(event)) {
            return false;
        }
        this.mouseDragging = true;
        return true;
    }

    onLeftButtonUp(event) {
        if (!super.onLeftButtonUp(event)) {
            return false;
        }
        this.mouseDragging = false;
        return true;
    }
    
    latlngToGeojson(latlng) {
        const geojson = {
            type: 'Point',
            coordinates: [latlng.lng, latlng.lat],
        };
        return geojson;
    }
}

export default LatlngTool;

