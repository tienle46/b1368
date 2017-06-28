import app from 'app';
import BaseScene from 'BaseScene';
import SFS2X from 'SFS2X';
import ScrollMessagePopup from 'ScrollMessagePopup';
import BuddyPopup from 'BuddyPopup';
import CCUtils from 'CCUtils';
import Utils from 'Utils';
import TopupDialogRub from 'TopupDialogRub';
import Linking from 'Linking';

export default class ListTableScene extends BaseScene {
    constructor() {
        super();

        this.properties = this.assignProperties({
            contentInScroll: cc.Node,
            tableListCell: cc.Prefab,
            invitePopupPrefab: cc.Prefab,
            gameTitleLbl: cc.Label,
            userMoneyLbl: cc.Label,
            jarAnchorNode: cc.Node,
            scrollView: cc.ScrollView,
            arrowNode: cc.Node,
            filter1stLabel: cc.Label,
            filter2ndLabel: cc.Label,
            filter3rdLabel: cc.Label,
            radio1: cc.Toggle,
            radio2: cc.Toggle,
            radio3: cc.Toggle,
            loadingNode: cc.Node,
            progressComponentNode: cc.Node
        });
        
        this.fakers = null; // room fakers
        
        this.time = 2500 * 10; // creating new request for updating tables every 25s
        // filter button conditional 
        this.filterCond = null;
        // invitation popup showed
        this.invitationShowed = false;
        // timeout setTimeout
        this.timeout = null;
        this.gameCode = null;
        this.enableMinbets = null;
        this._isInitedRoomList = false;
        this.__isCreatingRoom = false;
        this.minBalanceMultiple = 0;
        this._room = null;
        this._sentInviteRandomly = false;
    }

    onLoad() {
        super.onLoad();
        this._sentInviteRandomly = false;
        this.filterCond = app.config.listTableGroupFilters[0];
        this.progressComponent = this.progressComponentNode.getComponent('Progress');
        
        this.fakers = []; // room fakers
        this.enableMinbets = [];
        this.userMoneyLbl.string = `${Utils.numberFormat(app.context.getMeBalance() || 0)}`;
        [this.filter1stLabel, this.filter2ndLabel, this.filter3rdLabel].forEach((label, index) => {
            label.string = app.config.listTableGroupFilters[index].text;
        });
    }

    onEnable() {
        super.onEnable();
        this.gameCode = app.context.getSelectedGame();
        this.gameTitleLbl.string = this.gameCode ? app.const.gameLabels[this.gameCode] : "";
    }

    start() {
        super.start();
        this[`radio1`].checkMark.node.active = false;
        
        // this._getFirstGameLobbyFromServer();
        (!app.context.enableMinbets || !app.context.enableMinbets[this.gameCode]) ? this._getListGameMinBet() : (this.enableMinbets = app.context.enableMinbets[this.gameCode].sort((a, b) => a - b));
        
        if(this.enableMinbets.length > 0) {
            this._createRoomFakers();
            
            // let minMoney =  app.context.getMeBalance()/this.minBalanceMultiple;
            // let index = app.config.listTableGroupFilters.findIndex((o) => (minMoney >= o.min && minMoney <= o.max));
            
            // if(index === -1 && minMoney >= app._.maxBy(app.config.listTableGroupFilters, (o) => o.max).max) {
            //     this._activeFilterByIndex(app.config.listTableGroupFilters.length - 1, false);
            // } else if(~index) {
            //     this._activeFilterByIndex(index, false);
            // }
        }
        
        if(app.jarManager.hasJar(this.gameCode)) {
            let hasButton = true;
            app.jarManager.addJarToParent(this.jarAnchorNode, this.gameCode, hasButton);
        }

        app.system.showLackOfMoneyMessagePopup()
    }

