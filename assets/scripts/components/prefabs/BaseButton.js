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
        transDuration: 0.1
    },

    onLoad: function() {
        this.initScale = this.node.scale;
        this.button = this.getComponent(cc.Button);
        this.scaleDownAction = cc.scaleTo(this.transDuration, this.pressedScale);
        this.scaleUpAction = cc.scaleTo(this.transDuration, this.initScale);

        var self = this;
        function onTouchDown(event) {
            this.stopAllActions();
            this.runAction(self.scaleDownAction);
        }

        function onTouchUp(event) {
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }

        function onTouchUp(event) {
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }

        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }
});