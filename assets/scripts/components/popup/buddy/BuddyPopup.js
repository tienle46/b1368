/**
 * Created by Thanh on 2/20/2017.
 */

import app from 'app';
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
    }

    changeToChatTab(data) {
        this.multiTabPopup && this.multiTabPopup.changeTab(BuddyPopup.TAB_CHAT_INDEX, data);
    }

    show(parentNode = cc.director.getScene(), options = {}){
        this.multiTabPopup.show({parentNode, tabModels, ...options});
    }
}

BuddyPopup.TAB_BUDDY_LIST_INDEX = 0;
BuddyPopup.TAB_CHAT_INDEX = 1;