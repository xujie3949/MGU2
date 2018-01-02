import Logger from '../common/Logger';

/**
 * 创建ajax对象,可以通过options参数定制ajax对象
 * url:请求的url地址,必须
 * header:请求的头,键值对构成的json对象,默认值null
 * responseType:指定响应的类型,会影响最终放回的结果,默认值''
 * timeout:请求超时,默认值0
 * requestParameter:请求参数,会被拼接到url后面
 * parameter: 附加参数,会被传递给onSuccess或onFail,默认值null
 * debug:如果为true,输出调试信息,默认值false
 * onSuccess:请求成功回调函数,需要参数接受请求的结果,默认值null
 * onFail:请求失败回调函数,默认值null
 * onAbort:请求终止回调函数,默认值null
 * onError:请求失败回调函数,默认值null
 * onTimeout:请求失败回调函数,默认值null
 * @param {Object} options - 不能为null或undefined
 * @returns {XMLHttpRequest} xhr - 返回XMLHttpRequest对象
 */
function get(options) {
    if (!options) {
        throw new Error('参数options无效!');
    }
    let url = options.url;
    if (!url) {
        throw new Error('缺少url属性!');
    }

    const logger = Logger.getInstance();
    const headers = options.headers || null;
    const responseType = options.responseType || '';
    const timeout = options.timeout || 0;
    const requestParameter = options.requestParameter || null;
    if (requestParameter) {
        url = `${url}&parameter=${encodeURIComponent(JSON.stringify(requestParameter))}`;
    }

    const parameter = options.parameter || null;
    const debug = options.debug || false;

    const onSuccess = options.onSuccess || null;
    const onFail = options.onFail || null;
    const onAbort = options.onAbort || null;
    const onError = options.onError || null;
    const onTimeout = options.onTimeout || null;

    const xhr = new XMLHttpRequest();
    if (!xhr) {
        throw new Error('创建XMLHttpRequest对象失败!');
    }

    let startTime = null;
    let endTime = null;

    xhr.onloadstart = function (event) {
        if (debug) {
            startTime = new Date().getTime();
            logger.log(`开始请求:${url}    时间:${startTime}`);
            logger.log(`附加参数:${JSON.stringify(parameter)}`);
            logger.log(event);
        }
    };
    xhr.onabort = function (event) {
        endTime = new Date().getTime();
        const diff = endTime - startTime;
        const errmsg = `请求终止:${url}    时间:${startTime}    耗时:${diff}`;

        if (debug) {
            logger.log(errmsg);
            logger.log(`附加参数:${JSON.stringify(parameter)}`);
            logger.log(event);
        }

        if (onAbort) {
            onAbort(errmsg, parameter);
        }
    };
    xhr.onerror = function (event) {
        endTime = new Date().getTime();
        const diff = endTime - startTime;
        const errmsg = `网络错误:${url}    时间:${startTime}    耗时:${diff}`;

        if (debug) {
            logger.log(errmsg);
            logger.log(`附加参数:${JSON.stringify(parameter)}`);
            logger.log(event);
        }

        if (onError) {
            onError(errmsg, parameter);
        }
    };
    xhr.ontimeout = function (event) {
        endTime = new Date().getTime();
        const diff = endTime - startTime;
        const errmsg = `请求超时:${url}    时间:${startTime}    耗时:${diff}`;

        if (debug) {
            logger.log(errmsg);
            logger.log(`附加参数:${JSON.stringify(parameter)}`);
            logger.log(event);
        }

        if (onTimeout) {
            onTimeout(errmsg, parameter);
        }
    };
    xhr.onload = function (event) {
        endTime = new Date().getTime();
        const diff = endTime - startTime;

        // 状态码为2xx或304时都算请求成功
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            if (debug) {
                logger.log(`请求成功:${url}    时间:${startTime}    耗时:${diff}`);
                logger.log(`附加参数:${JSON.stringify(parameter)}`);
                logger.log(xhr.response);
            }
            if (onSuccess) {
                onSuccess(xhr.response, parameter);
            }
        } else {
            const errmsg = `请求失败:${url}    时间:${startTime}    耗时:${diff}    状态:${xhr.status}`;
            if (debug) {
                logger.log(errmsg);
                logger.log(`附加参数:${JSON.stringify(parameter)}`);
                logger.log(event);
            }
            if (onFail) {
                onFail(errmsg, parameter);
            }
        }
    };
    xhr.open('GET', url);
    if (headers) {
        const keys = Object.getOwnPropertyNames(headers);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const value = headers[key];
            xhr.setRequestHeader(key, value);
        }
    }
    xhr.responseType = responseType;
    xhr.timeout = timeout;
    xhr.send();
    return xhr;
}

