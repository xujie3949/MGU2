import createDebug, { enable } from 'debug';

class Logger {
    static instance = null;

    constructor() {
        this.namespace = 'App::UtilLogger';
        this._updateDebug();
    }

    setNamespace(namespace) {
        this.namespace = namespace;
        this._updateDebug();
    }

    log(string) {
        this.debug(string);
    }

    _updateDebug() {
        enable(this.namespace);

        this.debug = createDebug(this.namespace);
    }

    destroy() {
        Logger.instance = null;
    }

    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
}

export default Logger;

