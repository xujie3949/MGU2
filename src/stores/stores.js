import appStore from 'Stores/appStore';
import userStore from 'Stores/userStore';
import loadingStore from 'Stores/loadingStore';
import loginStore from 'Stores/loginStore';
import menuBarStore from 'Stores/menuBarStore';
import toolBarStore from 'Stores/toolBarStore';
import leftPanelStore from 'Stores/leftPanelStore';
import rightPanelStore from 'Stores/rightPanelStore';
import mapStore from 'Stores/mapStore';
import editorStore from 'Stores/editorStore';
import trajectoryListStore from 'Stores/trajectoryListStore';
import imageViewerStore from 'Stores/imageViewerStore';
import statusBarStore from 'Stores/statusBarStore';
import modalStore from 'Stores/modalStore';

const stores = {
    appStore: appStore,
    userStore: userStore,
    loadingStore: loadingStore,
    loginStore: loginStore,
    menuBarStore: menuBarStore,
    toolBarStore: toolBarStore,
    leftPanelStore: leftPanelStore,
    rightPanelStore: rightPanelStore,
    mapStore: mapStore,
    editorStore: editorStore,
    trajectoryListStore: trajectoryListStore,
    imageViewerStore: imageViewerStore,
    statusBarStore: statusBarStore,
    modalStore: modalStore,
};

export default stores;
