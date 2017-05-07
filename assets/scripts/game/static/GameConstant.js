/**
 * Created by t420 on 11/1/13.
 */

import app from 'app';

app.const.game = {};
app.const.game.board = {};
app.const.game.player = {};
app.const.game.rank = {};
app.const.game.player.state = {};
app.const.game.position = {};
app.const.game.seat = {};

app.const.game.DECK_CARD_SCALE = 0.6;

/**
 * Init Board state
 * @type {{}}
 */
app.const.game.state = {};
app.const.game.state.WAIT = 0;
app.const.game.state.READY = 1;
app.const.game.state.BOARD_STATE_END = 2;
app.const.game.state.BOARD_STATE_TURN_BASE_TRUE_PLAY = 3;
app.const.game.state.BOARD_STATE_ARRANGE_CARD = 4;
app.const.game.state.BOARD_STATE_BAO_XAM = 5;
app.const.game.state.BOARD_STATE_FACE_DOWN = 5;
app.const.game.state.BOARD_STATE_BET = 5;
app.const.game.state.BOARD_STATE_DOWN = 6;
app.const.game.state.BOARD_STATE_SPIN = 6;
app.const.game.state.BOARD_STATE_SHAKE = 7; // xóc đĩa
app.const.game.state.EXPLODING_RING_SPRITE_TAG = 20;
app.const.game.state.TIMELINE_SPRITE_ZORDER = 20;
app.const.game.state.CENTER_Y_PADDING_BOTTOM = 28;
app.const.game.state.ENDING = 2;
app.const.game.state.STATE_BAO_XAM = 5;
app.const.game.state.TURN_BASE_TRUE_PLAY = 3;
app.const.game.state.STATE_FACE_DOWN = 5;
app.const.game.state.STATE_WAIT_TURN = 4;
app.const.game.state.STATE_BET = 5;
app.const.game.state.STATE_DOWN = 6;
app.const.game.state.BOARD_STATE_SPIN = 6;
app.const.game.state.INITED = -1;
app.const.game.state.STATE_WAIT = -2;
app.const.game.state.BEGIN = -3;
app.const.game.state.STARTING = -4;
app.const.game.state.PLAYING = -5;
app.const.game.state.STATE_REJOIN = -6;
app.const.game.state.STARTED = -7;
app.const.game.state.DEAL_CARD = -8;
app.const.game.state.HISTORY_KEYWORD_ENDTIME = "e";
app.const.game.state.HISTORY_KEYWORD_DETAIL = "d";

/**
 * Game Id
 * @type {number}
 */
app.const.game.GAME_PHOM_ID = 0;
app.const.game.GAME_XITO_ID = 1;
app.const.game.GAME_BACAY_ID = 2;
app.const.game.GAME_LIENG_ID = 3;
app.const.game.GAME_TLMN_ID = 4;
app.const.game.GAME_TLMN_MOI_ID = 5;
app.const.game.GAME_TLMN_DEM_LA_ID = 6;
app.const.game.GAME_XAM_ID = 7;
app.const.game.GAME_BAUCUA_ID = 8;
app.const.game.GAME_CUP_ID = 9;
app.const.game.GAME_CTG_ID = 10;
app.const.game.GAME_XGAME = 11;

/**
 *
 * @type {number}
 */
app.const.game.player.INFOTYPE_GENNERAL = 1;
app.const.game.player.INFOTYPE_BALANCE_CHANGE = 2;

/**
 * Player state
 * @type {string[]}
 */
