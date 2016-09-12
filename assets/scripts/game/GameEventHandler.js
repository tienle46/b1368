/**
 * Created by Thanh on 8/29/2016.
 */

var game = require('game')

export default class GameEventHandler {
    constructor(board) {
        this.setBoard(board)
        game.system.setGameEventHandler(this)
    }

    setBoard(board){
        this.board = board

        this._pendingEvents = []

        this._shouldHandleEvent = false
    }

    setShouldHandleEvent(shouldHandleEvent){
        this._shouldHandleEvent = shouldHandleEvent;
    }

    handleGameEvent(event){

        if (!this.board) {
            return;
        }

        let roomId = event.sourceRoom;
        let data = event.params;
        let cmd = event.cmd;

        switch (cmd) {
            case game.commands.SYSTEM_MESSAGE:
                this._handleSystemMessage(data);
                break;
            case game.commands.DOWNLOAD_IMAGE:
                this._handlePlayerAvatar(data);
                break;
            case game.commands.USER_LEVEL_UP:
                this._handleUserLevelUp(data);
                break;
            case game.commands.TASK_FINISH:
                this._handleTaskFinish(data);
                break;
            case game.commands.BUDDY_NEW_INVITATION:
                this._handBuddyNewInvitation(data);
                break;
            case game.commands.ASSETS_USE_ITEM:
                this._handlePlayerUseAssets(data);
                break;
            case game.commands.PING_CLIENT:
                this._handlePingClient(data, roomId)
                break;
            default:
                if (!roomId || roomId != game.context.currentRoom.id) {
                    break;
                }
                switch (cmd) {
                    case game.commands.PLAYERS_BALANCE_CHANGE:
                        this.board._handleChangePlayerBalance(data);
                        break;
                    case game.commands.PLAYER_REENTER_ROOM:
                        this.board._handlePlayerReEnterGame(data);
                        break;
                    case game.commands.BOARD_STATE_CHANGE:
                        this._handleChangeBoardState(data);
                        break;
                    case game.commands.BOARD_MASTER_CHANGE:
                        this.board._handleChangeBoardMaster(data);
                        break;
                    case game.commands.PLAYER_REJOIN_ROOM:
                        this.board._handlePlayerRejoinGame(data);
                        break;
                    case game.commands.SPECTATOR_TO_PLAYER:
                        this.board._handleSpectatorToPlayer(data);
                        break;
                    case game.commands.PLAYER_TO_SPECTATOR:
                        this.board._handlePlayerToSpectator(data);
                        break;
                    default:
                        if (data.hasOwnProperty(game.keywords.PLAYER_ID)) {
                            this.board.playerManager.handleEvent(data[game.keywords.PLAYER_ID], cmd, data);
                        }

                }
        }
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

}