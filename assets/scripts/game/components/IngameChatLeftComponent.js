/**
 * Created by Thanh on 10/21/2016.
 */

import app from 'app';
import utils from 'utils';
import Component from 'Component';
import CCUtils from 'CCUtils';
import SFS2X from 'SFS2X';
import NodeRub from 'NodeRub';
import Props from 'Props';
import LoaderRub from 'LoaderRub';

export default class IngameChatLeftComponent extends Component {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            quickChatsList: cc.Node,
            emotionsList: cc.Node,
            textEditbox: cc.EditBox,
            showAnimName: "ingameShowChatLeft",
            hideAnimName: "ingameHideChatLeft",
            quickChatItemPrefab: cc.Prefab,
            emotionChatItemPrefab: cc.Prefab,
            // panels
            emotionsPanel: cc.Node,
            quickChatPanel: cc.Node,
            logChatPanel: cc.Node,
        }

        this.quickChats = null;
        this.animation = null;
        this.showing = false;
        this.inited = false;

    }

    onEnable() {
        super.onEnable();
        this.scene = app.system.currentScene;
        this.animation = this.node.getComponent(cc.Animation);
        this.onQuickChatTabChecked();
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
        if (!this.inited) {
            !this.quickChats && this._initQuickChatItemsFromServer();
            this.initEmotions();
        }
    }

    hide() {
        this.animation && this.animation.play(this.hideAnimName);
        this.showing = false;
    }

    onQuickChatTabChecked() {
        this.quickChatPanel.active = true;
        this.logChatPanel.active = false;
        this.emotionsPanel.active = false;
    }

    onLogChatTabChecked() {
        this.quickChatPanel.active = false;
        this.logChatPanel.active = true;
        this.emotionsPanel.active = false;
    }

    onEmotionsTabChecked() {
        this.quickChatPanel.active = false;
        this.logChatPanel.active = false;
        this.emotionsPanel.active = true;
    }

    onEditingEnded(e) {
        console.debug('e', e);
    }

    onChatEnterBtnClicked() {
        let text = this.textEditbox.string;
        this._sendChatMessage(text);
        this.textEditbox.string = "";
    }

    initMessages() {
        this.quickChatsList.children.map(child => child.destroy() && child.removeFromParent());
        this.quickChats.forEach(message => {
            let chatItemNode = cc.instantiate(this.quickChatItemPrefab);
            let gameQuickChatItem = chatItemNode.getComponent('GameQuickChatItem');

            if (gameQuickChatItem) {
                gameQuickChatItem.setLabel(message);
                chatItemNode.textMessage = gameQuickChatItem.getLabelText();
                this.quickChatsList.addChild(chatItemNode);
                CCUtils.addClickEvent(chatItemNode, this.node, IngameChatLeftComponent, this.onQuickChatItemClick);
            }
        });
        this.loader && this.loader.destroy();
        this.inited = true;
    }

    onQuickChatItemClick(event) {
        let text = event.target.getComponent('GameQuickChatItem').getLabelText();
        this._sendChatMessage(text);
    }

    emotionClicked(e) {
        this.hide();
        if (this.scene.gamePlayers.me) {
            Props.playPropName(e.target.name, 'emotions', 4, this.scene.gamePlayers.me.node);
        }
    }

    initEmotions() {
        this.emotionsList.children.map(child => child.destroy() && child.removeFromParent());
        cc.loader.loadResDir('emotions/thumbs', cc.SpriteFrame, (err, assets) => {
            if (err) {
                cc.error(err);
                return;
            }

            assets.forEach((asset, index) => {
                // console.debug(`${index} `, asset);
                const clickEvent = new cc.Component.EventHandler();
                clickEvent.target = this.node;
                clickEvent.component = 'IngameChatLeftComponent';
                clickEvent.handler = 'emotionClicked';

                let item = cc.instantiate(this.emotionChatItemPrefab);
                item.getComponent(cc.Sprite).spriteFrame = asset;
                item.name = asset.name;
                item.getComponent(cc.Button).clickEvents = [clickEvent];

                this.emotionsList.addChild(item);
            });
        });
        this.inited = true;
    }

    /**
     * This method going to call on animation hide chat component finish. Going to edit component to see this callback
     */
    onHidden() {
        this.node.active = false;
    }

    _sendChatMessage(message) {
        if (app._.isEmpty(message))
            return

        this.hide();

        app.service.sendRequest(new SFS2X.Requests.System.PublicMessageRequest(message));
        message = "";
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

app.createComponent(IngameChatLeftComponent);