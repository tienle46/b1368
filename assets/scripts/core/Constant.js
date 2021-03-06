/**
 * Created by Thanh on 9/1/2016.
 */

var app = require('app');

app.const = {};

app.const.MAX_INT = 2147483647
app.const.MIN_INT = -2147483647

app.const.LOADING_SHORT_DURATION = 15;
app.const.LOADING_MEDIUM_DURATION = 30;
app.const.LOADING_LONG_DURATION = 60;

app.const.dialogZIndex = 9999;
app.const.topupZIndex = 10000;
app.const.loadingZIndex = 10000;
app.const.toastZIndex = 10001;
app.const.soundControl = 10002;
app.const.popupZIndex = 10003;
app.const.LANGUAGE = "vi"; // set the language used in app. Default: "vi"

app.const.DIALOG_DIR_PREFAB = "dashboard/dialog/prefabs";
app.const.EXCHANGE_LIST_CARD_TYPE_ID = 1;
app.const.EXCHANGE_LIST_ITEM_TYPE_ID = 2;

app.const.USER_LOCAL_STORAGE = "userInfo";
app.const.IAP_LOCAL_STORAGE = "iapItems";

app.const.scene = {};
app.const.scene.ENTRANCE_SCENE = "EntranceScene";
app.const.scene.LOGIN_SCENE = "LoginScene";
app.const.scene.REGISTER_SCENE = "RegisterScene";
app.const.scene.DASHBOARD_SCENE = "DashboardScene";
app.const.scene.GAME_SCENE = "GameScene";
app.const.scene.LIST_TABLE_SCENE = "ListTableScene";
app.const.scene.BOTTOM_BAR = "BottomBar";
app.const.scene.EXCHANGE_CHIP = "ExchangeChip";

app.const.gameCode = {};
app.const.gameCode.PHOM = 'pom';
app.const.gameCode.TLMNDL = 'tnd';
app.const.gameCode.TLMN = 'tln';
app.const.gameCode.TLMNM = 'tnm';
app.const.gameCode.XITO = 'xit';
app.const.gameCode.BA_CAY = 'bcy';
app.const.gameCode.LIENG = 'lie';
app.const.gameCode.XAM = 'xam';
app.const.gameCode.BAU_CUA = 'tcc';
app.const.gameCode.TLMNDL_SOLO = 'tds';
app.const.gameCode.XAM_SOLO = 'xms';
app.const.gameCode.ALL = 'xga';
app.const.gameCode.XOC_DIA = 'xod';
app.const.gameCode.TAI_XIU = 'gtx';


app.const.gameLabels = {
    [app.const.gameCode.PHOM]: 'Phỏm',
    [app.const.gameCode.TLMNDL]: 'TLMN',
    [app.const.gameCode.TLMNDL_SOLO]: 'TLMN-Solo',
    [app.const.gameCode.TLMN]: 'TLMN',
    [app.const.gameCode.TLMNM]: 'TLMN Mới',
    [app.const.gameCode.XITO]: 'Xì Tố',
    [app.const.gameCode.XAM]: 'Sâm',
    [app.const.gameCode.XAM_SOLO]: 'Sâm-Solo',
    [app.const.gameCode.BA_CAY]: 'Ba Cây',
    [app.const.gameCode.LIENG]: 'Liêng',
    [app.const.gameCode.BAU_CUA]: 'Bầu Cua',
    [app.const.gameCode.ALL]: 'B1368',
    [app.const.gameCode.XOC_DIA]: 'Xóc Đĩa',
    [app.const.gameCode.TAI_XIU]: 'Tài Xỉu'
};

/**
 * System message type
 * @type {number}
 */
app.const.SYSTEM_MESSAGE_TYPE_TICKER = 1;
app.const.SYSTEM_MESSAGE_TYPE_POPUP = 0;
app.const.SYSTEM_MESSAGE_TYPE_ACTIVITY = 2;

/**
 * ========================== SCROLL EVENT TYPES ========================== 
 */
app.const.SCROLL_EVENT = {};
app.const.SCROLL_EVENT.SCROLL_TO_TOP = 0;
app.const.SCROLL_EVENT.SCROLL_TO_BOTTOM = 1;
app.const.SCROLL_EVENT.SCROLL_TO_LEFT = 2;
app.const.SCROLL_EVENT.SCROLL_TO_RIGHT = 3;
app.const.SCROLL_EVENT.SCROLLING = 4;
app.const.SCROLL_EVENT.BOUNCE_TOP = 5;
app.const.SCROLL_EVENT.BOUNCE_BOTTOM = 6;
app.const.SCROLL_EVENT.BOUNCE_LEFT = 7;
app.const.SCROLL_EVENT.BOUNCE_RIGHT = 8;
app.const.SCROLL_EVENT.AUTO_SCROLL_ENDED = 9; // while we pull scroll bar over ended edge
app.const.SCROLL_EVENT.TOUCH_ENDED = 10; // touch ended


