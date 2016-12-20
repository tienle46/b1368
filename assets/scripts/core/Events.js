/**
 * Created by Thanh on 9/22/2016.
 */

var Events = module.exports;

Events.HANDLE_TURN_DURATION             = "handle.turnDuration";
Events.HANDLE_CHANGE_TURN               = "handle.changeTurn";
Events.HANDLE_PLAY_TURN                 = "handle.playTurn";
Events.HANDLE_LOSE_TURN                 = "handle.loseTurn";
Events.HANDLE_SKIP_TURN                 = "handle.skipTurn";
Events.HANDLE_GET_TURN                  = "handle.getTurn";
Events.HANDLE_GAME_STATE_CHANGE         = "handle.gameStateChange";
Events.HANDLE_PLAYER_TAKE_CARD          = "handle.playerTakeCard";
Events.HANDLE_PLAYER_EAT_CARD           = "handle.playerEatCard";
Events.HANDLE_PLAYER_DOWN_CARD          = "handle.playerDownCard";
Events.HANDLE_PLAYER_HELP_CARD          = "handle.playerHelpCard";
Events.HANDLE_PLAYER_LEAVE_BOARD        = "handle.playerLeaveBoard";
Events.HANDLE_PLAYER_BET                = "handle.playerBet";
Events.HANDLE_PLAYER_DOWN_CARD          = "handle.playerDownCard";
Events.HANDLE_PLAYER_CUOC_BIEN             = "handle.playerGaHuc";
Events.HANDLE_PLAYER_ACCEPT_CUOC_BIEN         = "handle.playerAcceptHuc";

Events.SHOW_GAME_BEGIN_CONTROLS         = "show.gameBeginControls";
Events.SHOW_WAIT_TURN_CONTROLS          = "show.waitTurnControls";
Events.SHOW_ON_TURN_CONTROLS            = "show.onTurnControls";
Events.SHOW_EAT_AND_TAKE_CONTROLS       = "show.eatAndTakeControls";
Events.SHOW_PLAY_CONTROL_ONLY           = "show.playControlOnly";
Events.SHOW_JOIN_PHOM_CONTROLS          = "show.joinPhomControls";
Events.SHOW_DOWN_PHOM_CONTROLS          = "show.downPhomControls";
Events.SHOW_U_PHOM_CONTROLS             = "show.showUPhomControls";
Events.SHOW_PHOM_HIGHLIGHT              = "show.phomHighlight";
Events.SHOW_BAO_XAM_CONTROLS            = "show.baoSamControls";
Events.SHOW_BACAY_BET_CONTROLS          = "show.bacay.betControls";
Events.SHOW_DOWN_CARD_CONTROLS          = "show.downCardControls";
Events.SHOW_GOP_GA_NODE                 = "show.gopGaNode";
Events.SHOW_XOCDIA_BET_CONTROLS         = "show.xocdia.betControls";
Events.SHOW_DOWN_CARD_CONTROLS          = "show.downCardControls";
Events.SHOW_START_GAME_CONTROL          = "show.startGameControl";

Events.HIDE_ALL_CONTROLS                = "hide.allControls";
Events.HIDE_GAME_BEGIN_CONTROLS         = "hide.gameBeginControls";

Events.VISIBLE_INGAME_CHAT_COMPONENT    = "visible.inGameChatComponent";
Events.VISIBLE_GAME_PHOM_HIGHLIGNT      = "visible.gamePhomHighlight";

Events.ON_PLAYER_PLAYED_CARDS           = "on.player.playedCards";
Events.ON_PLAYER_READY_STATE_CHANGED    = "on.player.readyStateChanged";
Events.ON_PLAYER_REMAIN_CARD_COUNT      = "on.player.setReadyState";
Events.ON_PLAYER_TURN                   = "on.player.getTurn";
Events.ON_PLAYER_CHANGE_BALANCE         = "on.player.changeBalance";
Events.ON_PLAYER_CONG                   = "on.player.cong";
Events.ON_PLAYER_THOI                   = "on.player.thoi";
Events.ON_PLAYER_SET_BALANCE            = "on.player.setBalance";
Events.ON_PLAYER_REENTER_GAME           = "on.player.reenterGame";
Events.ON_PLAYER_CHAT_MESSAGE           = "on.player.chatMessage";
Events.ON_PLAYER_BAO_XAM                = "on.player.baoXam";
Events.ON_PLAYER_BAO_1                  = "on.player.bao1";
Events.ON_PLAYER_BACAY_CHANGE_BET       = "on.player.bacayChangeBet";
Events.ON_PLAYER_BACAY_GOP_GA           = "on.player.bacayGopGa";

Events.ON_USER_UPDATE_BALANCE           = "on.user.updateBalance";
Events.ON_USER_UPDATE_LEVEL             = "on.user.updateLevel";
Events.ON_USER_UPDATE_EXP_POINT         = "on.user.updateExpPoint";
Events.ON_USER_EXIT_ROOM                = "on.user.exitRoom";

Events.ON_ROOM_CHANGE_OWNER             = "on.room.changeOwner";
Events.ON_ROOM_CHANGE_MASTER            = "on.room.changeMaster";
Events.ON_ROOM_CHANGE_MIN_BET           = "on.room.changeMinBet";

