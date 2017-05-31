/**
 * Created by Thanh on 2/20/2017.
 */

import app from 'app';
import Component from 'Component';

export default class BuddyChatItem extends Component {
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

        if(this._sender){
            let htmlMsg = this.messageTemplate;
            htmlMsg = htmlMsg.replace(this.senderRegex, this._sender || "");
            htmlMsg = htmlMsg.replace(this.messageRegex, this._message || "");
            this.messageRichText.string = htmlMsg;
        }else{
            this.messageRichText.string = this._message || '';
        }

    }
}

app.createComponent(BuddyChatItem);