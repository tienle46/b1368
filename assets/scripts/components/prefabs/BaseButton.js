var game = require("game");


game.bottomBarButtonType = {
    NAPXU:0,
    TOPRANK:1,
    NOTIFI:2,
    EXCHANGEAWARD:3,
    HOTLINE:4,
    MESSAGE:5,
    USERINFO:6
},



cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        buttonType: game.bottomBarButtonType.NAPXU,
        pressedScale: 1,
        transDuration: 0
    },

    // use this for initialization
    onLoad: function () {


        this._addAnimationWhenTouch();

    },

    // add animation ưhen touch
    _addAnimationWhenTouch: function() {
        var self = this;
        self.initScale = this.node.scale;
        self.button = self.getComponent(cc.Button);
        self.scaleDownAction = cc.scaleTo(self.transDuration, self.pressedScale);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale);
        function onTouchDown (event) {
            this.stopAllActions();
            this.runAction(self.scaleDownAction);
        }
        function onTouchUp (event) {
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
