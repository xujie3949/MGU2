import {
    observable,
    action,
    computed,
} from 'mobx';

import navinfo from 'Navinfo';

class ToolBarStore {
  @observable itemId;
  @observable.ref items;

  constructor() {
      this.itemId = null;
      this.items = [];
  }

  @action
  initialize() {
      const commandFactory = navinfo.framework.command.CommandFactory.getInstance();
      this.items = [];
      this.items.push(commandFactory.getCommand('select'));
      this.items.push(commandFactory.getCommand('add'));
      this.items.push('divider');
      this.items.push(commandFactory.getCommand('del'));
      this.items.push(commandFactory.getCommand('info'));
  }

  @action
  setItemId(value) {
      this.itemId = value;
  }
}

const toolBarStore = new ToolBarStore();
export default toolBarStore;
