/**
 * Created by Thanh on 10/18/2016.
 */

import app from 'app';
import PromptPopup from 'PromptPopup';

export default class SingleLinePromptPopup {

    static show(parentNode = null, options){
        if(!parentNode) return;

        let promptNode = cc.instantiate(app.res.prefab.singleLinePromptPopup);
        let prompt = promptNode.getComponent('PromptPopup');
        if(prompt){
            prompt.setComponentData(Object.assign({}, options));
            parentNode.addChild(promptNode);
        }
    }
}