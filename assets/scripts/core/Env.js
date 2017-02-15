export default (function(app) {
    app.env = app.env || {};

    app.env.platform = function() {
        let platforms = {
            [cc.sys.UNKNOWN]: 'UNKNOWN',
            [cc.sys.WIN32]: 'WIN32',
            [cc.sys.LINUX]: 'LINUX',
            [cc.sys.MACOS]: 'MACOS',
            [cc.sys.ANDROID]: 'ANDROID',
            [cc.sys.IPHONE]: 'IPHONE',
            [cc.sys.IPAD]: 'IPAD',
            [cc.sys.WP8]: 'WP8',
            [cc.sys.BLACKBERRY]: 'BLACKBERRY',
            [cc.sys.NACL]: 'NACL',
            [cc.sys.EMSCRIPTEN]: 'EMSCRIPTEN',
            [cc.sys.TIZEN]: 'TIZEN',
            [cc.sys.WINRT]: 'WINRT',
            [cc.sys.MOBILE_BROWSER]: 'MOBILE_BROWSER',
            [cc.sys.DESKTOP_BROWSER]: 'DESKTOP_BROWSER',
        };

        return platforms[cc.sys.platform];
    };

    app.env.isBrowser = function() {
        return cc.sys.isBrowser;
    };

    app.env.isMobile = function() {
        return cc.sys.isMobile;
    };

    app.env.isAppleMobilePlatform = function() {
        return cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.IPAD;
    };

    app.env.isGooglePlatform = function() {
        return cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.IPAD;
    };

    app.env.isAndroid = function() {
        return app.env.isMobile() && (app.env.isGooglePlatform() || cc.sys.os === cc.sys.OS_ANDROID);
    };

    app.env.isIOS = function() {
        return app.env.isMobile() && (app.env.isAppleMobilePlatform() || cc.sys.os === cc.sys.OS_IOS);
    };


    /**ENV TESTS */
    app.env.isBrowserTest = function() {
        return app.env.isBrowser() && app.config.test;
    };

    app.env.isMobileTest = function() {
        return cc.sys.isMobile() && app.config.test;
    };

    app.env.isAndroidTest = function() {
        return cc.sys.isMobileTest() && app.env.isAndroid();
    };

    app.env.isIOSTest = function() {
        return cc.sys.isMobileTest() && app.env.isIOS();
    };

    /**ENV LOG */
    app.env.log = function() {
        let platform = `platform: ${app.env.platform()}`;
        let os = `os:${cc.sys.os} v${cc.sys.osVersion || cc.sys.osMainVersion}`;
        let env = 'in ' + (app.config.test ? 'Test' : 'Product') + ' environment';

        console.log(`Running on ${platform} | ${os} ${env}`);
    };

    app.env.log();


    /**ENV SETUP */
    (function setupEnv(app) {
        // update pollyfill
        require('Pollyfill')(app);

        if (app.env.isBrowser()) {
            var Fingerprint2 = require('fingerprinter');

            new Fingerprint2().get((printer) => {
                app.config.DEVICE_ID = printer;
            });
        } else if (app.env.isMobile()) {

            if (app.env.isIOS()) {
                app.config.DEVICE_ID = window.jsb.reflection.callStaticMethod("FCUUID", "uuidForDevice");
                log(`ios udid ${app.DEVICE_ID}`);
            }

            _setupSDK();
        }

        function _setupSDK() {
            if (cc.sys.isMobile && window.sdkbox) {
                //facebook
                window.sdkbox.PluginFacebook.init();

                //google analytics
                window.sdkbox.PluginGoogleAnalytics.init();
                window.sdkbox.PluginGoogleAnalytics.startSession();

                //onesignal
                window.sdkbox.PluginOneSignal.init();
                window.sdkbox.PluginOneSignal.registerForPushNotifications();
                // sdkbox.PluginOneSignal.setSubscription(true);
                window.sdkbox.PluginOneSignal.enableInAppAlertNotification(true);

                window.sdkbox.PluginOneSignal.setListener({
                    onSendTag: (success, key, message) => {},
                    onGetTags: (jsonString) => {},
                    onIdsAvailable: (userId, pushToken) => {},
                    onPostNotification: (success, message) => {},
                    onNotification: (isActive, message, additionalData) => {}
                });
            }
        }
    })(app);
});