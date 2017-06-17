import app from 'app';
import utils from 'utils';
import DialogActor from 'DialogActor';
import SFS2X from 'SFS2X';
import Events from 'Events';
import HttpImageLoader from 'HttpImageLoader';
import PromptPopup from 'PromptPopup';
import CCUtils from 'CCUtils';
import Linking from 'Linking';

class TopBar extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            userInfoCoinLbl: cc.Label,
            userNameLbl: cc.Label,
            msgNotifyBgNode: cc.Node,
            avatarSpriteNode: cc.Node,
            notifyCounterLbl: cc.Label,
            buddyNotifyLbl: cc.Label,
            buddyNotifyNode: cc.Node,
            dropDownOptions: cc.Node,
            dropDownBgNode: cc.Node,
            promptPrefab: cc.Prefab,
            settingDialog: cc.Prefab,
            vipLevel: cc.Label,
            fanPageNode: cc.Node,
            shopBtnNode: cc.Node
        };
    }

    onLoad() {
        super.onLoad();
        this.dropDownBgNode.on(cc.Node.EventType.TOUCH_END, () => this.dropDownOptions.active = false);
        this.vipLevel.string = app.context.getMyInfo().vipLevel;
        CCUtils.setVisible(this.msgNotifyBgNode, false);
    }

    onEnable() {
        super.onEnable()
        this._fillUserData()
        this._onBuddyNotifyCountChanged()
        this._onMessageCountChanged()
    }

    start() {
        super.start();
        this._requestMessageNotification();
        
        if(this.avatarSpriteNode){
            let sprite = this.avatarSpriteNode.getComponent(cc.Sprite);
            // app.context.getMyInfo().avatarUrl ? HttpImageLoader.loadImageToSprite(sprite, app.context.getMyInfo().avatarUrl) : HttpImageLoader.loadDefaultAvatar(sprite);
            app.context.getMyAvatar(sprite, 'thumb');
        }
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
        app.system.addListener(Events.ON_BUDDY_UNREAD_MESSAGE_COUNT_CHANGED, this._onBuddyNotifyCountChanged, this);
        app.system.addListener(Events.CLIENT_CONFIG_CHANGED, this._onConfigChanged, this);
        app.system.addListener(Events.ON_MESSAGE_COUNT_CHANGED, this._onMessageCountChanged, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
        app.system.removeListener(Events.ON_BUDDY_UNREAD_MESSAGE_COUNT_CHANGED, this._onBuddyNotifyCountChanged, this);
        app.system.removeListener(Events.CLIENT_CONFIG_CHANGED, this._onConfigChanged, this);
        app.system.removeListener(Events.ON_MESSAGE_COUNT_CHANGED, this._onMessageCountChanged, this);
    }

    onClickLogout() {
        app.system.confirm(
            app.res.string('really_wanna_quit'),
            null,
            this._onConfirmLogoutClick.bind(this)
        );
        this._hideDropDownMenu()
    }

    onFanpageClicked() {
        cc.sys.openURL(`${app.config.fanpage}`);
        this._hideDropDownMenu()
    }

    giveFeedbackClicked() {
        PromptPopup.show(app.system.getCurrentSceneNode(), {
            handler: this._onFeedbackConfirmed.bind(this),
            title: 'Góp ý',
            description: 'Nhập ý kiến',
            acceptLabelText: "Gửi"
        })
        this._hideDropDownMenu()
    }

    onClickLogout() {
        app.system.confirm(
            app.res.string('really_wanna_quit'),
            null,
            this._onConfirmLogoutClick.bind(this)
        );
        this._hideDropDownMenu()
    }

    handleSettingAction(e) {
        let dialog = cc.instantiate(this.settingDialog);
        app.system.getCurrentSceneNode().addChild(dialog);
    }

    handleMoreAction() {
        let state = this.dropDownOptions.active;
        this.dropDownOptions.active = !state;
    }

    updateUserCoin() {
        this.userInfoCoinLbl.string = `${utils.numberFormat(app.context.getMeBalance() || 0)}`;
    }

    onClickNapXuAction() {
        app.visibilityManager.goTo(Linking.ACTION_TOPUP);
    }

    onFriendBtnClick() {
        app.visibilityManager.goTo(Linking.ACTION_BUDDY);
    }

    onClickTransferAwardAction() {
        app.visibilityManager.goTo(Linking.ACTION_EXCHANGE);
    }

    callSupportClicked(e) {
        cc.sys.openURL(`tel:${app.config.supportHotline}`);
    }

    onClickMessageAction() {
        app.visibilityManager.goTo(Linking.ACTION_SYSTEM_MESSAGE);
    }

    onClickUserInfoAction() {
        app.visibilityManager.goTo(Linking.ACTION_PERSONAL_INFO);
    }
    
    _fillUserData() {
        this.userNameLbl.string = app.context.getMeDisplayName()
        this.userInfoCoinLbl.string = `${utils.numberFormat(app.context.getMeBalance() || 0)}`;
    }

    _onFeedbackConfirmed(content) {
        //collect user feedback and send to server
        if (content && content.trim().length > 0) {
            var sendObject = {
                'cmd': app.commands.SEND_FEEDBACK,
                'data': {
                    [app.keywords.REQUEST_FEEDBACK]: content
                }
            };

            app.service.send(sendObject, (data) => {
                if (data && data["s"]) {
                    app.system.showToast(app.res.string('feedback_sent_successfully'));
                } else {
                    app.system.showToast(app.res.string('error_while_sending_feedback'));
                }

            }, app.const.scene.DASHBOARD_SCENE);
        }
        return true;
    }

    _onMessageCountChanged(){
        let totalMessageCount = app.context.getTotalMessageCount();
        this.notifyCounterLbl.string = totalMessageCount;
        this.msgNotifyBgNode.active = totalMessageCount > 0;
    }
    
    _requestMessageNotification() {
        let sendObject = {
            cmd: app.commands.NEW_NOTIFICATION_COUNT
        };
        app.service.send(sendObject);
    }
    
    _onConfirmLogoutClick() {
        app.service.manuallyDisconnect();
    }

    _hideDropDownMenu() {
        CCUtils.setVisible(this.dropDownOptions, false)
    }

    _onConfigChanged() {
        app.context.getMyAvatar(this.avatarSpriteNode.getComponent(cc.Sprite), 'thumb')
        // HttpImageLoader.loadDefaultAvatar(this.avatarSpriteNode.getComponent(cc.Sprite));
    }

    _onBuddyNotifyCountChanged(count) {
        if (count > 0) {
            this.buddyNotifyLbl.string = `${count}`;
            utils.setVisible(this.buddyNotifyNode, true);
        } else {
            this.buddyNotifyLbl.string = '';
            utils.setVisible(this.buddyNotifyNode, false);
        }
    }

    _onUserVariablesUpdate(ev) {
        let changedVars = ev[app.keywords.BASE_EVENT_CHANGED_VARS] || [];
        changedVars.map(v => {
            if (v == app.keywords.USER_VARIABLE_BALANCE) {
                this.userInfoCoinLbl.string = `${utils.numberFormat(app.context.getMeBalance() || 0)}`;
            }
            
            if(v == app.keywords.CHANGE_AVATAR_URL) {
                let sprite = this.avatarSpriteNode.getComponent(cc.Sprite);
                // sprite && (RubUtils.loadImageToSprite(sprite, app.context.getMyInfo().avatarUrl))
                sprite && app.context.getMyAvatar(sprite, 'thumb');
            }
            
            if(v == app.keywords.USER_VARIABLE_DISPLAY_NAME) {
                let me = app.context.getMyInfo();
                this.userNameLbl.string = app.context.getMyInfo().displayName;
            }
            
            if(v == app.keywords.VIP_LEVEL) {
                this.vipLevel.string = app.context.getMyInfo().vipLevel;
            }
        });
    }

}

app.createComponent(TopBar);