import app from 'app';
import BaseScene from 'BaseScene';
import RubUtils from 'RubUtils';
import ArrayUtils from "../../utils/ArrayUtils";

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

        app.service.send(sendObject, (data) => {
            log(data);
            this.gameList = this._filterClientSupportedGames(data["cl"]);
            this._initItemListGame();
        }, app.const.scene.DASHBOARD_SCENE);


        //    handle bottom Bar event

        this._addBottomBar();
        this._addTopBar();
    }

    _filterClientSupportedGames(gameCodes) {
        return ArrayUtils.isEmpty(gameCodes) ? [] : gameCodes.filter(gc => {
            return gc == app.const.gameCode.PHOM || gc == app.const.gameCode.TLMNDL
        })
    }

    _initItemListGame() {

        const height = this.scrollerContentView.node.height;
        const itemDimension = Math.floor(height / 2.0 - 37);

        this.gameList.some(gc => {

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