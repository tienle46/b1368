/**
 * Created by Thanh on 3/3/2017.
 */

import app from 'app'
import Actor from 'Actor'
import CCUtils from 'CCUtils'

class EventPage extends Actor {

    constructor() {
        super();

        this.properties = {
            ...this.properties,
            nameLabel: cc.Label,
            imageNode: cc.Node,
            imageSprite: cc.Sprite,
            /**
             * @type(cc.WebView}
             */
            webView: cc.WebView,
        }

        this._showPolicyPage = false;
    }

    onDisable(){
        super.onDisable();
        this.showPolicy();
    }

    onEnable(){
        super.onEnable();
        this.showImage();
    }

    onWebLoaded(){
        //TODO
    }

    renderComponentData(data){
        if(data.imageUrl){
            let spriteFrame = this.loadImage(data.imageUrl)
            this.imageSprite.spriteFrame = spriteFrame;
        }

        if(data.name){
            this.nameLabel.string = data.name;
        }
    }

    showPolicy(){
        CCUtils.setVisible(this.imageNode, false);
        CCUtils.setVisible(this.webView, true);
        this.getComponentData().policyUrl && (this.webView.url = this.getComponentData().policyUrl);
    }

    showImage(){
        CCUtils.setVisible(this.imageNode, true);
        CCUtils.setVisible(this.webView, false);
    }
}

app.createComponent(EventPage);