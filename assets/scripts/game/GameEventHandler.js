/**
 * Created by Thanh on 8/29/2016.
 */

import game from 'game'
import SFS2X from 'SFS2X'
import async from 'async'

export default class GameEventHandler {
    constructor(board, scene) {
        this.board = board
        this._pendingEvents = []
        this.scene = scene
        this._handleEventImediate = true
    }

    setHandleEventImmediate(imediate){
        this._handleEventImediate = imediate;

        if(imediate){
            this._handlePendingEvents();
        }
    }

    _handlePendingEvents(){
        async.series(this._pendingEvents.map(eventObj => {
            return () => {eventObj.handler(...eventObj.data)}
        }));

        this._pendingEvents = [];
    }

    addGameEventListener(){
        game.system.addListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this._onUserExitRoom, this)
        game.system.addListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this._onUserEnterRoom, this)
        game.system.addListener(SFS2X.SFSEvent.ROOM_REMOVE, this._onRoomRemove, this)

        game.system.addListener(game.commands.SYSTEM_MESSAGE, this._handleSystemMessage, this)
        game.system.addListener(game.commands.DOWNLOAD_IMAGE, this._handlePlayerAvatar, this)
        game.system.addListener(game.commands.USER_LEVEL_UP, this._handleUserLevelUp, this)
        game.system.addListener(game.commands.TASK_FINISH, this._handleTaskFinish, this)
        game.system.addListener(game.commands.BUDDY_NEW_INVITATION, this._handBuddyNewInvitation, this)
        game.system.addListener(game.commands.ASSETS_USE_ITEM, this._handlePlayerUseAssets, this)
        game.system.addListener(game.commands.PING_CLIENT, this._handlePingClient, this)
        game.system.addListener(game.commands.PLAYERS_BALANCE_CHANGE, this.board._handleChangePlayerBalance, this)
        game.system.addListener(game.commands.PLAYER_REENTER_ROOM, this.board._handlePlayerReEnterGame, this)
        game.system.addListener(game.commands.BOARD_STATE_CHANGE, this.board._handleChangeBoardState, this)
        game.system.addListener(game.commands.BOARD_MASTER_CHANGE, this.board._handleChangeBoardMaster, this)
        game.system.addListener(game.commands.PLAYER_REJOIN_ROOM, this.board._handlePlayerRejoinGame, this)
    }

    removeGameEventListener(){
        game.system.removeListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this._onUserExitRoom)
        game.system.removeListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this._onUserEnterRoom)
        game.system.removeListener(SFS2X.SFSEvent.ROOM_REMOVE, this._onRoomRemove)

        game.system.removeListener(game.commands.SYSTEM_MESSAGE, this._handleSystemMessage)
        game.system.removeListener(game.commands.DOWNLOAD_IMAGE, this._handlePlayerAvatar)
        game.system.removeListener(game.commands.USER_LEVEL_UP, this._handleUserLevelUp)
        game.system.removeListener(game.commands.TASK_FINISH, this._handleTaskFinish)
        game.system.removeListener(game.commands.BUDDY_NEW_INVITATION, this._handBuddyNewInvitation)
        game.system.removeListener(game.commands.ASSETS_USE_ITEM, this._handlePlayerUseAssets)
        game.system.removeListener(game.commands.PING_CLIENT, this._handlePingClient)
        game.system.removeListener(game.commands.PLAYERS_BALANCE_CHANGE, this.board._handleChangePlayerBalance)
        game.system.removeListener(game.commands.PLAYER_REENTER_ROOM, this.board._handlePlayerReEnterGame)
        game.system.removeListener(game.commands.BOARD_STATE_CHANGE, this.board._handleChangeBoardState)
        game.system.removeListener(game.commands.BOARD_MASTER_CHANGE, this.board._handleChangeBoardMaster)
        game.system.removeListener(game.commands.PLAYER_REJOIN_ROOM, this.board._handlePlayerRejoinGame)
    }

    isCurrentGameRoom(event){
        return event.sourceRoom && event.sourceRoom === game.context.currentRoom.id
    }

    _onUserExitRoom(event){
        console.log(this)
        this.scene.goBack();
    }

    _onUserEnterRoom(event){
        if (!event.user || !event.room || event.room.id != this.board.room.id) {
            return;
        }

        this.scene.playerManager.onUserEnterRoom(event.user, event.room);
    }

    _onRoomRemove(event){
        this.scene.goBack()
    }

    _handleChangeBoardState(data){
        if (data.hasOwnProperty(game.keywords.BOARD_STATE_KEYWORD)) {
            let boardState = data[game.keywords.BOARD_STATE_KEYWORD];
            this.board.changeBoardState(boardState, data);

        }
    }

    _handleSystemMessage(data){
        var type = data[game.keywords.ADMIN_MESSAGE_TYPE];
        var messageArr = data[game.keywords.ADMIN_MESSAGE_LIST];

        if (type == game.const.SYSTEM_MESSAGE_TYPE_TICKER) {
            game.system.showTickerMessage(messageArr);
        } else if (type == game.const.SYSTEM_MESSAGE_TYPE_POPUP || type == game.const.SYSTEM_MESSAGE_TYPE_ACTIVITY) {
            messageArr.forEach(message => {
                game.system.info(messageArr[i]);
            });
        }
    }

    _handlePlayerAvatar(data){
        //TODO
    }

    _handleUserLevelUp(data) {
        //TODO
    }

    _handleTaskFinish(data){
        //TODO
    }

    _handBuddyNewInvitation(data){
        //TODO
    }

    _handlePlayerUseAssets(data){
        //TODO
    }

    _handlePingClient(data, roomId = -1){
        if (game.context.isJoinedGame() && roomId == game.context.currentRoom.id) {
           game.service.send({cmd: game.commands.PING_CLIENT, data: data, room: game.context.currentRoom});
        }
    }

    // handleGameEvent(event){
    //     if (!this.board) {
    //         return;
    //     }
    //
    //     let roomId = event.sourceRoom;
    //     let data = event.params;
    //     let cmd = event.cmd;
    //
    //     switch (cmd) {
    //         case game.commands.SYSTEM_MESSAGE:
    //             this._handleSystemMessage(data);
    //             break;
    //         case game.commands.DOWNLOAD_IMAGE:
    //             this._handlePlayerAvatar(data);
    //             break;
    //         case game.commands.USER_LEVEL_UP:
    //             this._handleUserLevelUp(data);
    //             break;
    //         case game.commands.TASK_FINISH:
    //             this._handleTaskFinish(data);
    //             break;
    //         case game.commands.BUDDY_NEW_INVITATION:
    //             this._handBuddyNewInvitation(data);
    //             break;
    //         case game.commands.ASSETS_USE_ITEM:
    //             this._handlePlayerUseAssets(data);
    //             break;
    //         case game.commands.PING_CLIENT:
    //             this._handlePingClient(data, roomId)
    //             break;
    //         default:
    //             if (!roomId || roomId != game.context.currentRoom.id) {
    //                 break;
    //             }
    //             switch (cmd) {
    //                 case game.commands.PLAYERS_BALANCE_CHANGE:
    //                     this.board._handleChangePlayerBalance(data);
    //                     break;
    //                 case game.commands.PLAYER_REENTER_ROOM:
    //                     this.board._handlePlayerReEnterGame(data);
    //                     break;
    //                 case game.commands.BOARD_STATE_CHANGE:
    //                     this._handleChangeBoardState(data);
    //                     break;
    //                 case game.commands.BOARD_MASTER_CHANGE:
    //                     this.board._handleChangeBoardMaster(data);
    //                     break;
    //                 case game.commands.PLAYER_REJOIN_ROOM:
    //                     this.board._handlePlayerRejoinGame(data);
    //                     break;
    //                 case game.commands.SPECTATOR_TO_PLAYER:
    //                     this.board._handleSpectatorToPlayer(data);
    //                     break;
    //                 case game.commands.PLAYER_TO_SPECTATOR:
    //                     this.board._handlePlayerToSpectator(data);
    //                     break;
    //                 default:
    //                     if (data.hasOwnProperty(game.keywords.PLAYER_ID)) {
    //                         this.board.playerManager.handleEvent(data[game.keywords.PLAYER_ID], cmd, data);
    //                     }
    //
    //             }
    //     }
    // }
}