/**
 * Created by Thanh on 8/29/2016.
 */

import app from 'app';
import { utils, GameUtils } from 'utils';
import SFS2X from 'SFS2X';
import async from 'async';
import { Events } from 'events'
import { Keywords, Commands } from 'core';

export default class GameEventHandler {
    constructor(scene) {
        this._pendingEvents = [];
        this.scene = scene;
        this._handleEventImediate = true;
        this._listenerMap = {};
        this._restoringGame = false
    }

    setRestoringGame(restoring = true){
        this._restoringGame = restoring;
        !restoring && this._handlePendingEvents();
    }

    isRestoringGame(){
        return this._restoringGame;
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

        app.system.addGameListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this._onUserExitRoom, this);
        app.system.addGameListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this._onUserEnterRoom, this);
        app.system.addGameListener(SFS2X.SFSEvent.ROOM_REMOVE, this._onRoomRemove, this);
        app.system.addGameListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
        app.system.addGameListener(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, this._onRoomVariablesUpdate, this);
        app.system.addGameListener(SFS2X.SFSEvent.PUBLIC_MESSAGE, this._onPlayerPublishMessage, this);

        app.system.addGameListener(Commands.SYSTEM_MESSAGE, this._handleSystemMessage, this);
        app.system.addGameListener(Commands.DOWNLOAD_IMAGE, this._handlePlayerAvatar, this);
        app.system.addGameListener(Commands.USER_LEVEL_UP, this._handleUserLevelUp, this);
        app.system.addGameListener(Commands.TASK_FINISH, this._handleTaskFinish, this);
        app.system.addGameListener(Commands.BUDDY_NEW_INVITATION, this._handBuddyNewInvitation, this);

        app.system.addGameListener(Commands.ASSETS_USE_ITEM, this._handlePlayerUseAssets, this);
        app.system.addGameListener(Commands.PING_CLIENT, this._handlePingClient, this);
        app.system.addGameListener(Commands.PLAYERS_BALANCE_CHANGE, this._handleChangePlayerBalance, this);
        app.system.addGameListener(Commands.PLAYER_REENTER_ROOM, this._handlePlayerReEnterGame, this);
        app.system.addGameListener(Commands.BOARD_STATE_CHANGE, this._handleGameStateChange, this);
        app.system.addGameListener(Commands.BOARD_MASTER_CHANGE, this._handleChangeBoardMaster, this);
        app.system.addGameListener(Commands.PLAYER_REJOIN_ROOM, this._handlePlayerRejoinGame, this);
        app.system.addGameListener(Commands.PLAYER_GET_TURN, this._onPlayerGetTurn, this);
        app.system.addGameListener(Commands.PLAYER_LOSE_TURN, this._onPlayerLoseTurn, this);
        app.system.addGameListener(Commands.PLAYER_SKIP_TURN, this._onPlayerSkipTurn, this);
        app.system.addGameListener(Commands.PLAYER_PLAY_CARD, this._onPlayerPlayCards, this);
        app.system.addGameListener(Commands.PLAYER_READY, this._onPlayerReady, this);
        app.system.addGameListener(Commands.PLAYER_UNREADY, this._onPlayerUnready, this);
        app.system.addGameListener(Commands.PLAYER_TAKE_CARD, this._onPlayerTakeCard, this);
        app.system.addGameListener(Commands.PLAYER_EAT_CARD, this._onPlayerEatCard, this);
        app.system.addGameListener(Commands.PLAYER_DOWN_CARD, this._onPlayerDownCard, this);
        app.system.addGameListener(Commands.PLAYER_HELP_CARD, this._onPlayerHelpCard, this);
        app.system.addGameListener(Commands.PLAYER_BET, this._onPlayerBet, this);
        app.system.addGameListener(Commands.BACAY_PLAYER_GA_HUC, this._onPlayerGaHuc, this);
        app.system.addGameListener(Commands.BACAY_PLAYER_HUC_ACCEPTED, this._onPlayerHucAccepted, this);
        app.system.addGameListener(Commands.BACAY_PLAYER_GOP_GA, this._onPlayerGopGa, this);
        app.system.addGameListener(Commands.XOCDIA_BET, this._onXocDiaPLayerBet, this);
        app.system.addGameListener(Commands.XOCDIA_CANCEL_BET, this._onXocDiaPLayerCancelBet, this);
        app.system.addGameListener(Commands.INVALID_PLAY_TURN, this._invalidPlayTurn, this);
        app.system.addGameListener(Commands.REGISTER_QUIT_ROOM, this._onRegisterQuitRoom, this);

        app.system.addGameListener(Commands.ASSETS_USE_ITEM, this._assetsUseItem, this);
        app.system.addGameListener(Commands.GET_CURRENT_GAME_DATA, this._getCurrentGameData, this);
        app.system.addGameListener(Commands.USER_DISCONNECTED, this._onHandleUserDisconnected, this, 0);
        app.system.addGameListener(Commands.REPLACE_FAKE_USER, this._replaceFakeUser, this);
        
        app.system.addGameListener(app.commands.PLAYER_BAO_XAM, this._handlePlayerBaoXam, this);
    }

    removeGameEventListener() {

        app.system.removeGameListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this._onUserExitRoom, this);
        app.system.removeGameListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this._onUserEnterRoom, this);
        app.system.removeGameListener(SFS2X.SFSEvent.ROOM_REMOVE, this._onRoomRemove, this);
        app.system.removeGameListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
        app.system.removeGameListener(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, this._onRoomVariablesUpdate, this);
        app.system.removeGameListener(SFS2X.SFSEvent.PUBLIC_MESSAGE, this._onPlayerPublishMessage, this);

        app.system.removeGameListener(Commands.SYSTEM_MESSAGE, this._handleSystemMessage, this);
        app.system.removeGameListener(Commands.DOWNLOAD_IMAGE, this._handlePlayerAvatar, this);
        app.system.removeGameListener(Commands.USER_LEVEL_UP, this._handleUserLevelUp, this);
        app.system.removeGameListener(Commands.TASK_FINISH, this._handleTaskFinish, this);
        app.system.removeGameListener(Commands.BUDDY_NEW_INVITATION, this._handBuddyNewInvitation, this);

        app.system.removeGameListener(Commands.ASSETS_USE_ITEM, this._handlePlayerUseAssets, this);
        app.system.removeGameListener(Commands.PING_CLIENT, this._handlePingClient, this);
        app.system.removeGameListener(Commands.PLAYERS_BALANCE_CHANGE, this._handleChangePlayerBalance, this);
        app.system.removeGameListener(Commands.PLAYER_REENTER_ROOM, this._handlePlayerReEnterGame, this);
        app.system.removeGameListener(Commands.BOARD_STATE_CHANGE, this._handleGameStateChange, this);
        app.system.removeGameListener(Commands.BOARD_MASTER_CHANGE, this._handleChangeBoardMaster, this);
        app.system.removeGameListener(Commands.PLAYER_REJOIN_ROOM, this._handlePlayerRejoinGame, this);
        app.system.removeGameListener(Commands.PLAYER_GET_TURN, this._onPlayerGetTurn, this);
        app.system.removeGameListener(Commands.PLAYER_LOSE_TURN, this._onPlayerLoseTurn, this);
        app.system.removeGameListener(Commands.PLAYER_SKIP_TURN, this._onPlayerSkipTurn, this);
        app.system.removeGameListener(Commands.PLAYER_PLAY_CARD, this._onPlayerPlayCards, this);
        app.system.removeGameListener(Commands.PLAYER_READY, this._onPlayerReady, this);
        app.system.removeGameListener(Commands.PLAYER_UNREADY, this._onPlayerUnready, this);

        app.system.removeGameListener(Commands.PLAYER_TAKE_CARD, this._onPlayerTakeCard, this);
        app.system.removeGameListener(Commands.PLAYER_EAT_CARD, this._onPlayerEatCard, this);
        app.system.removeGameListener(Commands.PLAYER_DOWN_CARD, this._onPlayerDownCard, this);
        app.system.removeGameListener(Commands.PLAYER_HELP_CARD, this._onPlayerHelpCard, this);
        app.system.removeGameListener(Commands.PLAYER_BET, this._onPlayerBet, this);
        app.system.removeGameListener(Commands.BACAY_PLAYER_GA_HUC, this._onPlayerGaHuc, this);
        app.system.removeGameListener(Commands.BACAY_PLAYER_HUC_ACCEPTED, this._onPlayerHucAccepted, this);
        app.system.removeGameListener(Commands.BACAY_PLAYER_GOP_GA, this._onPlayerGopGa, this);
        app.system.removeGameListener(Commands.XOCDIA_BET, this._onXocDiaPLayerBet, this);
        app.system.removeGameListener(Commands.XOCDIA_CANCEL_BET, this._onXocDiaPLayerCancelBet, this);
        app.system.removeGameListener(Commands.INVALID_PLAY_TURN, this._invalidPlayTurn, this);
        app.system.removeGameListener(Commands.REGISTER_QUIT_ROOM, this._onRegisterQuitRoom, this);

        app.system.removeGameListener(Commands.ASSETS_USE_ITEM, this._assetsUseItem, this);
        app.system.removeGameListener(Commands.GET_CURRENT_GAME_DATA, this._getCurrentGameData, this);
        app.system.removeGameListener(Commands.USER_DISCONNECTED, this._onHandleUserDisconnected, this, 0);
        app.system.removeGameListener(Commands.REPLACE_FAKE_USER, this._replaceFakeUser, this);
        
        app.system.removeGameListener(app.commands.PLAYER_BAO_XAM, this._handlePlayerBaoXam, this);
        
    }
    
    _handlePlayerBaoXam(data) {
        this.scene.emit(Events.ON_PLAYER_BAO_XAM_RESPONSE, data);
    }
    
    // {gameData, gamePhaseData, playerData} = data;
    _getCurrentGameData(data) {
        app.service._gameDataTimeout && clearTimeout(app.service._gameDataTimeout);
        
        this.scene.handleGameRefresh(data);
    }


    _onRegisterQuitRoom(data){
        this.scene.emit(Events.ON_PLAYER_REGISTER_QUIT_ROOM, data);
    }

    _onPlayerGopGa(data) {

        let playerId, gopGaValue, errMsg
        let success = utils.getValue(data, app.keywords.SUCCESSFULL);
        if (success) {
            playerId = utils.getValue(data, Keywords.PLAYER_ID);
            gopGaValue = utils.getValue(data, Keywords.BA_CAY_GOP_GA_VALUE);
        }else{
            errMsg = utils.getValue(data, Keywords.BA_CAY_GOP_GA_VALUE)
        }

        playerId && this.scene.emit(Events.ON_PLAYER_BACAY_GOP_GA, playerId, gopGaValue, errMsg || true);
    }

    _assetsUseItem(data) {
        let success = utils.getValue(data, app.keywords.SUCCESSFULL);
        if (success) {
            //{r: "123456", su: true, s: "p1642017854", t: 3, pi: 0}
            let sender = utils.getValue(data, app.keywords.ASSETS_ITEM_USED_SENDER);
            let receiver = utils.getValue(data, app.keywords.ASSETS_ITEM_USED_RECEIVER);
            let assetId = utils.getValue(data, app.keywords.ASSETS_DAOCU_ITEM_USED_ID);
            this.scene.emit(Events.ON_USER_USES_ASSET, sender, receiver, assetId);
        }
    }

    _onXocDiaPLayerCancelBet(data) {
        let playerId = utils.getValue(data, app.keywords.XOCDIA_CANCEL_BET.RESPONSE.PLAYER);
        let isSuccess = utils.getValue(data, app.keywords.XOCDIA_CANCEL_BET.RESPONSE.IS_SUCCESS);
        let err = utils.getValue(data, app.keywords.XOCDIA_CANCEL_BET.RESPONSE.ERROR_MSG);
        let d = { playerId, isSuccess, err };
        playerId && this.scene.emit(Events.XOCDIA_ON_PLAYER_CANCELBET, d);
    }

    _onXocDiaPLayerBet(data) {
        let playerId = utils.getValue(data, app.keywords.XOCDIA_BET.RESPONSE.PLAYER);
        let betsList = utils.getValue(data, app.keywords.XOCDIA_BET.RESPONSE.BET_LIST);
        let isSuccess = utils.getValue(data, app.keywords.XOCDIA_BET.RESPONSE.IS_SUCCESS);
        let err = utils.getValue(data, app.keywords.XOCDIA_BET.RESPONSE.ERROR_MSG);
        let isReplace = utils.getValue(data, app.keywords.XOCDIA_BET.RESPONSE.IS_REPLACE);
        let d = { playerId, betsList, isSuccess, err, isReplace };
        playerId && this.scene.emit(Events.XOCDIA_ON_PLAYER_BET, d);
    }

    _onPlayerHucAccepted(data) {
        let gaHucPlayerId = utils.getValue(data, app.keywords.BACAY_GA_HUC_PLAYER_ID);
        let biHucPlayerId = utils.getValue(data, app.keywords.BACAY_BI_HUC_PLAYER_ID);
        gaHucPlayerId && this.scene.emit(Events.HANDLE_PLAYER_ACCEPT_CUOC_BIEN, gaHucPlayerId, biHucPlayerId, data);
    }

    _onPlayerGaHuc(data) {
        let gaHucPlayerId = utils.getValue(data, app.keywords.BACAY_GA_HUC_PLAYER_ID);
        gaHucPlayerId && this.scene.emit(Events.HANDLE_PLAYER_CUOC_BIEN, gaHucPlayerId, data);
    }

    _onPlayerBet(data) {
        let playerId = utils.getValue(data, Keywords.PLAYER_ID);
        playerId && this.scene.emit(Events.HANDLE_PLAYER_BET, playerId, data);
    }

    _onPlayerDownCard(data) {
        let playerId = utils.getValue(data, Keywords.PLAYER_ID);
        playerId && this.scene.emit(Events.HANDLE_PLAYER_DOWN_CARD, playerId, data);
    }

    _onPlayerTakeCard(data) {
        let playerId = utils.getValue(data, Keywords.PLAYER_ID);
        playerId && this.scene.emit(Events.HANDLE_PLAYER_TAKE_CARD, playerId, data);
    }

    _onPlayerEatCard(data) {
        let playerId = utils.getValue(data, Keywords.PLAYER_ID);
        playerId && this.scene.emit(Events.HANDLE_PLAYER_EAT_CARD, playerId, data);
    }

    _onPlayerHelpCard(data) {
        let playerId = utils.getValue(data, Keywords.PLAYER_ID);
        playerId && this.scene.emit(Events.HANDLE_PLAYER_HELP_CARD, playerId, data);
    }

    _onPlayerPublishMessage(event) {
        this.scene.emit(Events.ON_PLAYER_CHAT_MESSAGE, event.sender, event.message);
    }

    _handleChangeBoardMaster(data) {
        let masterId = utils.getValue(data, "ma");
        masterId && this.scene.emit(Events.CHANGE_GAME_MASTER, masterId)
    }

    _handlePlayerRejoinGame(data) {
        this.scene.handleRejoinGame(data);
    }

    _replaceFakeUser(data) {
        let playerId = utils.getValue(data,  "playerId",  0);
        let userId = utils.getValue(data, "userId", 0);

        this.scene.emit(Events.ON_PLAYER_REENTER_GAME, playerId, userId);
    }
    
    _handlePlayerReEnterGame(data) {
        let playerId = utils.getValue(data, Keywords.PLAYER_ID, 0);
        let userId = utils.getValue(data, Keywords.USER_ID, 0);
        this.scene.emit(Events.ON_PLAYER_REENTER_GAME, playerId, userId);
    }

    _onUserVariablesUpdate(event) {
        let changedVars = event.changedVars;
        let user = event.user;
        
        
        changedVars && changedVars.forEach((varName) => {
            if (Keywords.USER_VARIABLE_BALANCE == varName) {
                this.scene.emit(Events.ON_USER_UPDATE_BALANCE, user);
            } else if (Keywords.USER_VARIABLE_LEVEL == varName) {
                this.scene.emit(Events.ON_USER_UPDATE_LEVEL, user);
            } else if (Keywords.USER_VARIABLE_EXP_POINT == varName) {
                this.scene.emit(Events.ON_USER_UPDATE_EXP_POINT, user);
            } else if ("newPlayer" == varName) {
                this.scene.emit(Events.ON_USER_UPDATE_NEW_PLAYER, user);
            }
        });
    }

    _onRoomVariablesUpdate(event) {
        let changedVars = event.changedVars;
        let room = event.room;

        changedVars && changedVars.forEach((varName) => {
            if (varName == Keywords.VARIABLE_OWNER) {
                this.scene.emit(Events.ON_ROOM_CHANGE_OWNER, room);
            }

            if (varName == Keywords.VARIABLE_MIN_BET) {
                this.scene.emit(Events.ON_ROOM_CHANGE_MIN_BET, room);
            }

            if (varName == Keywords.VARIABLE_XOCDIA_HISTORY) {
                this.scene.emit(Events.XOCDIA_ON_BOARD_UPDATE_PREVIOUS_RESULT_HISTORY, room.variables[varName].value);
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
                    
    _onHandleUserDisconnected(data = {}){
        let playerId = utils.getValue(data, app.keywords.PLAYER_ID, 0);
        let username =  utils.getValue(data, app.keywords.USER_NAME, "");
        let roomName =  utils.getValue(data, app.keywords.ROOM_NAME, "");
        
        let disconnectedPlayer = this.scene.gamePlayers.findPlayer(username);
        if(disconnectedPlayer != null){
            this.scene.emit(Events.ON_USER_EXIT_ROOM, disconnectedPlayer.user, this.scene.room, playerId);
        }
    }

    _onUserExitRoom(event) {
        if (!event.user || !event.room || !this.scene.room || event.room.id != this.scene.room.id) {
            return;
        }

        if(event.user){    

            if ( event.user.isItMe) {
                this.scene.emit(Events.ON_USER_EXIT_ROOM, event.user, event.room, event.user.getPlayerId(event.room));
                this.scene.goBack();
            }
            
            // this.scene.emit(Events.ON_USER_EXIT_ROOM, event.user, event.room, event.user.getPlayerId(event.room));
            // 
            // if ( event.user.isItMe) {
            //     this.scene.goBack();
            // }
        }
    }

    _onUserEnterRoom(event) {

        if (!event.user || !event.room || event.room.id != this.scene.room.id) {
            return;
        }

        this.scene.gamePlayers.onUserEnterRoom(event.user, event.room);
    }

    _onRoomRemove(event) {
        log('room remove: ', event);
        this.scene.goBack();
    }

    _handleGameStateChange(data) {
        let state = utils.getValue(data, app.keywords.BOARD_STATE_KEYWORD);
        utils.isNumber(state) && this.scene.emit(Events.ON_GAME_STATE_CHANGE, state, data);
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
            app.service.send({ cmd: Keywords.PING_CLIENT, data: data, room: app.context.currentRoom });
        }
    }

    _onPlayerReady(data) {
        let playerId = utils.getValue(data, app.keywords.PLAYER_ID);
        playerId && this.scene.emit(Events.ON_PLAYER_READY_STATE_CHANGED, playerId, true, this.scene.gamePlayers.isItMe(playerId));
    }

    _onPlayerUnready(data) {
        let playerId = utils.getValue(data, app.keywords.PLAYER_ID);
        playerId && this.scene.emit(Events.ON_PLAYER_READY_STATE_CHANGED, playerId, false, this.scene.gamePlayers.isItMe(playerId));
    }

    _handleChangePlayerBalance(data) {
        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER);
        let playersBalances = utils.getValue(data, Keywords.USER_BALANCE);
        playerIds && playersBalances && playerIds.forEach((id, index) => {
            this.scene.emit(Events.ON_PLAYER_CHANGE_BALANCE, id, playersBalances[index]);
        });

        // this.playerManager.changePlayerBalance(playerIds, playersBalances);
    }

    _invalidPlayTurn(data) {
        if (this.scene.gameState == app.const.game.state.TURN_BASE_TRUE_PLAY) {
            this.scene.emit(Events.SHOW_PLAY_CONTROL, true);
        }
    }
}