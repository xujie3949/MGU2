class Command {
    constructor(options) {
        this.key = options.key || '';
        this.name = options.name || '';
        this.desc = options.desc || '';
        this.icon = options.icon || '';
    }

    excute() {
        throw new Error(`${this.name}命令未重写Excute方法`);
    }

    canExcute() {
        return true;
    }
}

export default Command;
