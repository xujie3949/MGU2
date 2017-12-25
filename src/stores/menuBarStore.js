import {
  observable,
  action,
  computed,
} from 'mobx';

class MenuBarStore {
  @observable itemId;
  @observable menuPanelOpen;
  @observable menuPanelLeft;
  @observable menuPanelTop;
  @observable.ref menuItems;

  constructor() {
    this.itemId = null;
    this.menuPanelOpen = false;
    this.menuPanelLeft = 0;
    this.menuPanelTop = 0;
    this.menuItems = [];
  }

  @action
  setItemId(value){
    this.itemId = value;
  }

  @action
  setMenuPanelOpen(value){
    this.menuPanelOpen = value;
  }

  @action
  switchMenuPanel(){
    this.menuPanelOpen = !this.menuPanelOpen;
  }

  @action
  setMenuPanelPosition(left, top){
    this.menuPanelLeft = left;
    this.menuPanelTop = top;
  }
}

const menuBarStore = new MenuBarStore();
export default menuBarStore;
