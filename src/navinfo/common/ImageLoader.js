import ResourceFactory from './ResourceFactory';

/**
 * 渲染要素的图片资源加载类.
 */
export default class ImageLoader {
    /**
     * 根据加载要素的图片地址资源，初始化图片资源加载类.
     * @param {Array} urls - 加载的要素的图片地址资源
     */
    constructor(urls) {
        this.urls = urls;
        /**
         * 图片资源管理器实例对象 {@link ResourceFactory}
         * @type {Object}
         */
        this.resourceFactory = ResourceFactory.getInstance();
    }

    /**
     * 用Promise对象实现的 Ajax 加载要素图片资源方法.
     * @param success
     * @param error
     * @returns {object} promise
     */
    load(success, error) {
        const promise = new Promise((resolve, reject) => {
            if (this.urls.length === 0) {
                resolve();
                return;
            }

            const promises = this.getPromises();

            if (promises.length === 0) {
                resolve();
                return;
            }

            Promise.all(promises)
                .then(res => {
                    this.addToResourceFactory(res, this.resourceFactory);
                    resolve();
                })
                .catch(e => {
                    reject(e);
                });
        });

        return promise;
    }

    /**
     * 返回多个图片加载的Promise实例.
     * @returns {Array} promises - 返回多个图片加载的Promise实例
     */
    getPromises() {
        const promises = [];
        for (let i = 0; i < this.urls.length; ++i) {
            const url = this.urls[i];
            if (this.resourceFactory.containResource(url)) {
                continue;
            }
            promises.push(this.loadImage(url));
        }
        return promises;
    }

    /**
     * 加载图片.
     * @param {string} url - 图片地址
     */
    loadImage(url) {
        const promise = new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                const res = {
                    url: url,
                    image: image,
                };
                resolve(res);
            };
            image.onerror = () => {
                const res = {
                    url: url,
                    image: null,
                };
                resolve(res);
            };
            image.src = url;
        });

        return promise;
    }

    /**
     * 将加载的图片资源存储到图片资源管理器中.
     * @param {object} resources
     * @param {string} resources.url - 图片资源的url地址
     * @param {object} resources.image - 图片资源的image对象
     * @param {object} factory - 图片资源管理器(ResourceFactory)单例对象的引用
     */
    addToResourceFactory(resources, factory) {
        for (let i = 0; i < resources.length; ++i) {
            const resource = resources[i];
            const key = resource.url;
            const value = resource.image;
            if (!key || !value) {
                return;
            }

            factory.add(key, value);
        }
    }
}
