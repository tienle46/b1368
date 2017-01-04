import app from 'app';
import BaseScene from 'BaseScene';
import SFS2X from 'SFS2X';
import { loadRes } from 'RubUtils';
import { requestTimeout, clearRequestTimeout } from 'TimeHacker';

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
        this.interval = null;

        // filter button conditional 
        this.filterCond = null;

        // invitation popup showed
        this.invitationShowed = false;

        // timeout setTimeout
        this.timeout = null;

        // game group Id
        this.gameGroupId = null;

    }

    onDestroy() {
        super.onDestroy();
        this._clearInterval();
    }

    // clear interval
    _clearInterval() {
        this.timeout && clearRequestTimeout(this.timeout);
        this.timeout = null;
    }

    onLoad() {
        super.onLoad();

        this._initComponents();

        this._getFirstGameLobbyFromServer();
    }

    _initComponents() {
        app.context.getSelectedGame() && (this.gameCode = app.context.getSelectedGame());

        this.gameCode && this._initGameLabel(this.gameCode);

        let topBarScript = this.topbarNode.getComponent('TopBar');
        topBarScript.showBackButton();
    }

    onFilterBtnClick(e) {
        let [min, max] = [0, 0];

        switch (e.node.name) {
            case 'nongdanRadio':
                [min, max] = [1, 3];
                break;
            case 'quytocRadio':
                [min, max] = [3, 5];
                break;
            case 'hoanggiaRadio':
                [min, max] = [5, 7];
                break;
        }

        this.filterCond = { max, min };
        this._renderList(this.items, this.filterCond);
    }

    _initGameLabel(gameCode) {
        this.gameTitleLbl.string = gameCode.toUpperCase();
    }

    _getFirstGameLobbyFromServer() {

        let data = {};
        data[app.keywords.SERVICE_ID] = this.gameCode;

        let reqObject = {
            cmd: app.commands.USER_LIST_GROUP,
            data
        };

        app.service.send(reqObject, (data) => {
            if (data && data[app.keywords.GAME_LIST_RESULT] && data[app.keywords.GAME_LIST_RESULT] === this.gameCode) {
                let roomIds = data[app.keywords.GROUP_LIST_GROUP][app.keywords.GROUP_SHORT_NAME];
                let lobby = null;
                roomIds && roomIds.length > 0 && (lobby = roomIds[0]);
                lobby && this._sendRequestUserJoinLobbyRoom(lobby);

                // assume server will be response minbet for filtering based on its minbet
            } else {
                error('game code & result are not matched');
            }
        });
    }

    _sendRequestUserJoinLobbyRoom(lobbyId) {
        if (!lobbyId) {
            console.error('where is our lobby !');
            return;
        }

        let data = {};
        this.gameGroupId = `${this.gameCode}${lobbyId}`;

        data[app.keywords.GROUP_ID] = this.gameGroupId;

        let reqObject = {
            cmd: app.commands.USER_JOIN_LOBBY_ROOM,
            data
        };
        app.service.send(reqObject); // emit user join event
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(SFS2X.SFSEvent.ROOM_JOIN, this._handleRoomJoinEvent, this);
        app.system.addListener(app.commands.PLAYER_INVITE, this._onPlayerInviteEvent, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(SFS2X.SFSEvent.ROOM_JOIN, this._handleRoomJoinEvent, this);
        app.system.removeListener(app.commands.PLAYER_INVITE, this._onPlayerInviteEvent, this);
    }

    _onPlayerInviteEvent(event) {
        // console.debug('this.invitationShowed', this.invitationShowed);
        if (this.invitationShowed == false) {
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

        // console.debug('this.invitationShowed canceled', this.invitationShowed);
    }

    _handleRoomJoinEvent(event) {
        app.system.hideLoader();
        let room = event.room;
        if (room) {
            if (room.isGame === false && room.name && room.name.indexOf('lobby') > -1) {
                this._sendRequestUserListRoom(room);
            }
        } else {
            if (event.errorCode) {
                // console.debug('_handleRoomJoinEvent');
                app.system.error(event.errorMessage);
            }
        }
    }

    _sendRequestUserListRoom(room) {
        let sendObject = {
            cmd: app.commands.USER_LIST_ROOM,
            room
        };
        app.service.send(sendObject, (data) => {
            this.node && this._initRoomsListFromData(data);
        });

        this.timeout = requestTimeout(() => {
            this._sendRequestUserListRoom(room);
            clearRequestTimeout(this.timeout);
        }, this.time);

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
            customIds = [...customIds, ...new Array(4).fill(0)];
            this.items = [];
            for (let i = 0; i < customIds.length; i++) {

                const listCell = new cc.instantiate(this.tableListCell);

                // listCell.setContentSize(itemDimension - 16, 50);
                listCell.setPosition(cc.p(0, 0));

                const cellComponent = listCell.getComponent('TableListCell');

                if (!minBets[i]) {
                    minBets[i] = 5;
                    customIds[i] = null;
                    userCounts[i] = 0;
                    userMaxs[i] = 4;
                    passwords[i] = null;
                    cellComponent.setOnClickListener(() => {
                        this._createRoom(this.gameCode, minBets[i], userMaxs[i]);
                    });
                } else {
                    cellComponent.setOnClickListener(() => {
                        this.onUserRequestJoinRoom(cellComponent);
                    });
                }

                cellComponent && cellComponent.initCell(customIds[i], minBets[i], userCounts[i], userMaxs[i], passwords[i]);

                this.items.push(listCell);
                // this.contentInScroll.addChild(listCell);
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
            children && children.length > 0 && this.contentInScroll.removeAllChildren();

            items = this._filter(items, cond);
            if (items.length > 0) {
                // re-adding content
                items.map((item) => {
                    this.contentInScroll.addChild(item);
                });
            }
        }
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

        return items.filter((item) => item.getComponent('TableListCell').minBet >= cond.min && item.getComponent('TableListCell').minBet <= cond.max);
    }

    onHandleQuickJoinBtn() {
        let data = {};
        data[app.keywords.GAME_CODE] = this.gameCode;
        data[app.keywords.IS_SPECTATOR] = false;
        data[app.keywords.QUICK_JOIN_BET] = 1;

        console.log(app.system.gameEventEmitter)
        console.log(app.system.eventEmitter)

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

        app.system.showLoader();
        let sendObject = {
            cmd: app.commands.USER_JOIN_ROOM,
            data,
            // room: app.context.getLastJoinedRoom()
        };
        app.service.send(sendObject);
    }


    _createRoom(gameCode = null, minBet = 0, roomCapacity = 2, password = undefined) {

        const requestParam = {};
        requestParam[app.keywords.ROOM_BET] = minBet;
        requestParam[app.keywords.GAME_CODE] = gameCode;
        requestParam[app.keywords.ROOM_PASSWORD] = password;
        requestParam[app.keywords.ROOM_CAPACITY] = roomCapacity;

        /**
         * If create room successfully, response going handle by join room success follow
         */
        app.service.send({ cmd: app.commands.USER_CREATE_ROOM, data: requestParam, room: null }, (error) => {
            if (error.errorCode) {
                app.system.error(error.errorMessage);
            }
        });
    }
}

app.createComponent(ListTableScene);