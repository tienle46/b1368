import app from 'app';
import BaseScene from 'BaseScene';
import TopupDialogRub from 'TopupDialogRub';
import ExchangeDialogRub from 'ExchangeDialogRub';

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
    }

    onLoad() {
        var sendObject = {
            'cmd': 'gv',
            'data': {
                'pid': 1
            }
        };
        log('request list game');
        app.service.send(sendObject, (data) => {
            log(data);


            this.gameList = data["cl"];
            log(this.gameList);

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
                    log(`click Item ${gameCode}`);

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
            switch (buttonType) {
                case app.bottomBarButtonType.NAPXU:
                    this.addNapXuPopUp();
                    break;
                case app.bottomBarButtonType.EXCHANGEAWARD:
                    this.addExchangePopUp();
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
        //     log("dashboard:" + buttonType);
        //     this.addPopup();
        // });
        this.node.addChild(topBarNode);
    }

    addNapXuPopUp() {
        // var popupBase = new cc.instantiate(this.popUps);
        // popupBase.position = cc.p(0, 0);
        // this.node.addChild(popupBase, 10);

        let tabs = [{
            title: 'Thẻ cào',
            value: 'tab_card'
        }, {
            title: 'SMS',
            value: 'tab_sms'
        }, {
            title: 'IAP',
            value: 'tab_iap'
        }, {
            title: 'kiot',
            value: 'tab_kiot'
        }];

        let options = {
            itemHeight: 26.5
        };

        let tabOptions = { tabs, options };
        TopupDialogRub.show(this.node, tabOptions);
    }

    addExchangePopUp() {
        let tabs = [{
            title: 'Thẻ cào',
            value: 'tab_exchange_card'
        }, {
            title: 'Vật phẩm',
            value: 'tab_exchange_item'
        }, {
            title: 'Lịch sử',
            value: 'tab_exchange_history'
        }];

        let options = {
            itemHeight: 26.5,
            tabBodyPrefabType: 'exchange'
        };

        let tabOptions = { tabs, options };
        ExchangeDialogRub.show(this.node, tabOptions);
    }
}

app.createComponent(DashboardScene);