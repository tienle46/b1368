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

/**
 * Init Board state
 * @type {{}}
 */
app.const.game.board.state = {};
app.const.game.board.state.READY = 1;
app.const.game.board.state.BOARD_STATE_END = 2;
app.const.game.board.state.BOARD_STATE_TURN_BASE_TRUE_PLAY = 3;
app.const.game.board.state.BOARD_STATE_ARRANGE_CARD = 4;
app.const.game.board.state.BOARD_STATE_BAO_XAM = 5;
app.const.game.board.state.BOARD_STATE_FACE_DOWN = 5;
app.const.game.board.state.BOARD_STATE_BET = 5;
app.const.game.board.state.BOARD_STATE_DOWN = 6;
app.const.game.board.state.BOARD_STATE_SPIN = 6;
app.const.game.board.state.EXPLODING_RING_SPRITE_TAG = 20;
app.const.game.board.state.TIMELINE_SPRITE_ZORDER = 20;
app.const.game.board.state.CENTER_Y_PADDING_BOTTOM = 28;
app.const.game.board.state.ENDING = 2;
app.const.game.board.state.STATE_BAO_XAM = 5;
app.const.game.board.state.TURN_BASE_TRUE_PLAY = 3;
app.const.game.board.state.STATE_FACE_DOWN = 5;
app.const.game.board.state.STATE_WAIT_TURN = 4;
app.const.game.board.state.STATE_BET = 5;
app.const.game.board.state.STATE_DOWN = 6;
app.const.game.board.state.BOARD_STATE_SPIN = 6;
app.const.game.board.state.INITED = -1;
app.const.game.board.state.STATE_WAIT = -2;
app.const.game.board.state.BEGIN = -3;
app.const.game.board.state.STARTING = -4;
app.const.game.board.state.PLAYING = -5;
app.const.game.board.state.STATE_REJOIN = -6;
app.const.game.board.state.STARTED = -7;
app.const.game.board.state.DEAL_CARD = -8;
app.const.game.board.state.HISTORY_KEYWORD_ENDTIME = "e";
app.const.game.board.state.HISTORY_KEYWORD_DETAIL = "d";

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

app.const.game.rank.getRankString = function(rankType, rank) {
    var retString = "";
    switch (rankType) {
        case app.const.game.rank.GAME_RANK_TYPE_WIN_DRAW_LOSE:
        case app.const.game.rank.GAME_RANK_TYPE_WIN_LOSE:
            if (rank == 1) {
                retString = "Thắng";
            } else if (rank == 2) {
                retString = "Hòa";
            } else if (rank == 0) {
                retString = "Thua";
            }
            break;
        case app.const.game.rank.GAME_RANK_TYPE_FIRST_LAST:
            if (rank == app.const.game.rank.GAME_RANK_FIRST) {
                retString = "Nhất";
            } else if (rank == app.const.game.rank.GAME_RANK_SECOND) {
                retString = "Nhì";
            } else if (rank == app.const.game.rank.GAME_RANK_THIRD) {
                retString = "Ba";
            } else if (rank == app.const.game.rank.GAME_RANK_FOURTH) {
                retString = "Bét";
            }
            break;
        default:
            break;

    }
    return retString;
};

app.const.game.gameMenuString = [
        "Phỏm", "Xì tố", "Ba cây", "Liêng",
        "Tiến lên MN", "TLMN Kiểu Mới", "TLMN Đếm lá", "Xâm",
        "Bầu cua", "Cờ úp", " Cờ Tướng"];

app.const.game.gameMenuStringShort = [
        "Phỏm", "Xì tố", "Ba cây", "Liêng",
        "TLMN", "TLMN Mới", "TLMN Đếm lá", "Xâm",
        "Bầu cua", "Cờ úp", " Cờ Tướng"];

app.const.game.gameServiceString = {
    "pom": app.const.game.GAME_PHOM_ID,
    "xit": app.const.game.GAME_XITO_ID,
    "bcy": app.const.game.GAME_BACAY_ID,
    "lie": app.const.game.GAME_LIENG_ID,
    "tln": app.const.game.GAME_TLMN_ID,
    "tnm": app.const.game.GAME_TLMN_MOI_ID,
    "tnd": app.const.game.GAME_TLMN_DEM_LA_ID,
    "xam": app.const.game.GAME_XAM_ID,
    "tcc": app.const.game.GAME_BAUCUA_ID,
    "cup": app.const.game.GAME_CUP_ID,
    "ctg": app.const.game.GAME_CTG_ID,
    "xga": app.const.game.GAME_XGAME
};

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
    "cup",
    "ctg",
    "xga"
];

app.const.game.gameTableSeatType = [
        4, 5, 6, 6,
        4, 4, 4, 5,
        6, 2, 2, null
        //4, /*6, 6, 6*/
];

app.const.game.gameCardHandCardsFocusable = [
        true, false, true, false,
        true, true, true, true,
        false, false, false, false
        //true
];

app.const.game.gameDefaultHandCardsSize = [
        9,2,3,3,
        13,13,13,10,
        0,0,0,0,13
];

app.const.game.gameIsTurnBase = [
        true, true, false, true,
        true, true, true, true,
        false, false, false, false,
        //false
];


app.const.game.showHandCardWhenPlaying = [
        false, true, true, true,
        true, false, false, false,
        false, false , false, false,
        //false
];

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

