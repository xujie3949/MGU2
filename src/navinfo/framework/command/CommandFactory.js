class CommandFactory {
    constructor(props) {
        this.commands = {};
    }

    register(command) {
        if (this.commands.hasOwnProperty(command.key)) {
            return;
        }

        this.commands[command.key] = command;
    }

    unRegister(key) {
        if (!this.commands.hasOwnProperty(key)) {
            return;
        }

        delete this.commands[key];
    }

    clear() {
        this.commands = {};
    }

    getCommand(key) {
        if (!this.commands.hasOwnProperty(key)) {
            return null;
        }

        return this.commands[key];
    }

    /**
     * 单例销毁方法.
     * @return {undefined}
     */
    destroy() {
        this.clear();
        CommandFactory.instance = null;
    }

    /**
     * 获取FeatureFactory单例对象的静态方法
     * @example
     * const commandFactory = CommandFactory.getInstance();
     * @returns {Object} CommandFactory单例对象
     */
    static getInstance() {
        if (!CommandFactory.instance) {
            CommandFactory.instance = new CommandFactory();
        }
        return CommandFactory.instance;
    }
}

export default CommandFactory;