/**
 * ========================== MENU TYPES && ARROW DIRECTIONS ========================== 
 */
app.const.MENU = {};

app.const.MENU.TYPE = {};
app.const.MENU.TYPE.VERTICAL = 0;
app.const.MENU.TYPE.HORIZONTAL = 1;

app.const.MENU.ARROW_DIRECTION = {};
app.const.MENU.ARROW_DIRECTION.UP = 0;
app.const.MENU.ARROW_DIRECTION.LEFT = 1;
app.const.MENU.ARROW_DIRECTION.RIGHT = 2;
app.const.MENU.ARROW_DIRECTION.DOWN = 3;


/**
 * ========================== ELEMENT TYPE (LIST ITEM BASIC)========================== 
 */
app.const.LIST_ITEM = {};

app.const.LIST_ITEM.TYPE = {};
app.const.LIST_ITEM.TYPE.LABEL = 'label';
app.const.LIST_ITEM.TYPE.IMAGE = 'image';
app.const.LIST_ITEM.TYPE.BUTTON = 'button';


/**
 * =============================================== 
 *  DYNAMIC_ACTION && DYNAMIC_GROUP 
 * =============================================== 
 */
app.const.DYNAMIC_ACTION_BROWSE = 1;
app.const.DYNAMIC_ACTION_OTHER = 2;
app.const.DYNAMIC_ACTION_INFO = 3;
app.const.DYNAMIC_GROUP_NEW_EVENT = 1;

app.const.DYNAMIC_GROUP_ENTERTAINMENT = 2;
app.const.DYNAMIC_GROUP_LEADER_BOARD = 3;
app.const.DYNAMIC_GROUP_NOTIFY = 4;
app.const.DYNAMIC_GROUP_SYSTEM_MESSAGE = 5;
app.const.DYNAMIC_GROUP_INTRODUCTION = 6;
app.const.DYNAMIC_NODE_TYPE_ITEM = 1;
app.const.DYNAMIC_NODE_TYPE_DETAIL = 2;
app.const.DYNAMIC_NODE_TYPE_USER = 3;

// ============================ COLORS ============================
app.const.COLOR_YELLOW = new cc.Color(246, 213, 51);
app.const.HX_COLOR_YELLOW = cc.colorToHex(app.const.COLOR_YELLOW); //'#F6FF29';
app.const.COLOR_VIOLET = new cc.Color(68, 25, 97);
app.const.COLOR_WHITE = new cc.Color(255, 255, 255);
app.const.HX_COLOR_WHITE = cc.colorToHex(app.const.COLOR_WHITE); //'#ffffff';
app.const.COLOR_RED = new cc.Color(255, 0, 0);
app.const.COLOR_ORANGE = new cc.Color(255, 155, 0);
app.const.COLOR_GREEN = new cc.Color(100, 173, 45);
app.const.COLOR_BLACK = new cc.Color(0, 0, 0);
app.const.COLOR_GRAY = new cc.Color(174, 174, 174);

app.const.adminMessage = {};
app.const.adminMessage.TOAST = 0;
app.const.adminMessage.LACK_OF_MONEY = 1;
app.const.adminMessage.REWARD = 2;
app.const.adminMessage.CPI = 3;
app.const.adminMessage.MANUAL_DISMISS = 4;
app.const.adminMessage.ALERT = 5;
app.const.adminMessage.DAILY_LOGIN_MISSION = 11;
app.const.adminMessage.TOPUP_SUCCESSFULLY = 12;
app.const.adminMessage.REGISTER_BONUS = 14;
app.const.adminMessage.KICK_MESSAGE = 16;

app.const.NUMBER_MESSAGES_KEEP_INGAME = 30;
app.const.NUMBER_MESSAGES_KEEP_PER_BUDDY = 30;


/**
 * =============================================== 
 *  ACTION CODES
 * =============================================== 
 */
app.const.ACTION_CODES = ['CASH', 'TRANSFER', 'TOPUP', 'TOPUP_CARD', 'TOPUP_SMS', 'TOPUP_IAP', 'EVENT', 'BUDDY', 'BANK', 'GIFT_CODE', 'SYSTEM_MESSAGE', 'PERSONAL_MESSAGE', 'EXCHANGE', 'EXCHANGE_CARD', 'EXCHANGE_ITEM', 'EXCHANGE_HISTORY', 'BUDDY_CHAT', 'FEEDBACK', 'FANPAGE', 'WEBSITE', 'TOP_VIP', 'TOP_CAO_THU', 'TOP_DAI_GIA', 'AGENT', 'TOPUP_HISTORY', 'PERSONAL_INFO', 'PLAYER_INFO', 'PERSONAL_STATISTIC', 'PLAY_GAME'];