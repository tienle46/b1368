/**
 * Created by Thanh on 9/1/2016.
 */

var app = require('app');

app.const = {};
app.const.dialogZIndex = 9999;
app.const.topupZIndex = 10000;
app.const.loadingZIndex = 10000;
app.const.toastZIndex = 10001;
app.const.soundControl = 10002;
app.const.popupZIndex = 10003;
app.const.LANGUAGE = "vi"; // set the language used in app. Default: "vi"

app.const.DIALOG_DIR_PREFAB = "dashboard/dialog/prefabs";

app.const.USER_LOCAL_STORAGE = "userInfo";

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
app.const.gameCode.ALL = 'xga';
app.const.gameCode.XOC_DIA = 'xod';

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
app.const.COLOR_YELLOW = new cc.Color(246, 255, 41);
app.const.HX_COLOR_YELLOW = cc.colorToHex(app.const.COLOR_YELLOW); //'#F6FF29';
app.const.COLOR_VIOLET = new cc.Color(68, 25, 97);
app.const.COLOR_WHITE = new cc.Color(255, 255, 255);
app.const.HX_COLOR_WHITE = cc.colorToHex(app.const.COLOR_WHITE); //'#ffffff';
app.const.COLOR_RED = new cc.Color(255, 0, 0);
app.const.COLOR_ORANGE = new cc.Color(255, 155, 0);
app.const.COLOR_GREEN = new cc.Color(100, 173, 45);
app.const.COLOR_BLACK = new cc.Color(0, 0, 0);