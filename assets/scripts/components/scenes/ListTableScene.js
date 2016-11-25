import app from 'app';
import BaseScene from 'BaseScene';
import SFS2X from 'SFS2X';
import RubUtils from 'RubUtils';
import AlertPopupRub from 'AlertPopupRub';
import _ from 'lodash';

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

        this.items = [];

        this.time = 2500 * 10; // creating new request for updating tables every 25s
        this.interval = null;

        // filter button conditional 
        this.filterCond = null;

        // room lobby Id
        this.lobbyId = null;
    }

    onDestroy() {
        super.onDestroy();
        this._clearInterval();
    }

    // clear interval
    _clearInterval() {
        this.interval && clearInterval(this.interval);
    }


    onEnable() {
        super.onEnable();

        this._setInterval();
    }

    // interval for updating tables state by creating new request to server
    _setInterval() {
        (!this.interval) && (
            this.interval = setInterval(() => {
                this.node && this.lobby && this._getRoomList(this.lobby);
            }, this.time)
        );
    }

    onLoad() {
        super.onLoad();

        this._initComponents();

        this._getFirstGameLobbyFromServer();
    }

    _initComponents() {
        this._addBottomBar();
        this._addTopBar();

        app.context.getSelectedGame() && (this.gameCode = app.context.getSelectedGame());

        this.gameCode && this._initGameLabel(this.gameCode);

        this._initFilterBtns();
    }

    _initFilterBtns() {
        let btnNodes = this.node.getChildByName('Layout').children;

        let event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = 'ListTableScene';
        event.handler = 'onFilterBtnClick';

        btnNodes && btnNodes.forEach((btn) => {
            btn.getComponent(cc.Button).clickEvents = [event];
        });
    }

    onFilterBtnClick(e) {
        let [min, max] = [0, 0];

        switch (e.currentTarget.name) {
            case 'danthuongBtn':
                [min, max] = [1, 3];
                break;
            case 'danchoiBtn':
                [min, max] = [3, 5];
                break;
            case 'daigiaBtn':
                [min, max] = [5, 7];
                break;
            case 'typhuBtn':
                [min, max] = [7, 10];
                break;
        }

        this.filterCond = { max, min };
        this._renderList(this.items, this.filterCond);
    }

    _initGameLabel(gameCode) {
        let lbl = this.node.getChildByName('Sprite').getChildByName('gameTitle').getComponent(cc.Label);
        lbl.string = gameCode.toUpperCase();
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
                roomIds && roomIds.length > 0 && (this.lobby = roomIds[0]);
                this.lobby && this._getRoomList(this.lobby);

                // assume server will be response minbet for filtering based on its minbet
            } else {
                error('game code & result are not matched');
            }
        });
    }

    _getRoomList(lobbyId) {
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

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(SFS2X.SFSEvent.ROOM_JOIN, (event) => {
            let room = event.room;
            if (room) {
                if (room.isGame === false && room.name && room.name.indexOf('lobby') > -1) {
                    let sendObject = {
                        cmd: app.commands.USER_LIST_ROOM,
                        room
                    };
                    app.service.send(sendObject, (data) => {
                        this.node && this._initRoomsListFromData(data);
                    });
                }
            }

        }, this);
    }

    _initRoomsListFromData(data) {
        if (!data)
            return;

        this.items = [];
        const itemDimension = this.contentInScroll.width || 300;
        let customIds = data[app.keywords.ID],
            minBets = data[app.keywords.ROOM_MIN_BET],
            passwords = data[app.keywords.ROOM_PASSWORD],
            userCounts = data[app.keywords.ROOM_USER_COUNT],
            // isSolo = data[app.keywords.ROOM_SOLO_ONLY],
            userMaxs = data[app.keywords.ROOM_USER_MAX];

        if (customIds) {
            customIds = [...customIds, ...new Array(40).fill(0)];
            for (let i = 0; i < customIds.length; i++) {

                const listCell = new cc.instantiate(this.tableListCell);

                listCell.setContentSize(itemDimension - 16, 50);
                listCell.setPosition(cc.p(0, 0));

                const cellComponent = listCell.getComponent('TableListCell');

                if (!minBets[i]) {
                    minBets[i] = _.random(1, 10);
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
        items = this._filter(items, cond);

        if (items.length > 0 && this.contentInScroll) {
            // clear content
            this.contentInScroll.children.length > 0 && this.contentInScroll.removeAllChildren(true);

            // re-adding content
            items.map((item) => {
                this.contentInScroll.addChild(item);
            });
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

        items.filter((item) => {
            item.getComponent('TableListCell').minBet >= cond.min && item.getComponent('TableListCell').minBet <= cond.max
        });
        return items.filter((item) => item.getComponent('TableListCell').minBet >= cond.min && item.getComponent('TableListCell').minBet <= cond.max);
    }

    onHandleQuickJoinBtn() {
        let data = {};
        data[app.keywords.GAME_CODE] = this.gameCode;
        data[app.keywords.IS_SPECTATOR] = false;
        data[app.keywords.QUICK_JOIN_BET] = 1;

        log("join room request");
        console.log(app.system.gameEventEmitter)
        console.log(app.system.eventEmitter)

        app.service.send({ cmd: app.commands.USER_QUICK_JOIN_ROOM, data });
    }

    onUserRequestJoinRoom(cell) {
        if (cell.minBet > cell.balance) {
            AlertPopupRub.show(cc.director.getScene(), "rằng thì là mà .... minbet > balance");
        } else {
            if (cell.password) {
                console.warn('password wth ?');
            } else {
                this._requestJoinRoom(cell);
            }
        }
    }

    _requestJoinRoom(cell) {
        let data = {};
        data[app.keywords.ROOM_ID] = cell.id;
        data[app.keywords.IS_SPECTATOR] = false;
        data[app.keywords.ROOM_BET] = cell.minBet;
        cell.password && (data[app.keywords.ROOM_PASSWORD] = cell.password);

        let sendObject = {
            cmd: app.commands.USER_JOIN_ROOM,
            data,
            // room: app.context.getLastJoinedRoom()
        };
        app.service.send(sendObject);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
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

            let topBarScript = topbarNode.getComponent('TopBar');
            topBarScript.showBackButton();

            this.node.addChild(topbarNode);
        });
    }
}

app.createComponent(ListTableScene);