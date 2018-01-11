class Command {
    constructor() {
        this.key = '';
        this.name = '';
        this.desc = '';
        this.icon = '';
    }

    execute() {
        throw new Error(`${this.name}命令未重写Execute方法`);
    }

    canExecute() {
        return true;
    }
}

export default Command;
