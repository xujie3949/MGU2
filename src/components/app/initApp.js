import stores from 'Stores/stores';
import initCommands from 'Commands/initCommands';

const onSelectStart = e => {
  e.preventDefault();
};

const startup = () => {
  window.addEventListener('selectstart', this.onSelectStart);
  initCommands();
  stores.userStore.loadUserInfo();
  stores.toolBarStore.init();
};

const shutdown = () => {
  window.removeEventListener('selectstart', this.onSelectStart);
};

export default {
  startup,
  shutdown,
};