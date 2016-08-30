var game = require('game');
var item = require('item');

cc.Class({
    extends: cc.Component,


    properties: {
        gameList:[],


        scrollerContentView: {
            default:null,
            type:cc.Layout
        },

        item: {
            default: null,
            type:cc.Prefab
        },

        bottomBar: {
            default: null,
            type:cc.Prefab
        },

        topBar: {
            default: null,
            type:cc.Prefab
        }


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


    //    handle bottom Bar event

        this.addBottomBar();

    },




    _initItemListGame:function () {

        var height = this.scrollerContentView.node.height;
        var itemDimension = height / 2.0 - 80;

        for (var i = 0; i <  this.gameList.length ; i++) {



            var itemPrefab = this.item;
            var container = this.scrollerContentView;
            cc.loader.loadRes(game.resource.gameIcon[this.gameList[i]], cc.SpriteFrame, function (err, spriteFrame) {

                var nodeItem = new cc.instantiate(itemPrefab);
                nodeItem.setContentSize(itemDimension,itemDimension);
                nodeItem.getComponent(item).listenOnClickListener((gameCode) => {
                    console.log('click Item' + gameCode);
                });
                container.node.addChild(nodeItem);

                var sprite = nodeItem.getComponent(cc.Sprite);

                sprite.spriteFrame = spriteFrame ;
            });
        }

    },

    // Listen Bottom Bar Event (Click button In Bottom Bar)
    
    addBottomBar:function () {

        var bottomBarNode = new  cc.instantiate(this.bottomBar);

        let _item = require("BottomBar");
        bottomBarNode.getComponent(_item).listenClickTopBarItem( (buttonType) => {
            console.log("dashboard:" + buttonType);
        });

        this.node.addChild(bottomBarNode);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    //
    // },
});
