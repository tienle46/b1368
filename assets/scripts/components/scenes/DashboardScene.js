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

        scrollerContentView: {
            default:null,
            type:cc.Layout
        },

        item: {
            default: null,
            type:cc.Prefab
        },

        _gameList: []

    },

    // use this for initialization
    onLoad: function () {
        var sendObject = {
            'cmd' : 'gv',
            'data' : {
                'pid' : 1
            }
        };
        console.log('request list game');
        game.service.send(sendObject, (data) => {
            console.log(data);

            this._gameList = data['cl'];
            console.log(this._gameList);
            this._initItemListGame();
        },game.const.scene.DASHBOARD_SCENE);

    },
    
    
    _initItemListGame:function () {

        var height = this.scrollerContentView.node.height;
        var itemDimension = height / 2.0 - 80;

        for (var i = 0; i <  14 ; i++) {
            const node = new cc.instantiate(this.item);
            node.setContentSize(itemDimension,itemDimension);
            this.scrollerContentView.node.addChild(node);
        }

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
