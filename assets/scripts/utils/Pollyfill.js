export default (app) => {
    let reduce = Function.bind.call(Function.call, Array.prototype.reduce);
    let isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
    let concat = Function.bind.call(Function.call, Array.prototype.concat);
    let keys = Object.getOwnPropertyNames || Reflect.ownKeys;
    // Object.values
    if (!Object.values) {
        Object.values = function values(O) {
            return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
        };
    }

    // Object.entries
    if (!Object.entries) {
        Object.entries = function entries(O) {
            return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [
                [k, O[k]]
            ] : []), []);
        };
    }

    // deep merge for Object.assign 
    // Object.assign = app._.merge;
    if (typeof Object.assign != 'function') {
        Object.assign = function(target, varArgs) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }
};