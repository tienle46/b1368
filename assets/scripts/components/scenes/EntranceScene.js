/* eslint-disable no-undef, no-unused-vars */
import app from 'app';
import BaseScene from 'BaseScene';
import BuddyManager from 'BuddyManager';
import PromptPopup from 'PromptPopup';
import JarManager from 'JarManager';
import FacebookActions from 'FacebookActions';

class EntranceScene extends BaseScene {

    constructor() {
        super();
        
        this.properties = this.assignProperties({
            facebookButton: cc.Button
        });
    }

    onLoad() {
        if(!app.facebookActions) {
            app.facebookActions = new FacebookActions();
        }
        app.facebookActions.init(this._activeFacebookBtn.bind(this));
        app.context.setCtlData(null);
        
        super.onLoad();
    }

    start() {
        super.start();
        if (app.buddyManager) {
            app.buddyManager.reset();
        } else {
            app.buddyManager = new BuddyManager();
        }

        app.service.getClient()._reset(true);
        app.context.reset()
        
        if(!app.jarManager) {
            app.jarManager = new JarManager();
        }
        
        app.env.isBrowser() && app.system._quickAuthen();
    }

    handleLoginAction() {
        this.changeScene(app.const.scene.LOGIN_SCENE);
    }

    handleRegisterButton() {
        this.changeScene(app.const.scene.REGISTER_SCENE);
    }
    doPlaynow(){
        this.loginToDashboard("", "", false, true);
    }
    doLoginFacebook(){
        this.showLoading(app.res.string('logging_in_via_facebook'));
        
        app.facebookActions.login(this._onLoginWithAccessToken.bind(this))
    }
    handlePlayNowButton() {
        if (app.env.isMobile() || app.env.isBrowserTest()) {
            
            if(app.config.use_recaptcha && app.env.isAndroid()){
                //call jsb
                this.showLoading();
                window.jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSBUtils", "verifyWithReCaptcha", "(Ljava/lang/String;)V","playNow");
            }
            else{
                this.doPlaynow();
            }
        } else {
            app.system.info(app.res.string('play_now_not_support_on_mobile'))
        }
    }

    handleFacebookLoginAction() {
        if(app.config.use_recaptcha && app.env.isAndroid()){
            window.jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSBUtils", "verifyWithReCaptcha", "(Ljava/lang/String;)V", "fbLogin");
        }
        else{
            this.doLoginFacebook();
        }
    }

    _activeFacebookBtn() {
        this && this.facebookButton && (this.facebookButton.interactable = true);
    }

    // _generateUserName(key, deviceId, count, maxCall) {
    //     try {
    //         if (count < maxCall) {
    //             let code2 = `${this._javaHashcode(deviceId)}${key}xintaocho`;
    //             return this._generateUserName(key, code2, count + 1, maxCall);
    //         }
    //         return `p${Math.abs(this._javaHashcode(deviceId))}`;
    //     } catch (e) {
    //         app.system.info(app.res.string('play_now_not_available_right_now'))
    //     }
    // }
    //
    // _javaHashcode(str) {
    //     let hash = 0;
    //
    //     try {
    //         if (str.length == 0) return hash;
    //         for (let i = 0; i < str.length; i++) {
    //             let char = str.charCodeAt(i);
    //             hash = ((hash << 5) - hash) + char;
    //             hash = hash & hash; // Convert to 32bit integer
    //         }
    //         return hash;
    //     } catch (e) {
    //         throw new Error('hashCode: ' + e);
    //     }
    // }

}

app.createComponent(EntranceScene);