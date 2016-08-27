var game = require('game');

var item = require('item');
cc.Class({
    extends: cc.Component,


    properties: {
        gameList:[],
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


        this.gameList = data["cl"];

            console.log(this.gameList);



            this._initItemListGame();
        },game.const.scene.DASHBOARD_SCENE);

    },


    _initItemListGame:function () {

        let height = this.scrollerContentView.node.height;
        let itemDimension = height / 2.0 - 80;

        for (var i = 0; i <  this.gameList.length ; i++) {


            let nodeItem = new cc.instantiate(this.item);
            // console.log(nodeItem);
           let sprite = nodeItem.getComponent(cc.Sprite);
            nodeItem.setContentSize(itemDimension,itemDimension);

            this.scrollerContentView.node.addChild(nodeItem);
            nodeItem.getComponent(item).addOnClickListener((gameCode) => {
                    console.log("click Item");
            });

            cc.loader.loadRes(game.resource.gameIcon[this.gameList[i]], cc.SpriteFrame, function (err, spriteFrame) {
                var sprite = nodeItem.getComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame ;
            });
        }

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
