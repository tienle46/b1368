/**
 * Created by Thanh on 9/13/2016.
 */

export default class Emitter {

    constructor() {
        this._callbacks = {};
    }

    __logEmitter() {
        let count = Object.keys(this._callbacks).reduce((total, cbArr) => total + cbArr.length, 0);

        console.warn('Emitter callback counts: ', count, this._callbacks);
    }

    __logEmitterByEvent(event) {

        let callbacks = this._callbacks[`$${event}`];

        console.warn('Emitter ', event, " :", callbacks.length, callbacks);
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */
    addListener(event, fn, context, priority) {

        if (fn) {
            let fnName = fn.name;
            if (fnName.startsWith('bound ')) {
                let strs = fnName.split(' ');
                strs.length > 1 && (fnName = strs[1]);
            }

            if (context) {
                fn = fn.bind(context);
                fn.__context = context;
            }

            fn.__fnName = fnName;

            if (typeof priority == 'number' && priority >= 0) {
                (this._callbacks[`$${event}`] = this._callbacks['$' + event] || []).splice(priority, 0, fn);
            } else {
                (this._callbacks[`$${event}`] = this._callbacks['$' + event] || []).push(fn);
            }
            window.free(event, fn, context);
        }

        return this;
    }

    _checkContext(cb, context) {
        return cb && (!context || (cb.__context === context || (cb.fn && cb.fn.__context === context)));
    }

    _isSameInstance(cb, fn2) {
        if (cb.__fnName) {
            return typeof fn2 == 'function' && cb.__fnName === fn2.name.split(' ').pop();
        }
        return typeof cb == 'function' && typeof fn2 == 'function' && cb.name.split(' ').pop() === fn2.name.split(' ').pop();
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

    removeListener(event, fn, context) {
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
        if (event && !fn) {
            if (!context) {
                delete this._callbacks[`$${event}`];
            } else {
                for (let i = 0; i < callbacks.length; i++) {
                    this._checkContext(callbacks[i], context) && callbacks.splice(i--, 1);
                }
            }

            return this;
        }

        for (let i = 0; i < callbacks.length; i++) {
            let cb = callbacks[i];
            if (this._checkContext(cb, context) && this._isSameInstance(cb, fn)) {
                callbacks.splice(i--, 1);
            }
        }
        window.free(event, fn, context, callbacks);
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

    on(event, fn, context, priority) {
        this.addListener(event, fn, context, priority);
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

    off(event, fn, context) {
        this.removeListener(event, fn, context);
    }


    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */
    emit(event, ...args) {

        let callbacks = this._callbacks[`$${event}`];
        callbacks && callbacks.forEach(cb => {
            cb(...args);
        });

        return this;
    }

    listeners(event) {
        return this._callbacks[`$${event}`] || [];
    }

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    hasListeners(event) {
        return !!this.listeners(event).length;
    }

}