app.const.game.player.state.STATE_GENERAL = -2;
app.const.game.player.state.STATE_ACTION_WAIT = -1;
app.const.game.player.state.STATE_READY = 100;
app.const.game.player.state.STATE_UNREADY = 101;
app.const.game.player.state.STATE_TURNBASE_GET_TURN_WAIT = 0; // trang thai cho den turn noi chung
app.const.game.player.state.STATE_TURNBASE_PLAY = 1; // trang thai den turn noi chung
app.const.game.player.state.STATE_TLMN_PLAY_ARRANGE = 2;
app.const.game.player.state.STATE_BAO_XAM = 4;
app.const.game.player.state.STATE_LIENG_PLAY_TAT_TAY = 3;
app.const.game.player.state.STATE_XITO_CHOOSE_FACE_DOWN_CARD = 2;
app.const.game.player.state.STATE_PHOM_PLAY = app.const.game.player.state.STATE_TURNBASE_PLAY;
app.const.game.player.state.STATE_PHOM_EAT_TAKE = 2;
app.const.game.player.state.STATE_PHOM_DOWN = 3;
app.const.game.player.state.STATE_PHOM_JOIN = 4;
app.const.game.player.state.STATE_PHOM_PLAY_HO_U = 5;
app.const.game.player.state.STATE_BACAY_CHAT_DOWN = 2;
app.const.game.player.state.STATE_BACAY_CHAT_EMPTY = 3;
app.const.game.player.state.STATE_MOVE = 3;
app.const.game.player.state.WIDTH = 133;
app.const.game.player.state.HEIGHT = 137;
app.const.game.player.state.DOWN_RANK_ICON_TIME = 10;
app.const.game.player.state.LEVEL_UP_MOVE_BY_Y = 40;
app.const.game.player.state.LEVEL_UP_STAR_TAG = 20;

/**
 * Game rank
 * @type {{}}
 */
app.const.game.rank.gameRankTypes = [2, 0, 0, 1, 2, 0, 0, 0, 0, 1, 1];
app.const.game.rank.GAME_RANK_TYPE_WIN_LOSE = 0;
app.const.game.rank.GAME_RANK_TYPE_WIN_DRAW_LOSE = 1;
app.const.game.rank.GAME_RANK_TYPE_FIRST_LAST = 2;
app.const.game.rank.GAME_RANK_FIRST = 1;
app.const.game.rank.GAME_RANK_SECOND = 2;
app.const.game.rank.GAME_RANK_THIRD = 3;
app.const.game.rank.GAME_RANK_FOURTH = 4;
app.const.game.rank.GAME_RANK_WIN = 1;
app.const.game.rank.GAME_RANK_DRAW = 2;
app.const.game.rank.GAME_RANK_LOSE = 0;

/**
 * Player Seat
 * @type {number}
 */
app.const.game.seat.SEAT_TYPE_2_PLAYER = 2;
app.const.game.seat.SEAT_TYPE_4_PLAYER = 4;
app.const.game.seat.SEAT_TYPE_4_PLAYER_PHOM = 41;
app.const.game.seat.SEAT_TYPE_5_PLAYER = 5;
app.const.game.seat.SEAT_TYPE_5_PLAYER_XITO = 51;
app.const.game.seat.SEAT_TYPE_6_PLAYER = 6;

app.const.game.gameCodes = [
    "pom",
    "xit",
    "bcy",
    "lie",
    "tln",
    "tnm",
    "tnd",
    "xam",
    "tcc",
    "tds",
    "xms",
    "xga"
];

app.const.game.maxPlayers = {
    "pom": 4,
    "bcy": 9,
    "tnd": 4,
    "xam": 5,
    "xod": 9,
    "tds": 2,
    "xms": 2,
    "default": 2,
};

app.const.game.defaultGroupRoomRole = {};
app.const.game.defaultGroupRoomRole[app.keywords.GROUP_ROOM_MIN_BALANCE] = 0;
app.const.game.defaultGroupRoomRole[app.keywords.GROUP_ROOM_MIN_LEVEL] = 0;
app.const.game.defaultGroupRoomRole[app.keywords.GROUP_ROOM_MAX_BALANCE] = 0;
app.const.game.defaultGroupRoomRole[app.keywords.GROUP_ROOM_MAX_LEVEL] = 0;
app.const.game.defaultGroupRoomRole[app.keywords.GROUP_ROOM_CAPACITY] = 50;

/**
 *
 * @type {number}
 */
app.const.game.DEFAULT_READY_PHASE_DURATION = 20;
app.const.game.DEFAULT_TURN_DURATION = 20;
app.const.game.WIN_STRING_DISPLAY_TIME = 5000;

