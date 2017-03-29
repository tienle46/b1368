/**
 * Created by Thanh on 3/3/2017.
 */

import app from 'app';
import TopupDialogRub from 'TopupDialogRub';
import PersonalInfoDialogRub from 'PersonalInfoDialogRub';
import ExchangeDialogRub from 'ExchangeDialogRub';
import TopRankDialogRub from 'TopRankDialogRub';
import MessageCenterDialogRub from 'MessageCenterDialogRub';
import DialogRub from 'DialogRub';
import BuddyPopup from 'BuddyPopup';

class Linking {
    static goTo(action, data){
        try {
            data && (data = JSON.parse(data));
            switch(action) {
                case Linking.ACTION_PLAY_GAME:{
                    const {gameCode} = data;
                    app.context.setSelectedGame(gameCode);
                    app.system.loadScene(app.const.scene.LIST_TABLE_SCENE);
                    break;
                }
                
                case Linking.ACTION_TOPUP:
                case Linking.ACTION_TOPUP_CARD:
                case Linking.ACTION_TOPUP_SMS:
                case Linking.ACTION_TOPUP_IAP:
                case Linking.ACTION_TOPUP_HISTORY: {
                    this._handleOpenTopUpDialogAction(action, data);
                    break;
                }
                
                case Linking.ACTION_BANK:
                case Linking.ACTION_CASH:
                case Linking.ACTION_TRANSFER:
                case Linking.ACTION_GIFT_CODE:
                case Linking.ACTION_PERSONAL_INFO:
                case Linking.ACTION_PERSONAL_STATISTIC: {
                    this._handleOpenPersonalInfoDialogAction(action, data);
                    break;
                }
                
                case Linking.ACTION_EXCHANGE:
                case Linking.ACTION_EXCHANGE_CARD:
                case Linking.ACTION_EXCHANGE_ITEM:
                case Linking.ACTION_EXCHANGE_HISTORY:
                case Linking.ACTION_AGENT: {
                    this._handleOpenExchangeDialogAction(action, data);
                    break;
                }
                
                case Linking.ACTION_TOP_VIP:
                case Linking.ACTION_TOP_CAO_THU:
                case Linking.ACTION_TOP_DAI_GIA: {
                    this._handleOpenTopRankDialogAction(action, data);
                    break;   
                }
                
                case Linking.ACTION_SYSTEM_MESSAGE:
                case Linking.ACTION_PERSONAL_MESSAGE:
                case Linking.ACTION_FEEDBACK: {
                    this._handleOpenMessageCenterDialogAction(action, data);
                    break;
                }
                
                case Linking.ACTION_EVENT: {
                    let dialog = new DialogRub(this.node.parent, null, { title: 'Sự kiện' });
                    dialog.addBody('dashboard/dialog/prefabs/event/EventDialog', 'EventDialog');
                    break;
                }
                
                case Linking.ACTION_BUDDY:
                case Linking.ACTION_BUDDY_CHAT: {
                    this._handleOpenBuddyPopupAction(action, data);
                    break;
                }
                
                
                // TODO
                case Linking.ACTION_FANPAGE: break;
                case Linking.ACTION_WEBSITE: break;
                case Linking.ACTION_PLAYER_INFO: break;
            }
        } catch(e) {
            console.error(e);
            //TODO: need handle action when parse error occured !
        }
    }
    
    static _handleOpenBuddyPopupAction(actionCode) {
        let defaultTab = null;

        switch(actionCode) {
            case Linking.ACTION_BUDDY: {
                defaultTab = BuddyPopup.TAB_BUDDY_LIST_INDEX;
                break;
            }
            case Linking.ACTION_BUDDY_CHAT: {
                defaultTab = BuddyPopup.TAB_CHAT_INDEX;
                break;
            }
        }
        
        new BuddyPopup().show(app.system.getCurrentSceneNode(), {focusTabIndex: defaultTab});   
    }
    
    static _handleOpenMessageCenterDialogAction(actionCode) {
        let defaultTab = null;

        switch(actionCode) {
            case Linking.ACTION_SYSTEM_MESSAGE: {
                defaultTab = MessageCenterDialogRub.TAB_SYSTEM_MESSAGE_INDEX;
                break;
            }
            case Linking.ACTION_PERSONAL_MESSAGE: {
                defaultTab = MessageCenterDialogRub.TAB_PERSONAL_MESSAGE_INDEX;
                break;
            }
            case Linking.ACTION_FEEDBACK: {
                defaultTab = MessageCenterDialogRub.TAB_FEEDBACK_INDEX;
                break;
            }
        }
        
        new MessageCenterDialogRub().show(app.system.getCurrentSceneNode(), {focusTabIndex: defaultTab});   
    }
    
