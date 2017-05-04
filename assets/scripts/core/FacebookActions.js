/* eslint-disable no-undef, no-unused-vars */
import app from 'app';

export default class FacebookActions {
    constructor() {
        if(app.env.isMobile() && !window.sdkbox.PluginFacebook)
            cc.warn('Error occurred ! window.sdkbox.PluginFacebook');
        
        this._id = null;
        this._isLoggedIn = false;
        this._accessToken = null;
        
        this.defaultOptions = {
            onLogin: (isLogin, msg) => {},
            onAPI: function(tag, data) {},
            onSharedSuccess: function(data) {},
            onSharedFailed: function(data) {},
            onSharedCancel: function() {},
            onPermission: function(isLogin, msg) {}
        };
    }
    
    init(cb = null) {
        if (app.env.isMobile() && window.sdkbox.PluginFacebook) {
            this._initSdk();
            cb && cb();
        } else if (app.env.isBrowser()) {
            if (window.FB) {
                cb && cb();
            } else {
                window.fbAsyncInit = () => {
                    window.FB.init({
                        appId: `${ app.config.fbAppId }`,
                        xfbml: `${ app.config.fbxfbml }`,
                        version: `${ app.config.fbVersion }`
                    });
                    window.FB.AppEvents.logPageView();
                    cb && cb();
                };
                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) { return; }
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "//connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            }
        }    
    }
    
    /**
     * 
     * @param {Function} [runtimeCb] = (accessTokenId) => {}
     * @param {Funcion} responseCb = (fbId, accessToken) => {}
     * 
     * @memberof FacebookActions
     */
    login(runtimeCb = null, responseCb = null) {
        if (app.env.isMobile()) {
            this._setLoginState(window.sdkbox.PluginFacebook.isLoggedIn());
            
            if (!this.isLoggedIn()) {
                this._initSdk({
                    onLogin: (isLogin, msg) => {
                        isLogin && this._handlerLoginAction(window.sdkbox.PluginFacebook.getUserID(), window.sdkbox.PluginFacebook.getAccessToken(), runtimeCb, responseCb);
                    }
                });
                window.sdkbox.PluginFacebook.login();
            } else { 
                this._handlerLoginAction(window.sdkbox.PluginFacebook.getUserID(), window.sdkbox.PluginFacebook.getAccessToken(), runtimeCb, responseCb);
            }
        } else {
            if (window.FB) {
                window.FB.getLoginStatus((response) => {
                    if (response.status === 'connected') {
                        this._setLoginState(true);
                        
                        // the user is logged in and has authenticated, and response.authResponse supplies the user's ID, a valid access token,
                        // a signed request, and the time the access token and signed request each expire
                        let uid = response.authResponse.userID;
                        let accessToken = response.authResponse.accessToken;
                        
                        this._handlerLoginAction(uid, accessToken, runtimeCb, responseCb);
                    } else {
                        // the user is logged in to Facebook, but has not authenticated your app
                        window.FB.login((response) => {
                            if (response.authResponse) {
                                let accessToken = response.authResponse.accessToken; //get access token
                                let user_id = response.authResponse.userID; //get FB UID
                                // let pointer = this;
                                window.FB.api('/me', (res) => {
                                    // let user_email = res.email; //get user email
                                    // you can store this data into your database
                                    //console.warn('window.FB.api: ', res);
                                    this._handlerLoginAction(user_id, accessToken, runtimeCb, responseCb);
                                });
                            } else {
                                //user hit cancel button
                                //console.warn('User cancelled login or did not fully authorize.');
                                // this.accessToken = null;
                            }
                        }, {
                            scope: `${app.config.fbScope}`
                        });
                    }
                });
            } else {
                app.system.error(app.res.string('error_cannot_init_facebook'));
            }
        }
    }
    
    share({type = "link", link = "http://b1368.com", title = `Bài ${app.res.string('game_title')}`, text = "", image = ""} = {}) {
        if(app.env.isBrowser()) {
            window.FB.ui({
                method: 'share',
                href: link,
                title,
                description: text,
            }, function(response) {
                console.log('response', response);
            });
        } else if (app.env.isMobile()){
            cc.log(`share on mobile`);
            var info = {
                type,
                link,
                title,
                text,
                image
            };
            window.sdkbox.PluginFacebook.dialog(info);
        }
    }
    
    isLoggedIn() {
        return this._isLoggedIn;  
    }
    
    getFacebookId() {
        return this._id;  
    }
    
    getAccessToken() {
        return this._accessToken;
    }
    
    _setFacebookId(id) {
        this._id = id;
    }
    
    _setAccessToken(token) {
        this._accessToken = token;
    }
    
    _setLoginState(loggedIn) {
        this._isLoggedIn = loggedIn;
    }
    
    // init facebook plugin for mobile only
    _initSdk(options) {
        this.defaultOptions = Object.assign({}, this.defaultOptions, options);
        
        if(app.env.isMobile()) {
            window.sdkbox.PluginFacebook.setListener(this.defaultOptions);
        }
    }
    
    /**
     * @param {Function} [runtimeCb] = (accessTokenId) => {}
     * @param {Funcion} responseCb = (fbId, accessToken) => {}
     * 
     * @memberof FacebookActions
     */
    _handlerLoginAction(fbId, accessToken, runtimeCb, responseCb) {
        this._setAccessToken(accessToken);
        this._setFacebookId(fbId);

        runtimeCb && runtimeCb(this.getAccessToken());
        responseCb && responseCb(this.getFacebookId(), this.getAccessToken());
    }
}