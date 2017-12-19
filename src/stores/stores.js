import appStore from 'Stores/appStore';
import userStore from 'Stores/userStore';
import loadingStore from 'Stores/loadingStore';
import popupStore from "Src/stores/popupStore";
import loginStore from 'Stores/loginStore';

const stores = {
  appStore: appStore,
  userStore: userStore,
  loadingStore: loadingStore,
  popupStore: popupStore,
  loginStore: loginStore,
};

export default stores;
