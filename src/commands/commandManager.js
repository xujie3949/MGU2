class CommandManager {
  constructor(props){
    this.commands = {};
  }

  add(command){
    if(this.commands.hasOwnProperty(command.key)){
      return;
    }

    this.commands[command.key] = command;
  }

  del(key){
    if(!this.commands.hasOwnProperty(key)){
      return;
    }

    delete this.commands[key];
  }

  getCommand(key){
    if(!this.commands.hasOwnProperty(key)){
      return  null;
    }

    return this.commands[key];
  }
}

const commandManager = new CommandManager();
export default commandManager;