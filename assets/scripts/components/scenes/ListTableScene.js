import app from 'app';
import BaseScene from 'BaseScene';
import SFS2X from 'SFS2X';
import { requestTimeout, clearRequestTimeout } from 'TimeHacker';
import ScrollMessagePopup from 'ScrollMessagePopup';

export default class ListTableScene extends BaseScene {
    constructor() {
        super();

        this.contentInScroll = {
            default: null,
            type: cc.Node
        };

        this.tableListCell = {
            default: null,
            type: cc.Prefab
        };

        this.gameTitleLbl = {
            default: null,
            type: cc.Label
        };

        this.topbarNode = {
            default: null,
            type: cc.Node
        };

        this.items = [];

        this.time = 2500 * 10; // creating new request for updating tables every 25s

        // filter button conditional 
        this.filterCond = null;

        // invitation popup showed
        this.invitationShowed = false;

        // timeout setTimeout
        this.timeout = null;
        this.__isCreatingRoom = false;
    }

    onEnabled() {
        super.onEnabled();
    }

    onLoad() {
        super.onLoad();
    }

    onDestroy() {
        super.onDestroy();
        this._clearInterval();

        this.items.length = 0;

        // filter button conditional 
        this.filterCond = null;

        // invitation popup showed
        this.invitationShowed = false;
    }

    start() {
        super.start();

        this._initComponents();

        this._getFirstGameLobbyFromServer();
    }

    onHandleQuickJoinBtn() {
        let data = {};
        data[app.keywords.GAME_CODE] = this.gameCode;
        data[app.keywords.IS_SPECTATOR] = false;
        data[app.keywords.QUICK_JOIN_BET] = 1;

        app.system.showLoader();
        app.service.send({ cmd: app.commands.USER_QUICK_JOIN_ROOM, data });
    }

