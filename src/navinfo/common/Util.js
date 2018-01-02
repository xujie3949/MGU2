import _lang from 'lodash/lang';
import _array from 'lodash/array';
import _object from 'lodash/object';
import _function from 'lodash/function';
import _number from 'lodash/number';
import _string from 'lodash/string';
import _util from 'lodash/util';
import uuid from 'uuid/v4';

/**
 * 帮助类
 */
class Util {
    static isNaN(value) {
        return _lang.isNaN(value);
    }

    static isNull(value) {
        return _lang.isNull(value);
    }

    static isUndefined(value) {
        return _lang.isUndefined(value);
    }

    static isNil(value) {
        return _lang.isNil(value);
    }

    static isNumber(value) {
        return _lang.isNumber(value);
    }

    static isInteger(value) {
        return _lang.isInteger(value);
    }

    static isString(value) {
        return _lang.isString(value);
    }

    static isBoolean(value) {
        return _lang.isBoolean(value);
    }

    static isFunction(value) {
        return _lang.isFunction(value);
    }

    static isArray(value) {
        return _lang.isArray(value);
    }

    static isObject(value) {
        return _lang.isObject(value);
    }

    static isMap(value) {
        return _lang.isMap(value);
    }

    static isSet(value) {
        return _lang.isSet(value);
    }

    static isEmpty(value) {
        return _lang.isEmpty(value);
    }

    static isEqual(value, other) {
        return _lang.isEqual(value, other);
    }

    static isEqualWith(value, other, func) {
        return _lang.isEqualWith(value, other);
    }

    static clone(value) {
        return _lang.clone(value);
    }

    static cloneDeep(value) {
        return _lang.cloneDeep(value);
    }

    /* 以下为数组相关方法 */
    static first(array) {
        return _array.first(array);
    }

    static last(array) {
        return _array.last(array);
    }

    static concat(array, other) {
        return _array.concat(array, other);
    }

    static remove(array, func) {
        return _array.remove(array, func);
    }

    static reverse(array) {
        return _array.reverse(array);
    }

    static uniq(array) {
        return _array.uniq(array);
    }

    static uniqBy(array, func) {
        return _array.uniqBy(array, func);
    }

    static uniqWith(array, func) {
        return _array.uniqWith(array, func);
    }

    static union(array, other) {
        return _array.union(array, other);
    }

    static unionBy(array, other, func) {
        return _array.unionBy(array, other, func);
    }

    static unionWith(array, other, func) {
        return _array.unionWith(array, other, func);
    }

    static difference(array, other) {
        return _array.difference(array, other);
    }

    static differenceBy(array, other, identity) {
        return _array.differenceBy(array, other, identity);
    }

    static differenceWith(array, other, comparator) {
        return _array.differenceWith(array, other, comparator);
    }

    static intersection(array, other) {
        return _array.intersection(array, other);
    }

    static intersectionBy(array, other, identity) {
        return _array.intersectionBy(array, other, identity);
    }

    static intersectionWith(array, other, comparator) {
        return _array.intersectionWith(array, other, comparator);
    }

    /* 以下为对象相关方法 */

    static assign(object, source) {
        return _object.assign(object, source);
    }

    static assignWith(object, source, func) {
        return _object.assignWith(object, source, func);
    }

    static merge(object, source) {
        return _object.merge(object, source);
    }

    static mergeWith(object, source, func) {
        return _object.mergeWith(object, source, func);
    }

    static get(object, path) {
        return _object.get(object, path);
    }

    static set(object, path, value) {
        return _object.set(object, path, value);
    }

    static findKey(object, func) {
        return _object.findKey(object, func);
    }

    static findLastKey(object, func) {
        return _object.findLastKey(object, func);
    }

    static forOwn(object, func) {
        return _object.forOwn(object, func);
    }

    static forIn(object, func) {
        return _object.forIn(object, func);
    }

    static keys(object) {
        return _object.keys(object);
    }

    static keysIn(object) {
        return _object.keysIn(object);
    }

    static values(object) {
        return _object.values(object);
    }

    static valuesIn(object) {
        return _object.valuesIn(object);
    }

    static has(object, path) {
        return _object.has(object, path);
    }

    static hasIn(object, path) {
        return _object.hasIn(object, path);
    }

    static mapKeys(object, func) {
        return _object.mapKeys(object, func);
    }

    static mapValues(object, func) {
        return _object.mapValues(object, func);
    }

    static unset(object, path) {
        return _object.unset(object, path);
    }

    /* 以下为其他方法 */

    static delay(func, wait, args) {
        return _function.delay(func, wait, args);
    }

    static bind(func, context) {
        return _function.bind(func, context);
    }

    static bindAll(object, methodName) {
        return _util.bindAll(object, methodName);
    }

    static random(start, end) {
        return _number.random(start, end, false);
    }

    static escape(str) {
        return _string.escape(str);
    }

    static unescape(str) {
        return _string.unescape(str);
    }

    static truncate(str, length, omission = '...') {
        return _string.truncate(str, {
            length: length,
            omission: omission,
        });
    }

    static uniqueId(prefix = '') {
        return _util.uniqueId(prefix);
    }

    static uuid() {
        return uuid();
    }
}

export default Util;

