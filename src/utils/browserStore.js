import encryptor from 'Src/utils/encryptor';

class BrowserStore {
  static hasItem(key) {
    const value = localStorage.getItem(key);
    return value !== null;
  }

  static getItem(key) {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(encryptor.decrypt(value));
    }
    return null;
  }

  static setItem(key, value) {
    localStorage.setItem(key, encryptor.encrypt(JSON.stringify(value)));
  }

  static removeItem(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}

export default BrowserStore;