app.const.game.TLMN_THOI_TYPE_HEO_DEN = 0;
app.const.game.TLMN_THOI_TYPE_HEO_DO = 1;
app.const.game.TLMN_THOI_TYPE_BA_DOI_THONG = 2;
app.const.game.TLMN_THOI_TYPE_TU_QUY = 3;
app.const.game.TLMN_THOI_TYPE_BON_DOI_THONG = 4;
app.const.game.TLMN_THOI_TYPE_BA_BICH = 5;

//    General(0), SAP(1), LIENG(2), DI(3), TINH_DIEM(4)
app.const.game.LIENG_LIENG_TYPE_SAP = 1;
app.const.game.LIENG_LIENG_TYPE_LIENG = 2;
app.const.game.LIENG_LIENG_TYPE_DI = 3;
app.const.game.LIENG_LIENG_TYPE_DIEM = 4;

//UP_BO(0), THUNG_PHA_SANH(1), TU_QUY(2), CU_LU(3), THUNG(4), SANH(5), XAM_CO(6), THU(7), DOI(8), MAU(9);
app.const.game.XAM_XAM_TYPE_THUNG_PHA_SANH = 1;
app.const.game.XAM_XAM_TYPE_TU_QUY = 2;
app.const.game.XAM_XAM_TYPE_CU_LU = 3;
app.const.game.XAM_XAM_TYPE_THUNG = 4;
app.const.game.XAM_XAM_TYPE_SANH = 5;
app.const.game.XAM_XAM_TYPE_XAM_CO = 6;
app.const.game.XAM_XAM_TYPE_THU = 7;
app.const.game.XAM_XAM_TYPE_DOI = 8;
app.const.game.XAM_XAM_TYPE_MAU = 9;

app.const.game.TLMN_CARD_TYPE_SANH_RONG_DONG_HOA = 8
app.const.game.TLMN_CARD_TYPE_SANH_RONG = 7
app.const.game.TLMN_CARD_TYPE_DONG_HOA = 6
app.const.game.TLMN_CARD_TYPE_SAU_DOI_THONG = 5
app.const.game.TLMN_CARD_TYPE_NAM_DOI_THONG = 4
app.const.game.TLMN_CARD_TYPE_SAU_DOI = 3
app.const.game.TLMN_CARD_TYPE_BON_NHOM_BA = 2
app.const.game.TLMN_CARD_TYPE_TU_QUY_HEO = 1

app.const.game.GENERAL_WIN_TYPE_NORMAL = 0;
app.const.game.TLMN_WIN_TYPE_AN_TRANG = 1;
app.const.game.TLMN_WIN_TYPE_LUNG = 2;
app.const.game.TLMN_WIN_TYPE_DUT_BA_BICH = 3;
app.const.game.TLMN_WIN_TYPE_CONG_CA_LANG = 4;
//Start_cuongdm_15032012_Them Thoi ba bich
app.const.game.TLMN_WIN_TYPE_THOI_BA_BICH = 5;
//End_cuongdm_15032012_Thoi ba bich

app.const.game.PHOM_WIN_TYPE_U_THUONG = 1;
app.const.game.PHOM_WIN_TYPE_U_DEN = 2;
app.const.game.PHOM_WIN_TYPE_U_KHAN = 3;
app.const.game.PHOM_WIN_TYPE_U_TRON = 4;
app.const.game.PHOM_WIN_TYPE_U_PHOM_KIN = 5;

//    THANG_XAM(1), DEN_XAM(2), DEN_THOI_HEO(3);
app.const.game.XAM_WIN_TYPE_THANG_XAM = 1;
app.const.game.XAM_WIN_TYPE_DEN_XAM = 2;
app.const.game.XAM_WIN_TYPE_DEN_THOI_HEO = 3;
app.const.game.XAM_WIN_TYPE_AN_TRANG = 4;
//achievement
app.const.game.ACHIEVEMENT_DETAIL_TYPE_TOTAL = 0;
app.const.game.ACHIEVEMENT_DETAIL_TYPE_DAY = 1;
app.const.game.ACHIEVEMENT_DETAIL_TYPE_WEEK = 2;
app.const.game.ACHIEVEMENT_DETAIL_TYPE_MONTH = 3;
app.const.game.ACHIEVEMENT_DETAIL_TYPE_QUARTER = 4;
app.const.game.ACHIEVEMENT_DETAIL_TYPE_YEAR = 5;

