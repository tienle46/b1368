import app from 'app';
import BaseScene from 'BaseScene';
import RubUtils from 'RubUtils';
import NodeRub from 'NodeRub';
import ArrayUtils from 'ArrayUtils';

export default class DashboardScene extends BaseScene {
    constructor() {
        super();
        this.gameList = [];

        this.properties = {
            ...this.properties,
            pageView: cc.PageView,
            viewContainer: cc.Node,
            item: cc.Prefab,
            dailyDialog: cc.Node,
            dailyDialogContent: cc.Label
        };
    }

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this._getGamesListFromServer();
    }

    showDailyLoginPopup(message) {
        this.dailyDialogContent.string = message;

        let action = cc.sequence(cc.fadeIn(0.2), cc.delayTime(20), cc.fadeOut(0.5));
        this.dailyDialog.runAction(action);
    }

    onCloseDailyLoginPopup() {
        this.dailyDialog.runAction(cc.fadeOut(0.2));
    }

    onShareBtnClick() {
        window.FB.ui({
            method: 'share_open_graph',
            action_type: 'og.likes',
            action_properties: JSON.stringify({
                object: '....',
            })
        }, function(response) {
            console.log('response', response);
        });
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_LIST_GAME_CODE, this._onUserListGame, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_LIST_GAME_CODE, this._onUserListGame, this);
    }

    _getGamesListFromServer() {
        let data = {};
        data[app.keywords.PARTNER_ID] = 1;
        let sendObject = {
            'cmd': app.commands.USER_LIST_GAME_CODE,
            data
        };

        this.showLoading();
        app.service.send(sendObject);
    }

    _onUserListGame(data) {
        this.gameList = this._filterClientSupportedGames(data[app.keywords.SERVICE_CHILD_CODE_ARRAY]);
        this._initItemListGame();
    }

    _filterClientSupportedGames(gameCodes) {
        return ArrayUtils.isEmpty(gameCodes) ? [] : gameCodes.filter(gc => {
            return gc == app.const.gameCode.PHOM ||
                gc == app.const.gameCode.TLMNDL ||
                gc == app.const.gameCode.XAM ||
                gc == app.const.gameCode.BA_CAY ||
                gc == app.const.gameCode.XOC_DIA
        });
    }

    _initItemListGame() {
        const height = this.viewContainer.height || 200;
        const itemDimension = Math.floor(height / 2.0 - 37);

        let pageNodeOptions = {
            name: 'pageNode',
            size: cc.size(998, 455),
            // position: cc.v2(500, 0),
            layout: {
                type: cc.Layout.Type.GRID,
                resizeMode: cc.Layout.ResizeMode.CHILDREN,
                startAxis: cc.Layout.AxisDirection.HORIZONTAL,
                cellSize: cc.size(180, 180),
                padding: 0,
                spacingX: 85,
                spacingY: 55,
                verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM,
                horizontalDirection: cc.Layout.HorizontalDirection.LEFT_TO_RIGHT
            }
        };

        var node = null;
        let count = 0;
        app.async.mapSeries(this.gameList, (gc, cb) => {
            if (count > 8 && !indicator) {
                var indicator = this.pageView.indicator.node;
                indicator && indicator.opacity < 255 && (indicator.opacity = 255);
            }
            if (count % 8 === 0) {
                node = NodeRub.createNodeByOptions(pageNodeOptions);
                this.pageView.addPage(node);
            }
            let gameIconPath = app.res.gameIcon[gc];

            gameIconPath && RubUtils.getSpriteFrameFromAtlas('blueTheme/atlas/game_icons', gameIconPath, (sprite) => {
                if (sprite) {
                    const nodeItem = new cc.instantiate(this.item);
                    nodeItem.getComponent(cc.Sprite).spriteFrame = sprite;
                    nodeItem.setContentSize(itemDimension, itemDimension);
                    let itemComponent = nodeItem.getComponent('item');

                    itemComponent.gameCode = gc;
                    itemComponent.listenOnClickListener((gameCode) => {
                        log(`click Item ${gameCode}`);

                        this.changeScene(app.const.scene.LIST_TABLE_SCENE, () => {
                            // set game context
                            app.context.setSelectedGame(gc);
                        }, true);
                    });

                    node && node.addChild(nodeItem);

                    count++;
                }
                if (count == this.gameList.length)
                    this.hideLoading();

                cb(); // next ->
            });
        });
    }
}

app.createComponent(DashboardScene);