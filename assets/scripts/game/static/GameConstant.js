/**
 * Created by t420 on 11/1/13.
 */

var game = require("game")

game.const.SYSTEM_MESSAGE_TYPE_TICKER = 1;
game.const.SYSTEM_MESSAGE_TYPE_POPUP = 0;
game.const.SYSTEM_MESSAGE_TYPE_ACTIVITY = 2;

game.const.GAME_PHOM_ID = 0;
game.const.GAME_XITO_ID = 1;
game.const.GAME_BACAY_ID = 2;
game.const.GAME_LIENG_ID = 3;
game.const.GAME_TLMN_ID = 4;
game.const.GAME_TLMN_MOI_ID = 5;
game.const.GAME_TLMN_DEM_LA_ID = 6;
game.const.GAME_XAM_ID = 7;
game.const.GAME_BAUCUA_ID = 8;
game.const.GAME_CUP_ID = 9;
game.const.GAME_CTG_ID = 10;
game.const.GAME_XGAME = 11;

game.const.DEFAULT_READY_PHASE_DURATION = 20;
game.const.DEFAULT_TURN_DURATION = 20;
game.const.WIN_STRING_DISPLAY_TIME = 5000;
game.const.gameMenuString = [
        "Phỏm", "Xì tố", "Ba cây", "Liêng",
        "Tiến lên MN", "TLMN Kiểu Mới", "TLMN Đếm lá", "Xâm",
        "Bầu cua", "Cờ úp", " Cờ Tướng"];

game.const.gameMenuStringShort = [
        "Phỏm", "Xì tố", "Ba cây", "Liêng",
        "TLMN", "TLMN Mới", "TLMN Đếm lá", "Xâm",
        "Bầu cua", "Cờ úp", " Cờ Tướng"];

game.const.gameServiceString = {
    "pom": game.const.GAME_PHOM_ID,
    "xit": game.const.GAME_XITO_ID,
    "bcy": game.const.GAME_BACAY_ID,
    "lie": game.const.GAME_LIENG_ID,
    "tln": game.const.GAME_TLMN_ID,
    "tnm": game.const.GAME_TLMN_MOI_ID,
    "tnd": game.const.GAME_TLMN_DEM_LA_ID,
    "xam": game.const.GAME_XAM_ID,
    "tcc": game.const.GAME_BAUCUA_ID,
    "cup": game.const.GAME_CUP_ID,
    "ctg": game.const.GAME_CTG_ID,
    "xga": game.const.GAME_XGAME
};

