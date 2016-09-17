var game = require('game');
var item = require('item');
var BaseScene = require('BaseScene');

export default class DashboardScene extends BaseScene {
    constructor() {
        super();
        this.gameList = [];


        this.scrollerContentView = {
            default: null,
            type: cc.Layout
        };

        this.item = {
            default: null,
            type: cc.Prefab
        };

        this.bottomBar = {
            default: null,
            type: cc.Prefab
        };

        this.topBar = {
            default: null,
            type: cc.Prefab
        };

        this.popUp = {
            default: null,
            type: cc.Prefab
        }
    }

    onLoad() {
        var sendObject = {
            'cmd': 'gv',
            'data': {
                'pid': 1
            }
        };
        console.log('request list game');
        game.service.send(sendObject, (data) => {
            console.log(data);


            this.gameList = data["cl"];
            console.log(this.gameList);

            this._initItemListGame();
        }, game.const.scene.DASHBOARD_SCENE);


        //    handle bottom Bar event

        this._addBottomBar();
        this._addTopBar();
    }

    _initItemListGame() {

        const height = this.scrollerContentView.node.height;
        const itemDimension = height / 2.0 - 50;

        this.gameList.forEach(gc => {
            "use strict";
            cc.loader.loadRes(game.resource.gameIcon[gc], cc.SpriteFrame, (err, spriteFrame) => {

                const nodeItem = new cc.instantiate(this.item);
                nodeItem.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                nodeItem.setContentSize(itemDimension, itemDimension);

                let itemComponent = nodeItem.getComponent('item');

                itemComponent.gameCode = gc;
                itemComponent.listenOnClickListener((gameCode) => {
                    console.log(`click Item ${gameCode}`);

                    this.changeScene('ListTableScene');
                });

                this.scrollerContentView.node.addChild(nodeItem);


            });
        });

    }

    // Listen Bottom Bar Event (Click button In Bottom Bar)

    _addBottomBar() {
        const bottomBarNode = new cc.instantiate(this.bottomBar);

        bottomBarNode.getComponent('BottomBar').listenClickTopBarItem((buttonType) => {
            console.log("dashboard:" + buttonType);
            switch (buttonType) {
                case game.bottomBarButtonType.NAPXU:
                    this.addNapXuPopUp();
                    break;
                default:
                    this.addPopup();
                    break;
            }
        });
        this.node.addChild(bottomBarNode);
    }

    _addTopBar() {
        const topBarNode = new cc.instantiate(this.topBar);

        // topBarNode.getComponent('TopBar').listenClickTopBarItem( (buttonType) => {
        //     console.log("dashboard:" + buttonType);
        //     this.addPopup();
        // });
        this.node.addChild(topBarNode);
    }

    addNapXuPopUp() {
        var popupBase = new cc.instantiate(this.popUp);
        popupBase.position = cc.p(0, 0);
        console.debug(popupBase, popupBase.getChildByName('popup_bkg'));
        this.node.addChild(popupBase, 10);
    }
}

game.createComponent(DashboardScene);