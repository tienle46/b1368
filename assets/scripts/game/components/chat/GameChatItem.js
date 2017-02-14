/**
 * Created by Thanh on 10/24/2016.
 */

import app from 'app';

export default class GameChatItem {
    constructor() {
        this.label = cc.Label;
        this.text = null;
    }

    setSender

    onLoad(){
        this.label.string = this.text || "";
    }
}

app.createComponent(GameChatItem);