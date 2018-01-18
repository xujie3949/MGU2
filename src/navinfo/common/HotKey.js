import mousetrap from 'mousetrap';

class HotKey {
    static bind(hotKey, func, action = 'keyup') {
        mousetrap.bind(hotKey, func, action);
    }

    static unbind(hotKey, action = 'keyup') {
        mousetrap.unbind(hotKey, action);
    }

    static trigger(hotKey, action = 'keyup') {
        mousetrap.trigger(hotKey, action);
    }

    static pause(hotKey) {
        mousetrap.pause(hotKey);
    }

    static unpause(hotKey) {
        mousetrap.unpause(hotKey);
    }

    static reset(hotKey) {
        mousetrap.reset(hotKey);
    }
}

export default HotKey;
