/**
 * Created by Thanh on 9/1/2016.
 */
var app = require('app');

app.config = {};
app.config.currencyName = "chip";
// app.config.useSSL = false;
app.config.host = "123.31.12.100";

// app.config.host = "123.31.24.103";
app.config.useSSL = cc.sys.isBrowser? false: false;
// app.config.host = "1368casino.com";
// app.config.host = "1368.company";
app.config.port = app.config.useSSL ? 443 : 8921;
app.config.version = 0x00010015;
app.config.partnerId = 1;
app.config.ALPHA_TEST = false;

app.config.packageName = "";
// app.config.buildType = "full";
app.config.buildType = "store";

//LEFT IT FALSE FOR ALL CASE
app.config.tai_xiu_treo_kq = false;
app.config.use_recaptcha = false;

app.config.zone = "XGame";

//MUST UPDATE THIS VALUE TO FALSE BEFORE RELEASE NEW VERSION
app.config.debug = false;
app.config.test = false;
app.config.testIngame = false;
app.config.defaultLocale = 'vi';
app.config.poorNetworkThreshold = 2000;
app.config.pingPongPollQueueSize = 3;
app.config.pingPongInterval = 20000; // 20s
app.config.buildForMobile = true; // if ( sys.platform !== 'browser')
app.config.app_secret_key = '63d9ccc8-9ce1-4165-80c8-b15eb84a780a';
app.config.DEVICE_ID = 'a19c8e4ae2e82ef1c7846f32628d4ead3';
app.config.MINIMUM_PASSWORD = 6;
app.config.MAX_PASSWORD_LENGTH = 30;
app.config.MIN_USERNAME_LENGTH = 6;
app.config.MAX_USERNAME_LENGTH = 15;
app.config.USER_NAME_REGEX = /^[a-zA-Z0-9._]{6,15}$/;
app.config.PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{6,30}$/;
app.config.CRYPTO_AES_KEY = 'hiephvdepzai123$#@^&^$';

app.config.partnerId = 1;
app.config.fbAppId = 265548353914142;
// app.config.fbAppId = 1793374524209784; // <- app test
app.config.fbxfbml = true;
app.config.fbVersion = 'v2.8';
// app.config.fbVersion = 'v2.7'; // <- app test too
app.config.fbScope = 'public_profile,email,user_friends';

app.config.fanpage = `http://m.me/bai1368`;
app.config.website = `http://bai1368.com`;
app.config.supportHotline = '0974851368';
app.config.otp = false; //default false;
app.config.otp_config = {
    exchange: {
        enabled: true,
        msg: `Để sử dụng tính năng này, vui lòng cài ứng dụng OTP hoặc gọi hotline: ${app.config.supportHotline} để được hỗ trợ`
    },
    topup: {
        enabled: true,
        msg: `Để sử dụng tính năng này, vui lòng cài ứng dụng OTP hoặc gọi hotline: ${app.config.supportHotline} để được hỗ trợ`
    }
};
app.config.defaultMinBalanceJoinGameRoomMultiple = 10;
app.config.defaultAvatarUrl = "";
app.config.shareFBConfig = {
    // link: app.config.website,
    // title: `Bài B1368`,
    // image: `http://cms.songbaihoanggia.com/uploadfiles/share-fb.png`,
    // description: 'Chơi miễn phí, rinh chip tỉ',
    // info: {
    //     daily: {
    //         description: 'Chơi miễn phí, rinh chip tỉ',
    //     }, // || {description, image, link, title}
    //     newbie: 'Chơi miễn phí, rinh chip tỉ',  
    //     jar: 'Nổ hũ, Chơi miễn phí, rinh chip tỉ',  
    // }
};

app.config.filterLabels = ['Nông dân', 'Quý tộc', 'Hoàng gia'];
// 1:bac 2:vang 3:kimcuong
app.config.ingameGreetingVipMessages = {
    1: 'Chào Dân Chơi {{username}} !',
    2: 'Chào Đại Gia {{username}} !',
    3: 'Chào anh Đại {{username}} ạ !'
};

