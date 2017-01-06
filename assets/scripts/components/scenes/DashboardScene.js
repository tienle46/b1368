import app from 'app';
import BaseScene from 'BaseScene';
import RubUtils from 'RubUtils';
import NodeRub from 'NodeRub';
import ArrayUtils from "../../utils/ArrayUtils";

export default class DashboardScene extends BaseScene {
    constructor() {
        super();
        this.gameList = [];

        this.pageView = {
            default: null,
            type: cc.PageView
        };

        this.viewContainer = {
            default: null,
            type: cc.Node
        };

        this.item = {
            default: null,
            type: cc.Prefab
        };
    }

    onLoad() {
        super.onLoad();

        let sendObject = {
            'cmd': 'gv',
            'data': {
                'pid': 1
            }
        };

        app.service.send(sendObject, (data) => {
            this.gameList = this._filterClientSupportedGames(data["cl"]);
            this._initItemListGame();
        }, app.const.scene.DASHBOARD_SCENE);
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
                // this.viewContainer.addChild(node);
                this.pageView.addPage(node);
            }
            let gameIconPath = app.res.gameIcon[gc];
            gameIconPath && RubUtils.getSpriteFrameFromAtlas('blueTheme/atlas/game_icons/game_icons', gameIconPath, (sprite) => {
                if (sprite) {
                    const nodeItem = new cc.instantiate(this.item);
                    nodeItem.getComponent(cc.Sprite).spriteFrame = sprite;
                    nodeItem.setContentSize(itemDimension, itemDimension);
                    let itemComponent = nodeItem.getComponent('item');

                    itemComponent.gameCode = gc;
                    itemComponent.listenOnClickListener((gameCode) => {
                        log(`click Item ${gameCode}`);

                        // set game context
                        app.context.setSelectedGame(gc);

                        this.changeScene(app.const.scene.LIST_TABLE_SCENE);
                    });

                    node && node.addChild(nodeItem);

                    count++;
                }
                cb(); // next ->
            });
        });
    }
}

app.createComponent(DashboardScene);