import app from 'app'
import BaseScene from 'BaseScene'
import RubUtils from 'RubUtils'
import NodeRub from 'NodeRub'
import ArrayUtils from 'ArrayUtils'

export default class DashboardScene extends BaseScene {
    constructor() {
        super();

        this.properties = this.assignProperties({
            pageView: cc.PageView,
            viewContainer: cc.Node,
            item: cc.Prefab,
            dailyDialog: cc.Node,
            dailyDialogContent: cc.Label,
            dailyDialogTitle: cc.Label
        });
        
        this.iconComponents = {};
        this._isNewBie = false;
        this._jarAdded = false;
    }

    onLoad() {
        super.onLoad();
        this._isNewBie = false;
        this._jarAdded = false;
    }
    
    testClick() {
        // let data = {
        //     su: true,
        //     unverifiedPurchases: [],
        //     consumedProducts:[],
        //     purchasedProducts: [{
        //         msg: "Bạn đã nạp thành công 20000 Chip vào tài khoản djoker",
        //         su: true,
        //         productId: 'com.1368inc.phatloc.20kc',
        //         token: 'gadnjhbjlohdnijahkfebdej.AO-J1Oyf126egFrlky3FRZ_Li0VG4lxKFHb-yPeQx3lI6LIAsU0gGxqh_KvGgLogOTtcq3gbXKL825aysiEHKe0IZAe1JbZRp5A0y4CAi25Rw1ttJuXouqnjKD-k4BGXwTcW9t8u4ndRtm16o8dM1tqE6hM5eDVYgg'
        //     }]
        // }
       
        // let contextItem = { id: data.purchasedProducts[0].productId, receipt: data.purchasedProducts[0].token, username: app.context.getMyInfo().name || "" };
        // app.iap.addPurchase(contextItem)
        // app.service.send({cmd: "testBilling", data});
        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
        }
        let random = getRandomIntInclusive(1, 3);
        
        app.service.send({
            cmd: app.commands.HIGH_LIGHT_MESSAGE,
            data: {
                msg: 'Lorem ipsum dolor sit amet ' + random,
                rc: random
            }
        });
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
        !app.context.enableMinbets && this._getListGameMinBet();
        
        app.context.gameList.length < 1 && this._getGamesListFromServer();
        
        if(!app.context.ctl) {
            this._requestCtl();
            app.buddyManager.sendInitBuddy();
        }
        
        /**
         * set requestRandomInvite = true to make sure player only receive random invite on first time join game group
         */
        app.context.requestRandomInvite = true;
        
        app.context.gameList.length > 0 && this._initItemListGame();
        
        setTimeout(() => {
            let Linking = require('Linking');
            Linking.handlePendingActions();
            if(app.context.newVersionInfo){
                let message = app.res.string("message_update_version", {version: app.context.newVersionInfo.newVersion})
                app.system.confirm(message, () => {
                    app.context.newVersionInfo = null;
                }, () => {
                    cc.sys.openURL(app.context.newVersionInfo.newVersionLink);
                    app.context.newVersionInfo = null;
                })
            }
        }, 600);

        app.system.showLackOfMoneyMessagePopup();
    }

    showDailyLoginPopup(message, isNewBie = false, title) {
        this._isNewBie = isNewBie;
        this.dailyDialog.active = true;
        this.dailyDialogContent.string = message;
        this.dailyDialogTitle.string = isNewBie ? app.res.string('greeting_newbiew') : app.res.string('daily_gift');
        title && (this.dailyDialogTitle.string = title);
        
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
        app.system.addListener(app.commands.GET_LIST_GAME_MINBET, this._onListGameMinBetResponse, this);
        app.system.addListener(app.commands.USER_LIST_GAME_CODE, this._onUserListGame, this);
        app.system.addListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_LIST_GAME_MINBET, this._onListGameMinBetResponse, this);
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
    
    _getListGameMinBet() {
        app.service.send({
            cmd: app.commands.GET_LIST_GAME_MINBET,
        });
    }
    
    _onListGameMinBetResponse(data) {
        app.context.enableMinbets = data;
    }
    
    _onUserListGame(data) {
        let gameList = this._filterClientSupportedGames(data[app.keywords.SERVICE_CHILD_CODE_ARRAY]);
        let removedGames = app.context.gameList.length == 0 ? [] : ArrayUtils.removeAll([...gameList], app.context.gameList);
        
        if (removedGames.length < gameList.length) {
            app.context.gameList = gameList;
            this._initItemListGame();
        }
        removedGames = [];
    }

    _filterClientSupportedGames(gameCodes) {
        return ArrayUtils.isEmpty(gameCodes) ? [] : gameCodes.filter(gc => app.config.supportedGames.indexOf(gc) >= 0);
    }
    
    _requestListHu() {
        app.jarManager.requestUpdateJarList();   
    }

    _initItemListGame() {
        const height = this.viewContainer.height || 200;
        const itemDimension = Math.floor(height / 2.0 - 37);

        var node = null;
        let count = 0;
        
        let gameItems = [];
        app.async.mapSeries(app.context.gameList, (gc, cb) => {
            if (count > 7 && !this.pageView.indicator.node.opacity) {
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
                    
                    let itemComponent = nodeItem.getComponent('item');

                    itemComponent.gameCode = gc;
                    itemComponent.listenOnClickListener((gameCode) => {
                        app.context.setSelectedGame(gameCode);
                        this.changeScene(app.const.scene.LIST_TABLE_SCENE);
                    });
                                
                    gameItems.push(nodeItem);
                    // node && node.addChild(nodeItem);
                    count++;
                }
                if (count > 0 && (count % 8 === 0 || count == app.context.gameList.length)){
                    gameItems.forEach(nodeItem => node && node.addChild(nodeItem));
                    gameItems = [];
                    if(count == app.context.gameList.length) {
                        this._requestListHu();
                        this.hideLoading();
                    }
                }

                cb(); // next ->
            });
        });
    }
}

app.createComponent(DashboardScene);