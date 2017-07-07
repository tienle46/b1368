/**
 * Created by Thanh on 3/3/2017.
 */

import app from 'app';
import TopupDialogRub from 'TopupDialogRub';
import PersonalInfoDialogRub from 'PersonalInfoDialogRub';
import ExchangeDialogRub from 'ExchangeDialogRub';
import TopRankDialogRub from 'TopRankDialogRub';
import MessageCenterDialogRub from 'MessageCenterDialogRub';
import BuddyPopup from 'BuddyPopup';

const pendingActions = [];

function isJSON(str) {
    if ( /^\s*$/.test(str) ) return false;
    str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
    str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
    return (/^[\],:{}\s]*$/).test(str);
}


class Linking {

    static goTo(action, data) {
        log('!app.context.getMe()1', JSON.stringify(!app.context.getMe()));
        
        if (!app.context.getMe()) {
            log('!app.context.getMe()');
            pendingActions.push({
                action,
                data
            });
        }
        try {
            if (data && typeof data == "string" && isJSON(data))
                data = JSON.parse(data);
                
            log('action data', JSON.stringify(data))
            switch (action) {
                case Linking.ACTION_PLAY_GAME:
                    {
                        const {
                            gameCode
                        } = data;
                        app.context.setSelectedGame(gameCode);
                        app.system.loadScene(app.const.scene.LIST_TABLE_SCENE);
                        break;
                    }

                case Linking.ACTION_TOPUP:
                case Linking.ACTION_TOPUP_CARD:
                case Linking.ACTION_TOPUP_SMS:
                case Linking.ACTION_TOPUP_IAP:
                case Linking.ACTION_TOPUP_HISTORY:
                    {
                        this._handleOpenTopUpDialogAction(action, data);
                        break;
                    }

                case Linking.ACTION_BANK:
                case Linking.ACTION_CASH:
                case Linking.ACTION_TRANSFER:
                case Linking.ACTION_GIFT_CODE:
                case Linking.ACTION_PERSONAL_INFO:
                case Linking.ACTION_PERSONAL_STATISTIC:
                    {
                        this._handleOpenPersonalInfoDialogAction(action, data);
                        break;
                    }

                case Linking.ACTION_EXCHANGE:
                case Linking.ACTION_EXCHANGE_CARD:
                case Linking.ACTION_EXCHANGE_ITEM:
                case Linking.ACTION_EXCHANGE_HISTORY:
                case Linking.ACTION_AGENT:
                    {
                        this._handleOpenExchangeDialogAction(action, data);
                        break;
                    }

                case Linking.ACTION_TOP_VIP:
                case Linking.ACTION_TOP_CAO_THU:
                case Linking.ACTION_TOP_DAI_GIA:
                    {
                        this._handleOpenTopRankDialogAction(action, data);
                        break;
                    }

                case Linking.ACTION_SYSTEM_MESSAGE:
                case Linking.ACTION_PERSONAL_MESSAGE:
                case Linking.ACTION_FEEDBACK:
                    {
                        this._handleOpenMessageCenterDialogAction(action, data);
                        break;
                    }

                case Linking.ACTION_EVENT:
                    {
                        let dialog = cc.instantiate(app.res.prefab.eventDialog);
                        app.system.getCurrentSceneNode().addChild(dialog);
                        break;
                    }

                case Linking.ACTION_BUDDY:
                case Linking.ACTION_BUDDY_CHAT:
                    {
                        this._handleOpenBuddyPopupAction(action, data);
                        break;
                    }


                    // TODO
                case Linking.ACTION_FANPAGE:
                    cc.sys.openURL(`${app.config.fanpage}`);
                    break;
                case Linking.ACTION_WEBSITE:
                    cc.sys.openURL(`${app.config.website}`);
                    break;
                case Linking.ACTION_PLAYER_INFO:
                    break;
                case Linking.ACTION_SHOW_TOAST:
                    this._handleShowToastAction(action, data);
                    break;
            }
        } catch (e) {
            console.error(e);
            //TODO: need handle action when parse error occured !
        }
    }
    
    static handlePendingActions() {
        log(`handling pending actions:`, JSON.stringify(pendingActions));
        if (pendingActions.length == 0) return;

        pendingActions.forEach(a => {
            this.goTo(a.action, a.data);
        });
        pendingActions.length = 0;
    }

