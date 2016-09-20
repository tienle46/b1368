var app = require('app');
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

        this.popUps = {
            default: null,
            type: cc.Prefab
        };
    }

    onLoad() {
        var sendObject = {
            'cmd': 'gv',
            'data': {
                'pid': 1
            }
        };
        console.log('request list game');
        app.service.send(sendObject, (data) => {
            console.log(data);


            this.gameList = data["cl"];
            console.log(this.gameList);

            this._initItemListGame();
        }, app.const.scene.DASHBOARD_SCENE);


        //    handle bottom Bar event

        this._addBottomBar();
        this._addTopBar();
    }

    _initItemListGame() {

        const height = this.scrollerContentView.node.height;
        const itemDimension = height / 2.0 - 50;

        this.gameList.forEach(gc => {
            "use strict";
            let gameIconPath = app.res.gameIcon[gc];

            gameIconPath && cc.loader.loadRes(gameIconPath, cc.SpriteFrame, (err, spriteFrame) => {

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
                case app.bottomBarButtonType.NAPXU:
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
        var popupBase = new cc.instantiate(this.popUps);
        popupBase.position = cc.p(0, 0);
        this.node.addChild(popupBase, 10);
    }
}

app.createComponent(DashboardScene);