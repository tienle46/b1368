/**
 * Cache all request data as key - value
 * Its data need to be refreshed if has any change between currently data and new one.
 */
import app from 'app';

export default class Marker {

    constructor() {
        this.caches = {};
    }

    addItem(keyObject, data, renderer = null) {
        let k = this._validKey(keyObject),
            __isNew = true,
            __isUpdated = undefined,
            __renderer = renderer;

        if (this._isCached(keyObject)) {
            __isNew = false;
            __isUpdated = this.isUpdatedData(keyObject, data);
        }

        this.caches[k] = {
            data,
            __isNew,
            __isUpdated,
            __renderer
        };
    }

    addItemRenderer(keyObject, renderer) {
        let item = this.getItem(keyObject);
        item && (item.__renderer = renderer);
    }

    getItemRenderer(keyObject) {
        let item = this.getItem(keyObject);
        return item && item.__renderer;
    }

    getItem(keyObject) {
        let k = this._validKey(keyObject);
        return this.caches[k];
    }

    getItemData(keyObject) {
        let item = this.getItem(keyObject);
        return item && item.data;
    }

    isUpdatedData(keyObject, newData) {
        let oldData = this.getItemData(keyObject);
        return app._.isEqual(oldData, newData);
    }

    _validKey(key) {
        return (key instanceof Object) ? JSON.stringify(key) : key.toString();
    }

    _isCached(keyObject) {
        let k = this._validKey(keyObject);
        return this.caches.hasOwnProperty(k);
    }
}