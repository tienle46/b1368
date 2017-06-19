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
        return app.env.isMobile() && app.config.test;
    };

    app.env.isAndroidTest = function() {
        return app.env.isMobileTest() && app.env.isAndroid();
    };

    app.env.isIOSTest = function() {
        return app.env.isMobileTest() && app.env.isIOS();
    };

    /**ENV LOG */
    app.env.log = function() {
        let platform = `platform: ${app.env.platform()}`;
        let os = `os:${cc.sys.os} v${cc.sys.osVersion || cc.sys.osMainVersion}`;
        let env = 'in ' + (app.config.test ? 'Test' : 'Product') + ' environment';

        log(`Running on ${platform} | ${os} ${env}`);
    };

    app.env.log();


    /**************************************************************************************************************
     **************************************************ENV SETUP **************************************************
     **************************************************************************************************************/
    app.env.__setupEnvironment = function() {
        app.config.useSSL = app.env.isBrowser();
        cc.log('use ssl', app.config.useSSL);
        cc.log('use ssl app.env.isBrowser', app.env.isBrowser());
        app.config.port = app.config.useSSL ? 443 : 8921;
        cc.log('use ssl p', app.config.port);
        
        if (app.env.isBrowser()) {
            var Fingerprint2 = require('fingerprinter');

            new Fingerprint2().get((printer) => {
                app.config.DEVICE_ID = printer;
            });
        } else if (app.env.isMobile()) {

            if (app.env.isIOS()) {
                app.config.DEVICE_ID = window.jsb.reflection.callStaticMethod("FCUUID", "uuidForDevice");
                app.config.CARRIER_NAME = window.jsb.reflection.callStaticMethod("JSBUtils", "carrierName");
            }
            if (app.env.isAndroid()) {
                app.config.DEVICE_ID = window.jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSBUtils", "uuidForDevice", "()Ljava/lang/String;");
                app.config.CARRIER_NAME = window.jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSBUtils", "carrierName", "()Ljava/lang/String;");
            }

            _setupSDKBox();
        }

        function _setupSDKBox() {
            /* eslint-disable no-console, no-unused-vars */
            let _initPluginFacebook = () => {
                //facebook
                debug(`facebook init`);
                window.sdkbox.PluginFacebook.init();
            };

            let _initPluginGoogleAnalytics = () => {
                //google analytics
                debug(`analytics init`);
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
                    onNotification: (isActive, message, additionalData) => {
                        
                    },
                    onNotificationOpened: (message) => {
                        // message: {"notification":{"payload":{"body":"onNotificationOpened","sound":"default","title":"onNotificationOpened","notificationID":"7ea8fd68-df2a-40a5-9c8e-fb992251cd7e","rawPayload":{"aps":{"alert":{"title":"onNotificationOpened","body":"onNotificationOpened"},"sound":"default"},"custom":{"a":{"action":"TOPUP_CARD"},"i":"7ea8fd68-df2a-40a5-9c8e-fb992251cd7e"}},"additionalData":{"action":"TOPUP_CARD"}},"shown":true,"displayType":1},"action":{}}
                        debug(`message: ${message}`);
                        
                        let additionalData = message && message['notification'] && message['notification']['payload']['additionalData'];
                        debug(`additionalData: ${additionalData}`);
                        if(additionalData && additionalData.action){
                            let Linking = require('Linking');
                            
                            let actionParamStr = additionalData['action_extras']
                            let actionParam = actionParamStr == null || !actionParamStr.length ? "{}" : additionalData['action_extras'];
                            
                            Linking.goTo(additionalData['action'], actionParam);
                        }
                    }
                });
            };

            let _initPluginIAP = () => {
                /**
                 * ENV setup IAP listener
                 * @param processes {Object}
                 * @prop
                 *  onInitialized,
                    onSuccess,
                    onFailure,
                    onCanceled,
                    onRestored,
                    onProductRequestSuccess,
                    onProductRequestFailure
                 * @returns null
                 */
                app.env.sdkIAPSetListener = (processes) => {
                    let objectListener = {
                        onInitialized: (success) => {
                            log('IAP: success', JSON.stringify(success));
                        },
                        onSuccess: (product) => {
                            //Purchase success
                            /**
                             * @ IOS product
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
                             * 
                             * @ Android product
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
                        onFailure: (product, msg) => {
                            log('IAP: onFailure', JSON.stringify(product), JSON.stringify(msg));
                        }, //Purchase failed
                        onCanceled: (product) => {
                            log('IAP: onCanceled', JSON.stringify(product));
                        }, //Purchase was canceled by user
                        onRestored: (product) => {
                            log('IAP: success', JSON.stringify(product));
                        }, //Purchase restored
                        onProductRequestSuccess: (products) => {
                            //Returns you the data for all the iap products
                            //You can get each item using following method
                            log('\nIAP: onProductRequestSuccess', JSON.stringify(products));
                        },
                        onProductRequestFailure: (msg) => {
                            //When product refresh request fails.
                            log('\nIAP: onProductRequestFailure', JSON.stringify(msg))
                        }
                    };

                    objectListener = Object.assign({}, objectListener, processes);
                    window.sdkbox.IAP.setListener(objectListener);
                };

                if(!app.system) {
                   log('IAP: !app.system', app.system)
                }
                
                if(!app.iap){
                    let IAPManager = require('IAPManager');
                    
                    app.iap = new IAPManager();
                    app.iap.init(window.sdkbox.IAP);
                }
                
            };
            
            let _initPluginKochava = () => {
                window.sdkbox.PluginKochava.init();
            };
            if (cc.sys.isMobile && window.sdkbox) {
                
                let plugins = [
                    _initPluginFacebook,
                    _initPluginGoogleAnalytics,
                    _initPluginIAP,
                    _initPluginKochava
                ].map(p => {
                    p();
                });

                // window.release(plugins);
            }
        }
    }; // end Func

});