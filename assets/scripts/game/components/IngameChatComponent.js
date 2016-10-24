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

export default class IngameChatComponent extends Component {
    constructor() {
        super();
        this.loadingComponent = cc.Node;
        this.messageListContent = cc.Node;
        this.messageListComponent = cc.Node;
        this.loading = null;
        this.messages = null;
        this.animation = null;
        this.showing = false;
        this.inited = false;

        this.gameChatItemPrefab = cc.Prefab;
    }

    setup(scene){
        this.scene = scene;
    }

    onLoad(){
        debug("IngameChatComponent: ", this.node);
        this.animation = this.node.getComponent(cc.Animation);
        this.loading = this.loadingComponent.getComponentInChildren(Progress.name);
        this.node.active = false;
    }

    setVisible(){
        console.log("setVisible: ", this.showing);
        this.showing ? this.hide() : this.show();
        debug(this.animation);
    }

    show(){
        this.node.active = true;
        this.animation && this.animation.play('openIngameChatComponent');
        this.showing = true;
    }

    hide(){
        this.node.active = false;
        this.animation && this.animation.play('closeIngameChatComponent');
        this.showing = false;
    }

    onShow(){
        if(!this.inited && this.messages) {
            this.initMessages();
        }
    }

    initMessages(){

        this.messageListContent.removeAllChildren(true);

        this.messages.forEach(message => {
            let chatItemNode = cc.instantiate(this.gameChatItemPrefab);
            let gameChatItem = chatItemNode.getComponent(GameChatItem.name);

            if(gameChatItem){
                gameChatItem.text = message;
                this.messageListContent.addChild(chatItemNode);
                CCUtils.addClickEvent(chatItemNode, this.node, IngameChatComponent, this.onClickChatMessage);
            }
        });

        this.inited = true;
    }

    onHidden(){
        this.node.active = false;
    }

    onShown(){
        if(!this.messages){
            this.loading.show(120);
            app.service.send({cmd: app.commands.INGAME_CHAT_MESSAGE_LIST, data: {[app.keywords.GAME_CODE]: this.scene.gameCode}}, (data) => {
                let gameCode = utils.getValue(data, app.keywords.GAME_CODE);
                if(gameCode == this.scene.gameCode){
                    this.messages = utils.getValue(data, app.keywords.MESSAGE_LIST);
                    this.initMessages();
                }

                this.loading.hide();
            });
        }
    }

    onClickCloseButton(...args){
        this.hide();
    }

    onClickChatMessage(event){
        this.hide();
        let text = event.target.getComponent(GameChatItem.name).text;
        app.service.sendRequest(new SFS2X.Requests.System.PublicMessageRequest(text));
    }
}

app.createComponent(IngameChatComponent);