/**
 * 创建ajax对象,可以通过options参数定制ajax对象
 * url:请求的url地址,必须
 * header:请求的头,键值对构成的json对象,默认值null
 * responseType:指定响应的类型,会影响最终放回的结果,默认值''
 * timeout:请求超时,默认值0
 * requestParameter:请求参数
 * parameter: 附加参数,会被传递给onSuccess或onFail,默认值null
 * debug:如果为true,输出调试信息,默认值false
 * onSuccess:请求成功回调函数,需要参数接受请求的结果,默认值null
 * onFail:请求失败回调函数,默认值null
 * onAbort:请求终止回调函数,默认值null
 * onError:请求失败回调函数,默认值null
 * onTimeout:请求失败回调函数,默认值null
 * @param {Object} options - 不能为null或undefined
 * @returns {XMLHttpRequest} xhr - 返回XMLHttpRequest对象
 */
function post(options) {
    if (!options) {
        throw new Error('参数options无效!');
    }
    const url = options.url;
    if (!url) {
        throw new Error('缺少url属性!');
    }

    const logger = Logger.getInstance();
    const headers = options.headers || null;
    const responseType = options.responseType || '';
    const timeout = options.timeout || 0;
    const requestParameter = options.requestParameter || null;
    if (!requestParameter) {
        throw new Error('缺少requestParameter属性!');
    }
    const parameter = options.parameter || null;
    const debug = options.debug || false;

    const onSuccess = options.onSuccess || null;
    const onFail = options.onFail || null;
    const onAbort = options.onAbort || null;
    const onError = options.onError || null;
    const onTimeout = options.onTimeout || null;

    const xhr = new XMLHttpRequest();
    if (!xhr) {
        throw new Error('创建XMLHttpRequest对象失败!');
    }

    let startTime = null;
    let endTime = null;

    xhr.onloadstart = function (event) {
        if (debug) {
            startTime = new Date().getTime();
            logger.log(`开始请求:${url}    时间:${startTime}`);
            logger.log(`附加参数:${JSON.stringify(parameter)}`);
            logger.log(event);
        }
    };
    xhr.onabort = function (event) {
        endTime = new Date().getTime();
        const diff = endTime - startTime;
        const errmsg = `请求终止:${url}    时间:${startTime}    耗时:${diff}`;

        if (debug) {
            logger.log(errmsg);
            logger.log(`附加参数:${JSON.stringify(parameter)}`);
            logger.log(event);
        }

        if (onAbort) {
            onAbort(errmsg, parameter);
        }
    };
    xhr.onerror = function (event) {
        endTime = new Date().getTime();
        const diff = endTime - startTime;
        const errmsg = `网络错误:${url}    时间:${startTime}    耗时:${diff}`;

        if (debug) {
            logger.log(errmsg);
            logger.log(`附加参数:${JSON.stringify(parameter)}`);
            logger.log(event);
        }

        if (onError) {
            onError(errmsg, parameter);
        }
    };
    xhr.ontimeout = function (event) {
        endTime = new Date().getTime();
        const diff = endTime - startTime;
        const errmsg = `请求超时:${url}    时间:${startTime}    耗时:${diff}`;

        if (debug) {
            logger.log(errmsg);
            logger.log(`附加参数:${JSON.stringify(parameter)}`);
            logger.log(event);
        }

        if (onTimeout) {
            onTimeout(errmsg, parameter);
        }
    };
    xhr.onload = function (event) {
        endTime = new Date().getTime();
        const diff = endTime - startTime;

        // 状态码为2xx或304时都算请求成功
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            if (debug) {
                logger.log(`请求成功:${url}    时间:${startTime}    耗时:${diff}`);
                logger.log(`附加参数:${JSON.stringify(parameter)}`);
                logger.log(xhr.response);
            }
            if (onSuccess) {
                onSuccess(xhr.response, parameter);
            }
        } else {
            const errmsg = `请求失败:${url}    时间:${startTime}    耗时:${diff}    状态:${xhr.status}`;
            if (debug) {
                logger.log(errmsg);
                logger.log(`附加参数:${JSON.stringify(parameter)}`);
                logger.log(xhr);
            }
            if (onFail) {
                onFail(errmsg, parameter);
            }
        }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if (headers) {
        const keys = Object.getOwnPropertyNames(headers);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const value = headers[key];
            xhr.setRequestHeader(key, value);
        }
    }
    xhr.responseType = responseType;
    xhr.timeout = timeout;
    const data = encodeURIComponent(JSON.stringify(requestParameter));
    xhr.send(`parameter=${data}`);
    return xhr;
}

export default {
    get,
    post,
};
