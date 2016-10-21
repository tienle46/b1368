
import app from 'app';

const bottomBarButtonType = {
    DEFAULT: 0,
    NAPXU: 0,
    TOPRANK: 1,
    NOTIFI: 2,
    EXCHANGEAWARD: 3,
    HOTLINE: 4,
    MESSAGE: 5,
    USERINFO: 6
};
app.bottomBarButtonType = bottomBarButtonType;

cc.Class({
    extends: cc.Component,

    properties: {
        buttonType: app.bottomBarButtonType.NAPXU,
        pressedScale: 0.8,
        transDuration: 0.1,
        isTouching: false
    },

    onLoad: function() {
        this.initScale = this.node.scale;
        this.button = this.getComponent(cc.Button);
        this.scaleDownAction = cc.scaleTo(this.transDuration, this.pressedScale);
        this.scaleUpAction = cc.sequence(cc.scaleTo(this.transDuration, this.initScale), cc.callFunc(() => this.isTouching = false));
        this.resetScaleAction = cc.sequence(cc.scaleTo(0, this.initScale), cc.callFunc(() => this.isTouching = false));

        var self = this;
        function onTouchDown(event) {
            this.stopAllActions();
            this.runAction(self.scaleDownAction);
            this.isTouching = true;
        }

        function onTouchUp(event) {
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }

        function onTouchCancel(event) {
            this.stopAllActions();
            this.runAction(self.resetScaleAction);
            this.isTouching = false;
        }

        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }
});