    static _handleOpenBuddyPopupAction(actionCode) {
        let defaultTab = null;

        switch (actionCode) {
            case Linking.ACTION_BUDDY:
                {
                    defaultTab = BuddyPopup.TAB_BUDDY_LIST_INDEX;
                    break;
                }
            case Linking.ACTION_BUDDY_CHAT:
                {
                    defaultTab = BuddyPopup.TAB_CHAT_INDEX;
                    break;
                }
        }

        new BuddyPopup().show(app.system.getCurrentSceneNode(), {
            focusTabIndex: defaultTab
        });
    }

    static _handleOpenMessageCenterDialogAction(actionCode) {
        let defaultTab = null;

        switch (actionCode) {
            case Linking.ACTION_SYSTEM_MESSAGE:
                {
                    defaultTab = MessageCenterDialogRub.TAB_SYSTEM_MESSAGE_INDEX;
                    break;
                }
            case Linking.ACTION_PERSONAL_MESSAGE:
                {
                    defaultTab = MessageCenterDialogRub.TAB_PERSONAL_MESSAGE_INDEX;
                    break;
                }
            case Linking.ACTION_FEEDBACK:
                {
                    defaultTab = MessageCenterDialogRub.TAB_FEEDBACK_INDEX;
                    break;
                }
        }

        new MessageCenterDialogRub().show(app.system.getCurrentSceneNode(), {
            focusTabIndex: defaultTab
        });
    }

    static _handleOpenTopUpDialogAction(actionCode) {
        let defaultTab = null;

        switch (actionCode) {
            case Linking.ACTION_TOPUP:
            case Linking.ACTION_TOPUP_CARD:
                {
                    defaultTab = TopupDialogRub.TAB_CARD_INDEX;
                    break;
                }
            case Linking.ACTION_TOPUP_SMS:
                {
                    defaultTab = TopupDialogRub.TAB_SMS_INDEX;
                    break;
                }
            case Linking.ACTION_TOPUP_IAP:
                {
                    defaultTab = TopupDialogRub.TAB_IAP_INDEX;
                    break;
                }
            case Linking.ACTION_TOPUP_HISTORY:
                {
                    defaultTab = TopupDialogRub.TAB_HISTORY_INDEX;
                    break;
                }
        }

        new TopupDialogRub().show(app.system.getCurrentSceneNode(), {
            focusTabIndex: defaultTab
        });
    }


    static _handleOpenExchangeDialogAction(actionCode) {
        let defaultTab = null;
        
        if(app.config.ALPHA_TEST) {
            app.system.info(app.res.string('coming_soon'));
            return;
        }
       
        switch (actionCode) {
            case Linking.ACTION_EXCHANGE:
            case Linking.ACTION_EXCHANGE_CARD:
                {
                    defaultTab = ExchangeDialogRub.TAB_EXCHANGE_CARD_INDEX;
                    break;
                }
            case Linking.ACTION_EXCHANGE_ITEM:
                {
                    defaultTab = ExchangeDialogRub.TAB_EXCHANGE_ITEM_INDEX;
                    break;
                }
            case Linking.ACTION_EXCHANGE_HISTORY:
                {
                    defaultTab = ExchangeDialogRub.TAB_EXCHANGE_HISTORY_INDEX;
                    break;
                }
            case Linking.ACTION_AGENT:
                {
                    defaultTab = ExchangeDialogRub.TAB_EXCHANGE_AGENCY_INDEX;
                    break;
                }
        }
        
        
        if(app.context.getMyInfo().verified) {
            new ExchangeDialogRub().show(app.system.getCurrentSceneNode(), {
                focusTabIndex: defaultTab
            });
        } else {
            app.system.confirm(
                app.res.string('error_un_verified'),
                null,
                this._onShowVerifyCode.bind(this)
            );
        }
    }
    
    static _onShowVerifyCode() {
        let dialog = cc.instantiate(app.res.prefab.verificationDialog);
        app.system.getCurrentSceneNode().addChild(dialog, 100);
    }
    
    static _handleOpenPersonalInfoDialogAction(actionCode, data) {
        let defaultTab = null;

        switch (actionCode) {
            case Linking.ACTION_CASH:
            case Linking.ACTION_TRANSFER:
            case Linking.ACTION_BANK:
                {
                    defaultTab = PersonalInfoDialogRub.TAB_USER_BANK_INDEX;
                    break;
                }
            case Linking.ACTION_GIFT_CODE:
                {
                    defaultTab = PersonalInfoDialogRub.TAB_SMS_INDEX;
                    break;
                }
            case Linking.ACTION_PERSONAL_STATISTIC:
                {
                    defaultTab = PersonalInfoDialogRub.TAB_USER_ACHIEVEMENTS_INDEX;
                    break;
                }
            default:
                { //ACTION_PERSONAL_INFO
                    defaultTab = PersonalInfoDialogRub.TAB_USER_INFO_INDEX;
                    break;
                }
        }

        let personalRub = new PersonalInfoDialogRub();
        data && personalRub.changeToTab(defaultTab, data);
        personalRub.show(app.system.getCurrentSceneNode(), {
            focusTabIndex: defaultTab
        });
    }