app.config.supportedGames = [
    app.const.gameCode.PHOM,
    app.const.gameCode.TLMNDL,
    app.const.gameCode.XAM,
    app.const.gameCode.BA_CAY,
    app.const.gameCode.XOC_DIA,
    app.const.gameCode.TLMNDL_SOLO,
    app.const.gameCode.XAM_SOLO,
    app.const.gameCode.TAI_XIU,
    app.const.gameCode.BAU_CUA,
    app.const.gameCode.LIENG
];

app.config.soloGames = [
    app.const.gameCode.TLMNDL_SOLO,
    app.const.gameCode.XAM_SOLO,
]

app.config.listTableGroupFilters = [
    {min: 0, max: 1000, text: 'Nông dân'},
    {min: 0, max: 10000, text: 'Quý tộc'},
    {min: 0, max: 2000000000, text: 'Hoàng gia'}
];

app.config.gameGroups = {
    [app.const.gameCode.PHOM]: `${app.const.gameCode.PHOM}01`,
    [app.const.gameCode.TLMNDL]: `${app.const.gameCode.TLMNDL}01`,
    [app.const.gameCode.XAM]: `${app.const.gameCode.XAM}01`,
    [app.const.gameCode.BA_CAY]: `${app.const.gameCode.BA_CAY}01`,
    [app.const.gameCode.XOC_DIA]: `${app.const.gameCode.XOC_DIA}01`,
};

app.config.actionLabels = {
    'CASH': `Rút ${app.config.currencyName}`,
    'TRANSFER': `Chuyển ${app.config.currencyName}`,
    'TOPUP': `Nạp ${app.config.currencyName}`,
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

// list of things which need to hide when submit app
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
app.config.verifyAccountSyntax = {}; // {viettel, mobi, vina}
app.config.generateOtpSyntax = {}; // {viettel, mobi, vina}
app.config.enableOtpOnTransferMoney = true;

app.config.parseConfigData = function(configData = {}) {
    app.config.currencyName = configData.currencyName || app.config.currencyName;
    app.config.fanpage = configData.fanpage || app.config.fanpage;
    app.config.supportHotline = configData.supportHotline || app.config.supportHotline;
    app.config.listTableGroupFilters = configData.listTableGroupFilters || app.config.listTableGroupFilters;
    app.config.fbAppId = configData.fbAppId || app.config.fbAppId;
    app.config.defaultAvatarUrl = configData.defaultAvatarUrl || app.config.defaultAvatarUrl;
    app.config.gameGroups = configData.gameGroups || app.config.gameGroups;
    app.config.actionLabels = Object.assign({}, app.config.actionLabels, configData.actionLabels || {});
    app.config.features = configData.features || app.config.features;
    app.config.website = configData.website || app.config.website;
    app.config.shareFBConfig = configData.shareFBConfig || app.config.shareFBConfig;
    app.config.verifyAccountSyntax = configData.verifyAccountSyntax || app.config.verifyAccountSyntax;
    app.config.generateOtpSyntax = configData.generateOtpSyntax || app.config.generateOtpSyntax;
    app.config.enableOtpOnTransferMoney = configData.enableOtpOnTransferMoney == undefined ? app.config.enableOtpOnTransferMoney : configData.enableOtpOnTransferMoney;

    // Default otp false, only apply otp config for Android only
    if (app.env.isAndroid() && app.config.buildType === "store") {
        configData.hasOwnProperty('otp') && (app.config.otp = configData.otp);
        app.config.otp_config = configData.otp_config || app.config.otp_config;    
    }
    
    const ActionBlocker = require('ActionBlocker');
    ActionBlocker.onClientConfigChanged(configData.blockConfig || {});
    
    const Events = require('GameEvents');
    app.system.emit(Events.CLIENT_CONFIG_CHANGED, app.config.features)
};

app.config.getFeature = function(code) {
    return app.config.features && app.config.features[code];
};

app.config.getShareObject = function(key) {
    let shareObject = {};
    let info = app.config.shareFBConfig.info[key];
    
    if(info) {
        if(typeof info === 'string') {
            shareObject.text = info;
        } else {
            info.hasOwnProperty('description') && (shareObject.text = info.description);
            info.hasOwnProperty('link') && (shareObject.link = info.link);
            info.hasOwnProperty('title') && (shareObject.title = info.title);
            info.hasOwnProperty('image') && (shareObject.image = info.image);
        }
    }
    
    return shareObject;
}