var game = require('game');
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
    },

    // use this for initialization
    onLoad: function () {
        var sendObject = {
            "cmd" : "gv",
            "data" : {
                "pid" : 1
            },
        }
        console.log('request list game');
        game.service.send(sendObject, (data) => {
            console.log(data);
        },game.const.scene.DASHBOARD_SCENE);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
