/**
 * Created by Thanh on 10/21/2016.
 */

import app from 'app';
import utils from 'utils';
import Component from 'Component';
import Progress from 'Progress';
import CCUtils from 'CCUtils';
import SFS2X from 'SFS2X';
import GameChatItem from 'GameChatItem';
import NodeRub from 'NodeRub';
import Props from 'Props';

export default class IngameChatLeftComponent extends Component {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            loadingComponent: cc.Node,
            quickChatLists: cc.Node,
            showAnimName: "ingameShowChatLeft",
            hideAnimName: "ingameHideChatLeft",
            quickChatItemPrefab: cc.Prefab,
            // emotionsPanel: cc.Node,
        }

        this.loading = null;
        this.messages = null;
        this.animation = null;
        this.showing = false;
        this.inited = false;

    }

    onEnable() {
        super.onEnable();
        this.scene = app.system.currentScene;
        this.animation = this.node.getComponent(cc.Animation);
        this._initQuickChatItemsFromServer();
        // this.initEmotions();
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
        if (!this.inited && this.messages) {
            this.initMessages();
        }
    }

    hide() {
        this.animation && this.animation.play(this.hideAnimName);
        this.showing = false;
    }

    onQuickChatTabChecked() {
        console.debug('onQuickChatTabChecked')
    }

    onLogChatTabChecked() {
        console.debug('onLogChatTabChecked')
    }

    onEmotionsTabChecked() {
        console.debug('onEmotionsTabChecked')
    }

    initMessages() {
        this.quickChatLists.children.map(child => child.destroy() && child.removeFromParent());
        this.messages.forEach(message => {
            let chatItemNode = cc.instantiate(this.quickChatItemPrefab);
            let gameQuickChatItem = chatItemNode.getComponent('GameQuickChatItem');

            if (gameQuickChatItem) {
                gameQuickChatItem.setLabel(message);
                chatItemNode.textMessage = gameQuickChatItem.getLabelText();
                this.quickChatLists.addChild(chatItemNode);
                CCUtils.addClickEvent(chatItemNode, this.node, IngameChatLeftComponent, this.onQuickChatItemClick);
            }
        });

        this.inited = true;
    }

    onQuickChatItemClick(event) {
        this.hide();
        let text = event.target.getComponent('GameQuickChatItem').getLabelText();
        app.service.sendRequest(new SFS2X.Requests.System.PublicMessageRequest(text));
    }

    emotionClicked(e) {
        this.hide();
        if (this.scene.gamePlayers.me) {
            Props.playPropName(e.target.name, 'emotions', 4, this.scene.gamePlayers.me.node);
        }
    }

    initEmotions() {
        this.emotionsPanel.children.forEach(child => child.destroy());
        this.emotionsPanel.removeAllChildren();

        cc.loader.loadResAll('emotions/thumbs', cc.SpriteFrame, (err, assets) => {
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

                let o = {
                    name: asset.name,
                    size: cc.size(75, 75),
                    sprite: {
                        spriteFrame: asset,
                        trim: true,
                        type: cc.Sprite.Type.SIMPLE,
                        sizeMode: cc.Sprite.SizeMode.CUSTOM
                    },
                    button: {
                        event: clickEvent
                    }
                };
                const node = NodeRub.createNodeByOptions(o);

                this.emotionsPanel.addChild(node);
            });

        });
    }

    /**
     * This method going to call on animation hide chat component finish. Going to edit component to see this callback
     */
    onHidden() {
        this.node.active = false;
    }

    _initQuickChatItemsFromServer() {
        if (!this.messages) {
            utils.setActive(this.messageListContent, false);
            let sendObject = {
                cmd: app.commands.INGAME_CHAT_MESSAGE_LIST,
                data: {
                    [app.keywords.GAME_CODE]: this.scene.gameCode
                }
            };

            app.service.send(sendObject, (data) => {
                // utils.setActive(this.messageListContent, true);

                let gameCode = utils.getValue(data, app.keywords.GAME_CODE);
                if (gameCode == this.scene.gameCode) {
                    this.messages = utils.getValue(data, app.keywords.MESSAGE_LIST);
                    this.initMessages();
                }

                // this.loading.hide();
            });
        }
    }

    onShown() {

        if (!this.messages) {
            utils.setActive(this.messageListContent, false);
            app.service.send({
                cmd: app.commands.INGAME_CHAT_MESSAGE_LIST,
                data: {
                    [app.keywords.GAME_CODE]: this.scene.gameCode
                }
            }, (data) => {
                utils.setActive(this.messageListContent, true);

                let gameCode = utils.getValue(data, app.keywords.GAME_CODE);
                if (gameCode == this.scene.gameCode) {
                    this.messages = utils.getValue(data, app.keywords.MESSAGE_LIST);
                    this.initMessages();
                }

                // this.loading.hide();
            });
        }

    }

    onClickCloseButton(...args) {
        this.hide();
    }
}

app.createComponent(IngameChatLeftComponent);