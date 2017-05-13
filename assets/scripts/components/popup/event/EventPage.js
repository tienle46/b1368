/**
 * Created by Thanh on 3/3/2017.
 */

import app from 'app'
import Actor from 'Actor'
import CCUtils from 'CCUtils'
import Utils from 'Utils'
import RubUtils from 'RubUtils';

class EventPage extends Actor {

    constructor() {
        super();

        this.properties = {
            ...this.properties,
            nameLabel: cc.Label,
            imageNode: cc.Node,
            imageSprite: cc.Sprite,
            attendBtnNode: cc.Node,
            policyBtnNode: cc.Node,
            backBtnNode: cc.Node,
            /**
             * @type(cc.WebView}
             */
            webView: cc.WebView,
        }

        this._showPolicyPage = false;
        
        this._backBtnListener = null;
        this._attendBtnListener = null;
    }

    onDisable(){
        super.onDisable();
        this.webView && this.showPolicy();
    }

    onEnable(){
        super.onEnable();
        this._showImage();
    }

    onWebLoaded(){
        //TODO
    }

    renderComponentData(data){
        this.nameLabel.string = data.name || "";
        if(data.imageUrl){
            RubUtils.loadSpriteFrame(this.imageSprite, data.imageUrl, null, true);
        }

        data.actionCode && !Utils.isEmpty(data.actionCode) && data.actionCode !== "''" ? CCUtils.active(this.attendBtnNode) : CCUtils.deactive(this.attendBtnNode);
        data.policyUrl && !Utils.isEmpty(data.policyUrl) ? CCUtils.active(this.policyBtnNode) : CCUtils.deactive(this.policyBtnNode);
    }
    
    onAttendBtnClick() {
        app.visibilityManager.goTo(this.getComponentData().actionCode, this.getComponentData().actionData);
        this.getComponentData().attendBtnListener && this.getComponentData().attendBtnListener();
    }
    
    showPolicy(){
        if(this.getComponentData().policyUrl) {
            CCUtils.setVisible(this.imageNode, false);
            CCUtils.active(this.webView);
            CCUtils.active(this.backBtnNode);

            this.webView.url = this.getComponentData().policyUrl
            
            this.getComponentData().policyBtnListener && this.getComponentData().policyBtnListener();
        }
    }
    
    onBackBtnClick() {
        this._showImage();
        this.getComponentData().backBtnListener && this.getComponentData().backBtnListener();
        CCUtils.deactive(this.backBtnNode);
    }
    
    _showImage(){
        CCUtils.setVisible(this.imageNode, true);
        CCUtils.deactive(this.webView);
    }
}

app.createComponent(EventPage);