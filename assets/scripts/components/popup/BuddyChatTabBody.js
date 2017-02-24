/**
 * Created by Thanh on 2/17/2017.
 */

import app from 'app';
import utils from 'utils';
import PopupTabBody from 'PopupTabBody';
import Events from 'Events';

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
            chatScroll: cc.ScrollView
        }

        this.buddy = null;
    }

    _addGlobalListener(){
        super._addGlobalListener();
        app.system.addListener(Events.ON_BUDDY_MESSAGE, this._onBuddyMessage, this);
    }

    _removeGlobalListener(){
        super._removeGlobalListener();
        app.system.removeListener(Events.ON_BUDDY_MESSAGE, this._onBuddyMessage, this);
    }

    _onBuddyMessage(sender, message, isItMe){
        this._addSingleMessage(sender, message);
        this.chatScroll.scrollToBottom();
    }

    loadData() {
        super.loadData();
    }

    onDataChanged(data) {

        console.log('onDataChanged chat tab: ', data);

        super.onDataChanged(data);

        if(data && data.buddy){
            this.buddy = data.buddy;
            this.popup.setTitle(this.buddy.name);
        }

        if(this.buddy){
            this._initMessageList();
        }else{
            this.chatErrorNode && (this.chatErrorNode.active = true);
            this.chatContent.active = false;
        }
    }

    _loadMessages(){
        //TODO
    }

    _initMessageList(){
        if(!this.chatContent.active){
            this.chatErrorNode && (this.chatErrorNode.active = false);
            this.chatContent.active = true;
        }

        if(this.buddy.messages){
            this.onMessageListChanged(this.buddy.messages);
        }else{
            this._loadMessages();
        }
    }

    onMessageListChanged(messages = []){
        messages.forEach(messageObj => this._addSingleMessage(messageObj.sender, messageObj.message));
        this.chatScroll.scrollToBottom();
    }

    _addSingleMessage(sender, message){
        let chatItemNode = cc.instantiate(this.chatItemPrefab);
        let chatItem = chatItemNode.getComponent('BuddyChatItem');
        chatItem && chatItem.setMessage(sender, message);
        this.chatMessageList.addChild(chatItemNode);

        if(this.chatMessageList.children.length > app.const.NUMBER_MESSAGES_KEEP_PER_BUDDY){
            let removeNode = this.chatMessageList.children[0];
            removeNode.destroy();
            removeNode.removeFromParent(true);
        }
    }

    sendInputMessage(){
        if(this.buddy){
            let message = this.chatEditBox.string;
            if(message.trim().length > 0){
                this.chatEditBox.string = "";
                app.buddyManager.sendMessage(message, this.buddy.name);
            }
        }

        this.chatEditBox.setFocus();
    }

    onLoad() {
        super.onLoad();

        this.setLoadingData(false);
    }

    onEnable() {
        super.onEnable();

        if(this.buddy){

            if(this.buddy.isOnline()){
                this.chatEditBox.placeholder = app.res.string("input_content");
                utils.maxLength = 80;
            }else{
                this.chatEditBox.placeholder = app.res.string("buddy_chat_with_online_buddy_only")
                utils.maxLength = 0;
            }
        }else {
            this.chatEditBox.placeholder = app.res.string("input_content");
            utils.maxLength = 0;
        }
    }

}

app.createComponent(BuddyChatTabBody);