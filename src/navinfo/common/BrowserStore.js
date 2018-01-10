import Encryptor from './Encryptor';

class BrowserStore {
    static hasItem(key) {
        const value = localStorage.getItem(key);
        return value !== null;
    }

    static getItem(key) {
        const value = localStorage.getItem(key);
        if (!value) {
            return null;
        }

        const encryptor = Encryptor.getInstance();
        const res = encryptor.decrypt(value);
        if (!res) {
            return null;
        }

        return JSON.parse(res);
    }

    static setItem(key, value) {
        const encryptor = Encryptor.getInstance();
        const res = encryptor.encrypt(JSON.stringify(value));
        if (!res) {
            return;
        }

        localStorage.setItem(key, res);
    }

    static removeItem(key) {
        localStorage.removeItem(key);
    }

    static clear() {
        localStorage.clear();
    }
}

export default BrowserStore;
