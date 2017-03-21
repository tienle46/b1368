/**
 * Created by Thanh on 9/15/2016.
 */

import CCUtils from 'CCUtils'
import PlayerCardRenderer from 'PlayerCardRenderer';

export default class PlayerCardTurnBaseRenderer extends PlayerCardRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            remainCardCount: cc.Node,
        }

        this.remainCardCountLabel = null;
    }

    onLoad(){
        super.onLoad()

        if(this.remainCardCount){
            this.remainCardCountLabel = this.remainCardCount.getComponent(cc.Label);
            !this.remainCardCountLabel && (this.remainCardCountLabel = this.remainCardCount.getComponentInChildren(cc.Label))
        }
    }

    setRemainCardCount(count = 0){
        if(count == 0){
            this.setVisibleRemainCardNode();
        }else {
            this.remainCardCountLabel && (this.remainCardCountLabel.string = `${count}`)
        }
    }

    setVisibleRemainCardNode(visible = false){
        CCUtils.setVisible(this.remainCardCount, visible)
    }
}