import appStore from 'Stores/appStore';
import userStore from 'Stores/userStore';
import loadingStore from 'Stores/loadingStore';
import loginStore from 'Stores/loginStore';
import menuBarStore from 'Stores/menuBarStore';
import toolBarStore from 'Stores/toolBarStore';
import leftPanelStore from 'Stores/leftPanelStore';
import rightPanelStore from 'Stores/rightPanelStore';

const stores = {
    appStore: appStore,
    userStore: userStore,
    loadingStore: loadingStore,
    loginStore: loginStore,
    menuBarStore: menuBarStore,
    toolBarStore: toolBarStore,
    leftPanelStore: leftPanelStore,
    rightPanelStore: rightPanelStore,
};

export default stores;
