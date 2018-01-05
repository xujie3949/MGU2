import forge from 'node-forge';
import Logger from './Logger';

class Encryptor {
    key = '';
    iv = '';
    algorithm = 'AES-CBC';

    constructor(key, iv, algorithm) {
        this.algorithm = algorithm || this.algorithm;
        // key和iv的长度必须为16,24,32
        this.key = key || 'Navinfo123456789';
        this.iv = iv || 'Navinfo123456789';
        this.logger = Logger.getInstance();
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
        try {
            const cipher = forge.cipher.createCipher(this.algorithm, this.key);
            cipher.start({ iv: this.iv });
            cipher.update(forge.util.createBuffer(value));
            cipher.finish();
            const encrypted = cipher.output;
            return encrypted.toHex();
        } catch (err) {
            this.logger(`加密失败:${err}`);
            return null;
        }
    }

    decrypt(value) {
        try {
            const decipher = forge.cipher.createDecipher(this.algorithm, this.key);
            decipher.start({ iv: this.iv });
            const buffer = this.createBufferFromHex(value);
            decipher.update(buffer);
            decipher.finish();
            const decrypted = decipher.output;
            return decrypted.toString();
        } catch (err) {
            this.logger(`解密失败:${err}`);
            return null;
        }
    }

    /**
     * 加密器.
     */
    destroy() {
        Encryptor.instance = null;
    }

    static instance = null;

    /**
     * 获取加密器单例的静态方法
     * @example
     * const encryptor = Encryptor.getInstance();
     * @returns {Object} 返回Encryptor单例对象
     */
    static getInstance() {
        if (!Encryptor.instance) {
            Encryptor.instance =
                new Encryptor();
        }
        return Encryptor.instance;
    }
}

export default Encryptor;

