/**
 * Created by Thanh on 8/29/2016.
 */

import app from 'app';
import SFS2X from 'SFS2X';
import async from 'async';
import Events from 'Events'

export default class GameEventHandler {
    constructor(board, scene) {
        this.board = board;
        this._pendingEvents = [];
        this.scene = scene;
        this._handleEventImediate = true;
    }

    setHandleEventImmediate(imediate) {
        this._handleEventImediate = imediate;

        if (imediate) {
            this._handlePendingEvents();
        }
    }

    _handlePendingEvents() {
        async.series(this._pendingEvents.map(eventObj => {
            return () => { eventObj.handler(...eventObj.data); };
        }));

        this._pendingEvents = [];
    }

    addGameEventListener() {
        app.system.addListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this._onUserExitRoom, this);
        app.system.addListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this._onUserEnterRoom, this);
        app.system.addListener(SFS2X.SFSEvent.ROOM_REMOVE, this._onRoomRemove, this);

        app.system.addListener(app.commands.SYSTEM_MESSAGE, this._handleSystemMessage, this);
        app.system.addListener(app.commands.DOWNLOAD_IMAGE, this._handlePlayerAvatar, this);
        app.system.addListener(app.commands.USER_LEVEL_UP, this._handleUserLevelUp, this);
        app.system.addListener(app.commands.TASK_FINISH, this._handleTaskFinish, this);
        app.system.addListener(app.commands.BUDDY_NEW_INVITATION, this._handBuddyNewInvitation, this);
        app.system.addListener(app.commands.ASSETS_USE_ITEM, this._handlePlayerUseAssets, this);
        app.system.addListener(app.commands.PING_CLIENT, this._handlePingClient, this);
        app.system.addListener(app.commands.PLAYERS_BALANCE_CHANGE, this.board._handleChangePlayerBalance, this);
        app.system.addListener(app.commands.PLAYER_REENTER_ROOM, this.board._handlePlayerReEnterGame, this);
        app.system.addListener(app.commands.BOARD_STATE_CHANGE, this._handleChangeBoardState, this);
        app.system.addListener(app.commands.BOARD_MASTER_CHANGE, this.board._handleChangeBoardMaster, this);
        app.system.addListener(app.commands.PLAYER_REJOIN_ROOM, this.board._handlePlayerRejoinGame, this);

        app.system.addListener(app.commands.PLAYER_GET_TURN, this._onPlayerGetTurn, this);
        app.system.addListener(app.commands.PLAYER_LOSE_TURN, this._onPlayerLoseTurn, this);
        app.system.addListener(app.commands.PLAYER_SKIP_TURN, this._onPlayerSkipTurn, this);
        app.system.addListener(app.commands.PLAYER_PLAY_CARD, this._onPlayerPlayCards, this);
    }

    removeGameEventListener() {
        app.system.removeListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this._onUserExitRoom);
        app.system.removeListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this._onUserEnterRoom);
        app.system.removeListener(SFS2X.SFSEvent.ROOM_REMOVE, this._onRoomRemove);

        app.system.removeListener(app.commands.SYSTEM_MESSAGE, this._handleSystemMessage);
        app.system.removeListener(app.commands.DOWNLOAD_IMAGE, this._handlePlayerAvatar);
        app.system.removeListener(app.commands.USER_LEVEL_UP, this._handleUserLevelUp);
        app.system.removeListener(app.commands.TASK_FINISH, this._handleTaskFinish);
        app.system.removeListener(app.commands.BUDDY_NEW_INVITATION, this._handBuddyNewInvitation);
        app.system.removeListener(app.commands.ASSETS_USE_ITEM, this._handlePlayerUseAssets);
        app.system.removeListener(app.commands.PING_CLIENT, this._handlePingClient);
        app.system.removeListener(app.commands.PLAYERS_BALANCE_CHANGE, this.board._handleChangePlayerBalance);
        app.system.removeListener(app.commands.PLAYER_REENTER_ROOM, this.board._handlePlayerReEnterGame);
        app.system.removeListener(app.commands.BOARD_STATE_CHANGE, this._handleChangeBoardState);
        app.system.removeListener(app.commands.BOARD_MASTER_CHANGE, this.board._handleChangeBoardMaster);
        app.system.removeListener(app.commands.PLAYER_REJOIN_ROOM, this.board._handlePlayerRejoinGame);

        app.system.removeListener(app.commands.PLAYER_GET_TURN, this._onPlayerGetTurn);
        app.system.removeListener(app.commands.PLAYER_LOSE_TURN, this._onPlayerLoseTurn);
        app.system.removeListener(app.commands.PLAYER_SKIP_TURN, this._onPlayerSkipTurn);
        app.system.removeListener(app.commands.PLAYER_PLAY_CARD, this._onPlayerPlayCards)
    }

    _onPlayerGetTurn(data){
        console.debug("_onPlayerGetTurn")
    }

    _onPlayerLoseTurn(data){
        console.debug("_onPlayerLoseTurn")
    }

    _onPlayerSkipTurn(data){
        console.debug("_onPlayerSkipTurn")
    }

    _onPlayerPlayCards(data){
        console.debug("_onPlayerPlayCards")
        this.scene.emit(Events.HANDLE_PLAY_TURN, data);
    }

    isCurrentGameRoom(event) {
        return event.sourceRoom && event.sourceRoom === app.context.currentRoom.id;
    }

    _onUserExitRoom(event) {
        console.log(event)
        // if(event.user.isItMe()){
            this.scene.goBack();
        // }
    }

    _onUserEnterRoom(event) {

        if (!event.user || !event.room || event.room.id != this.board.room.id) {
            return;
        }

        this.scene.playerManager.onUserEnterRoom(event.user, event.room);
    }

    _onRoomRemove(event) {
        this.scene.goBack();
    }

    _handleChangeBoardState(data) {
        if (data.hasOwnProperty(app.keywords.BOARD_STATE_KEYWORD)) {
            let boardState = data[app.keywords.BOARD_STATE_KEYWORD];
            this.board.changeBoardState(boardState, data);

            if (data.hasOwnProperty(app.keywords.BOARD_PHASE_DURATION)) {
                this.board.changeBoardPhaseDuration(data);
            }
        }

    }

    _handleSystemMessage(data) {
        var type = data[app.keywords.ADMIN_MESSAGE_TYPE];
        var messageArr = data[app.keywords.ADMIN_MESSAGE_LIST];

        if (type == app.const.SYSTEM_MESSAGE_TYPE_TICKER) {
            app.system.showTickerMessage(messageArr);
        } else if (type == app.const.SYSTEM_MESSAGE_TYPE_POPUP || type == app.const.SYSTEM_MESSAGE_TYPE_ACTIVITY) {
            messageArr.forEach((message, i) => {
                app.system.info(messageArr[i]);
            });
        }
    }

    _handlePlayerAvatar(data) {
        //TODO
    }

    _handleUserLevelUp(data) {
        //TODO
    }

    _handleTaskFinish(data) {
        //TODO
    }

    _handBuddyNewInvitation(data) {
        //TODO
    }

    _handlePlayerUseAssets(data) {
        //TODO
    }

    _handlePingClient(data, roomId = -1) {
        if (app.context.isJoinedGame() && roomId == app.context.currentRoom.id) {
            app.service.send({ cmd: app.commands.PING_CLIENT, data: data, room: app.context.currentRoom });
        }
    }
}