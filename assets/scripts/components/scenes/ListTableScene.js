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

        this.properties = {
            ...this.properties,
            contentInScroll: cc.Node,
            tableListCell: cc.Prefab,
            invitePopupPrefab: cc.Prefab,
            gameTitleLbl: cc.Label,
            userMoneyLbl: cc.Label,
            jarAnchorNode: cc.Node,
            arrowNode: cc.Node,
            filter1stLabel: cc.Label,
            filter2ndLabel: cc.Label,
            filter3rdLabel: cc.Label,
            radio1: cc.Toggle,
            radio2: cc.Toggle,
            radio3: cc.Toggle
        };
        
        this.items = null;
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
        this.items = [];
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
        this._getFirstGameLobbyFromServer();
        this._getListGameMinBet();
        if(app.jarManager.hasJar(this.gameCode)) {
            let hasButton = true;
            app.jarManager.addJarToParent(this.jarAnchorNode, this.gameCode, hasButton);
        }

        app.system.showLackOfMoneyMessagePopup()
    }

    onDestroy() {
        super.onDestroy();
        window.release(this.items, this.enableMinbets);
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

        app.system.showLoader();
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
    
    _activeFilterByIndex(index) {
        for(let i = 1; i <= 3; i++) 
            this[`radio${i}`] && (this[`radio${i}`].isChecked = false);
        
        this.filterCond = app.config.listTableGroupFilters[index];
        
        this[`radio${index + 1}`] && (this[`radio${index + 1}`].isChecked = true);
        this._renderList();    
    }
    
    _bestSuitableRoom(rooms, minBalanceMultiple) {
        let minMoney = app.context.getMeBalance() / this.minBalanceMultiple;
        let room = app._.maxBy(rooms.filter(item => {
            let {userCount, roomCapacity, minBet} = item.getComponentData();
            return userCount >= 1 && userCount < roomCapacity && minBet <= minMoney;
        }), (item) => {
            let {minBet} = item.getComponentData();
            return minBet;
        });
        
        if (room) {
            let minBet = room.getComponentData().minBet;
            let index = app.config.listTableGroupFilters.findIndex(cond => minBet >= cond.min && minBet <= cond.max);
            this._activeFilterByIndex(index);
        }
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
        let room = event.room;
        this._room = room;

        if (room) {
            if (room.isGame === false && room.name && ~room.name.indexOf('lobby')) {
                this._sendRequestUserListRoom(room);
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
        let emptyRoom = true;
        for(let i = 0; i < displayIds.length; i++) {
            emptyRoom = false;
            let object = this._createRoomObject(ids[i], displayIds[i], minBets[i], userCounts[i], roomCapacities[i], passwords[i]);
            (userCounts[i] === roomCapacities[i] ? fullRooms : playableRooms).push(object);
        }
        
        if(emptyRoom) {
            let minMoney =  app.context.getMeBalance()/this.minBalanceMultiple;
            let index = app.config.listTableGroupFilters.findIndex((o) => (minMoney >= o.min && minMoney <= o.max));
            
            if(index === -1 && minMoney >= app._.maxBy(app.config.listTableGroupFilters, (o) => o.max).max) {
                this._activeFilterByIndex(app.config.listTableGroupFilters.length - 1);
            } else if(~index) {
                this._activeFilterByIndex(index);
            }
        }
        
        // room faker
        let fakers = [];
        this.enableMinbets.forEach(minBet => fakers.push(this._createRoomObject(0, 0, minBet, 0, app.const.game.maxPlayers[this.gameCode || 'default'], null)));
        
        playableRooms = [...playableRooms, ...fakers, ...fullRooms];
        
        if (!addMore) {
            this.items.forEach(item => item.node && CCUtils.destroy(item.node));
            window.release(this.items);
        }

        for (let i = 0; i < playableRooms.length; i++) {
            let listCell = cc.instantiate(this.tableListCell);
            let cellComponent = listCell.getComponent('TableListCell');
            cellComponent.setOnClickListener((data) => this.onUserRequestJoinRoom(data));
            cellComponent && cellComponent.initCell(playableRooms[i]);
            this.addNode(listCell);
            this.items.push(cellComponent);
        }
        
        this.minBalanceMultiple && this._bestSuitableRoom(this.items, this.minBalanceMultiple);
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
    
    _renderList() {
        this.contentInScroll.removeAllChildren();
        // CCUtils.clearAllChildren(this.contentInScroll);

        let filterItems = this._filterItems();
        if (filterItems.length > 0) {
            this.setVisibleEmptyNode(false);
            this.contentInScroll && filterItems.map(item => this.contentInScroll.addChild(item.node));
        } else {
            this.setVisibleEmptyNode(true);
        }

        this.hideLoading();
    }

    _filterItems() {
        return this.items.filter(item => {
            let minbet = item.getComponentData().minBet;
            return minbet >= this.filterCond.min && minbet <= this.filterCond.max;
        });
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

app.createComponent(ListTableScene);