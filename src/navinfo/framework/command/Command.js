class Command {
    constructor(options) {
        this.key = options.key || '';
        this.name = options.name || '';
        this.desc = options.desc || '';
        this.icon = options.icon || '';
    }

    execute() {
        throw new Error(`${this.name}命令未重写Execute方法`);
    }

    canExecute() {
        return true;
    }
}

export default Command;