    static _handleOpenTopUpDialogAction(actionCode) {
        let defaultTab = null;
        
        switch(actionCode) {
            case Linking.ACTION_TOPUP:
            case Linking.ACTION_TOPUP_CARD: {
                defaultTab = TopupDialogRub.TAB_CARD_INDEX;
                break;
            }
            case Linking.ACTION_TOPUP_SMS: {
                defaultTab = TopupDialogRub.TAB_SMS_INDEX;
                break;
            }
            case Linking.ACTION_TOPUP_IAP: {
                defaultTab = TopupDialogRub.TAB_IAP_INDEX;
                break;
            }
            case Linking.ACTION_TOPUP_HISTORY: {
                defaultTab = TopupDialogRub.TAB_HISTORY_INDEX;
                break;
            }
        }
        
        new TopupDialogRub().show(app.system.getCurrentSceneNode(), {focusTabIndex: defaultTab});
    }
    
    
    static _handleOpenExchangeDialogAction(actionCode) {
        let defaultTab = null;

        switch(actionCode) {
            case Linking.ACTION_EXCHANGE:
            case Linking.ACTION_EXCHANGE_CARD: {
                defaultTab = ExchangeDialogRub.TAB_EXCHANGE_CARD_INDEX;
                break;
            }
            case Linking.ACTION_EXCHANGE_ITEM: {
                defaultTab = ExchangeDialogRub.TAB_EXCHANGE_ITEM_INDEX;
                break;
            }
            case Linking.ACTION_EXCHANGE_HISTORY: {
                defaultTab = ExchangeDialogRub.TAB_EXCHANGE_HISTORY_INDEX;
                break;
            }
            case Linking.ACTION_AGENT: {
                defaultTab = ExchangeDialogRub.TAB_EXCHANGE_AGENCY_INDEX;
                break;
            }
        }
        
        new ExchangeDialogRub().show(app.system.getCurrentSceneNode(), {focusTabIndex: defaultTab});
    }
    
    
    static _handleOpenPersonalInfoDialogAction(actionCode) {
        let defaultTab = null;
        
        switch(actionCode) {
            case Linking.ACTION_CASH:
            case Linking.ACTION_TRANSFER:
            case Linking.ACTION_BANK: {
                defaultTab = PersonalInfoDialogRub.TAB_USER_BANK_INDEX;
                break;
            }
            case Linking.ACTION_GIFT_CODE: {
                defaultTab = PersonalInfoDialogRub.TAB_SMS_INDEX;
                break;
            }
            case Linking.ACTION_PERSONAL_STATISTIC: {
                defaultTab = PersonalInfoDialogRub.TAB_USER_ACHIEVEMENTS_INDEX;
                break;
            }
            default: { //ACTION_PERSONAL_INFO
               defaultTab = PersonalInfoDialogRub.TAB_USER_INFO_INDEX;
               break; 
            }
        }
        
        new PersonalInfoDialogRub().show(app.system.getCurrentSceneNode(), {focusTabIndex: defaultTab});
    }
    
    static _handleOpenTopRankDialogAction(actionCode) {
        let defaultTab = null;
        switch(actionCode) {
            case Linking.ACTION_TOP_VIP: {
                defaultTab = TopRankDialogRub.TAB_TOP_VIP_INDEX;
                break;
            }
            case Linking.ACTION_TOP_CAO_THU: {
                defaultTab = TopRankDialogRub.TAB_TOP_CAO_THU_INDEX;
                break;
            }
            case Linking.ACTION_TOP_DAI_GIA: {
                defaultTab = TopRankDialogRub.TAB_TOP_DAI_GIA_INDEX;
                break;
            }
        }

        new TopRankDialogRub().show(app.system.getCurrentSceneNode(), {focusTabIndex: defaultTab});
    }
}

app.const.ACTION_CODES.forEach(actionCode => {
    Linking[`ACTION_${actionCode}`] = actionCode;
});
// Linking.ACTION_TOPUP = "TOPUP";
// Linking.ACTION_PLAY_GAME = "PLAY_GAME";

export default Linking;