//buddy
app.const.game.BUDDY_INVITE_RESULT_CONFIRM = 1;
app.const.game.BUDDY_INVITE_RESULT_CANCEL = 2;
app.const.game.BUDDY_STATE_ONLINE = "Online";
app.const.game.BUDDY_STATE_AVAILABLE = "Available";
app.const.game.BUDDY_STATE_AWAY = "Away";
app.const.game.BUDDY_STATE_BUSY = "Busy";
app.const.game.BUDDY_STATE_INVISIBLE = "Invisible";

//task
app.const.game.TASK_TYPE_DAILY = 1;
app.const.game.TASK_TYPE_EVENT = 2;
app.const.game.TASK_TYPE_GENERAL = 3;
app.const.game.TASK_TYPE_SYSTEM = 4;
app.const.game.TASK_STATUS_NEW = 0;
app.const.game.TASK_STATUS_DOING = 1;
app.const.game.TASK_STATUS_DONE = 2;
app.const.game.TASK_STATUS_FAIL = 3;
app.const.game.TASK_REGISTER_RESULT_SUCCESS = 0;
app.const.game.TASK_REGISTER_RESULT_NOT_FOUND = 1;
app.const.game.TASK_REGISTER_RESULT_NOT_ENOUGH_CONDITIONS = 2;
app.const.game.TASK_REGISTER_RESULT_DONE = 3;
app.const.game.TASK_REGISTER_RESULT_EXPIRY = 4;
app.const.game.TASK_REGISTER_RESULT_REGISTERED = 5;

//store
app.const.game.STORE_NONE = 0;
app.const.game.STORE_AVATAR = 1;
app.const.game.STORE_VATPHAM = 2;
app.const.game.STORE_DAOCU = 3;
app.const.game.STORE_BAOBOI = 4;
app.const.game.STORE_ITEM_EXPIRY_TIME_TYPE_MINUTE = "MI";
app.const.game.STORE_ITEM_EXPIRY_TIME_TYPE_HOUR = "HH";
app.const.game.STORE_ITEM_EXPIRY_TIME_TYPE_DAY = "DD";
app.const.game.STORE_ITEM_EXPIRY_TIME_TYPE_MONTH = "MM";
app.const.game.STORE_ITEM_EXPIRY_TIME_TYPE_YEAR = "YY";

app.const.game.ASSETS_DAOCU_FLOWER = 0;
app.const.game.ASSETS_DAOCU_KISS = 1;
app.const.game.ASSETS_DAOCU_HAMMER = 2;
app.const.game.ASSETS_DAOCU_BEER = 3;
app.const.game.ASSETS_DAOCU_CAKE = 4;
app.const.game.ASSETS_DAOCU_BOMB = 5;

app.const.game.TLMN_THOI_TYPE_HEO_DEN = 0;
app.const.game.TLMN_THOI_TYPE_HEO_DO = 1;
app.const.game.TLMN_THOI_TYPE_BA_DOI_THONG = 2;
app.const.game.TLMN_THOI_TYPE_TU_QUY = 3;
app.const.game.TLMN_THOI_TYPE_BON_DOI_THONG = 4;
app.const.game.TLMN_THOI_TYPE_BA_BICH = 5;

app.const.game.GAME_TYPE_GENERAL = 0;
app.const.game.GAME_TYPE_TIENLEN = 1;
app.const.game.GAME_TYPE_PHOM = 2;
app.const.game.GAME_TYPE_XAM = 3;
app.const.game.GAME_TYPE_SPECIAL_XAM = 4;
app.const.game.GAME_TYPE_CO = 5;
app.const.game.GAME_TYPE_POKER = 6;
app.const.game.GAME_TYPE_MAU_BINH = 7;