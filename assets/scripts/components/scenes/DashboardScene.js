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
            }
        ,game.const.scene.DASHBOARD_SCENE);

    },


    _initItemListGame:function () {

        var height = this.scrollerContentView.node.height;
        var itemDimension = height / 2.0 - 80;

        for (var i = 0; i <  this.gameList.length ; i++) {


            // nodeItem.getComponent(item).addOnClickListener((gameCode) => {
            //         console.log('click Item' + gameCode);
            // });
            var itemPrefab = this.item;
            var container = this.scrollerContentView;
            cc.loader.loadRes(game.resource.gameIcon[this.gameList[i]], cc.SpriteFrame, function (err, spriteFrame) {

                var nodeItem = new cc.instantiate(itemPrefab);
                nodeItem.setContentSize(itemDimension,itemDimension);
                container.node.addChild(nodeItem);

                var sprite = nodeItem.getComponent(cc.Sprite);

                sprite.spriteFrame = spriteFrame ;
            });
        }

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
