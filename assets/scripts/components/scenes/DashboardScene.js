var game = require('game');
var item = require('item');
var BaseScene = require('BaseScene');
cc.Class({
    extends: BaseScene,


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
        },

        popUp: {
            default:null,
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
        this.addTopBar();


    },



    _initItemListGame:function () {

        const height = this.scrollerContentView.node.height;
        const itemDimension = height / 2.0 - 60;

        this.gameList.forEach(gc=>{
            "use strict";
            cc.loader.loadRes(game.resource.gameIcon[gc], cc.SpriteFrame, (err, spriteFrame) => {

                const nodeItem = new cc.instantiate(this.item);
                nodeItem.setContentSize(itemDimension,itemDimension);

                let itemComponent = nodeItem.getComponent('item');

                itemComponent.gameCode = gc;
                itemComponent.listenOnClickListener((gameCode) => {
                    console.log(`click Item ${gameCode}`);

                    cc.director.loadScene('ListTableScene');
                });

                this.scrollerContentView.node.addChild(nodeItem);

                nodeItem.getComponent(cc.Sprite).spriteFrame = spriteFrame ;

            });
        });

    },

    // Listen Bottom Bar Event (Click button In Bottom Bar)
    
    addBottomBar:function () {

        const bottomBarNode = new cc.instantiate(this.bottomBar);

        bottomBarNode.getComponent('BottomBar').listenClickTopBarItem( (buttonType) => {
            console.log("dashboard:" + buttonType);
            this.addPopup();
        });

        this.node.addChild(bottomBarNode);
    },

    addTopBar: function () {
        const topBarNode = new cc.instantiate(this.topBar);

        // topBarNode.getComponent('TopBar').listenClickTopBarItem( (buttonType) => {
        //     console.log("dashboard:" + buttonType);
        //     this.addPopup();
        // });

        this.node.addChild(topBarNode);
    },
    
    addPopup: function () {
        var popupBase = new cc.instantiate(this.popUp);
        popupBase.position = cc.p(0,0);
        // let _item = require("BasePopup");
        // popupBase.getComponent(_item)

        this.node.addChild(popupBase);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    //
    // },
});
