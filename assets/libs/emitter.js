/**
 * Created by Thanh on 9/13/2016.
 */


export default class Emitter {
    constructor() {
        this._callbacks = {}

    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */
    addListener(event, fn, context = this) {
        if(fn) fn.context = context;
        (this._callbacks[`$${event}`] = this._callbacks['$' + event] || []).push(fn);
        return this;
    }

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    removeListener(event, fn) {
        this._callbacks = this._callbacks || {};

        // all
        if (!event && !fn) {
            this._callbacks = {};
            return this;
        }

        // specific event
        let callbacks = this._callbacks[`$${event}`];
        if (!callbacks) return this;

        // remove all handlers
        if (event) {
            delete this._callbacks[`$${event}`];
            return this;
        }

        for (var i = 0; i < callbacks.length; i++) {
            let cb = callbacks[i];
            if (cb === fn || cb.fn === fn) {
                callbacks.splice(i, 1);
                break;
            }
        }

        return this;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    on(event, fn, context = this) {
        this.addListener(event, fn, context)
    }

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    off(event, fn){
        this.removeListener(event, fn)
    }


    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */
    emit (event, ...args) {

        let callbacks = this._callbacks[`$${event}`];
        callbacks && callbacks.forEach(cb => {
                cb.call(cb.context, ...args);
        });

        return this;
    }

    listeners (event) {
        return this._callbacks[`$${event}`] || [];
    }

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    hasListeners (event) {
        return !!this.listeners(event).length;
    }

}