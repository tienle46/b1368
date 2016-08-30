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

        gameCode: "",
        gameID: 0,
        _clickListener: null

    },

    // use this for initialization
    onLoad: function () {

        // var listenerTouch = {
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     onTouchBegan: function(touch, event) {
        //         this.handleClickItem();
        //         return true;
        //     }.bind(this)
        // };

        // var listenerClick = {
        //     event: cc.EventListener.KEYBOARD,
        //     onKeyPressed: function(keyCode, event) {
        //         this.handleClickItem();
        //         return true;
        //     }.bind(this)
        // };

        // cc.eventManager.addListener(listenerTouch,this.node);
        // cc.eventManager.addListener(listenerClick,this.node);

    },

    listenOnClickListener:function (cb) {
        this._clickListener = cb;
    },

    handleClickItem:function () {
        this._clickListener && this._clickListener(this.gameCode);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
