/**
 * Created by Thanh on 10/18/2016.
 */

import app from 'app';
import Component from 'Component';
import CCUtils, { isNode, destroy } from 'CCUtils';
import Utils from 'Utils'

export default class PromptPopup extends Component {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
             bgTransparent: cc.Node,
            titleLbl: cc.Label,
            inputEditBox: cc.EditBox,
            descriptionLbl: cc.Label,
            acceptButtonLbl: cc.Label,
            acceptBtnNode: cc.Node,
            mainNode: cc.Node,
            bodyNode: cc.Node,
            popupBkg: cc.Node
        });
        
    }

    onEnable() {
        super.onEnable();
        this.node.on(cc.Node.EventType.TOUCH_START, () => null);
        this.node.zIndex = (app.const.popupZIndex - 1);
    }

    setComponentData(data = {}){
        if(!data.hasOwnProperty('requireNotEmpty')){
            data.requireNotEmpty = true
        }

        super.setComponentData(data)
    }

    hide(){
        CCUtils.clearFromParent(this.node)
    }

    static show(parentNode = null, options){
        if(!parentNode) return;

        let promptNode = cc.instantiate(app.res.prefab.promptPopup);
        let prompt = promptNode.getComponent('PromptPopup');
        if(prompt){
            prompt.setComponentData(Object.assign({}, options));
            parentNode.addChild(promptNode);
        }
    }

    static showSingleLine(parentNode = null, options){
        if(!parentNode) return;

        let promptNode = cc.instantiate(app.res.prefab.singleLinePromptPopup);
        let prompt = promptNode.getComponent('PromptPopup');
        if(prompt){
            prompt.setComponentData(Object.assign({}, options));
            parentNode.addChild(promptNode);
        }
    }

    renderComponentData(data){
        super.renderComponentData(data);
        data.title && (this.titleLbl.string = data.title)
        data.description && (this.descriptionLbl.string = data.description)
        data.acceptLabelText && (this.acceptButtonLbl.string = data.acceptLabelText)
        data.maxLength && (this.inputEditBox.maxLength = data.maxLength)
    }

    start(){
        super.start();
        this.getComponentData().inputMode && (this.inputEditBox.inputMode = this.getComponentData().inputMode)
    }

    onClickDenyBtn() {
        this.hide();
    }

    onClickAcceptBtn(fn) {
        let value = this.inputEditBox.string;
        let data = this.getComponentData();
        if(data.requireNotEmpty && Utils.isEmpty(value)) {
            app.system.showToast(app.res.string('error_user_enter_empty_input'));
        } else {
            data.handler && data.handler(value) && this.hide();
        }
    }
}

app.createComponent(PromptPopup)