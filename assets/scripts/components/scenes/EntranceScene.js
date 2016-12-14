var app = require('app');
import AlertPopupRub from 'AlertPopupRub';
import BaseScene from 'BaseScene';
import PromptPopupRub from 'PromptPopupRub';

export default class EntranceScene extends BaseScene {

    constructor() {

        super();

        this.loginButton = {
            default: null,
            type: cc.Button
        };

        this.registerButton = {
            default: null,
            type: cc.Button
        };

        this.playNowButton = {
            default: null,
            type: cc.Button
        };

        this.facebookButton = {
            default: null,
            type: cc.Button
        };

    }

    // use this for initialization
    onLoad() {

        // sdkbox.PluginFacebook.setListener({
        //     onLogin: (isLogin, msg) => {
        //         if(isLogin){
        //             const fbId = sdkbox.PluginFacebook.getUserID();
        //             this.accessToken = sdkbox.PluginFacebook.getAccessToken();
        //             log(`fbId ${fbId} and token ${this.accessToken}`);
        //             this.getUserByFbId(fbId , this.accessToken);
        //         }
        //         else{
        //
        //         }
        //     },
        //     onAPI: function(tag, data) {},
        //     onSharedSuccess: function(data) {},
        //     onSharedFailed: function(data) {},
        //     onSharedCancel: function() {},
        //     onPermission: function(isLogin, msg) {}
        // });

        super.onLoad();
    }

    onUserDonePickupName() {
        if (this.prom.getVal() && this.prom.getVal().trim().length > 0) {
            //
            app.service.connect((success) => {
                if (success) {
                    app.service.requestAuthen(userName, "", true, false,this.accessToken , (error, result) => {

                        this.hideLoading();

                        if (error) {
                            log('Login error:');
                            error = JSON.parse(error);
                            this.addPopup(app.getMessageFromServer(error.p.ec));
                        }
                        if (result) {
                            log(result);
                            log(`Logged in as ${app.context.getMe().name}`);
                            this.changeScene(app.const.scene.DASHBOARD_SCENE);
                        }
                    });
                }
            });
        }
        else{

            this.addPopup(`Tên đăng nhập không được bỏ trống`);
        }
    }
    getUserByFbId(fbId , accessToken){
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = ()=>
        {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400))
            {
                var json = JSON.parse(xhr.responseText);
                log(`json`, xhr.responseText);
                if(json["success"]){
                    const userName = json["username"];
                    if(userName && typeof  userName == 'string' && userName.trim().length > 0){
                        //try to log user in with username and facebook access token

                        app.service.connect((success) => {
                            if (success) {
                                app.service.requestAuthen(userName, "", false, false,accessToken , (error, result) => {

                                    debug(`error ${error} result ${result}`);
                                    debug(`===> this `, this);
                                    this.hideLoading();

                                    if (error) {
                                        error = JSON.parse(error);
                                        log('Login error:');
                                        this.addPopup(app.getMessageFromServer(error.p.ec));
                                    }
                                    if (result) {
                                        log(result);
                                        log(`Logged in as ${app.context.getMe().name}`);
                                        this.changeScene(app.const.scene.DASHBOARD_SCENE);
                                    }
                                });
                            }
                        });
                    }
                    else{
                        this.prom = new PromptPopupRub(cc.director.getScene(), { green: this.onUserDonePickupName }, { label: { text: 'Chọn tên đăng nhập:' } }, this);
                        this.prom.init();
                    }
                }
                else{

                }
            }
        };
        xhr.open("GET", `http://${app.config.host}:3767/user/fb/${fbId}`, true);
        xhr.send();
    }


    handleLoginAction() {
        this.changeScene(app.const.scene.LOGIN_SCENE);
        // this.showLoading();
        // app.service.connect((success) => {
        //     log("success: " + success);
        //     if (success) {
        //         app.service.requestAuthen('crush1', "1234nm", false, true,null, (error, result) => {
        //             error = JSON.parse(error);
        //             this.hideLoading();
        //             if (result) {
        //                 log(app.context.getMe());
        //                 this.changeScene(app.const.scene.DASHBOARD_SCENE);
        //             }
        //             if (error) {
        //                 this.addPopup(app.getMessageFromServer(error.p.ec));
        //             }
        //         });
        //     }
        // });
    }

    // _loginToDashboard(username, password) {
    //     this.showLoading();
    //     app.service.connect((success) => {
    //         if (success) {
    //             app.service.requestAuthen(username, password, false, true,null, (error, result) => {
    //                 error = JSON.parse(error);
    //                 this.hideLoading();
    //                 if (error) {
    //                     log('Login error:');
    //                     this.addPopup(app.getMessageFromServer(error.p.ec));
    //                 }
    //                 if (result) {
    //                     log(result);
    //                     log(`Logged in as ${app.context.getMe().name}`);
    //                     this.changeScene(app.const.scene.DASHBOARD_SCENE);
    //                 }
    //             });
    //         }
    //     });
    // }

    handleRegisterButton() {
        this.showLoading();
        this.changeScene(app.const.scene.REGISTER_SCENE);
    }

    handlePlayNowButton() {
        this.showLoading();
        app.service.connect((success) => {
            log("success: " + success);
            if (success) {
                app.service.requestAuthen(this._generateUserName("ysad12", app.DEVICE_ID, 0, 5), this._generateUserName("yz212", app.DEVICE_ID, 0, 6), false, true,null , (error, result) => {

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

    test() {
        debug(this.prom.getVal());
    }

    handleFacebookLoginAction() {
        // AlertPopupRub.show(this.node, "Chức năng đang cập nhật!");
        // this.prom = new PromptPopupRub(this.node, { confirmBtn: this.test }, { label: { text: 'dafuq ?' } }, this);
        // this.prom.init();

        if(cc.sys.isMobile) {

            if(!sdkbox.PluginFacebook.isLoggedIn()){
                this.accessToken = null;
                sdkbox.PluginFacebook.login();
            }
            else{
                const fbId = sdkbox.PluginFacebook.getUserID();
                this.accessToken = sdkbox.PluginFacebook.getAccessToken();
                log(`fbId ${fbId} and token ${this.accessToken}`);
                this.getUserByFbId(fbId , this.accessToken);
            }

        }
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