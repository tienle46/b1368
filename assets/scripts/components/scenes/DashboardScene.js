import app from 'app';
import BaseScene from 'BaseScene';
import RubUtils from 'RubUtils';
import Utils from 'Utils';
import NodeRub from 'NodeRub';
import ArrayUtils from 'ArrayUtils';

export default class DashboardScene extends BaseScene {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            pageView: cc.PageView,
            viewContainer: cc.Node,
            item: cc.Prefab,
            dailyDialog: cc.Node,
            dailyDialogContent: cc.Label,
            dailyDialogTitle: cc.Label
        };
        
        this.iconComponents = {};
        this._isNewBie = false;
    }

    onLoad() {
        super.onLoad();
        this._isNewBie = false;
    }

    onEnable() {
        super.onEnable();
    }

    onDestroy() {
        super.onDestroy();
        this.free(this.iconComponents);
        this._isNewBie = false;
    }

    start() {
        super.start();
        this._requestListHu();
        
        this._getGamesListFromServer();
        !app.context.ctl && this._requestCtl();
        
        /**
         * set requestRandomInvite = true to make sure player only receive random invite on first time join game group
         */
        app.context.requestRandomInvite = true;
        
        app.context.gameList.length > 0 && this._initItemListGame();
        
        setTimeout(() => {
            let Linking = require('Linking');
            log(`setTimeout`);
            Linking.handlePendingActions();
        }, 1000);

        app.system.showLackOfMoneyMessagePopup();
    }

    showDailyLoginPopup(message, isNewBie = false) {
        this._isNewBie = isNewBie;
        this.dailyDialog.active = true;
        this.dailyDialogContent.string = message;
        this.dailyDialogTitle.string = isNewBie ? app.res.string('greeting_newbiew') : app.res.string('daily_gift');
        
        let action = cc.sequence(cc.fadeIn(0.2), cc.delayTime(20), cc.fadeOut(0.5), cc.callFunc(()=> {
            this.dailyDialog.active = false;
        }));
        this.dailyDialog.runAction(action);
    }

    onCloseDailyLoginPopup() {
        this.dailyDialog.runAction(cc.fadeOut(0.2), cc.callFunc(()=> {
            this.dailyDialog.active = false;
        }));
    }

    onShareBtnClick() {
        app.facebookActions.share(app.config.getShareObject(this._isNewBie ? 'newbie': 'daily'));
    }
    
    onInviteBtnClick() {
        // window.FB.ui({method: 'apprequests',
        //     message: 'XXXXXXX'
        // }, function(response){
        //     console.warn(response);
        // });  
        
        app.visibilityManager.goTo('TOPUP')
    }
    
    _requestCtl() {
        app.service.send({
            'cmd': app.commands.USER_GET_CHARGE_LIST,
        });
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_LIST_GAME_CODE, this._onUserListGame, this);
        app.system.addListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_LIST_GAME_CODE, this._onUserListGame, this);
        app.system.removeListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
    }
    
    _onUserGetChargeList(data) {
        app.context.setCtlData(data);  
    }
    
    _getGamesListFromServer() {
        if (app.context.gameList.length == 0) {
            this.showLoading('Đang tải dữ liệu ....');
        }
        app.service.send({
            cmd: app.commands.USER_LIST_GAME_CODE,
            data: {
                [app.keywords.PARTNER_ID]: 1
            }
        });
    }

    _onUserListGame(data) {
        let gameList = this._filterClientSupportedGames(data[app.keywords.SERVICE_CHILD_CODE_ARRAY]);
        gameList.push('taixiu');
        let removedGames = app.context.gameList.length == 0 ? [] : ArrayUtils.removeAll([...gameList], app.context.gameList);

        if (removedGames.length < gameList.length) {
            app.context.gameList = gameList;
            this._initItemListGame();
        }
        removedGames = [];
        app.buddyManager.sendInitBuddy();
    }

    _filterClientSupportedGames(gameCodes) {
        return ArrayUtils.isEmpty(gameCodes) ? [] : gameCodes.filter(gc => app.config.supportedGames.indexOf(gc) >= 0);
    }
    
    _requestListHu() {
        app.service.send({
            cmd: app.commands.LIST_HU
        });    
    }

    _initItemListGame() {
        const height = this.viewContainer.height || 200;
        const itemDimension = Math.floor(height / 2.0 - 37);

        var node = null;
        let count = 0;
        
        // app.context.gameList.forEach((gc, index) => {
        //     if(index > 8 && !indicator) {
        //         var indicator = this.pageView.indicator.node;
        //         indicator && indicator.opacity < 255 && (indicator.opacity = 255);
        //     }
            
        //     if (index % 8 === 0) {
        //         let pageNodeOptions = {
        //             name: 'pageNode',
        //             size: cc.size(998, 455),
        //             // position: cc.v2(500, 0),
        //             layout: {
        //                 type: cc.Layout.Type.GRID,
        //                 resizeMode: cc.Layout.ResizeMode.CHILDREN,
        //                 startAxis: cc.Layout.AxisDirection.HORIZONTAL,
        //                 cellSize: cc.size(180, 180),
        //                 padding: 0,
        //                 spacingX: 85,
        //                 spacingY: 55,
        //                 verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM,
        //                 horizontalDirection: cc.Layout.HorizontalDirection.LEFT_TO_RIGHT
        //             }
        //         };
        //         node = NodeRub.createNodeByOptions(pageNodeOptions);
        //         this.pageView.addPage(node);
        //     }
        //     let gameIconPath = app.res.gameIcon[gc];
            
        //     gameIconPath && RubUtils.getSpriteFrameFromAtlas('blueTheme/atlas/game_icons', gameIconPath, (sprite) => {
        //         if (sprite) {
        //             const nodeItem = cc.instantiate(this.item);
        //             nodeItem.getComponent(cc.Sprite).spriteFrame = sprite;
        //             nodeItem.setContentSize(itemDimension, itemDimension);
        //             let itemComponent = nodeItem.getComponent('item');
                    
        //             itemComponent.gameCode = gc;
        //             itemComponent.listenOnClickListener((gameCode) => {
        //                 app.context.setSelectedGame(gameCode);
        //                 this.changeScene(app.const.scene.LIST_TABLE_SCENE);
        //             });
                    
        //             // // this.iconComponents[gc] = itemComponent;
        //             if(app.jarManager.hasJar(gc)) {
        //                 app.jarManager.addJarToParent(itemComponent.getJarAnchor(), gc);
        //             }

        //             node && node.addChild(item)
        //         }
        //         if (index == app.context.gameList.length - 1) {
        //             // this._requestListHu();
        //             this.hideLoading();
        //         }
        //     });
        // });
        
        let gameItems = [];
        app.async.mapSeries(app.context.gameList, (gc, cb) => {
            if (count > 8 && !indicator) {
                var indicator = this.pageView.indicator.node;
                indicator && indicator.opacity < 255 && (indicator.opacity = 255);
            }
            if (count % 8 === 0) {
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
                node = NodeRub.createNodeByOptions(pageNodeOptions);
                this.pageView.addPage(node);
            }
            let gameIconPath = app.res.gameIcon[gc];

            gameIconPath && RubUtils.getSpriteFrameFromAtlas('blueTheme/atlas/game_icons', gameIconPath, (sprite) => {
                if (sprite) {
                    const nodeItem = cc.instantiate(this.item);
                    nodeItem.getComponent(cc.Sprite).spriteFrame = sprite;
                    nodeItem.setContentSize(itemDimension, itemDimension);
                    gc === 'taixiu' && (nodeItem.opacity = 200);
                    
                    let itemComponent = nodeItem.getComponent('item');

                    itemComponent.gameCode = gc;
                    itemComponent.listenOnClickListener((gameCode) => {
                        if(gc === 'taixiu'){
                            app.system.showToast('Game đang cập nhật...');
                            return;
                        }
                        app.context.setSelectedGame(gameCode);
                        this.changeScene(app.const.scene.LIST_TABLE_SCENE);
                    });
                    
                    if(app.jarManager.hasJar(gc)) {
                        app.jarManager.addJarToParent(itemComponent.getJarAnchor(), gc);
                    }
                    
                    gameItems.push(nodeItem);
                    // node && node.addChild(nodeItem);

                    count++;
                }
                if (count == app.context.gameList.length){
                    gameItems.forEach(nodeItem => node && node.addChild(nodeItem));
                    gameItems.length = 0;
                    this.hideLoading();
                }

                cb(); // next ->
            });
        });
    }
}

app.createComponent(DashboardScene);