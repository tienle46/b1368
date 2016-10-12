/**
 * Created by Thanh on 8/29/2016.
 */

import app from 'app';
import {utils, GameUtils} from 'utils';
import SFS2X from 'SFS2X';
import async from 'async';
import {Events} from 'events'
import {Keywords, Commands} from 'core';

export default class GameEventHandler {
    constructor(scene) {
        this._pendingEvents = [];
        this.scene = scene;
        this.board = scene.board;
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
            return () => {
                eventObj.handler(...eventObj.data);
            };
        }));

        this._pendingEvents = [];
    }

    addGameEventListener() {

        app.system.addListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this._onUserExitRoom, this);
        app.system.addListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this._onUserEnterRoom, this);
        app.system.addListener(SFS2X.SFSEvent.ROOM_REMOVE, this._onRoomRemove, this);
        app.system.addListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
        app.system.addListener(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, this._onRoomVariablesUpdate, this);

        app.system.addListener(Commands.SYSTEM_MESSAGE, this._handleSystemMessage, this);
        app.system.addListener(Commands.DOWNLOAD_IMAGE, this._handlePlayerAvatar, this);
        app.system.addListener(Commands.USER_LEVEL_UP, this._handleUserLevelUp, this);
        app.system.addListener(Commands.TASK_FINISH, this._handleTaskFinish, this);
        app.system.addListener(Commands.BUDDY_NEW_INVITATION, this._handBuddyNewInvitation, this);

        app.system.addListener(Commands.ASSETS_USE_ITEM, this._handlePlayerUseAssets, this);
        app.system.addListener(Commands.PING_CLIENT, this._handlePingClient, this);
        app.system.addListener(Commands.PLAYERS_BALANCE_CHANGE, this._handleChangePlayerBalance, this);
        app.system.addListener(Commands.PLAYER_REENTER_ROOM, this._handlePlayerReEnterGame, this);
        app.system.addListener(Commands.BOARD_STATE_CHANGE, this._handleGameStateChange, this);
        app.system.addListener(Commands.BOARD_MASTER_CHANGE, this.board._handleChangeBoardMaster, this);
        app.system.addListener(Commands.PLAYER_REJOIN_ROOM, this._handlePlayerRejoinGame, this);
        app.system.addListener(Commands.PLAYER_GET_TURN, this._onPlayerGetTurn, this);
        app.system.addListener(Commands.PLAYER_LOSE_TURN, this._onPlayerLoseTurn, this);
        app.system.addListener(Commands.PLAYER_SKIP_TURN, this._onPlayerSkipTurn, this);
        app.system.addListener(Commands.PLAYER_PLAY_CARD, this._onPlayerPlayCards, this);
        app.system.addListener(Commands.PLAYER_READY, this._onPlayerReady, this);
        app.system.addListener(Commands.PLAYER_UNREADY, this._onPlayerUnready, this);

        console.log("addGameEventListener")
    }

    removeGameEventListener() {

        app.system.removeListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this._onUserExitRoom);
        app.system.removeListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this._onUserEnterRoom);
        app.system.removeListener(SFS2X.SFSEvent.ROOM_REMOVE, this._onRoomRemove);
        app.system.removeListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate);
        app.system.removeListener(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, this._onRoomVariablesUpdate);

        app.system.removeListener(Commands.SYSTEM_MESSAGE, this._handleSystemMessage);
        app.system.removeListener(Commands.DOWNLOAD_IMAGE, this._handlePlayerAvatar);
        app.system.removeListener(Commands.USER_LEVEL_UP, this._handleUserLevelUp);
        app.system.removeListener(Commands.TASK_FINISH, this._handleTaskFinish);
        app.system.removeListener(Commands.BUDDY_NEW_INVITATION, this._handBuddyNewInvitation);

        app.system.removeListener(Commands.ASSETS_USE_ITEM, this._handlePlayerUseAssets);
        app.system.removeListener(Commands.PING_CLIENT, this._handlePingClient);
        app.system.removeListener(Commands.PLAYERS_BALANCE_CHANGE, this._handleChangePlayerBalance);
        app.system.removeListener(Commands.PLAYER_REENTER_ROOM, this._handlePlayerReEnterGame);
        app.system.removeListener(Commands.BOARD_STATE_CHANGE, this._handleGameStateChange);
        app.system.removeListener(Commands.BOARD_MASTER_CHANGE, this.board._handleChangeBoardMaster);
        app.system.removeListener(Commands.PLAYER_REJOIN_ROOM, this._handlePlayerRejoinGame);
        app.system.removeListener(Commands.PLAYER_GET_TURN, this._onPlayerGetTurn);
        app.system.removeListener(Commands.PLAYER_LOSE_TURN, this._onPlayerLoseTurn);
        app.system.removeListener(Commands.PLAYER_SKIP_TURN, this._onPlayerSkipTurn);
        app.system.removeListener(Commands.PLAYER_PLAY_CARD, this._onPlayerPlayCards);
        app.system.removeListener(Commands.PLAYER_READY, this._onPlayerReady);
        app.system.removeListener(Commands.PLAYER_UNREADY, this._onPlayerUnready);
    }

    _handlePlayerRejoinGame(data){
        this.scene.emit(Events.ON_GAME_REJOIN, data);
    }

    _handlePlayerReEnterGame(data) {
        let playerId = utils.getValue(data, Keywords.PLAYER_ID, 0);
        let userId = utils.getValue(data, Keywords.USER_ID, 0);
        this.scene.emit(Events.ON_PLAYER_REENTER_GAME, playerId, userId);
    }

    _onUserVariablesUpdate(event){

        console.log("_onUserVariablesUpdate: ", event)

        let changedVars = event.changedVars;
        let user = event.user;

        changedVars && changedVars.forEach((varName) => {
            if (Keywords.USER_VARIABLE_BALANCE == varName) {
                this.scene.emit(Events.ON_USER_UPDATE_BALANCE, user);
            }
            else if (Keywords.USER_VARIABLE_LEVEL == varName) {
                this.scene.emit(Events.ON_USER_UPDATE_LEVEL, user);
            }
            else if (Keywords.USER_VARIABLE_EXP_POINT == varName) {
                this.scene.emit(Events.ON_USER_UPDATE_EXP_POINT, user);
            }
        });
    }

    _onRoomVariablesUpdate(event){
        let changedVars = event.changedVars;
        let room = event.room;

        changedVars && changedVars.forEach((varName) => {
            if (varName == Keywords.VARIABLE_OWNER) {
                this.scene.emit(Events.ON_ROOM_CHANGE_OWNER, room);
            }

            if (varName == Keywords.VARIABLE_MIN_BET) {
                this.scene.emit(Events.ON_ROOM_CHANGE_MIN_BET, room);
            }
        });
    }

    _onPlayerGetTurn(data) {
        this.scene.emit(Events.HANDLE_GET_TURN, data);
    }

    _onPlayerLoseTurn(data) {
        this.scene.emit(Events.HANDLE_LOSE_TURN, data);
    }

    _onPlayerSkipTurn(data) {
        this.scene.emit(Events.HANDLE_SKIP_TURN, data);
    }

    _onPlayerPlayCards(data) {
        this.scene.emit(Events.HANDLE_PLAY_TURN, data);
    }

    isCurrentGameRoom(event) {
        return event.sourceRoom && event.sourceRoom === app.context.currentRoom.id;
    }

    _onUserExitRoom(event) {
        log(event)

        if (!event.user || !event.room || event.room.id != this.scene.room.id) {
            return;
        }

        this.scene.emit(Events.GAME_USER_EXIT_ROOM, event.user, event.room);

        if (event.user && event.user.isItMe) {
            this.scene.goBack();
        }
    }

    _onUserEnterRoom(event) {

        if (!event.user || !event.room || event.room.id != this.scene.room.id) {
            return;
        }

        this.scene.gamePlayers.onUserEnterRoom(event.user, event.room);
    }

    _onRoomRemove(event) {
        this.scene.goBack();
    }

    _handleGameStateChange(data) {
        let state = utils.getValue(data, app.keywords.BOARD_STATE_KEYWORD);
        state && this.scene.emit(Events.ON_GAME_STATE_CHANGE, state, data);
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
        if (app.context.isJoinedInGameRoom(roomId)) {
            app.service.send({cmd: Keywords.PING_CLIENT, data: data, room: app.context.currentRoom});
        }
    }

    _onPlayerReady(data){
        console.log("on player ready: ", data)
        let playerId = utils.getValue(data, app.keywords.PLAYER_ID);
        playerId && this.scene.emit(Events.ON_PLAYER_READY_STATE_CHANGED, playerId, true, this.scene.gamePlayers.isItMe(playerId));
    }

    _onPlayerUnready(data){
        let playerId = utils.getValue(data, app.keywords.PLAYER_ID);
        playerId && this.scene.emit(Events.ON_PLAYER_READY_STATE_CHANGED, playerId, false, this.scene.gamePlayers.isItMe(playerId));
    }

    _handleChangePlayerBalance(data){
        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER);
        let playersBalances = utils.getValue(data, Keywords.USER_BALANCE);

        log("_handleChangePlayerBalance: ", playersBalances);

        playerIds && playersBalances && playerIds.forEach((id, index) => {
            this.scene.emit(Events.ON_PLAYER_CHANGE_BALANCE, id, playersBalances[index]);
        });

        // this.playerManager.changePlayerBalance(playerIds, playersBalances);
    }
}