import app from 'app';
import utils from 'utils';
import DialogActor from 'DialogActor';
import DialogRub from 'DialogRub';
import TopupDialogRub from 'TopupDialogRub';
import ExchangeDialogRub from 'ExchangeDialogRub';
import PersonalInfoDialogRub from 'PersonalInfoDialogRub';
import MessageCenterDialogRub from 'MessageCenterDialogRub';
import SFS2X from 'SFS2X';
import Events from 'Events';
import BuddyPopup from 'BuddyPopup';
import HttpImageLoader from 'HttpImageLoader';
import PromptPopup from 'PromptPopup';
import CCUtils from 'CCUtils';

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
            soundControl: cc.Node,
        };
    }

    onLoad() {
        super.onLoad();
        this.dropDownBgNode.on(cc.Node.EventType.TOUCH_END, () => this.dropDownOptions.active = false);
    }

    onEnable() {
        super.onEnable();
        this._fillUserData();
        this._onBuddyNotifyCountChanged();
    }

    start() {
        super.start();
        this._requestMessageNotification(app.context.unreadMessageBuddies.length);
        if(this.avatarSpriteNode){
            let sprite = this.avatarSpriteNode.getComponent(cc.Sprite);
            app.context.getMyInfo().avatarUrl ? HttpImageLoader.loadImageToSprite(sprite, app.context.getMyInfo().avatarUrl) : HttpImageLoader.loadDefaultAvatar(sprite);
        }
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.NEW_NOTIFICATION_COUNT, this._onNotifyCount, this);
        app.system.addListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
        app.system.addListener(Events.ON_BUDDY_UNREAD_MESSAGE_COUNT_CHANGED, this._onBuddyNotifyCountChanged, this);
        app.system.addListener(Events.CLIENT_CONFIG_CHANGED, this._onConfigChanged, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.NEW_NOTIFICATION_COUNT, this._onNotifyCount, this);
        app.system.removeListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
        app.system.removeListener(Events.ON_BUDDY_UNREAD_MESSAGE_COUNT_CHANGED, this._onBuddyNotifyCountChanged, this);
        app.system.removeListener(Events.CLIENT_CONFIG_CHANGED, this._onConfigChanged, this);
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

    onSoundBtnClick() {
        this.soundControl && this.soundControl.getComponent('SoundControl').show();
    }

    handleSettingAction(e) {
        //TODO
    }

    handleMoreAction() {
        let state = this.dropDownOptions.active;
        this.dropDownOptions.active = !state;
    }

    updateUserCoin() {
        this.userInfoCoinLbl.string = `${utils.numberFormat(app.context.getMeBalance() || 0)}`;
    }

    onClickNapXuAction() {
        let scene = app.system.getCurrentSceneNode();
        TopupDialogRub.show(scene);
    }

    onFriendBtnClick() {
        let buddy = new BuddyPopup().show(this.node.parent);
        buddy = null;
    }

    onClickTransferAwardAction() {
        let url = `${app.const.DIALOG_DIR_PREFAB}/exchange`;
        let tabs = [{
            title: 'Thẻ cào',
            value: `${url}/tab_exchange_card`
        }, {
            title: 'Vật phẩm',
            value: `${url}/tab_exchange_item`
        }, {
            title: 'Lịch sử',
            value: `${url}/tab_exchange_history`
        }, {
            title: 'Đại lý',
            value: `${url}/tab_agency`
        }];

        // bottombar -> dashboard scene node
        ExchangeDialogRub.show(app.system.getCurrentSceneNode(), tabs, { title: 'Đổi thưởng' });
    }

    callSupportClicked(e) {
        cc.sys.openURL(`tel:${app.config.supportHotline}`);
    }

    onClickMessageAction() {
        let url = `${app.const.DIALOG_DIR_PREFAB}/messagecenter`;
        let tabs = [{
            title: 'Hệ thống',
            value: `${url}/tab_system_messages`
        }, {
            title: 'Cá nhân',
            value: `${url}/tab_personal_messages`
        }];

        MessageCenterDialogRub.show(app.system.getCurrentSceneNode(), tabs, { title: 'Tin nhắn' });
    }

    onClickUserInfoAction() {
        // personal tabs
        let url = `${app.const.DIALOG_DIR_PREFAB}/userinfo`;
        let tabs = [{
                title: 'Cá nhân',
                value: `${url}/tab_user_info`
            },
            {
                title: 'Thành tích',
                value: `${url}/tab_user_achievements`
            }, {
                title: 'Ngân hàng',
                value: `${url}/tab_user_bank`
            }
            // , {
            //     title: 'Gift Code',
            //     value: `${url}/tab_gift_code`
            // }
            // , {
            //     title: 'Chuyển chip',
            //     value: 'tab_transfer_vc'
            // }, {
            //     title: 'Nhận chip',
            //     value: 'tab_transfer_transaction'
            // }, 
        ];

        PersonalInfoDialogRub.show(app.system.getCurrentSceneNode(), tabs, { title: 'Cá nhân' });
    }


    /**
     * PRIVATES 
     */

    _fillUserData() {
        this.userNameLbl.string = app.context.getMyInfo().name;

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

    _onNotifyCount(data) {
        let count = data[app.keywords.NEWS_CONTENT];
        this.msgNotifyBgNode.active = count > 0;
        this.notifyCounterLbl.string = count;
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
        HttpImageLoader.loadDefaultAvatar(this.avatarSpriteNode.getComponent(cc.Sprite));
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
        console.debug('_onUserVariablesUpdate', ev);
        let changedVars = ev[app.keywords.BASE_EVENT_CHANGED_VARS]
        changedVars.map(v => {
            if (v == 'coin') {
                this.userInfoCoinLbl.string = `${utils.numberFormat(app.context.getMeBalance() || 0)}`;
            }
            
            if(v == app.keywords.CHANGE_AVATAR_URL) {
                let sprite = this.avatarSpriteNode.getComponent(cc.Sprite);
                sprite && (HttpImageLoader.loadImageToSprite(sprite, app.context.getMyInfo().avatarUrl))
            }
        });

    }

}

app.createComponent(TopBar);