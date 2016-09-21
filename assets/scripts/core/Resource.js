/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import i18next from 'i18next';

app.res = {};

app.res.getString = app.res.string = (key, params) => {
    return i18next.t(key, params);
};

app.res.getErrorMessage = function (key) {
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
                [defaultLocale]: {translation: newLang}
            }
        }, (err, t) => {
            err && cb && cb(errMsg);
        });
    } else {
        cb && cb(errMsg);
    }
};

app.res.loadLanguage(app.config.defaultLocale, (err) => { if (err) throw new Error("Không thể khởi tạo ngôn ngữ"); } );

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
    "tnd": "dashboard/tlmn_ico",
    "xam": "dashboard/sam_ico",
    "bcy": "dashboard/bacay_ico",
    "lie": "dashboard/lieng_ico",
    "pom": "dashboard/phom_ico",
    "xit": "dashboard/xito_ico",
    "mbh": "dashboard/tlmn_ico"

};

/**
 * Path of resource should be declare here to maintain easier
 * @type {{}}
 */
app.res.path = {

};