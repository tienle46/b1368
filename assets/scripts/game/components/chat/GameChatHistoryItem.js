/**
 * Created by Thanh on 10/24/2016.
 */

import app from 'app';
import Component from 'Component';

export default class GameChatHistoryItem extends Component {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            messageRichText: cc.RichText,
            messageTemplate: cc.String,
            senderRegex: cc.String,
            messageRegex: cc.String,
        });

        this._sender = "";
        this._message = "";
    }

    setMessage(sender, message){
        this._sender = sender;
        this._message = message;
    }

    onEnable(){
        super.onEnable();

        this._initMessage();
    }

    _initMessage(){
        if(!this.messageRichText) return;

        let htmlMsg = this.messageTemplate;
        htmlMsg = htmlMsg.replace(this.senderRegex, this._sender || "");
        htmlMsg = htmlMsg.replace(this.messageRegex, this._message || "");

        this.messageRichText.string = htmlMsg;
    }
}

app.createComponent(GameChatHistoryItem);