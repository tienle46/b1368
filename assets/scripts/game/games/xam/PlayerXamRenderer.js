/**
 * Created by Thanh on 9/15/2016.
 */

import utils from 'utils';
import app from 'app';
import PlayerCardTurnBaseRenderer from 'PlayerCardTurnBaseRenderer';

export default class PlayerXamRenderer extends PlayerCardTurnBaseRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            baoXamNode: cc.Node,
            bao1Node: cc.Node,
        }
    }

    showBaoXam(active = true){
        utils.setActive(this.baoXamNode, active);

        console.log("this.baoXamNode: ", this.baoXamNode.active, this.baoXamNode);
    }

    showBao1(active = true){
        utils.setVisible(this.bao1Node, active);
    }
}

app.createComponent(PlayerXamRenderer);
