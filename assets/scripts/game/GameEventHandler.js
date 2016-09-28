/**
 * Created by Thanh on 8/29/2016.
 */

import app from 'app';
import SFS2X from 'SFS2X';
import async from 'async';
import Events from 'Events'
import GameUtils from 'GameUtils'

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

        app.system.addListener(app.commands.SYSTEM_MESSAGE, this._handleSystemMessage, this);
        app.system.addListener(app.commands.DOWNLOAD_IMAGE, this._handlePlayerAvatar, this);
        app.system.addListener(app.commands.USER_LEVEL_UP, this._handleUserLevelUp, this);
        app.system.addListener(app.commands.TASK_FINISH, this._handleTaskFinish, this);
        app.system.addListener(app.commands.BUDDY_NEW_INVITATION, this._handBuddyNewInvitation, this);
        app.system.addListener(app.commands.ASSETS_USE_ITEM, this._handlePlayerUseAssets, this);
        app.system.addListener(app.commands.PING_CLIENT, this._handlePingClient, this);
        app.system.addListener(app.commands.PLAYERS_BALANCE_CHANGE, this.board._handleChangePlayerBalance, this);
        app.system.addListener(app.commands.PLAYER_REENTER_ROOM, this.board._handlePlayerReEnterGame, this);
        app.system.addListener(app.commands.BOARD_STATE_CHANGE, this._handleGameStateChange, this);
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
        app.system.removeListener(app.commands.BOARD_STATE_CHANGE, this._handleGameStateChange);
        app.system.removeListener(app.commands.BOARD_MASTER_CHANGE, this.board._handleChangeBoardMaster);
        app.system.removeListener(app.commands.PLAYER_REJOIN_ROOM, this.board._handlePlayerRejoinGame);

        app.system.removeListener(app.commands.PLAYER_GET_TURN, this._onPlayerGetTurn);
        app.system.removeListener(app.commands.PLAYER_LOSE_TURN, this._onPlayerLoseTurn);
        app.system.removeListener(app.commands.PLAYER_SKIP_TURN, this._onPlayerSkipTurn);
        app.system.removeListener(app.commands.PLAYER_PLAY_CARD, this._onPlayerPlayCards)
    }

    _onPlayerGetTurn(data) {
        console.debug("_onPlayerGetTurn");
        this.scene.emit(Events.HANDLE_GET_TURN, data);
    }

    _onPlayerLoseTurn(data) {
        console.debug("_onPlayerLoseTurn");
        this.scene.emit(Events.HANDLE_LOSE_TURN, data);
    }

    _onPlayerSkipTurn(data) {
        console.debug("_onPlayerSkipTurn")
        this.scene.emit(Events.HANDLE_SKIP_TURN, data);
    }

    _onPlayerPlayCards(data) {
        console.debug("_onPlayerPlayCards")
        this.scene.emit(Events.HANDLE_PLAY_TURN, data);
    }

    isCurrentGameRoom(event) {
        return event.sourceRoom && event.sourceRoom === app.context.currentRoom.id;
    }

    _onUserExitRoom(event) {
        console.log(event)

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
        if (data.hasOwnProperty(app.keywords.BOARD_PHASE_DURATION)) {
            this.board && this.board.changeBoardPhaseDuration(data);
        }

        if (data.hasOwnProperty(app.keywords.BOARD_STATE_KEYWORD)) {

            let state = data[app.keywords.BOARD_STATE_KEYWORD];

            this.scene.emit(Events.ON_GAME_STATE_CHANGE, state, data);

            let localState = GameUtils.convertToLocalBoardState(state);
            this.scene.gameState = state;
            this.scene.gameLocalState = localState;

            console.debug("Game state: ", state, localState);

            switch (localState) {
                case app.const.game.board.state.BEGIN:
                    this.scene.emit(Events.ON_GAME_STATE_BEGIN, data);
                    break;
                case app.const.game.board.state.STARTING:
                    this.scene.emit(Events.ON_GAME_STATE_STARTING, data);
                    break;
                case app.const.game.board.state.STARTED:
                    this.scene.emit(Events.ON_GAME_STATE_STARTED, data);
                    break;
                case app.const.game.board.state.PLAYING:
                    this.scene.emit(Events.ON_GAME_STATE_PLAYING, data);
                    break;
                case app.const.game.board.state.ENDING:
                    this.scene.emit(Events.ON_GAME_STATE_ENDING, data);
                    break;
            }

            // this.board.handleGameStateChange(state, data);
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
            app.service.send({cmd: app.commands.PING_CLIENT, data: data, room: app.context.currentRoom});
        }
    }
}