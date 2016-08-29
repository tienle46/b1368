/**
 * Created by Thanh on 8/26/2016.
 */

var game = require("game")

game.const.playerState = {}

game.const.playerState.STATE_GENERAL = -2;
game.const.playerState.STATE_ACTION_WAIT = -1;
game.const.playerState.STATE_READY = 100;
game.const.playerState.STATE_UNREADY = 101;
game.const.playerState.STATE_TURNBASE_GET_TURN_WAIT = 0; // trang thai cho den turn noi chung
game.const.playerState.STATE_TURNBASE_PLAY = 1; // trang thai den turn noi chung
game.const.playerState.STATE_TLMN_PLAY_ARRANGE = 2;
game.const.playerState.STATE_BAO_XAM = 4;
game.const.playerState.STATE_LIENG_PLAY_TAT_TAY = 3;
game.const.playerState.STATE_XITO_CHOOSE_FACE_DOWN_CARD = 2;
game.const.playerState.STATE_PHOM_PLAY = game.const.playerState.STATE_TURNBASE_PLAY;
game.const.playerState.STATE_PHOM_EAT_TAKE = 2;
game.const.playerState.STATE_PHOM_DOWN = 3;
game.const.playerState.STATE_PHOM_JOIN = 4;
game.const.playerState.STATE_PHOM_PLAY_HO_U = 5;
game.const.playerState.STATE_BACAY_CHAT_DOWN = 2;
game.const.playerState.STATE_BACAY_CHAT_EMPTY = 3;
game.const.playerState.STATE_MOVE = 3;
//
game.const.INFOTYPE_GENNERAL = 1;
game.const.INFOTYPE_BALANCE_CHANGE = 2;
//
game.const.playerState.WIDTH = 133;
game.const.playerState.HEIGHT = 137;
//
game.const.playerState.DOWN_RANK_ICON_TIME = 10;

game.const.playerState.LEVEL_UP_MOVE_BY_Y = 40;
game.const.playerState.LEVEL_UP_STAR_TAG = 20;