/* eslint-disable no-undef, no-unused-vars */
import app from 'app'
import BaseScene from 'BaseScene'
import BuddyManager from 'BuddyManager'
import PromptPopup from 'PromptPopup'

class EntranceScene extends BaseScene {

    constructor() {
        super();

        this.properties = {
            ...this.properties,
            facebookButton: cc.Button,
            promptPrefab: cc.Prefab
        }

        this.accessToken = null;
    }

    onLoad() {
        if (app.env.isMobile() && sdkbox.PluginFacebook) {
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
        } else if (app.env.isBrowser()) {
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

    start(){
        super.start();

        if(app.buddyManager){
            app.buddyManager.reset();
        } else{
            app.buddyManager = new BuddyManager();
        }

        app.service.client._reset(true);
        app.context.reset()
    }

    handleLoginAction() {
        this.changeScene(app.const.scene.LOGIN_SCENE);
    }

    handleRegisterButton() {
        this.changeScene(app.const.scene.REGISTER_SCENE);
    }

    handlePlayNowButton() {
        if(app.env.isMobile() || app.env.isBrowserTest()){
            let username = this._generateUserName("ysad12", app.config.DEVICE_ID, 0, 5);
            let password = this._generateUserName("yz212", app.config.DEVICE_ID, 0, 6);
            this.loginToDashboard(username, password, false, true);
        }else{
            app.system.info(app.res.string('play_now_not_support_on_mobile'))
        }
    }

    handleFacebookLoginAction() {

        this.accessToken = null;
        this.showLoading(app.res.string('logging_in_via_facebook'));
        if (app.env.isMobile()) {
            if (!window.sdkbox.PluginFacebook.isLoggedIn()) {
                window.sdkbox.PluginFacebook.login();
            } else {
                const fbId = window.sdkbox.PluginFacebook.getUserID();
                this.accessToken = window.sdkbox.PluginFacebook.getAccessToken();
                log(`fbId ${fbId} and token ${this.accessToken}`);
                this.getUserByFbId(fbId, this.accessToken);
            }
        } else {
            if(window.FB) {
                window.FB.getLoginStatus((response) => {
                    if (response.status === 'connected') {
                        // the user is logged in and has authenticated, and response.authResponse supplies the user's ID, a valid access token,
                        // a signed request, and the time the access token and signed request each expire
                        let uid = response.authResponse.userID;
                        this.accessToken = response.authResponse.accessToken;

                        this.getUserByFbId(uid, this.accessToken);
                    } else {
                        // the user is logged in to Facebook, but has not authenticated your app
                        window.FB.login((response) => {
                            if (response.authResponse) {
                                this.accessToken = response.authResponse.accessToken; //get access token
                                let user_id = response.authResponse.userID; //get FB UID
                                let pointer = this;
                                window.FB.api('/me', (res) => {
                                    // let user_email = res.email; //get user email
                                    // you can store this data into your database
                                    //console.warn('window.FB.api: ', res);
                                    pointer.getUserByFbId(user_id, this.accessToken);
                                });
                            } else {
                                //user hit cancel button
                                //console.warn('User cancelled login or did not fully authorize.');
                                this.accessToken = null;
                            }
                        }, {
                            scope: `${app.config.fbScope}`
                        });
                    }
                });
            }else{
                app.system.error(app.res.string('error_cannot_init_facebook'))
            }
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
                        this._showInputUsernamePopup();
                    }
                } else {
                    app.system.error(app.res.string('error_system'));
                }
            }
        };
        xhr.open("GET", `http://${app.config.host}:8922/user/fb/${fbId}`, true);
        xhr.send();
    }

    _showInputUsernamePopup(){
        PromptPopup.show(this.node, this.promptPrefab, {
            handler: this._onUserDonePickupName.bind(this),
            title: app.res.string('input_username_title'),
            description: app.res.string('username_rule'),
            acceptLabelText: app.res.string('label_enter_game'),
            inputRegex: app.config.USER_NAME_REGEX,
            inputErrorMessage: app.res.string('error_username_not_match'),
            maxLength: app.config.MAX_USERNAME_LENGTH
        })
    }

    _onUserDonePickupName(username) {
        this._onLoginWithAccessToken(username, this.accessToken);
    }

    _activeFacebookBtn() {
        this.facebookButton.interactable = true;
    }

    _onLoginWithAccessToken(username, accessToken) {
        if(username.length > 0) {
            this.loginToDashboard(username, "", false, false, accessToken);
        }
    }

    _generateUserName(key, deviceId, count, maxCall) {
        try{
            if (count < maxCall) {
                let code2 = `${this._javaHashcode(deviceId)}${key}xintaocho`;
                return this._generateUserName(key, code2, count + 1, maxCall);
            }
            return `p${Math.abs(this._javaHashcode(deviceId))}`;
        }catch(e){
            app.system.info(app.res.string('play_now_not_available_right_now'))
        }
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