game.const.gameCodes = [
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



game.const.gameTableSeatType = [
        4, 5, 6, 6,
        4, 4, 4, 5,
        6, 2, 2, null
        //4, /*6, 6, 6*/
];



game.const.gameCardHandCardsFocusable = [
        true, false, true, false,
        true, true, true, true,
        false, false, false, false
        //true
];

game.const.gameDefaultHandCardsSize = [
        9,2,3,3,
        13,13,13,10,
        0,0,0,0,13
];


game.const.gameIsTurnBase = [
        true, true, false, true,
        true, true, true, true,
        false, false, false, false,
        //false
];


game.const.showHandCardWhenPlaying = [
        false, true, true, true,
        true, false, false, false,
        false, false , false, false,
        //false
];



game.const.defaultGroupRoomRole = {};
game.const.defaultGroupRoomRole[game.keywords.GROUP_ROOM_MIN_BALANCE] = 0;
game.const.defaultGroupRoomRole[game.keywords.GROUP_ROOM_MIN_LEVEL] = 0;
game.const.defaultGroupRoomRole[game.keywords.GROUP_ROOM_MAX_BALANCE] = 0;
game.const.defaultGroupRoomRole[game.keywords.GROUP_ROOM_MAX_LEVEL] = 0;
game.const.defaultGroupRoomRole[game.keywords.GROUP_ROOM_CAPACITY] = 50;

//achievement
game.const.ACHIEVEMENT_DETAIL_TYPE_TOTAL = 0;
game.const.ACHIEVEMENT_DETAIL_TYPE_DAY = 1;
game.const.ACHIEVEMENT_DETAIL_TYPE_WEEK = 2;
game.const.ACHIEVEMENT_DETAIL_TYPE_MONTH = 3;
game.const.ACHIEVEMENT_DETAIL_TYPE_QUARTER = 4;
game.const.ACHIEVEMENT_DETAIL_TYPE_YEAR = 5;

//buddy
game.const.BUDDY_INVITE_RESULT_CONFIRM = 1;
game.const.BUDDY_INVITE_RESULT_CANCEL = 2;
game.const.BUDDY_STATE_ONLINE = "Online";
game.const.BUDDY_STATE_AVAILABLE = "Available";
game.const.BUDDY_STATE_AWAY = "Away";
game.const.BUDDY_STATE_BUSY = "Busy";
game.const.BUDDY_STATE_INVISIBLE = "Invisible";

//task
game.const.TASK_TYPE_DAILY = 1;
game.const.TASK_TYPE_EVENT = 2;
game.const.TASK_TYPE_GENERAL = 3;
game.const.TASK_TYPE_SYSTEM = 4;
game.const.TASK_STATUS_NEW = 0;
game.const.TASK_STATUS_DOING = 1;
game.const.TASK_STATUS_DONE = 2;
game.const.TASK_STATUS_FAIL = 3;
game.const.TASK_REGISTER_RESULT_SUCCESS = 0;
game.const.TASK_REGISTER_RESULT_NOT_FOUND = 1;
game.const.TASK_REGISTER_RESULT_NOT_ENOUGH_CONDITIONS = 2;
game.const.TASK_REGISTER_RESULT_DONE = 3;
game.const.TASK_REGISTER_RESULT_EXPIRY = 4;
game.const.TASK_REGISTER_RESULT_REGISTERED = 5;

//store
game.const.STORE_NONE = 0;
game.const.STORE_AVATAR = 1;
game.const.STORE_VATPHAM = 2;
game.const.STORE_DAOCU = 3;
game.const.STORE_BAOBOI = 4;
game.const.STORE_ITEM_EXPIRY_TIME_TYPE_MINUTE = "MI";
game.const.STORE_ITEM_EXPIRY_TIME_TYPE_HOUR = "HH";
game.const.STORE_ITEM_EXPIRY_TIME_TYPE_DAY = "DD";
game.const.STORE_ITEM_EXPIRY_TIME_TYPE_MONTH = "MM";
game.const.STORE_ITEM_EXPIRY_TIME_TYPE_YEAR = "YY";

game.const.ASSETS_DAOCU_FLOWER = 0;
game.const.ASSETS_DAOCU_KISS = 1;
game.const.ASSETS_DAOCU_HAMMER = 2;
game.const.ASSETS_DAOCU_BEER = 3;
game.const.ASSETS_DAOCU_CAKE = 4;
game.const.ASSETS_DAOCU_BOMB = 5;

game.const.TLMN_THOI_TYPE_HEO_DEN = 0;
game.const.TLMN_THOI_TYPE_HEO_DO = 1;
game.const.TLMN_THOI_TYPE_BA_DOI_THONG = 2;
game.const.TLMN_THOI_TYPE_TU_QUY = 3;
game.const.TLMN_THOI_TYPE_BON_DOI_THONG = 4;
game.const.TLMN_THOI_TYPE_BA_BICH = 5;

game.const.getTLMNThoiString = function(thoiType){
    switch (thoiType) {
        case game.const.TLMN_THOI_TYPE_HEO_DEN:
            return "Heo đen";
        case game.const.TLMN_THOI_TYPE_HEO_DO:
            return "Heo đỏ";
        case game.const.TLMN_THOI_TYPE_BA_DOI_THONG:
            return "Ba đôi thông";
        case game.const.TLMN_THOI_TYPE_TU_QUY:
            return "Tứ quý";
        case game.const.TLMN_THOI_TYPE_BON_DOI_THONG:
            return "Bốn đôi thông";
        case game.const.TLMN_THOI_TYPE_BA_BICH:
            return "Thối Ba Bích";
    }
};

/**
 * Created by t420 on 11/1/13.
 */

var game = require("game")

game.const.GENERAL_WIN_TYPE_NORMAL = 0;

game.const.TLMN_WIN_TYPE_AN_TRANG = 1;
game.const.TLMN_WIN_TYPE_LUNG = 2;
game.const.TLMN_WIN_TYPE_DUT_BA_BICH = 3;
game.const.TLMN_WIN_TYPE_CONG_CA_LANG = 4;
//Start_cuongdm_15032012_Them Thoi ba bich
game.const.TLMN_WIN_TYPE_THOI_BA_BICH = 5;
//End_cuongdm_15032012_Thoi ba bich

game.const.PHOM_WIN_TYPE_U_THUONG = 1;
game.const.PHOM_WIN_TYPE_U_DEN = 2;
game.const.PHOM_WIN_TYPE_U_KHAN = 3;
game.const.PHOM_WIN_TYPE_U_TRON = 4;
game.const.PHOM_WIN_TYPE_U_PHOM_KIN = 5;

//    THANG_XAM(1), DEN_XAM(2), DEN_THOI_HEO(3);
game.const.XAM_WIN_TYPE_THANG_XAM = 1;
game.const.XAM_WIN_TYPE_DEN_XAM = 2;
game.const.XAM_WIN_TYPE_DEN_THOI_HEO = 3;


game.const.getTLMNFirstRankSpecialString = function(winType) {
    var retString = "";
    switch (winType) {
        case game.const.TLMN_WIN_TYPE_AN_TRANG:
            retString = "Ăn trắng";
            break;
        case game.const.TLMN_WIN_TYPE_LUNG:
            retString = "Lũng";
            break;
        case game.const.TLMN_WIN_TYPE_DUT_BA_BICH:
            retString = "Đút 3 bích";
            break;
        case game.const.TLMN_WIN_TYPE_CONG_CA_LANG:
            retString = "Cóng cả làng";
            break;
        default:
            break;
    }
    return retString;
};


game.const.getPhomFirstRankSpecialString = function(winType) {
    var retString = "";
    switch (winType) {
        case game.const.PHOM_WIN_TYPE_U_THUONG:
            retString = " Ù ";
            break;
        case game.const.PHOM_WIN_TYPE_U_DEN:
            retString = "Ù đền";
            break;
        case game.const.PHOM_WIN_TYPE_U_KHAN:
            retString = "Ù khan";
            break;
        case game.const.PHOM_WIN_TYPE_U_TRON:
            retString = "Ù tròn";
            break;
        case game.const.PHOM_WIN_TYPE_U_PHOM_KIN:
            retString = "Ù phỏm kín";
            break;
        default:
            break;
    }
    return retString;
};


game.const.getXamSpecialString = function(winType) {
    var retString = "";
    switch (winType) {
        case game.const.XAM_WIN_TYPE_DEN_XAM:
            retString = "Đền Xâm";
            break;
        case game.const.XAM_WIN_TYPE_DEN_THOI_HEO:
            retString = "Đền Thối Heo";
            break;
        case game.const.XAM_WIN_TYPE_THANG_XAM:
            retString = "Thắng Xâm";
            break;
        default:
            break;
    }
    return retString;
};

game.const.TLMN_THOI_TYPE_HEO_DEN = 0;
game.const.TLMN_THOI_TYPE_HEO_DO = 1;
game.const.TLMN_THOI_TYPE_BA_DOI_THONG = 2;
game.const.TLMN_THOI_TYPE_TU_QUY = 3;
game.const.TLMN_THOI_TYPE_BON_DOI_THONG = 4;
game.const.TLMN_THOI_TYPE_BA_BICH = 5;

//    General(0), SAP(1), LIENG(2), DI(3), TINH_DIEM(4)
game.const.LIENG_LIENG_TYPE_SAP = 1;
game.const.LIENG_LIENG_TYPE_LIENG = 2;
game.const.LIENG_LIENG_TYPE_DI = 3;
game.const.LIENG_LIENG_TYPE_DIEM = 4;

//    UP_BO(0), THUNG_PHA_SANH(1), TU_QUY(2), CU_LU(3), THUNG(4), SANH(5), XAM_CO(6), THU(7), DOI(8), MAU(9);
game.const.XAM_XAM_TYPE_THUNG_PHA_SANH = 1;
game.const.XAM_XAM_TYPE_TU_QUY = 2;
game.const.XAM_XAM_TYPE_CU_LU = 3;
game.const.XAM_XAM_TYPE_THUNG = 4;
game.const.XAM_XAM_TYPE_SANH = 5;
game.const.XAM_XAM_TYPE_XAM_CO = 6;
game.const.XAM_XAM_TYPE_THU = 7;
game.const.XAM_XAM_TYPE_DOI = 8;
game.const.XAM_XAM_TYPE_MAU = 9;

game.const.getXiToSpecialString = function (xitoType) {
    var retString = "";
    switch (xitoType) {
        case game.const.XAM_XAM_TYPE_THUNG_PHA_SANH:
            retString = game.const.MESSAGE_XITO_THUNG_PHA_SANH;
            break;
        case game.const.XAM_XAM_TYPE_TU_QUY:
            retString = game.const.MESSAGE_XITO_TU_QUY;
            break;
        case game.const.XAM_XAM_TYPE_CU_LU:
            retString = game.const.MESSAGE_XITO_CU_LU;
            break;
        case game.const.XAM_XAM_TYPE_THUNG:
            retString = game.const.MESSAGE_XITO_THUNG;
            break;
        case game.const.XAM_XAM_TYPE_SANH:
            retString = game.const.MESSAGE_XITO_SANH;
            break;
        case game.const.XAM_XAM_TYPE_XAM_CO:
            retString = game.const.MESSAGE_XITO_XAM_CO;
            break;
        case game.const.XAM_XAM_TYPE_THU:
            retString = game.const.MESSAGE_XITO_THU;
            break;
        case game.const.XAM_XAM_TYPE_DOI:
            retString = game.const.MESSAGE_XITO_DOI;
            break;
        case game.const.XAM_XAM_TYPE_MAU:
            retString = game.const.MESSAGE_XITO_MAU;
            break;
        default:
            break;
    }
    return retString;
};





game.const.getTLMNThoiString = function(thoiType) {
    var retString = "";
    switch (thoiType) {
        case game.const.TLMN_THOI_TYPE_HEO_DEN:
            retString = "Heo đen";
            break;
        case game.const.TLMN_THOI_TYPE_HEO_DO:
            retString = "Heo đỏ";
            break;
        case game.const.TLMN_THOI_TYPE_BA_DOI_THONG:
            retString = "Ba đôi thông";
            break;
        case game.const.TLMN_THOI_TYPE_TU_QUY:
            retString = "Tứ quý";
            break;
        case game.const.TLMN_THOI_TYPE_BON_DOI_THONG:
            retString = "Bốn đôi thông";
            break;
        case game.const.TLMN_THOI_TYPE_BA_BICH:
            retString = "Ba Bích";
            break;
        default:
            break;
    }
    return retString;
};





game.const.getLiengSpecialString = function(liengType) {
    var retString = "";
    switch (liengType) {
        case game.const.LIENG_LIENG_TYPE_SAP:
            retString = game.const.getMessage(game.const.INFOR_SAP);
            break;
        case game.const.LIENG_LIENG_TYPE_LIENG:
            retString = game.const.getMessage(game.const.INFOR_LIENG);
            break;
        case game.const.LIENG_LIENG_TYPE_DI:
            retString = game.const.getMessage(game.const.INFOR_DI);
            break;
        case game.const.LIENG_LIENG_TYPE_DIEM:
            retString = game.const.getMessage(game.const.INFOR_DO_DIEM);
            break;
        default:
            break;
    }
    return retString;
};
