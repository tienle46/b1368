/**
 * Created by Thanh on 2/20/2017.
 */

import app from 'app';
import Events from 'Events';
import MultiTabPopup from 'MultiTabPopup';

const tabModels = [
    {title: "Danh sách", prefabPath: 'popup/buddy/BuddyListTabBody', componentName: 'BuddyListTabBody'},
    {title: "Chat", prefabPath: 'popup/buddy/BuddyChatTabBody', componentName: 'BuddyChatTabBody'},
];

export default class BuddyPopup {

    constructor() {
        let node = cc.instantiate(app.res.prefab.multiTabPopup);
        /**
         * @type {MultiTabPopup}
         */
        this.multiTabPopup = node.getComponent("MultiTabPopup");
        this.multiTabPopup.changeToChatTab = this.changeToChatTab.bind(this);
        this.multiTabPopup.setComponentData({
            tabNotifyData: {
                [BuddyPopup.TAB_CHAT_INDEX]: app.context.getUnreadMessageBuddyCount()
            }
        })

        this.multiTabPopup._addGlobalListener = () => {
            app.system.addListener(Events.ON_BUDDY_UNREAD_MESSAGE_COUNT_CHANGED, this._onBuddyNotifyCountChanged, this);
        }

        this.multiTabPopup._removeGlobalListener = () => {
            app.system.removeListener(Events.ON_BUDDY_UNREAD_MESSAGE_COUNT_CHANGED, this._onBuddyNotifyCountChanged, this);
        }
    }

    _onBuddyNotifyCountChanged(count = 0){
        if(count < 0){
            count = 0;
        }
        this.multiTabPopup.setNotifyCountForTab(BuddyPopup.TAB_CHAT_INDEX, count);
    }

    changeToChatTab(data) {
        this.multiTabPopup && this.multiTabPopup.changeTab(BuddyPopup.TAB_CHAT_INDEX, data)
    }
    
    show(parentNode = cc.director.getScene(), options = {}){
        this.multiTabPopup.show(Object.assign({}, {parentNode, tabModels}, options));
    }
}

BuddyPopup.TAB_BUDDY_LIST_INDEX = 0;
BuddyPopup.TAB_CHAT_INDEX = 1;