    onDestroy() {
        super.onDestroy();
        this.enableMinbets = []
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GET_LIST_GAME_MINBET, this._onListGameMinBetResponse, this);
        app.system.addListener(app.commands.USER_LIST_GROUP, this._onUserListGroup, this);
        app.system.addListener(app.commands.USER_LIST_ROOM, this._onUserListRoom, this);
        app.system.addListener(app.commands.USER_CREATE_ROOM, this._onUserCreateRoom, this);
        app.system.addListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
        app.system.addListener(SFS2X.SFSEvent.ROOM_JOIN, this._handleRoomJoinEvent, this);
        app.service.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError, this);
        app.system.marker.getItemData(app.system.marker.SHOW_INVITATION_POPUP_OPTION) && app.system.addListener(app.commands.PLAYER_INVITE, this._onPlayerInviteEvent, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_LIST_GAME_MINBET, this._onListGameMinBetResponse, this);
        app.system.removeListener(app.commands.USER_LIST_GROUP, this._onUserListGroup, this);
        app.system.removeListener(app.commands.USER_LIST_ROOM, this._onUserListRoom, this);
        app.system.removeListener(app.commands.USER_CREATE_ROOM, this._onUserCreateRoom, this);
        app.system.removeListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
        app.system.removeListener(SFS2X.SFSEvent.ROOM_JOIN, this._handleRoomJoinEvent, this);
        app.service.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError, this);
        app.system.removeListener(app.commands.PLAYER_INVITE, this._onPlayerInviteEvent, this);
    }
    
    onClickNapXuAction() {
        app.visibilityManager.goTo(Linking.ACTION_TOPUP);
    }

    onClickChatBtn() {
        new BuddyPopup().show(this.node.parent, { focusTabIndex: BuddyPopup.TAB_CHAT_INDEX });
    }

    onClickBackBtn() {
        app.system.loadScene(app.const.scene.DASHBOARD_SCENE);
    }
    
    onRefreshBtnClick() {
        this.__isCreatingRoom = false;
        this._sendRequestUserListRoom(this._room);
    }
    
    _onListHu() {
        if(app.jarManager.hasJar(this.gameCode)) {
            let hasButton = true;
            app.jarManager.addJarToParent(this.jarAnchorNode, this.gameCode, hasButton);
        }
    }
    
    _getListGameMinBet() {
        let gameCode = app.context.getSelectedGame();
        this.gameCode && app.service.send({
            cmd: app.commands.GET_LIST_GAME_MINBET,
            data: {
                [app.keywords.GAME_CODE]: gameCode
            }
        });
    }

    onClickQuickJoinBtn() {
        let sendObject = {
            cmd: app.commands.USER_QUICK_JOIN_ROOM,
            data: {
                [app.keywords.GAME_CODE]: this.gameCode,
                [app.keywords.IS_SPECTATOR]: false,
                [app.keywords.QUICK_JOIN_BET]: 1,
            }
        };

        this.showLoading();
        app.service.send(sendObject);
    }

    onUserRequestJoinRoom({ id, minBet, password, isSpectator, roomCapacity } = {}) {
        log('id: ', id, " minbet:", minBet, "Capacity: ", roomCapacity);

        let minBalance = this._calculateMinBalanceToJoinGame(minBet);

        if (minBalance > app.context.getMeBalance()) {
            app.system.confirm(
                app.res.string('error_user_not_enough_gold_to_join_room', { minBalance }),
                null,
                this._onOpenTopUp.bind(this),
            );
        } else {
            if (password) {
                app.system.info(app.res.string('error_system_not_support_join_room_have_password'));
            } else {
                if (id > 0) {
                    this._requestJoinRoom({ id, minBet, password, isSpectator });
                } else {
                    this._createRoom({ minBet, roomCapacity });
                }
            }
        }
    }

    onClickNongDanBtn() {
        this._activeFilterByIndex(0);
    }

    onClickQuyTocBtn() {
        this._activeFilterByIndex(1);
    }

    onClickHoangGiaBtn(e) {
        this._activeFilterByIndex(2);
    }

    onClickGuideBtn() {
        ScrollMessagePopup.show(this.node, {
            cmd: app.commands.RULE_OF_GAME,
            data: {
                [app.keywords.SERVICE_ID]: this.gameCode,
                [app.keywords.CLIENT_VERSION]: 1,
                [app.keywords.ACTION]: 1,
                "testMode": false
            },
            parser: (data) => {
                return data[app.keywords.GAME_RULE] ? data[app.keywords.GAME_RULE] : data[app.keywords.GAME_GUIDE];
            }
        });
    }
    
    showLoading(message = '', timeoutInSeconds = 30, payload = '') {
        if(this.progressComponent) {
            this.progressComponent.show(timeoutInSeconds);
        }
    }   
    
    hideLoading() {
       if(this.progressComponent) {
            this.progressComponent.hide();
        } 
    }
    
    _getFirstGameLobbyFromServer() {
        this.showLoading(app.res.string('loading_data'));
        app.service.send({
            cmd: app.commands.USER_LIST_GROUP,
            data: {
                [app.keywords.SERVICE_ID]: this.gameCode
            }
        });
    }
    
    _calculateMinBalanceToJoinGame(minBet) {
        return minBet * (this.minBalanceMultiple > 0 ? this.minBalanceMultiple : app.config.defaultMinBalanceJoinGameRoomMultiple);
    }
    
    _onUserListGroup(data) {
        if (data && data[app.keywords.GAME_LIST_RESULT] && data[app.keywords.GAME_LIST_RESULT] === this.gameCode) {
            let roomIds = data[app.keywords.GROUP_LIST_GROUP][app.keywords.GROUP_SHORT_NAME];
            let minBalanceMultiples = data[app.keywords.GROUP_LIST_ROLE]["minBalanceMultiples"];

            if (minBalanceMultiples && minBalanceMultiples.length > 0) {
                this.minBalanceMultiple = minBalanceMultiples[0];
            }

            if (roomIds && roomIds.length > 0) {
                this._sendRequestUserJoinLobbyRoom(roomIds[0]);
            }
        }
    }
    
    _onOpenTopUp() {
        app.visibilityManager.goTo(Linking.ACTION_TOPUP);
    }
    
    _onListGameMinBetResponse(data) {
        if (data) {
            this.enableMinbets = data[app.keywords.GAME_ENABLE_MINBET_LIST] || [];
            this.enableMinbets.sort((a, b) => a - b);

            if (this._isInitedRoomList) {
                this._initRoomsListFromData({}, true);
            }
        }
    }
    
    _activeFilterByIndex(index, showActivate = true) {
        if(showActivate && !this[`radio1`].checkMark.node.active) {
            this[`radio1`].checkMark.node.active = true;
        }      
        
        for(let i = 1; i <= 3; i++) 
            this[`radio${i}`] && (this[`radio${i}`].isChecked = false);
        
        this.filterCond = app.config.listTableGroupFilters[index];
        
        this[`radio${index + 1}`] && (this[`radio${index + 1}`].isChecked = showActivate || this._isInitedRoomList);
        
        this.scrollView.stopAutoScroll(); // stop scrolling before rendering list
        
        this._renderList(showActivate);    
    }
    
    _createRoomFakers() {
        this.enableMinbets.forEach(minBet => this.fakers.push(this._createRoomObject(0, 0, minBet, 0, app.const.game.maxPlayers[this.gameCode || 'default'], null)));
            
        this.fakers.forEach(object => {
            let listCell = cc.instantiate(this.tableListCell);
            listCell.zIndex = ListTableScene.TYPE_FAKE_ROOM;
            listCell.active = false;
            let cellComponent = listCell.getComponent('TableListCell');
            let data = { id:0, minBet:object.minBet, password: object.password, isSpectator:false, roomCapacity: object.roomCapacity};
            cellComponent.setOnClickListener(() => this.onUserRequestJoinRoom(data));
            cellComponent && cellComponent.initCell(object);
            this.addNode(listCell);
            this.contentInScroll.addChild(listCell);
        });
    }
    
    _bestSuitableRoom(minBalanceMultiple) {
        let minMoney = app.context.getMeBalance() / this.minBalanceMultiple;
        let rooms = this.contentInScroll.children;
        
        let room = app._.maxBy(rooms.filter(item => {
            let cell = item.getComponent('TableListCell');
            if(cell) {
                let {userCount, roomCapacity, minBet} = cell.getComponentData();
                return userCount >= 1 && userCount < roomCapacity && minBet <= minMoney;
            }
        }), (item) => {
            let cell = item.getComponent('TableListCell');
            if(cell) {
                let {minBet} = cell.getComponentData();
                return minBet;
            }
        });
        
        let index = 0;
        if (room) {
            let cell = room.getComponent('TableListCell');
            let {minBet} = cell.getComponentData();
            index = app.config.listTableGroupFilters.findIndex(cond => minBet >= cond.min && minBet <= cond.max);
        }
        
        this._activeFilterByIndex(index);
    }
    
    _sendRequestUserJoinLobbyRoom(lobbyId) {
        if (!lobbyId) {
            app.system.info(app.res.string('error_undefined_please_try_again'));
        } else {
            app.service.send({
                cmd: app.commands.USER_JOIN_LOBBY_ROOM,
                data: {
                    [app.keywords.GROUP_ID]: `${this.gameCode}${lobbyId}`
                }
            });
        }
    }

    _onPlayerInviteEvent(event) {
        if (!this.invitationShowed && !this.__isCreatingRoom) {
            let joinRoomRequestData = {
                id: event[app.keywords.INVITATION_ROOM_SFSID],
                isSpectator: false,
                minBet: event[app.keywords.QUICK_JOIN_BET]
            };
            this.invitationShowed = true;
            
            // this.invitationShowed && app.system.confirm(
            //     app.res.string('user_got_invitation_to_join_room', { invoker: event.u, minBet: event.b }),
            //     this._onCancelInvitationBtnClick.bind(this),
            //     this._onConfirmInvitationBtnClick.bind(this, joinRoomRequestData)
            // );
            
            let invitePopup = cc.instantiate(this.invitePopupPrefab);
            let invitePopupComponent = invitePopup.getComponent('PlayerInvitePopup');
            invitePopupComponent && invitePopupComponent.init(app.system.getCurrentSceneNode(), {
                    username: event.u,
                    bet: event.b,
                    avatarUrl: event.inviterAvatarUrl || app.config.defaultAvatarUrl.thumb,
                    userCoin: event.inviterBalance,
                    roomCapacity: event.roomCapacity,
                    roomBalance: this._calculateMinBalanceToJoinGame(event.b),
                    inviterVipLevel: event.inviterVipLevel
                },
                this._onConfirmInvitationBtnClick.bind(this, joinRoomRequestData),
                this._onCancelInvitationBtnClick.bind(this)
            );
            
            joinRoomRequestData = null;
        }
    }
    
    _onArrowBtnClick() {
        
    }
    
    _onConfirmInvitationBtnClick(joinRoomRequestData) {
        this.invitationShowed = false;

        this._requestJoinRoom(joinRoomRequestData);
    }

    _onCancelInvitationBtnClick() {
        this.invitationShowed = false;
    }

    _handleRoomJoinEvent(event) {
        this._room = event.room;

        if (this._room) {
            if (this._room.isGame === false && this._room.name && ~this._room.name.indexOf('lobby')) {
                this._sendRequestUserListRoom(this._room);
            }
        } else {
            if (event.errorCode) {
                this.hideLoading();
                app.system.error(app.getRoomErrorMessage(event));
            }
        }
    }

    _sendRequestUserListRoom(room) {
        // if (this.timeout) {
        //     return;
        // }

        app.service.send({
            cmd: app.commands.USER_LIST_ROOM,
            room
        });
        
        // if (!this.timeout) {
        //     this.timeout = requestTimeout(() => {
        //         this._clearInterval();
        //         this._sendRequestUserListRoom(room);
        //     }, this.time);
        // }
    }

    _onUserListRoom(data) {
        this._initRoomsListFromData(data);
        /*Need to check exactly equal true or undefined*/
        if (!this._sentInviteRandomly && (app.context.requestRandomInvite === true || app.context.requestRandomInvite === undefined)) {
            // app.service.send({
            //     cmd: "randomInviteGame",
            //     data: {
            //         [app.keywords.GAME_CODE]: this.gameCode
            //     }
            // })
            this._sentInviteRandomly = true;
            
            setTimeout(() => this.node && app.service.send({
                cmd: "randomInviteGame",
                data: {
                    [app.keywords.GAME_CODE]: this.gameCode
                }
            }), 500);
        }
    }

    _initRoomsListFromData(data = {}, addMore = false) {
        let ids = data[app.keywords.ID] || [];
        let displayIds = data[app.keywords.ROOM_CUSTOM_ID] || [];
        let minBets = data[app.keywords.ROOM_MIN_BET] || [];
        let passwords = data[app.keywords.ROOM_PASSWORD] || [];
        let userCounts = data[app.keywords.ROOM_USER_COUNT] || [];
        let roomCapacities = data[app.keywords.ROOM_USER_MAX] || [];
        
        let playableRooms = [];
        let fullRooms = [];
        for(let i = 0; i < displayIds.length; i++) {
            let object = this._createRoomObject(ids[i], displayIds[i], minBets[i], userCounts[i], roomCapacities[i], passwords[i]);
            (userCounts[i] === roomCapacities[i] ? fullRooms : playableRooms).push(object);
        }
        
        let isEmptyList = !(fullRooms.length > 0 || playableRooms.length > 0)
        
        // room faker
        if(this.fakers.length < 1 || addMore) {
            this._createRoomFakers();
        }
        
        this.contentInScroll.children.forEach(item => item && item.zIndex !== ListTableScene.TYPE_FAKE_ROOM && CCUtils.destroy(item));
        
        if(isEmptyList) {
            let minMoney =  app.context.getMeBalance()/this.minBalanceMultiple;
            let index = app.config.listTableGroupFilters.findIndex((o) => (minMoney >= o.min && minMoney <= o.max));
            
            if(index === -1 && minMoney >= app._.maxBy(app.config.listTableGroupFilters, (o) => o.max).max) {
                this._activeFilterByIndex(app.config.listTableGroupFilters.length - 1);
            } else if(~index) {
                this._activeFilterByIndex(index);
            }
        } else {            
            // re-order children 
            let createRooms = (array, type) => {
                for (let i = 0; i < array.length; i++) {
                    let listCell = cc.instantiate(this.tableListCell);
                    listCell.active = false;
                    listCell.zIndex = type;
                    let cellComponent = listCell.getComponent('TableListCell');
                    cellComponent.setOnClickListener((data) => this.onUserRequestJoinRoom(data));
                    cellComponent && cellComponent.initCell(array[i]);
                    this.addNode(listCell);
                    this.contentInScroll.addChild(listCell);
                }
            }
            createRooms(playableRooms, 1);
            createRooms(fullRooms, 3);
            
            // let rooms = [...playableRooms, ...fullRooms];
            
            // for (let i = 0; i < rooms.length; i++) {
            //     let listCell = cc.instantiate(this.tableListCell);
            //     listCell.active = false;
            //     let cellComponent = listCell.getComponent('TableListCell');
            //     cellComponent.setOnClickListener((data) => this.onUserRequestJoinRoom(data));
            //     cellComponent && cellComponent.initCell(rooms[i]);
            //     this.addNode(listCell);
            //     this.contentInScroll.addChild(listCell);
            // }
            
            // for (let i = 0; i < rooms.length; i++) {
            //     let listCell = cc.instantiate(this.tableListCell);
            //     listCell.active = false;
            //     let cellComponent = listCell.getComponent('TableListCell');
            //     cellComponent.setOnClickListener((data) => this.onUserRequestJoinRoom(data));
            //     cellComponent && cellComponent.initCell(rooms[i]);
            //     this.addNode(listCell);
            //     this.contentInScroll.addChild(listCell);
            // }
            
            this.minBalanceMultiple && this._bestSuitableRoom(this.minBalanceMultiple);
        }
        
        this._isInitedRoomList = true;
    }
    
    _createRoomObject(id, displayId, minBet, userCount, roomCapacity, password) {
        return {
            id,
            displayId,
            minBet,
            userCount,
            roomCapacity,
            password
        }   
    }
    
    _renderList(showActivate) {
        if(!showActivate)
            return;
            
        // this.contentInScroll.removeAllChildren();
        // this.contentInScroll && this.contentInScroll.children && this.contentInScroll.children.forEach(child => child.active = false);

        // let filterItems = this._filterItems();
        // if (filterItems.length > 0) {
            this.setVisibleEmptyNode(false);
            this.contentInScroll.children.forEach((child) => {
                let cell = child.getComponent('TableListCell');
                if(cell) {
                    let minbet = cell.getComponentData().minBet;
                    child.active = (minbet >= this.filterCond.min && minbet <= this.filterCond.max)
                }
            });
            
            this.contentInScroll.sortAllChildren();
            
            // // this.contentInScroll && filterItems.forEach(item => this.contentInScroll.addChild(item.node));
            // this.contentInScroll && filterItems.forEach(item => item.node.active = true);
        // } else {
        //     this.setVisibleEmptyNode(true);
        // }

        this.hideLoading();
    }

    /**
     * 
     * @param {any} cell {id, isSpectator, minBet, password}
     * 
     * @memberOf ListTableScene
     */
    _requestJoinRoom({ id, minBet, password, isSpectator } = {}) {
        let sendObject = {
            cmd: app.commands.USER_JOIN_ROOM,
            data: {
                [app.keywords.ROOM_ID]: id,
                [app.keywords.IS_SPECTATOR]: isSpectator || false,
                [app.keywords.ROOM_BET]: minBet,
            }
        };
        password && (sendObject.data[app.keywords.ROOM_PASSWORD] = password);

        this.showLoading('Đang vào bàn chơi....');
        app.service.send(sendObject);
    }

    _createRoom({ minBet = 0, roomCapacity = 2 } = {}) {
        this.__isCreatingRoom = true;

        /**
         * If create room successfully, response going handle by join room success follow
         */
        this.showLoading('Đang vào bàn chơi....');
        app.service.send({
            cmd: app.commands.USER_CREATE_ROOM,
            data: {
                [app.keywords.ROOM_BET]: minBet,
                [app.keywords.GAME_CODE]: this.gameCode,
                [app.keywords.ROOM_CAPACITY]: roomCapacity,
                [app.keywords.IS_SPECTATOR]: false
            }
        });
    }

    _onUserCreateRoom(data) {
        this.__isCreatingRoom = false;
        if (data.errorCode) {
            this.hideLoading();
            app.system.error(app.getRoomErrorMessage(data));
        }
    }

    _onJoinRoomError(event) {
        this.__isCreatingRoom = false;
        if (event.errorCode) {
            let _cb = this._sendRequestUserListRoom.bind(this, this._room);
            app.system.error(app.getRoomErrorMessage(event) || event.errorMessage, _cb, _cb);
        }
    }
    
    _onUserVariablesUpdate(ev) {
        let changedVars = ev[app.keywords.BASE_EVENT_CHANGED_VARS] || [];
        changedVars.map(v => {
        if (v == 'coin') {
                this.userMoneyLbl.string = `${Utils.numberFormat(app.context.getMeBalance() || 0)}`;
            }
        });
    }
}

ListTableScene.TYPE_FAKE_ROOM = 2;
app.createComponent(ListTableScene);