app.const.game.getTLMNThoiString = function(thoiType){
    switch (thoiType) {
        case app.const.game.TLMN_THOI_TYPE_HEO_DEN:
            return "Heo đen";
        case app.const.game.TLMN_THOI_TYPE_HEO_DO:
            return "Heo đỏ";
        case app.const.game.TLMN_THOI_TYPE_BA_DOI_THONG:
            return "Ba đôi thông";
        case app.const.game.TLMN_THOI_TYPE_TU_QUY:
            return "Tứ quý";
        case app.const.game.TLMN_THOI_TYPE_BON_DOI_THONG:
            return "Bốn đôi thông";
        case app.const.game.TLMN_THOI_TYPE_BA_BICH:
            return "Thối Ba Bích";
    }
};

app.const.game.getTLMNFirstRankSpecialString = function(winType) {
    var retString = "";
    switch (winType) {
        case app.const.game.TLMN_WIN_TYPE_AN_TRANG:
            retString = "Ăn trắng";
            break;
        case app.const.game.TLMN_WIN_TYPE_LUNG:
            retString = "Lũng";
            break;
        case app.const.game.TLMN_WIN_TYPE_DUT_BA_BICH:
            retString = "Đút 3 bích";
            break;
        case app.const.game.TLMN_WIN_TYPE_CONG_CA_LANG:
            retString = "Cóng cả làng";
            break;
        default:
            break;
    }
    return retString;
};


app.const.game.getPhomFirstRankSpecialString = function(winType) {
    var retString = "";
    switch (winType) {
        case app.const.game.PHOM_WIN_TYPE_U_THUONG:
            retString = " Ù ";
            break;
        case app.const.game.PHOM_WIN_TYPE_U_DEN:
            retString = "Ù đền";
            break;
        case app.const.game.PHOM_WIN_TYPE_U_KHAN:
            retString = "Ù khan";
            break;
        case app.const.game.PHOM_WIN_TYPE_U_TRON:
            retString = "Ù tròn";
            break;
        case app.const.game.PHOM_WIN_TYPE_U_PHOM_KIN:
            retString = "Ù phỏm kín";
            break;
        default:
            break;
    }
    return retString;
};


app.const.game.getXamSpecialString = function(winType) {
    var retString = "";
    switch (winType) {
        case app.const.game.XAM_WIN_TYPE_DEN_XAM:
            retString = "Đền Xâm";
            break;
        case app.const.game.XAM_WIN_TYPE_DEN_THOI_HEO:
            retString = "Đền Thối Heo";
            break;
        case app.const.game.XAM_WIN_TYPE_THANG_XAM:
            retString = "Thắng Xâm";
            break;
        default:
            break;
    }
    return retString;
};

app.const.game.getXiToSpecialString = function (xitoType) {
    var retString = "";
    switch (xitoType) {
        case app.const.game.XAM_XAM_TYPE_THUNG_PHA_SANH:
            retString = app.const.game.MESSAGE_XITO_THUNG_PHA_SANH;
            break;
        case app.const.game.XAM_XAM_TYPE_TU_QUY:
            retString = app.const.game.MESSAGE_XITO_TU_QUY;
            break;
        case app.const.game.XAM_XAM_TYPE_CU_LU:
            retString = app.const.game.MESSAGE_XITO_CU_LU;
            break;
        case app.const.game.XAM_XAM_TYPE_THUNG:
            retString = app.const.game.MESSAGE_XITO_THUNG;
            break;
        case app.const.game.XAM_XAM_TYPE_SANH:
            retString = app.const.game.MESSAGE_XITO_SANH;
            break;
        case app.const.game.XAM_XAM_TYPE_XAM_CO:
            retString = app.const.game.MESSAGE_XITO_XAM_CO;
            break;
        case app.const.game.XAM_XAM_TYPE_THU:
            retString = app.const.game.MESSAGE_XITO_THU;
            break;
        case app.const.game.XAM_XAM_TYPE_DOI:
            retString = app.const.game.MESSAGE_XITO_DOI;
            break;
        case app.const.game.XAM_XAM_TYPE_MAU:
            retString = app.const.game.MESSAGE_XITO_MAU;
            break;
        default:
            break;
    }
    return retString;
};

app.const.game.getTLMNThoiString = function(thoiType) {
    var retString = "";
    switch (thoiType) {
        case app.const.game.TLMN_THOI_TYPE_HEO_DEN:
            retString = "Heo đen";
            break;
        case app.const.game.TLMN_THOI_TYPE_HEO_DO:
            retString = "Heo đỏ";
            break;
        case app.const.game.TLMN_THOI_TYPE_BA_DOI_THONG:
            retString = "Ba đôi thông";
            break;
        case app.const.game.TLMN_THOI_TYPE_TU_QUY:
            retString = "Tứ quý";
            break;
        case app.const.game.TLMN_THOI_TYPE_BON_DOI_THONG:
            retString = "Bốn đôi thông";
            break;
        case app.const.game.TLMN_THOI_TYPE_BA_BICH:
            retString = "Ba Bích";
            break;
        default:
            break;
    }
    return retString;
};

app.const.game.getLiengSpecialString = function(liengType) {
    var retString = "";
    switch (liengType) {
        case app.const.game.LIENG_LIENG_TYPE_SAP:
            retString = app.const.game.getMessage(app.const.game.INFOR_SAP);
            break;
        case app.const.game.LIENG_LIENG_TYPE_LIENG:
            retString = app.const.game.getMessage(app.const.game.INFOR_LIENG);
            break;
        case app.const.game.LIENG_LIENG_TYPE_DI:
            retString = app.const.game.getMessage(app.const.game.INFOR_DI);
            break;
        case app.const.game.LIENG_LIENG_TYPE_DIEM:
            retString = app.const.game.getMessage(app.const.game.INFOR_DO_DIEM);
            break;
        default:
            break;
    }
    return retString;
};
