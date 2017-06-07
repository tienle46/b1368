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

        this.properties = {
            ...this.properties,
            facebookButton: cc.Button
        }
    }

    onLoad() {
        if(!app.facebookActions) {
            app.facebookActions = new FacebookActions();
        }
        app.facebookActions.init(this._activeFacebookBtn.bind(this));
       
        super.onLoad();
    }

    start() {
        super.start();
        
        if (app.buddyManager) {
            app.buddyManager.reset();
        } else {
            app.buddyManager = new BuddyManager();
        }

        app.service.client._reset(true);
        app.context.reset()
        
        if(!app.jarManager) {
            app.jarManager = new JarManager();
        }
    }

    handleLoginAction() {
        this.changeScene(app.const.scene.LOGIN_SCENE);
    }

    handleRegisterButton() {
        this.changeScene(app.const.scene.REGISTER_SCENE);
    }

    handlePlayNowButton() {
        if (app.env.isMobile() || app.env.isBrowserTest()) {
            this.loginToDashboard("", "", false, true);
        } else {
            app.system.info(app.res.string('play_now_not_support_on_mobile'))
        }
    }

    handleFacebookLoginAction() {
        this.accessToken = null;
        this.showLoading(app.res.string('logging_in_via_facebook'));
        
        app.facebookActions.login(this._onLoginWithAccessToken.bind(this))
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