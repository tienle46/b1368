/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import utils from 'utils';
import BoardRenderer from 'BoardRenderer';
import BoardCardRenderer from 'BoardCardRenderer';
import BoardCardBetTurnRenderer from 'BoardCardBetTurnRenderer';

export default class BoardBaCayRenderer extends BoardCardBetTurnRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            gopGaNode: cc.Node,
            gopGaButton: cc.Button,
            gopGaLabel: cc.Label,
            gopGaCoinNode: cc.Node,
        }
    }

    onEnable(){
        super.onEnable();
    }

    setVisibleGopGaComponent(visible){
        utils.setVisible(this.gopGaNode, visible);
        if(!visible){
            utils.setInteractable(this.gopGaButton, true);
        }
    }

    setGopGaLabelValue(value){
        this.gopGaLabel.string = `${value}`;
    }

    disableGopGaValue(disable = true){
        utils.setInteractable(this.gopGaButton, disable);
    }
}

app.createComponent(BoardBaCayRenderer);