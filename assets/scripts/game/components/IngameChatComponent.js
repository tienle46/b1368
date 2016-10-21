/**
 * Created by Thanh on 10/21/2016.
 */

import app from 'app';
import utils from 'utils';
import Component from 'Component';

export default class IngameChatComponent extends Component {
    constructor() {
        super();
        this.loadingComponent = cc.Node;
        this.messageListContent = cc.Node;
        this.messageListComponent = cc.Node;
        this.loading = null;
        this.messages = null;
        this.animation = null;
    }

    setup(scene){
        this.scene = scene;
    }

    onLoad(){
        this.animation = this.node.getComponent(cc.Animation);
    }

    show(){
        this.animation && this.animation.play('closeIngameChatComponent');
    }

    hide(){
        this.animation && this.animation.play('openIngameChatComponent');
    }

    onShow(){
        debug("onShow")
        if(this.messages) {
            this.initMessages();
        }
    }

    initMessages(){

    }

    onHidden(){
        debug("onHidden");
    }

    onShown(){
        debug("onShown");
        if(!this.messages){
            this.loading.show(120);
            app.service.send({cmd: app.commands.INGAME_CHAT_MESSAGE_LIST, data: {[app.keywords.GAME_CODE]: this.scene.gameCode}}, (data) => {
                let gameCode = utils.getValue(data, app.keywords.GAME_CODE);
                if(gameCode == this.scene.gameCode){
                    let messages = utils.getValue(data, app.keywords.MESSAGE_LIST);
                    if(messages){


                    }
                }

                this.loading.hide();
            });
        }
    }

    onClickCloseButton(...args){
        console.log("onClickCloseButton: ", args);
    }

    onClickChatMessage(...args){
        console.log("onClickChatMessage: ", args);
    }
}

app.createComponent(IngameChatComponent);