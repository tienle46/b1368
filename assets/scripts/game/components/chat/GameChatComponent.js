/**
 * Created by Thanh on 10/21/2016.
 */

import app from 'app';
import utils from 'utils';
import Actor from 'Actor';
import CCUtils from 'CCUtils';
import SFS2X from 'SFS2X';
import LoaderRub from 'LoaderRub';
import Events from "Events";

export const emotionTexts = [];
export const emotionNames = [];
export const emotions = [];

export function getEmotionName(text) {
    let index = emotionTexts.indexOf(text);
    if (index >= 0) return emotionNames[index];
}

export default class GameChatComponent extends Actor {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            quickChatsList: cc.Node,
            emotionsList: cc.Node,
            chatHistoryNode: cc.Node,
            textEditbox: cc.EditBox,
            showAnimName: "ingameShowChatLeft",
            hideAnimName: "ingameHideChatLeft",
            quickChatItemPrefab: cc.Prefab,
            emotionChatItemPrefab: cc.Prefab,
            logChatItemPrefab: cc.Prefab,
            // panels
            emotionsPanel: cc.Node,
            quickChatPanel: cc.Node,
            chatHistoryPanel: cc.Node,
            chatHistoryScroll: cc.ScrollView,
            /**
             * @type {cc.Toggle}
             */
            tabChatHistoryToggle: cc.Toggle,
            /**
             * @type {cc.Toggle}
             */
            tabEmoChatToggle: cc.Toggle,
        }

        this.quickChats = null;
        this.animation = null;
        this.showing = false;
        this.inited = false;
    }

    static loadEmotions() {
        this.emotions = [];
        cc.loader.loadResDir('emotions/thumbs', cc.SpriteFrame, (err, assets) => {
            if (err) {
                cc.error(err);
                return;
            }

            emotions.push(...assets);
            emotions.forEach((asset, index) => {
                emotionTexts.push(`[:e${index}]`);
                emotionNames.push(asset.name);
            });
        });
    }

    onLoad() {
        super.onLoad();
        this.scene = app.system.currentScene;
    }

    _addGlobalListener() {
        super._addGlobalListener();
        this.scene.on(Events.ON_PLAYER_CHAT_MESSAGE, this._onPlayerChatMessage, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        this.scene.off(Events.ON_PLAYER_CHAT_MESSAGE, this._onPlayerChatMessage, this);
    }

    _onPlayerChatMessage(sender, message) {

        if (!sender) return;

        this._addNewChatHistoryItem(sender.name, message);

        if (this.chatHistoryPanel.children.length > app.const.NUMBER_MESSAGES_KEEP_INGAME) {
            this.chatHistoryPanel.children[0].destroy();
            this.chatHistoryPanel.removeChild(this.chatHistoryPanel.children[0]);
        }

        this.chatHistoryScroll.scrollToBottom();
    }

    _addNewChatHistoryItem(sender, message) {
        let chatItem = cc.instantiate(this.logChatItemPrefab);
        let historyItem = chatItem.getComponent('GameChatHistoryItem');
        if (historyItem) {
            historyItem.setMessage(sender, message);
        }

        this.chatHistoryPanel.addChild(chatItem);
    }

    onEnable() {
        super.onEnable();
        this.animation = this.node.getComponent(cc.Animation);
        this.checkTabEmotionChat();
    }

    checkTabEmotionChat(){
        this.tabEmoChatToggle.check();
        this.onEmotionsTabChecked();
    }

    start() {
        super.start();
        this.node.active = false;
    }

    setVisible() {
        this.showing ? this.hide() : this.show();
    }

    show() {
        this.node.active = true;
        this.animation && this.animation.play(this.showAnimName);
        if(!this.inited){
            !this.quickChats && this._initQuickChatItemsFromServer();
            this._initEmotions();
            this._initMessageHistory();
        }else{
            this.checkTabEmotionChat();
        }

        this.inited = true;
    }

    _initMessageHistory(){

        console.log('this.scene.gameContext.messages: ', this.scene.gameContext.messages);

        this.chatHistoryPanel.children.forEach(child => child.destroy() && child.removeFromParent(true));

        this.scene.gameContext.messages && this.scene.gameContext.messages.forEach(messageObj => {
            this._addNewChatHistoryItem(messageObj.sender, messageObj.message)
        });
        this.chatHistoryScroll.scrollToBottom();
    }

    hide() {
        this.animation && this.animation.play(this.hideAnimName);
        this.showing = false;
    }

    onQuickChatTabChecked() {
        CCUtils.active(this.quickChatPanel);
        CCUtils.deactive(this.chatHistoryNode );
        CCUtils.deactive(this.emotionsPanel );
    }

    onLogChatTabChecked() {
        CCUtils.deactive(this.quickChatPanel );
        CCUtils.active(this.chatHistoryNode);
        CCUtils.deactive(this.emotionsPanel );
    }

    onEmotionsTabChecked() {
        CCUtils.deactive(this.quickChatPanel );
        CCUtils.deactive(this.chatHistoryNode );
        CCUtils.active(this.emotionsPanel);
    }

    onEditingEnded(e) {
        // console.debug('e', e);
    }

    onChatEnterBtnClicked() {
        let text = this.textEditbox.string;
        this._sendChatMessage(text);
        this.textEditbox.string = "";
        this.textEditbox.setFocus();
    }

    _initChatHistory() {

        console.log('this.scene.gameContext.messages: ', this.scene.gameContext.messages);

        this.chatHistoryPanel.children.forEach(child => child.destroy() && child.removeFromParent(true));
        this.scene.gameContext.messages && this.scene.gameContext.messages.forEach(msgObj => this._addNewChatHistoryItem(msgObj.sender, msgObj.message));
    }

    initMessages() {
        this.quickChatsList.children.map(child => child.destroy() && child.removeFromParent(true));
        this.quickChats.forEach(message => {
            let chatItemNode = cc.instantiate(this.quickChatItemPrefab);
            let gameQuickChatItem = chatItemNode.getComponent('GameQuickChatItem');

            if (gameQuickChatItem) {
                gameQuickChatItem.setLabel(message);
                chatItemNode.textMessage = gameQuickChatItem.getLabelText();
                this.quickChatsList.addChild(chatItemNode);
                CCUtils.addClickEvent(chatItemNode, this.node, GameChatComponent, this.onQuickChatItemClick);
            }
        });
        this.loader && this.loader.destroy();
    }

    onQuickChatItemClick(event) {
        let text = event.target.getComponent('GameQuickChatItem').getLabelText();
        this._sendChatMessage(text);
        
        // this.tabChatHistoryToggle.check();
        // this.onLogChatTabChecked();
    }

    emotionClicked(e, indexStr) {
        if (this.scene.gamePlayers.me) {
            let index = Number(indexStr);

            if (!isNaN(index)) {
                let text = emotionTexts[index];

                if (text && text.length > 0) {
                    this._sendChatMessage(text);
                    // app.service.sendRequest(new SFS2X.Requests.System.PublicMessageRequest(text));
                    this.onClickCloseButton();
                }
            }

            //Props.playPropName(e.target.name, 'emotions', 4, this.scene.gamePlayers.me.node);
        }

        // this.tabChatHistoryToggle.check();
        // this.onLogChatTabChecked();
    }

    onDestroy() {
        super.onDestroy();
        emotions.splice(0, emotions.length);
        console.log('GameChatComponent: ');
    }

    _initEmotions() {

        if (this.emotionInited) return;

        this.emotionsList.children.map(child => child.destroy() && child.removeFromParent());
        emotions.forEach((asset, index) => {
            const clickEvent = new cc.Component.EventHandler();
            clickEvent.target = this.node;
            clickEvent.component = 'GameChatComponent';
            clickEvent.handler = 'emotionClicked';
            clickEvent.customEventData = `${index}`;

            let item = cc.instantiate(this.emotionChatItemPrefab);
            item.getComponentInChildren(cc.Sprite).spriteFrame = asset;
            item.name = asset.name;
            item.getComponent(cc.Button).clickEvents = [clickEvent];

            this.emotionsList.addChild(item);
        });

        this.emotionInited = true;
    }

    /**
     * This method going to call on animation hide chat component finish. Going to edit component to see this callback
     */
    onHidden() {
        this.node.active = false;
    }

    _sendChatMessage(message) {
        if (app._.isEmpty(message)) return;

        app.service.sendRequest(new SFS2X.Requests.System.PublicMessageRequest(message));
        message = "";
        this.onClickCloseButton();
    }

    _initQuickChatItemsFromServer() {
        if (!this.quickChats) {
            utils.setActive(this.messageListContent, false);
            let sendObject = {
                cmd: app.commands.INGAME_CHAT_MESSAGE_LIST,
                data: {
                    [app.keywords.GAME_CODE]: this.scene.gameCode
                }
            };
            this.loader = new LoaderRub(this.quickChatsPanel);
            app.service.send(sendObject, (data) => {
                utils.setActive(this.messageListContent, true);

                let gameCode = utils.getValue(data, app.keywords.GAME_CODE);
                if (gameCode == this.scene.gameCode) {
                    this.quickChats = utils.getValue(data, app.keywords.MESSAGE_LIST);
                    this.initMessages();
                }
            });
        }
    }

    onClickCloseButton(...args) {
        this.hide();
    }
}

app.createComponent(GameChatComponent);