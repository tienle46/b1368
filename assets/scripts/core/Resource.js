/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import i18next from 'i18next';

app.res = {};
app.res.prefab = {};

app.res.prefab.toast = cc.Prefab;
app.res.prefab.scrollview = cc.Prefab;
app.res.prefab.loading = cc.Prefab;
app.res.prefab.fullSceneLoading = cc.Prefab;

app.res.spriteFrame = {};

app.res.getString = app.res.string = (key, params) => {
    return i18next.t(key, params);
};

app.res.getErrorMessage = function(key) {
    //TODO
};

/**
 * Change language at runtime
 * @param defaultLocale
 */
app.res.loadLanguage = (defaultLocale, cb) => {

    let newLang = require(defaultLocale);
    let errMsg = app.res.string('change_language_fail') || "Đổi ngôn ngữ thất bại";

    if (newLang) {
        i18next.init({
            lng: defaultLocale,
            resources: {
                [defaultLocale]: { translation: newLang }
            }
        }, (err, t) => {
            err && cb && cb(errMsg);
        });
    } else {
        cb && cb(errMsg);
    }
};

app.res.loadLanguage(app.config.defaultLocale, (err) => { if (err) throw new Error("Không thể khởi tạo ngôn ngữ"); });

app.res.playerAnchorPath = {
    4: "game/players/FourPlayerPositions",
    5: "game/players/FivePlayerPositions",
    6: "game/players/SixPlayerPositions",
    8: "game/players/EightPlayerPositions",
};

app.res.playerAnchorName = {
    4: "FourPlayerPositions",
    5: "FivePlayerPositions",
    6: "SixPlayerPositions",
    8: "EightPlayerPositions",
};

/**
 * Game icon path map with game code
 * @type {{tnd: string, xam: string, bcy: string, lie: string, pom: string, xit: string, mbh: string}}
 */
app.res.gameIcon = {
    "tnd": "tlmn_dl_ico",
    "tds": "tlmn_dl_solo_ico",
    "xam": "sam_ico",
    "xms": "sam_solo_ico",
    "bcy": "bacay_ico",
    "lie": "lieng_ico",
    "pom": "phom_ico",
    "xit": "xito_ico",
    "mbh": "maubinh_ico",
    "xod": "xocdia_ico"
};
app.res.gameTopCapThuIcon = {
    // // bai 3 mien
    // "dnode/list324.png": "dashboard/thumbs/phom_ico_s",
    // "dnode/list327.png": "dashboard/thumbs/phom_ico_s",
    // "dnode/list328.png": "dashboard/thumbs/tlmn_ico_s",
    // "dnode/list329.png": "dashboard/thumbs/tlmn_ico_s",
    // "dnode/list330.png": "dashboard/thumbs/sam_ico_s",
    // "dnode/list331.png": "dashboard/thumbs/lieng_ico_s",
    // "dnode/list332.png": "dashboard/thumbs/xito_ico_s",
    // "dnode/list333.png": "dashboard/thumbs/bacay_ico_s",
    // // tlmn moi
    // "dnode/list368.png": "dashboard/thumbs/tlmn_ico_s",
    // "dnode/list374.png": "dashboard/thumbs/tlmn_ico_s",
    // "dnode/tds": "dashboard/tlmn_solo_ico_s",
    // "dnode/xms": "dashboard/sam_solo_ico_s",
    // bai 3 mien
    "dnode/list324.png": "phom_ico",
    "dnode/list327.png": "phom_ico",
    "dnode/list328.png": "tlmn_dl_ico",
    "dnode/list329.png": "tlmn_dl_ico",
    "dnode/list330.png": "sam_ico",
    "dnode/list331.png": "lieng_ico",
    "dnode/list332.png": "xito_ico",
    "dnode/list333.png": "bacay_ico",
    // tlmn moi
    "dnode/list368.png": "tlmn_ico",
    "dnode/list374.png": "tlmn_ico",
    // tlmn solo
    "dnode/tds": "tlmn_dl_solo_ico",
    "dnode/xms": "sam_ico",
};

app.res.asset_tools = {};

/**
 * Path of resource should be declare here to maintain easier
 * @type {{}}
 */
app.res.path = {

};

app.res.gameName = {
    "tnd": app.res.string('game_name_tlmn'),
    "tds": app.res.string('game_name_tlmn_solo'),
    "xam": app.res.string('game_name_sam'),
    "xms": app.res.string('game_name_sam_solo'),
    "bcy": app.res.string('game_name_ba_cay'),
    "lie": app.res.string('game_name_lieng'),
    "pom": app.res.string('game_name_phom'),
    "xit": app.res.string('game_name_xi_to'),
    "xod": app.res.string('game_name_xoc_dia'),
};


app.res.ATLAS_URLS = {
    PROVIDERS: 'blueTheme/atlas/providers',
    CHIPS: 'blueTheme/atlas/chips'
};