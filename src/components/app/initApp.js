import stores from 'Stores/stores';
import registerCommands from 'Business/command/registerCommands';

class InitApp {
    startup = () => {
        // 处理全局事件
        window.addEventListener('selectstart', this.onSelectStart);

        // 初始化命令
        registerCommands();

        // 初始化stores
        const keys = Object.getOwnPropertyNames(stores);
        for (let i = 0; i < keys.length; ++i) {
            const store = stores[keys[i]];
            if (store.initialize) {
                store.initialize();
            }
        }
    };

    shutdown = () => {
        window.removeEventListener('selectstart', this.onSelectStart);
    };

    onSelectStart = e => {
        e.preventDefault();
    };
}

const initApp = new InitApp();
export default initApp;
