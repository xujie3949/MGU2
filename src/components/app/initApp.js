import stores from 'Stores/stores';
import initCommands from 'Commands/initCommands';

const onSelectStart = e => {
  e.preventDefault();
};

const startup = () => {
  // 处理全局事件
  window.addEventListener('selectstart', this.onSelectStart);

  // 初始化命令
  initCommands();

  // 初始化stores
  const keys = Object.getOwnPropertyNames(stores);
  for (let i = 0; i < keys.length; ++i) {
    const store = stores[keys[i]];
    if (store.initialize) {
      store.initialize();
    }
  }
};

const shutdown = () => {
  window.removeEventListener('selectstart', this.onSelectStart);
};

export default {
  startup,
  shutdown,
};