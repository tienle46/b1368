/**
 * Created by Thanh on 9/1/2016.
 */
import VisibilityManager from 'VisibilityManager';

var app = require('app');

app.config = {};
// app.config.host = "123.31.12.100";
// app.config.port = 8481;
app.config.host = "123.30.238.174";
app.config.port = 8921;
app.config.zone = "XGame";
app.config.debug = false;
app.config.useSSL = false;
app.config.test = true;
app.config.testIngame = false;
app.config.defaultLocale = 'vi';
app.config.poorNetworkThreshold = 2000;
app.config.pingPongPollQueueSize = 3;
app.config.pingPongInterval = 60000;
app.config.buildForMobile = true; // if ( sys.platform !== 'browser')
app.config.app_secret_key = '63d9ccc8-9ce1-4165-80c8-b15eb84a780a';
app.config.DEVICE_ID = 'a19c8e4ae2e82ef1c7846f32628d4ead3';
app.config.MINIMUM_PASSWORD = 6;
app.config.MAX_PASSWORD_LENGTH = 15;
app.config.MIN_USERNAME_LENGTH = 6;
app.config.MAX_USERNAME_LENGTH = 15;
app.config.USER_NAME_REGEX = /^[a-zA-Z0-9._]{6,15}$/;
app.config.PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{6,15}$/;


app.config.fbAppId = 226720277782952;
app.config.fbxfbml = true;
app.config.fbVersion = 'v2.8';
app.config.fbScope = 'public_profile,email';

app.config.fanpage = `https://www.messenger.com/t/${app.config.fbAppId}`;
app.config.supportHotline = '0983.369.898';
app.config.defaultMinBalanceJoinGameRoomMultiple = 10;
app.config.defaultAvatarUrl = "";

app.config.supportedGames = [
    app.const.gameCode.PHOM,
    app.const.gameCode.TLMNDL,
    app.const.gameCode.XAM,
    app.const.gameCode.BA_CAY,
    app.const.gameCode.XOC_DIA,
];

app.config.listTableGroupFilters = [
    {min: 0, max: 1000},
    {min: 0, max: 10000},
    {min: 0, max: 2000000000},
];

app.config.gameGroups = {
    [app.const.gameCode.PHOM]: `${app.const.gameCode.PHOM}01`,
    [app.const.gameCode.TLMNDL]: `${app.const.gameCode.TLMNDL}01`,
    [app.const.gameCode.XAM]: `${app.const.gameCode.XAM}01`,
    [app.const.gameCode.BA_CAY]: `${app.const.gameCode.BA_CAY}01`,
    [app.const.gameCode.XOC_DIA]: `${app.const.gameCode.XOC_DIA}01`,
};

app.config.actionLabels = {
    'CASH': 'Rút tiền',
    'TRANSFER': 'Chuyển tiền',
    'TOPUP': 'Nạp tiền',
    'TOPUP_CARD': 'Nạp thẻ',
    'TOPUP_SMS': 'Nạp SMS',
    'TOPUP_IAP': 'Nạp IAP',
    'EVENT': 'Sự kiện',
    'BUDDY': 'Bạn bè',
    'BANK': 'Ngân hàng',
    'GIFT_CODE': 'Mã thưởng',
    'SYSTEM_MESSAGE': 'Tin nhắn hệ thống',
    'PERSONAL_MESSAGE': 'Tin nhắn cá nhân',
    'EXCHANGE': 'Đổi thưởng',
    'EXCHANGE_CARD': 'Đổi thẻ',
    'EXCHANGE_ITEM': 'Đổi vp',
    'EXCHANGE_HISTORY': 'Lịch sử',
    'BUDDY_CHAT': 'Chat',
    'FEEDBACK': 'Góp ý',
    'FANPAGE': 'Fanpage',
    'WEBSITE': 'Website',
    'TOP_VIP': 'Top Vip',
    'TOP_CAO_THU': 'Top Cao Thu',
    'TOP_DAI_GIA': 'Top đại gia',
    'AGENT': 'Đại lý',
    'TOPUP_HISTORY': 'Lịch sử',
    'PERSONAL_INFO': 'Xem',
    'PLAYER_INFO': 'Xem',
    'PERSONAL_STATISTIC': 'Thành tích',
    'PLAY_GAME': 'Vào game'
};

// list of things need to hide when submit app
/** Ex:
    1 Nạp thẻ cào (tuc)
    2 Nạp SMS (cs)
    3 Fanpage (fp)
    4 Sự kiện (evt)
    5 Đổi thưởng (ex)
    6 Ngân hàng (bnk)
    7 Bot (bot)
    8 Giftcode (gc)
 */
app.config.features = {};

app.config.parseConfigData = function(configData = {}) {
    app.config.fanpage = configData.fanpage || app.config.fanpage;
    app.config.supportHotline = configData.supportHotline || app.config.supportHotline;
    app.config.listTableGroupFilters = configData.listTableGroupFilters || app.config.listTableGroupFilters;
    app.config.fbAppId = configData.fbAppId || app.config.fbAppId;
    app.config.defaultAvatarUrl = configData.defaultAvatarUrl || app.config.defaultAvatarUrl;
    app.config.gameGroups = configData.gameGroups || app.config.gameGroups;
    app.config.actionLabels = Object.assign({}, app.config.actionLabels, configData.actionLabels || {});
    app.config.features = configData.features || app.config.features;
    
    if(!app.visibilityManager) {
        app.visibilityManager = new VisibilityManager(app.config.features);
    }
    
    const Events = require('Events');
    app.system.emit(Events.CLIENT_CONFIG_CHANGED)
};

app.config.getFeature = function(code) {
    return app.config.features && app.config.features[code];
};