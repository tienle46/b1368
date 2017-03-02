/**
 * Created by Thanh on 2/17/2017.
 */

import app from 'app';
import utils from 'utils';
import PopupTabBody from 'PopupTabBody';
import Events from 'Events';
import { destroy } from 'CCUtils';

class BuddyChatTabBody extends PopupTabBody {

    constructor() {
        super();

        this.properties = {
            ...this.properties,

            /**
             * @type {cc.EditBox}
             */
            chatEditBox: cc.EditBox,
            chatItemPrefab: cc.Prefab,
            chatContent: cc.Node,
            chatMessageList: cc.Node,
            chatErrorNode: cc.Node,
            chatErrorLabel: cc.Label,
            /**
             * @type{cc.Node}
             */
            chattingBuddyList: cc.Node,
            chatScroll: cc.ScrollView,
            chattingBuddyPrefab: cc.Prefab,
            toggleGroup: cc.ToggleGroup
        }

        this.buddy = null;
        this.chattingBuddyItems = null;
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(Events.ON_BUDDY_MESSAGE, this._onBuddyMessage, this);
        app.system.addListener(Events.ON_BUDDY_ONLINE_STATE_CHANGED, this._onBuddyOnlineStateChange, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(Events.ON_BUDDY_MESSAGE, this._onBuddyMessage, this);
        app.system.removeListener(Events.ON_BUDDY_ONLINE_STATE_CHANGED, this._onBuddyOnlineStateChange, this);
    }

    _onBuddyOnlineStateChange(isOnline, isItMe, buddy) {
        if (!isItMe) {
            let buddyItem = this._findChattingBuddy(buddy);
            buddyItem && buddyItem.onBuddyChanged();
        }
    }

    _onBuddyMessage(senderName, toBuddyName, message, isItMe) {

        console.log('sender, toBuddy, message, isItMe: ', senderName, toBuddyName, message, isItMe);

        if (!this.buddy) return;

        if (isItMe) {
            if (toBuddyName != this.buddy.name) return;
        } else {
            if (senderName != this.buddy.name) {
                let senderBuddy = this._findChattingBuddy(senderName);
                senderBuddy && senderBuddy.onBuddyChanged();
                return;
            }
        }

        this._addSingleMessage(senderName, message);
        !isItMe && app.context.removeUnreadMessageBuddies(senderName);

        if (!isItMe) {
            let buddy = app.buddyManager.getBuddyByName(senderName);
            buddy && (buddy.newMessageCount = 0);
        }

        this.chatScroll.scrollToBottom();
    }

    _findChattingBuddy(findingBuddy) {
        let buddyName = findingBuddy.name || findingBuddy;

        let findBuddyItem = null;
        this.chattingBuddyItems.some(buddyItem => {
            if (buddyItem.buddy.name == buddyName) {
                findBuddyItem = buddyItem;
                return true;
            }
        });

        return findBuddyItem;
    }

    onDataChanged(data) {
        if (!super.onDataChanged(data)) return;

        if (data) {
            data.chattingBuddies && this._initChattingBuddyList(data.chattingBuddies)
            this.buddy = data.buddy;
        }

        let buddyItem;
        if (!this.buddy) {
            buddyItem = this.chattingBuddyItems.length > 0 ? this.chattingBuddyItems[0] : undefined
            this.buddy = buddyItem && buddyItem.buddy;
        } else {
            buddyItem = this._findChattingBuddy(this.buddy);
        }


        if (this.buddy) {
            if (buddyItem) {
                if (buddyItem.isSelected()) {
                    this._onChangeSelectedBuddy(buddyItem);
                } else {
                    buddyItem.select();
                }
            } else {
                this._addChattingBuddy(this.buddy, true)
            }

            this.chatErrorNode.active && utils.setVisible(this.chatErrorNode, false);

        } else {
            this._onError(app.res.string('buddy_select_buddy_to_chat'));
        }

    }

    _addChattingBuddy(buddy, autoSelect = false) {
        if (!buddy) return;

        /**
         * @type {cc.Node}
         */
        let chattingBuddyNode = cc.instantiate(this.chattingBuddyPrefab);
        let chattingBuddy = chattingBuddyNode.getComponent('ChattingBuddyItem');

        if (chattingBuddy) {
            chattingBuddy.setBuddy(buddy);
            chattingBuddy.setToggleGroup(this.toggleGroup);
            chattingBuddy.setOnCheckedListener((buddyItem) => {
                this._onChangeSelectedBuddy(buddyItem);
            });

            this.chattingBuddyList.addChild(chattingBuddyNode);
            this.chattingBuddyItems.push(chattingBuddy);
            app.context.addToChattingBuddies(buddy);
            app.context.removeUnreadMessageBuddies(buddy.name);

            if (autoSelect) {
                chattingBuddy.select()
            }
        }
    }

    _onChangeSelectedBuddy(buddyItem) {

        if (buddyItem) {
            this.buddy = buddyItem.buddy;
            this.buddy.newMessageCount = 0;
            this.popup.setTitle(this.buddy.name);
            this._initMessageList();
            buddyItem.onReadMessage();
        } else {
            this._onError();
        }
    }

    _onError(message) {
        this.chatContent.active = false;

        if (message) {
            this.chatErrorNode && (this.chatErrorNode.active = true);
            this.chatErrorLabel && (this.chatErrorLabel.string = message);
        } else {
            this.chatErrorNode && (this.chatErrorNode.active = false);
        }
    }

    _loadMessages() {
        //TODO
    }

    _initMessageList() {
        this.chatMessageList.children.forEach(child => child.destroy() && child.removeFromParent(true));

        if (!this.chatContent.active) {
            this.chatErrorNode && (this.chatErrorNode.active = false);
            this.chatContent.active = true;
        }

        if (this.buddy.messages) {
            this.onMessageListChanged(this.buddy.messages);
        } else {
            this._loadMessages();
        }
    }

    onMessageListChanged(messages = []) {
        messages.forEach(messageObj => this._addSingleMessage(messageObj.sender, messageObj.message));
        this.chatScroll.scrollToBottom();
    }

    _addSingleMessage(sender, message) {
        let chatItemNode = cc.instantiate(this.chatItemPrefab);
        let chatItem = chatItemNode.getComponent('BuddyChatItem');
        chatItem && chatItem.setMessage(sender, message);
        this.chatMessageList.addChild(chatItemNode);

        if (this.chatMessageList.children.length > app.const.NUMBER_MESSAGES_KEEP_PER_BUDDY) {
            let removeNode = this.chatMessageList.children[0];
            destroy(removeNode);
        }
    }

    sendInputMessage() {
        if (this.buddy) {
            if (this.buddy.isOnline()) {
                let message = this.chatEditBox.string;
                if (message.trim().length > 0) {
                    app.buddyManager.sendMessage(message, this.buddy.name);
                }
            } else {
                this.notifyOnlyChatWithOnlineUser();
            }

            this.chatEditBox.string = "";
        }

        this.chatEditBox.setFocus();
    }

    notifyOnlyChatWithOnlineUser() {
        this._addSingleMessage(null, app.res.string('buddy_chat_with_online_buddy_only'));
    }

    onLoad() {
        super.onLoad();
        this.chattingBuddyItems = [];
    }

    loadData() {
        this.setLoadedData({ chattingBuddies: app.context.chattingBuddies }, false);
    }

    onEnable() {
        super.onEnable();
    }

    onDestroy() {
        window.releaseEvents(chattingBuddyItems);
    }

    _initChattingBuddyList(chattingBuddies) {
        this.chattingBuddyList.removeAllChildren(true);
        this.chattingBuddyItems.splice(0, this.chattingBuddyItems.length)
        chattingBuddies.forEach(buddy => this._addChattingBuddy(buddy))
    }

}

app.createComponent(BuddyChatTabBody);