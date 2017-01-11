/**
 * Replace functions for setTimeout & setInterval 
 * that will be throtting by browser while browser is inactivation
 */

/**
 * Request Interval
 * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
export function requestInterval(fn, delay) {
    let requestAnimFrame = (function() {
            return window.requestAnimationFrame || function(callback, element) {
                setTimeout(callback, 1000 / 60);
            };
        })(),
        start = new Date().getTime(),
        handle = {};

    function loop() {
        handle.value = requestAnimFrame(loop);
        let current = new Date().getTime(),
            delta = current - start;
        if (delta >= delay) {
            fn.call();
            start = new Date().getTime();
        }
    }
    handle.value = requestAnimFrame(loop);
    return handle;
}

/**
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
export function clearRequestInterval(handle) {
    if (handle) {
        if (window.cancelAnimationFrame) {
            cancelAnimationFrame(handle.value);
            handle.value = null;
        } else {
            clearInterval(handle);
            handle = null;
        }
    }
}

/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
export function requestTimeout(fn, delay) {
    let requestAnimFrame = (function() {
            return window.requestAnimationFrame || function(callback, element) {
                setTimeout(function() {
                    callback();
                    // console.log("set timeout with setTimeout");
                }, 1000 / 60);
            };
        })(),
        start = new Date().getTime(),
        handle = {};

    function loop() {
        let current = new Date().getTime(),
            delta = current - start;
        if (delta >= delay) {
            fn.call();
        } else {
            handle.value = requestAnimFrame(loop);
        }
    }

    handle.value = requestAnimFrame(loop);

    return handle;
}

/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
export function clearRequestTimeout(handle) {
    if (handle) {
        if (window.cancelAnimationFrame) {
            cancelAnimationFrame(handle.value);
        } else {
            clearTimeout(handle);
            handle = null;
        }
    }
}