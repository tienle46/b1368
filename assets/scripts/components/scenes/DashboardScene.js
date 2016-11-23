import app from 'app';
import BaseScene from 'BaseScene';
import RubUtils from 'RubUtils';

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
        const itemDimension = height / 2.0 - 70;

        this.gameList.some(gc => {
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

                    // set game context
                    app.context.setSelectedGame(gc);

                    this.changeScene(app.const.scene.LIST_TABLE_SCENE);
                });

                this.scrollerContentView.node.addChild(nodeItem);

            });

            // if(gameIconPath) return true;
        });

    }

    // Listen Bottom Bar Event (Click button In Bottom Bar)

    _addBottomBar() {
        RubUtils.loadRes('bottombar/bottombar').then((prefab) => {
            let bottomBarNode = cc.instantiate(prefab);

            this.node.addChild(bottomBarNode);
        });
    }

    _addTopBar() {
        RubUtils.loadRes('dashboard/Topbar').then((prefab) => {
            let topbarNode = cc.instantiate(prefab);

            this.node.addChild(topbarNode);
        });

    }
}

app.createComponent(DashboardScene);