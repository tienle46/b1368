import app from 'app';
import utils from 'utils';
import DialogActor from 'DialogActor';
import DialogRub from 'DialogRub';
import TopupDialogRub from 'TopupDialogRub';
import ExchangeDialogRub from 'ExchangeDialogRub';
import PersonalInfoDialogRub from 'PersonalInfoDialogRub';
import MessageCenterDialogRub from 'MessageCenterDialogRub';
import numeral from 'numeral';
import SFS2X from 'SFS2X';
import Events from 'Events';
import BuddyPopup from 'BuddyPopup';
import HttpImageLoader from 'HttpImageLoader';

class BottomBar extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            userInfoCoinLbl: cc.Label,
            userNameLbl: cc.Label,
            notifyBgNode: cc.Node,
            avatarSpriteNode: cc.Node,
            notifyCounterLbl: cc.Label,
            buddyNotifyLbl: cc.Label,
            buddyNotifyNode: cc.Node,
        };
    }

    onEnable() {
        super.onEnable();
        this._fillUserData();
        this._onBuddyNotifyCountChanged();
    }

    start() {
        super.start();
        this._requestMessageNotification(app.context.unreadMessageBuddies.length);
        this.avatarSpriteNode && HttpImageLoader.loadDefaultAvatar(this.avatarSpriteNode.getComponent(cc.Sprite));
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
        let changedVars = ev[app.keywords.BASE_EVENT_CHANGED_VARS]
        changedVars.map(v => {
            if (v == 'coin') {
                this.userInfoCoinLbl.string = `${numeral(app.context.getMeBalance() || 0).format('0,0')}`;
            }
        });

    }

    updateUserCoin() {
        this.userInfoCoinLbl.string = `${numeral(app.context.getMeBalance() || 0).format('0,0')}`;
    }

    onClickNapXuAction() {
        (function() {
            let scene = app.system.getCurrentSceneNode();
            TopupDialogRub.show(scene);
        }())
    }

    onClickTopRankAction() {
        let url = `${app.const.DIALOG_DIR_PREFAB}/rank`;
        let tabs = [{
            title: 'Top VIP',
            value: `${url}/tab_top_vip`
        }, {
            title: 'Top Cao thủ',
            value: `${url}/tab_top_cao_thu`
        }, {
            title: 'Top Đại gia',
            value: `${url}/tab_top_dai_gia`
        }];

        let dialogRub = DialogRub.show(app.system.getCurrentSceneNode(), tabs, { title: 'Xếp hạng' });
        window.free(dialogRub);
    }

    onFriendBtnClick() {
        let buddy = new BuddyPopup().show(this.node.parent);
        window.free(buddy);
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
        let exchangeDialogRub = ExchangeDialogRub.show(app.system.getCurrentSceneNode(), tabs, { title: 'Đổi thưởng' });
        window.free(exchangeDialogRub);
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

        let messageCenterDialogRub = MessageCenterDialogRub.show(app.system.getCurrentSceneNode(), tabs, { title: 'Tin nhắn' });
        window.free(messageCenterDialogRub);
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

        let personalInfoDialogRub = PersonalInfoDialogRub.show(app.system.getCurrentSceneNode(), tabs, { title: 'Cá nhân' });
        window.free(personalInfoDialogRub);
    }

    _fillUserData() {
        this.userNameLbl.string = app.context.getMyInfo().name;

        this.userInfoCoinLbl.string = `${numeral(app.context.getMeBalance() || 0).format('0,0')}`;
    }

    _onNotifyCount(data) {
        let count = data[app.keywords.NEWS_CONTENT];
        this.notifyBgNode.active = count > 0;
        this.notifyCounterLbl.string = count;
    }

    _requestMessageNotification() {
        let sendObject = {
            cmd: app.commands.NEW_NOTIFICATION_COUNT
        };
        app.service.send(sendObject);
    }
}

app.createComponent(BottomBar);