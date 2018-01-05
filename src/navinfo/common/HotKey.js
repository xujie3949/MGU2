import mousetrap from 'mousetrap';

class HotKey {
    static bind(hotKey, func, ...args) {
        mousetrap.bind(hotKey, func, args);
    }

    static unbind(hotKey, ...args) {
        mousetrap.unbind(hotKey, args);
    }

    static trigger(hotKey, ...args) {
        mousetrap.trigger(hotKey, args);
    }

    static reset(hotKey) {
        mousetrap.reset(hotKey);
    }
}

export default HotKey;