    onUserRequestJoinRoom(cell) {
        if (cell.minBet > cell.balance) {
            app.system.error(
                app.res.string('error_user_not_enough_gold_to_join_room', { minBet: cell.minBet })
            );
        } else {
            if (cell.password) {
                console.warn('password wth ?');
            } else {
                this._requestJoinRoom(cell);
            }
        }
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_LIST_GROUP, this._onUserListGroup, this);
        app.system.addListener(app.commands.USER_LIST_ROOM, this._onUserListRoom, this);
        app.system.addListener(app.commands.USER_CREATE_ROOM, this._onUserCreateRoom, this);
        app.system.addListener(SFS2X.SFSEvent.ROOM_JOIN, this._handleRoomJoinEvent, this);
        app.system.addListener(app.commands.PLAYER_INVITE, this._onPlayerInviteEvent, this);
        app.system.addListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_LIST_GROUP, this._onUserListGroup, this);
        app.system.removeListener(app.commands.USER_LIST_ROOM, this._onUserListRoom, this);
        app.system.removeListener(app.commands.USER_CREATE_ROOM, this._onUserCreateRoom, this);
        app.system.removeListener(SFS2X.SFSEvent.ROOM_JOIN, this._handleRoomJoinEvent, this);
        app.system.removeListener(app.commands.PLAYER_INVITE, this._onPlayerInviteEvent, this);
        app.system.removeListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError, this);
    }

    onNongDanBtnClick() {
        this.filterCond = { min: 1, max: 3 };
        this._renderList(this.items, this.filterCond);
    }

    onQuyTocBtnClick() {
        this.filterCond = { min: 3, max: 5 };
        this._renderList(this.items, this.filterCond);
    }

    onHoangGiaBtnClick() {
        this.filterCond = { min: 5, max: 7 };
        this._renderList(this.items, this.filterCond);
    }

    onGuideBtnClick() {
        let data = {
            [app.keywords.SERVICE_ID]: this.gameCode,
            [app.keywords.CLIENT_VERSION]: 1,
            [app.keywords.ACTION]: 1,
            "testMode": false
        };

        ScrollMessagePopup.show(this.node, {
            cmd: app.commands.RULE_OF_GAME,
            data: data,
            parser: (data) => {
                return data[app.keywords.GAME_RULE] ? data[app.keywords.GAME_RULE] : data[app.keywords.GAME_GUIDE];
            }
        });
    }

    // clear interval
    _clearInterval() {
        this.timeout && clearRequestTimeout(this.timeout);
    }

    _initComponents() {
        app.context.getSelectedGame() && (this.gameCode = app.context.getSelectedGame());

        this.gameCode && this._initGameLabel(this.gameCode);

        let topBarScript = this.topbarNode.getComponent('TopBar');
        topBarScript.showBackButton();
    }

    _initGameLabel(gameCode) {
        cc.log('gameCode', gameCode);
        this.gameTitleLbl.string = app.const.gameLabels[gameCode].toUpperCase();
    }

    _getFirstGameLobbyFromServer() {

        let data = {};
        data[app.keywords.SERVICE_ID] = this.gameCode;

        let reqObject = {
            cmd: app.commands.USER_LIST_GROUP,
            data
        };

        this.showLoading(app.res.string('loading_data'));
        app.service.send(reqObject);
    }

    _onUserListGroup(data) {
        if (data && data[app.keywords.GAME_LIST_RESULT] && data[app.keywords.GAME_LIST_RESULT] === this.gameCode) {
            let roomIds = data[app.keywords.GROUP_LIST_GROUP][app.keywords.GROUP_SHORT_NAME];
            let lobbyId = null;
            roomIds && roomIds.length > 0 && (lobbyId = roomIds[0]);
            lobbyId && this._sendRequestUserJoinLobbyRoom(lobbyId);

            // TODO: assume server will be response minbet for filtering based on its minbet
        } else {
            error('game code & result are not matched', JSON.stringify(data[app.keywords.GAME_LIST_RESULT]), this.gameCode);
        }
    }

    _sendRequestUserJoinLobbyRoom(lobbyId) {
        if (!lobbyId) {
            console.error('where is our lobby !');
            return;
        }

        let data = {};
        data[app.keywords.GROUP_ID] = `${this.gameCode}${lobbyId}`;

        let reqObject = {
            cmd: app.commands.USER_JOIN_LOBBY_ROOM,
            data
        };
        app.service.send(reqObject); // emit user join event
    }

    _onPlayerInviteEvent(event) {
        if (!this.invitationShowed && !this.__isCreatingRoom) {
            let room = {
                id: event[app.keywords.INVITATION_ROOM_SFSID],
                isSpectator: false,
                minBet: event[app.keywords.QUICK_JOIN_BET]
            };
            this.invitationShowed = true;

            this.invitationShowed && app.system.confirm(
                app.res.string('user_got_invitation_to_join_room', { invoker: event.u, minBet: event.b }),
                this._onCancelInvitationBtnClick.bind(this),
                this._onConfirmInvitationBtnClick.bind(this, room)
            );
        }
    }

    _onConfirmInvitationBtnClick(room) {
        this.invitationShowed = false;

        this._requestJoinRoom(room);
    }

    _onCancelInvitationBtnClick() {
        this.invitationShowed = false;
    }

    _handleRoomJoinEvent(event) {
        let room = event.room;
        if (room) {
            if (room.isGame === false && room.name && room.name.indexOf('lobby') > -1) {
                this._sendRequestUserListRoom(room);
            }
        } else {
            if (event.errorCode) {
                app.system.error(app.getMessageFromServer(event));
            }
        }
    }

    _sendRequestUserListRoom(room) {
        let sendObject = {
            cmd: app.commands.USER_LIST_ROOM,
            room
        };
        app.service.send(sendObject);

        if (!this.timeout) {
            this.timeout = requestTimeout(() => {
                this.timeout && this._sendRequestUserListRoom(room);
                clearRequestTimeout(this.timeout);
            }, this.time);
        }
    }

    _onUserListRoom(data) {
        this.node && this._initRoomsListFromData(data);
    }

    _initRoomsListFromData(data) {
        if (!data)
            return;

        let customIds = data[app.keywords.ID],
            minBets = data[app.keywords.ROOM_MIN_BET],
            passwords = data[app.keywords.ROOM_PASSWORD],
            userCounts = data[app.keywords.ROOM_USER_COUNT],
            // isSolo = data[app.keywords.ROOM_SOLO_ONLY],
            userMaxs = data[app.keywords.ROOM_USER_MAX];

        if (customIds) {
            // room faker
            customIds = [...customIds, ...[0, 0, 0, 0]];
            this.items.length = 0;
            for (let i = 0; i < customIds.length; i++) {

                let listCell = cc.instantiate(this.tableListCell);
                // listCell.setContentSize(itemDimension - 16, 50);
                listCell.setPosition(cc.p(0, 0));

                let cellComponent = listCell.getComponent('TableListCell');

                if (!minBets[i]) {
                    minBets[i] = 5;
                    customIds[i] = null;
                    userCounts[i] = 0;
                    userMaxs[i] = 4;
                    passwords[i] = null;
                    cellComponent.setOnClickListener(() => {
                        this._createRoom(this.gameCode, minBets[i], userMaxs[i]);
                    });

                    listCell.__$filterException = true;
                } else {
                    cellComponent.setOnClickListener(() => {
                        this.onUserRequestJoinRoom(cellComponent);
                    });
                }

                cellComponent && cellComponent.initCell(customIds[i], minBets[i], userCounts[i], userMaxs[i], passwords[i]);

                this.items.push(listCell);
            }

            this._renderList(this.items, this.filterCond);
        }
    }

    /**
     * 
     * @param {function} cond: _filter condition
     * 
     * @memberOf ListTableScene
     */
    _renderList(items, cond = null) {

        if (this.contentInScroll) {
            // clear content
            let children = this.contentInScroll.children;

            if (children && children.length > 0) {
                (!cond) && children.forEach(child => child.destroy());
                this.contentInScroll.removeAllChildren();
            }

            let filteredItems = this._filter(items, cond);
            if (filteredItems.length > 0) {
                // re-adding content
                filteredItems.map((item) => {
                    this.contentInScroll.addChild(item);
                });
                filteredItems = [];
            }
        }
        this.hideLoading();
    }

    /**
     * 
     * @param {any} cond
     * {
     *      max: number,
     *      min: number
     * }
     * @memberOf ListTableScene
     */
    _filter(items, cond = null) {
        items = items || [];
        if (!cond)
            return items;
        let filteredItems = [];
        filteredItems = items.filter((item) => item.__$filterException || (item.getComponent('TableListCell') && item.getComponent('TableListCell').minBet >= cond.min && item.getComponent('TableListCell').minBet <= cond.max));
        return filteredItems;
    }

    /**
     * 
     * @param {any} cell {id, isSpectator, minBet, password}
     * 
     * @memberOf ListTableScene
     */
    _requestJoinRoom(room) {
        let data = {};
        data[app.keywords.ROOM_ID] = room.id;
        data[app.keywords.IS_SPECTATOR] = room.isSpectator || false;
        data[app.keywords.ROOM_BET] = room.minBet;
        room.password && (data[app.keywords.ROOM_PASSWORD] = room.password);

        let sendObject = {
            cmd: app.commands.USER_JOIN_ROOM,
            data,
            // room: app.context.getLastJoinedRoom()
        };

        this.showLoading('Đang tải thông tin bàn chơi ....');
        app.service.send(sendObject);
    }


    _createRoom(gameCode = null, minBet = 0, roomCapacity = 2, password = undefined) {
        let data = {};
        data[app.keywords.ROOM_BET] = minBet;
        data[app.keywords.GAME_CODE] = gameCode;
        data[app.keywords.ROOM_PASSWORD] = password;
        data[app.keywords.ROOM_CAPACITY] = roomCapacity;
        let sendObject = {
            cmd: app.commands.USER_CREATE_ROOM,
            data,
            room: null
        };

        this.__isCreatingRoom = true;

        /**
         * If create room successfully, response going handle by join room success follow
         */
        app.system.showLoader();
        app.service.send(sendObject);
    }

    _onUserCreateRoom(data) {
        if (data.errorCode) {
            app.system.error(app.getMessageFromServer(data));
        }
    }

    _onJoinRoomError() {
        this.__isCreatingRoom = false;
        this._clearInterval();
        this._sendRequestUserListRoom();
    }
}

app.createComponent(ListTableScene);