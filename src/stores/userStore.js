import {
    observable,
    action,
    computed,
} from 'mobx';

import navinfo from 'Navinfo';
import User from 'Models/User';

class UserStore {
    @observable user;

    constructor() {
        this.user = null;
    }

    @action
    initialize() {
        if (navinfo.common.BrowserStore.hasItem('userInfo')) {
            const userInfo = navinfo.common.BrowserStore.getItem('userInfo');
            const user = new User();
            user.fromJson(userInfo);
            this.user = user;
        }
    }

    @action
    setUser(value) {
        this.user = value;
    }

    saveUserInfo() {
        navinfo.common.BrowserStore.setItem('userInfo', this.user.toJson());
    }

    clearUserInfo() {
        navinfo.common.BrowserStore.removeItem('userInfo');
    }
}

const userStore = new UserStore();
export default userStore;
