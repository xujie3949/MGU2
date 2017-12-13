import forge from 'node-forge';

class Encryptor {
  key = '';
  iv = '';
  algorithm = 'AES-CBC';

  constructor(key, iv, algorithm) {
    this.algorithm = algorithm || this.algorithm;
    this.key = key || 'Navinfo123456789';
    this.iv = iv || 'Navinfo123456789';
  }

  setKey(key) {
    this.key = key;
  }

  getKey(key) {
    return this.key;
  }

  setIV(iv) {
    this.iv = iv;
  }

  getIV(iv) {
    return this.iv;
  }

  setAlgorithm(algorithm) {
    this.algorithm = algorithm;
  }

  getAlgorithm(algorithm) {
    return this.algorithm;
  }

  createBufferFromHex(value) {
    const length = value.length / 2;
    const charCode = [];
    for (let i = 0; i < length; ++i) {
      const subStr = value.substr(i * 2, 2);
      charCode.push(parseInt(subStr, 16));
    }
    const str = String.fromCharCode(...charCode);
    const buffer = forge.util.createBuffer(str);
    return buffer;
  }

  encrypt(value) {
    const cipher = forge.cipher.createCipher(this.algorithm, this.key);
    cipher.start({ iv: this.iv });
    cipher.update(forge.util.createBuffer(value));
    cipher.finish();
    const encrypted = cipher.output;
    return encrypted.toHex();
  }

  decrypt(value) {
    const decipher = forge.cipher.createDecipher(this.algorithm, this.key);
    decipher.start({ iv: this.iv });
    const buffer = this.createBufferFromHex(value);
    decipher.update(buffer);
    decipher.finish();
    const decrypted = decipher.output;
    return decrypted.toString();
  }
}

const encryptor = new Encryptor();

export default encryptor;

