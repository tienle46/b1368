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
        return cc.sys.platform == cc.sys.ANDROID;
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

            _setupSDKBox();
        }

        function _setupSDKBox() {
            /* eslint-disable no-console, no-unused-vars */
            let releaseArray = require('RubUtils').releaseArray;

            let _initPluginFacebook = () => {
                //facebook
                window.sdkbox.PluginFacebook.init();
            };

            let _initPluginGoogleAnalytics = () => {
                //google analytics
                window.sdkbox.PluginGoogleAnalytics.init();
                window.sdkbox.PluginGoogleAnalytics.startSession();
            };

            let _initPluginOneSignal = () => {
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
            };

            let _initPluginIAP = () => {
                function _getIAPItemsFromStorage() {
                    return cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE) || null;
                }

                window.sdkbox.IAP.init();
                window.sdkbox.IAP.setDebug(true);

                // save failed items to localStorage
                if (!_getIAPItemsFromStorage())
                    cc.sys.localStorage.setItem(app.const.IAP_LOCAL_STORAGE, []);

                // setup listener
                window.sdkbox.IAP.setListener({
                    onInitialized: (success) => {
                        cc.log('IAP: success', JSON.stringify(success));
                    },
                    onSuccess: (product) => {
                        //Purchase success
                        /**
                         * @product
                         * {
                         * "name":"com.3mien.68.45K",
                         * "id":"com.3mien.68.45K",
                         * "title":"45K Chips",
                         * "description":"Purchase 45K Chips",
                         * "price":"₫45,000",
                         * "currencyCode":"VND",
                         * "receipt":"",
                         * "receiptCipheredPayload":"MIITxwYJKoZIhvcNAQcCoIITuDCCE7QCAQExCzAJBgUrDgMCGgUAMIIDaAYJ"
                         * }
                         */
                    },
                    onFailure: (product, msg) => {}, //Purchase failed
                    onCanceled: (product) => {}, //Purchase was canceled by user
                    onRestored: (product) => {}, //Purchase restored
                    onProductRequestSuccess: (products) => {
                        //Returns you the data for all the iap products
                        //You can get each item using following method
                        cc.log('\nIAP: onProductRequestSuccess', JSON.stringify(products));

                        if (_getIAPItemsFromStorage()) {
                            let productIds = [];
                            for (let i = 0; i < products.length; i++) {
                                // loop
                                productIds.push(products[i].id);
                            }

                            let purchases = [];
                            _getIAPItemsFromStorage().forEach((item) => {
                                if (app._.includes(productIds, item.id)) {
                                    init.push(item.receipt);
                                }
                            });
                            let sendObj = {
                                cmd: 'submitPurchase',
                                data: {
                                    purchases
                                }
                            };

                            app.system.showLoader('Thực hiện lại giao dịch lỗi .....', 60);
                            app.service.send(sendObj);
                        }
                    },
                    onProductRequestFailure: (msg) => {
                        //When product refresh request fails.
                        cc.log('\nIAP: onProductRequestFailure', JSON.stringify(msg))

                    }
                });
            };

            if (cc.sys.isMobile && window.sdkbox) {
                let plugins = [
                    _initPluginFacebook,
                    _initPluginGoogleAnalytics,
                    _initPluginOneSignal,
                    _initPluginIAP
                ].map(p => {
                    p();
                });

                releaseArray(plugins);
            }
        }

    })(app);
});