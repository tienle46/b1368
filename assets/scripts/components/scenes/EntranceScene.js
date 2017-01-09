/* eslint-disable no-undef, no-unused-vars */
var app = require('app');
import BaseScene from 'BaseScene';

export default class EntranceScene extends BaseScene {

    constructor() {

        super();

        this.facebookButton = {
            default: null,
            type: cc.Button
        };

        this.promptPrefab = {
            default: null,
            type: cc.Prefab
        };

        this.accessToken = null;
    }

    // use this for initialization
    onLoad() {
        if (cc.sys.isMobile) {
            sdkbox.PluginFacebook.setListener({
                onLogin: (isLogin, msg) => {
                    if (isLogin) {
                        const fbId = sdkbox.PluginFacebook.getUserID();
                        this.accessToken = sdkbox.PluginFacebook.getAccessToken();
                        log(`fbId ${fbId} and token ${this.accessToken}`);
                        this.getUserByFbId(fbId, this.accessToken);
                    }
                },
                onAPI: function(tag, data) {},
                onSharedSuccess: function(data) {},
                onSharedFailed: function(data) {},
                onSharedCancel: function() {},
                onPermission: function(isLogin, msg) {}
            });
            this._activeFacebookBtn();
        } else {
            if (window.FB) {
                this._activeFacebookBtn();
            } else {
                window.fbAsyncInit = () => {
                    window.FB.init({
                        appId: `${app.config.fbAppId }`,
                        xfbml: `${app.config.fbxfbml }`,
                        version: `${app.config.fbVersion }`
                    });
                    window.FB.AppEvents.logPageView();
                    this._activeFacebookBtn();
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
        super.onLoad();
    }

    handleLoginAction() {
        this.changeScene(app.const.scene.LOGIN_SCENE);
    }

    handleRegisterButton() {
        this.showLoading();
        this.changeScene(app.const.scene.REGISTER_SCENE);
    }

    handlePlayNowButton() {
        this.showLoading();
        app.service.connect((success) => {
            log("success: " + success);
            if (success) {
                app.service.requestAuthen(this._generateUserName("ysad12", app.DEVICE_ID, 0, 5), this._generateUserName("yz212", app.DEVICE_ID, 0, 6), false, true, null, (error, result) => {

                    if (result) {
                        this.hideLoading();
                        this.changeScene(app.const.scene.DASHBOARD_SCENE);
                    }

                    if (error) {
                        error = JSON.parse(error);
                        this.addPopup(app.getMessageFromServer(error.p.ec));
                    }
                });
            }
        });
    }

    handleFacebookLoginAction() {
        this.accessToken = null;
        this.showLoading();

        if (cc.sys.isMobile) {
            if (!sdkbox.PluginFacebook.isLoggedIn()) {
                sdkbox.PluginFacebook.login();
            } else {
                const fbId = sdkbox.PluginFacebook.getUserID();
                this.accessToken = sdkbox.PluginFacebook.getAccessToken();
                log(`fbId ${fbId} and token ${this.accessToken}`);
                this.getUserByFbId(fbId, this.accessToken);
            }
        } else {
            window.FB && window.FB.getLoginStatus((response) => {
                if (response.status === 'connected') {
                    // the user is logged in and has authenticated, and response.authResponse supplies the user's ID, a valid access token, 
                    // a signed request, and the time the access token and signed request each expire
                    let uid = response.authResponse.userID;
                    this.accessToken = response.authResponse.accessToken;

                    this.getUserByFbId(uid, this.accessToken);
                } else if (response.status === 'not_authorized') {
                    // the user is logged in to Facebook, but has not authenticated your app
                    window.FB.login((response) => {
                        if (response.authResponse) {
                            this.accessToken = response.authResponse.accessToken; //get access token
                            let user_id = response.authResponse.userID; //get FB UID
                            let pointer = this;
                            window.FB.api('/me', (res) => {
                                // let user_email = res.email; //get user email
                                // you can store this data into your database
                                pointer.getUserByFbId(user_id, this.accessToken);
                            });
                        } else {
                            //user hit cancel button
                            // console.log('User cancelled login or did not fully authorize.');
                            this.accessToken = null;
                        }
                    }, {
                        scope: `${app.config.fbScope}`
                    });
                }
            });
        }
    }

    getUserByFbId(fbId, accessToken) {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                this.hideLoading();
                var json = JSON.parse(xhr.responseText);
                if (json["success"]) {
                    const username = json["username"];
                    if (username && typeof username == 'string' && username.trim().length > 0) {
                        this._onLoginWithAccessToken(username, accessToken);
                    } else {
                        let prompt = cc.instantiate(this.promptPrefab);
                        let option = {
                            handler: this._onUserDonePickupName.bind(this),
                            title: 'Chọn tên đăng nhập',
                            description: 'Chọn tên đăng nhập :',
                            editBox: {
                                inputMode: cc.EditBox.InputMode.SINGLE_LINE
                            }
                        };
                        prompt.getComponent('PromptPopup').init(null, option);
                    }
                } else {
                    app.system.error(app.res.string('error_system'));
                }
            }
        };
        xhr.open("GET", `http://${app.config.host}:8767/user/fb/${fbId}`, true);
        xhr.send();
    }

    _onUserDonePickupName(username) {
        this._onLoginWithAccessToken(username, this.accessToken);
    }

    _activeFacebookBtn() {
        this.facebookButton.interactable = true;
    }

    _onLoginWithAccessToken(username, accessToken) {
        this.showLoading();
        app.service.connect((success) => {
            if (success) {
                app.service.requestAuthen(username, "", false, false, accessToken, (error, result) => {
                    this.hideLoading();

                    if (error) {
                        error = JSON.parse(error);
                        app.system.error(app.getMessageFromServer(error.p.ec));
                    }
                    if (result) {
                        this.changeScene(app.const.scene.DASHBOARD_SCENE);
                    }
                });
            }
        });
    }

    _generateUserName(key, deviceId, count, maxCall) {
        if (count < maxCall) {
            let code2 = `${this._javaHashcode(deviceId)}${key}xintaocho`;
            return this._generateUserName(key, code2, count + 1, maxCall);
        }
        return `p${Math.abs(this._javaHashcode(deviceId))}`;
    }

    _javaHashcode(str) {
        let hash = 0;

        try {
            if (str.length == 0) return hash;
            for (let i = 0; i < str.length; i++) {
                let char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        } catch (e) {
            throw new Error('hashCode: ' + e);
        }
    }


}

app.createComponent(EntranceScene);