    static _handleOpenTopRankDialogAction(actionCode) {
        let defaultTab = null;
        switch (actionCode) {
            case Linking.ACTION_TOP_VIP:
                {
                    defaultTab = TopRankDialogRub.TAB_TOP_VIP_INDEX;
                    break;
                }
            case Linking.ACTION_TOP_CAO_THU:
                {
                    defaultTab = TopRankDialogRub.TAB_TOP_CAO_THU_INDEX;
                    break;
                }
            case Linking.ACTION_TOP_DAI_GIA:
                {
                    defaultTab = TopRankDialogRub.TAB_TOP_DAI_GIA_INDEX;
                    break;
                }
        }

        new TopRankDialogRub().show(app.system.getCurrentSceneNode(), {
            focusTabIndex: defaultTab
        });
    }
    static _handleShowToastAction(actionCode, data) {
        log(`_handleShowToastAction data ${data.message}`);
        app.system.showToast(data.message);
    }
    static isExchangeAction(action) {
        switch(action) {
            case Linking.ACTION_EXCHANGE:
            case Linking.ACTION_EXCHANGE_CARD:
            case Linking.ACTION_EXCHANGE_ITEM:
            case Linking.ACTION_EXCHANGE_HISTORY:
            case Linking.ACTION_AGENT:
                return true;
        }
        
        return false;
    }
    
    static isBankOrGiftCodeAction(action) {
        switch(action) {
            case Linking.ACTION_BANK:
            case Linking.ACTION_CASH:
            case Linking.ACTION_TRANSFER:
            case Linking.ACTION_GIFT_CODE:
                return true;
        }
        
        return false;
    }
}

// app.const.ACTION_CODES.forEach(actionCode => {
//     Linking[`ACTION_${actionCode}`] = actionCode;
// });

Linking.ACTION_CASH = 'CASH'
Linking.ACTION_TRANSFER = 'TRANSFER'
Linking.ACTION_TOPUP = 'TOPUP'
Linking.ACTION_TOPUP_CARD = 'TOPUP_CARD'
Linking.ACTION_TOPUP_SMS = 'TOPUP_SMS'
Linking.ACTION_TOPUP_IAP = 'TOPUP_IAP'
Linking.ACTION_EVENT = 'EVENT'
Linking.ACTION_BUDDY = 'BUDDY'
Linking.ACTION_BANK = 'BANK'
Linking.ACTION_GIFT_CODE = 'GIFT_CODE'
Linking.ACTION_SYSTEM_MESSAGE = 'SYSTEM_MESSAGE'
Linking.ACTION_PERSONAL_MESSAGE = 'PERSONAL_MESSAGE'
Linking.ACTION_EXCHANGE = 'EXCHANGE'
Linking.ACTION_EXCHANGE_CARD = 'EXCHANGE_CARD'
Linking.ACTION_EXCHANGE_ITEM = 'EXCHANGE_ITEM'
Linking.ACTION_EXCHANGE_HISTORY = 'EXCHANGE_HISTORY'
Linking.ACTION_BUDDY_CHAT = 'BUDDY_CHAT'
Linking.ACTION_FEEDBACK = 'FEEDBACK'
Linking.ACTION_FANPAGE = 'FANPAGE'
Linking.ACTION_WEBSITE = 'WEBSITE'
Linking.ACTION_TOP_VIP = 'TOP_VIP'
Linking.ACTION_TOP_CAO_THU = 'TOP_CAO_THU'
Linking.ACTION_TOP_DAI_GIA = 'TOP_DAI_GIA'
Linking.ACTION_AGENT = 'AGENT'
Linking.ACTION_TOPUP_HISTORY = 'TOPUP_HISTORY'
Linking.ACTION_PERSONAL_INFO = 'PERSONAL_INFO'
Linking.ACTION_PLAYER_INFO = 'PLAYER_INFO'
Linking.ACTION_PERSONAL_STATISTIC = 'PERSONAL_STATISTIC'
Linking.ACTION_PLAY_GAME = 'PLAY_GAME'
Linking.ACTION_SHOW_TOAST = 'SHOW_TOAST'
// Linking.ACTION_TOPUP = "TOPUP";
// Linking.ACTION_PLAY_GAME = "PLAY_GAME";

export default Linking;