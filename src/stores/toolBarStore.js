import {
    observable,
    action,
    computed,
} from 'mobx';

import commandManager from 'Commands/commandManager';

class ToolBarStore {
  @observable itemId;
  @observable.ref items;

  constructor() {
      this.itemId = null;
      this.items = [];
  }

  @action
  initialize() {
      this.items = [];
      this.items.push(commandManager.getCommand('select'));
      this.items.push(commandManager.getCommand('add'));
      this.items.push('divider');
      this.items.push(commandManager.getCommand('del'));
      this.items.push(commandManager.getCommand('info'));
  }

  @action
  setItemId(value) {
      this.itemId = value;
  }
}

const toolBarStore = new ToolBarStore();
export default toolBarStore;