/**
 * add ability for pausing setInterval / setTimeout
 * Usage: 
 * // create interval call every 5s
 * var timer = new TimerRub(() => {
 *   alert("Done!");
 * }, 5000);
 * 
 * or:
 * setTimeout(() => {
 *      // after 2s pause the timer
 *      timer.pause(); 
 *      setTimeout(() => {
 *          // after 5s, resume the timer
 *          timer.resume();
 *      }, 5000); 
 * }, 2000); 
 */
export default class TimerRub {
    constructor(cb, interval) {
        this.cb = cb;
        this.interval = interval;

        this.timerId = null;
        this.startTime = null;
        this.remaining = 0;

        this.state = TimerRub.STATE_IDLE; // 0 = idle, 1 = running, 2 = paused, 3 = resume

        this._init();
    }

    _init() {
        this.startTime = new Date().getTime();
        (!this.timerId) && (this.timerId = setInterval(this.cb, this.interval));
        this.state = TimerRub.STATE_RUNNING;
    }

    pause() {
        if (this.state != TimerRub.STATE_RUNNING) return;

        let remain = this.interval - (new Date().getTime() - this.startTime);

        this.remaining = remain > 0 ? remain : 100;

        this.clear(this.timerId);
        this.state = TimerRub.STATE_PAUSED;
    }
    
    isPaused() {
        return this.state == TimerRub.STATE_PAUSED;
    }

    resume() {
        if (!this.isPaused()) return;

        this.state = TimerRub.STATE_RESUME;
        timeout && clearTimeout(timeout);
        var timeout = null;
        timeout = setTimeout(this.timeoutCallback.bind(this), this.remaining);
    }

    timeoutCallback() {
        if (this.state != TimerRub.STATE_RESUME) return;
        // this.cb();

        this.startTime = new Date().getTime();
        this.timerId && this.clear(this.timerId);
        this.timerId = null;
        (!this.timerId) && (this.timerId = setInterval(this.cb, this.interval));
        this.remaining = 0;
        this.state = TimerRub.STATE_RUNNING;
    }

    clear() {
        clearInterval(this.timerId);
    }
}
TimerRub.STATE_IDLE = 0;
TimerRub.STATE_RUNNING = 1;
TimerRub.STATE_PAUSED = 2;
TimerRub.STATE_RESUME = 3;