Events.ON_CLICK_PLAY_BUTTON             = "on.click.playButton";
Events.ON_CLICK_SORT_BUTTON             = "on.click.sortButton";
Events.ON_CLICK_SKIP_TURN_BUTTON        = "on.click.skipTurnButton";
Events.ON_CLICK_EAT_CARD_BUTTON         = "on.click.eatCardButton";
Events.ON_CLICK_TAKE_CARD_BUTTON        = "on.click.takeCardButton";
Events.ON_CLICK_JOIN_PHOM_BUTTON        = "on.click.joinPhomButton";
Events.ON_CLICK_SKIP_JOIN_PHOM_BUTTON   = "on.click.skipJoinButton";
Events.ON_CLICK_DOWN_PHOM_BUTTON        = "on.click.downPhomButton";
Events.ON_CLICK_SKIP_DOWN_PHOM_BUTTON   = "on.click.skipDownButton";
Events.ON_CLICK_CHANGE_PHOM_BUTTON      = "on.click.changePhomButton";
Events.ON_CLICK_U_BUTTON                = "on.click.uButton";
Events.ON_CLICK_DOI_U_TRON_BUTTON       = "on.click.doiUTronButton";
Events.ON_CLICK_BAO_XAM_BUTTON          = "on.click.baoXamButton";
Events.ON_CLICK_BO_BAO_XAM_BUTTON       = "on.click.boBaoXamButton";
Events.ON_CLICK_BET_BUTTON              = "on.click.betButton";
Events.ON_CLICK_HUC_BUTTON              = "on.click.hucButton";
Events.ON_CLICK_KE_BUTTON               = "on.click.keButton";
Events.ON_CLICK_REVEAL_BUTTON           = "on.click.revealButton";
Events.ON_CLICK_DOWN_BUTTON             = "on.click.downButton";
Events.ON_CLICK_CHOOSE_BET_BUTTON       = "on.click.chooseBetButton";
Events.ON_CLICK_START_GAME_BUTTON       = "on.click.startGameButton";

Events.ON_GAME_RESET                        = "on.game.reset";
Events.ON_GAME_STATE_BEGIN                  = "on.game.stateBegin";
Events.ON_GAME_STATE_STARTING               = "on.game.stateStarting";
Events.ON_GAME_STATE_STARTED                = "on.game.stateStarted";
Events.ON_GAME_STATE_PLAYING                = "on.game.statePlaying";
Events.ON_GAME_STATE_ENDING                 = "on.game.stateEnding";
Events.ON_GAME_STATE_CHANGE                 = "on.game.stateChange"
Events.ON_GAME_STATE                        = "on.game.state"
Events.ON_GAME_STATE_TRUE_PLAY              = "on.game.stateTruePlay"
Events.ON_GAME_LOAD_PLAY_DATA               = "on.game.loadPlayData";
Events.ON_GAME_REJOIN                       = "on.game.rejoin";
Events.ON_GAME_SET_LAST_MOVE                = "on.game.setLastMove";
Events.ON_GAME_CLEAN_TURN_ROUTINE_DATA      = "on.game.cleanTurnRoutineData";
Events.ON_GAME_LOAD_DATA_AFTER_SCENE_START  = "on.game.loadDataAfterSceneStart";
Events.ON_GAME_MASTER_CHANGED               = "on.game.masterChanged";

Events.ON_ACTION_EXIT_GAME                  = "on.action.exitGame";
Events.ON_ACTION_LOAD_GAME_GUIDE            = "on.action.loadGameGuide";

Events.SET_INTERACTABLE_PLAY_CONTROL        = "set.interactablePlayControl";
Events.SET_INTERACTABLE_HA_PHOM_CONTROL     = "set.interactableHaPhomControl";
Events.SET_INTERACTABLE_EAT_CONTROL         = "set.interactableEatControl";

Events.ADD_BET_TO_MASTER                    = "add.betToMaster";

Events.XOCDIA_ON_BOARD_UPDATE_PREVIOUS_RESULT_HISTORY   = "xocdia.on.board.update.previous.result.history";
Events.XOCDIA_ON_CONTROL_SAVE_PREVIOUS_BETDATA          = "xocdia.on.control.save.previous.betData";
Events.XOCDIA_ON_DISTRIBUTE_CHIP                        = "xocdia.on.distribute.chip";
Events.XOCDIA_ON_PLAYER_CANCELBET                       = "xocdia.on.player.cancelBet";
Events.XOCDIA_ON_PLAYER_BET                             = "xocdia.on.player.bet";
Events.XOCDIA_ON_PLAYER_TOSSCHIP_ANIMATION              = "xocdia.on.player.tosschip.anim";
Events.XOCDIA_ON_PLAYER_CANCEL_BET_SUCCESS              = "xocdia.on.player.cancel.bet.success";
Events.XOCDIA_ON_PLAYER_GET_CHIP_SUCCESS                = "xocdia.on.player.get.chip.success";
Events.XOCDIA_ON_PLAYER_RECEIVE_CHIP_ANIMATION          = "xocdia.on.player.receive.chip.anim";