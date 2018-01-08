
export default class CustomEaseBackInOut extends cc.ActionEase {

    update(dt) {
        var overshoot = 0.5;
        dt = dt * 2;
        if (dt < 1) {
            this._inner.update((dt * dt * ((overshoot + 1) * dt - overshoot)) / 2);
        } else {
            dt = dt - 2;
            this._inner.update((dt * dt * ((overshoot + 1) * dt + overshoot)) / 2 + 1);
        }
    }

    clone() {
        var action = new CustomEaseBackInOut();
        action.initWithAction(this._inner.clone());
        return action;
    }

    reverse() {
        return new CustomEaseBackInOut(this._inner.reverse());
    }
}

CustomEaseBackInOut.create = function (action) {
    return new CustomEaseBackInOut(action);
};

cc._customEaseBackInOutObj = {
    easing: function (time1) {
        var overshoot = 0.5;
        time1 = time1 * 2;
        if (time1 < 1) {
            return (time1 * time1 * ((overshoot + 1) * time1 - overshoot)) / 2;
        } else {
            time1 = time1 - 2;
            return (time1 * time1 * ((overshoot + 1) * time1 + overshoot)) / 2 + 1;
        }
    },

    reverse: function () {
        return cc._customEaseBackInOutObj;
    }
};

cc.customEaseBackInOut = function () {
    return cc._customEaseBackInOutObj;
};