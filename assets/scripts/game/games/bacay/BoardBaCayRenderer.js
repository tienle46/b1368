/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import utils from 'utils';
import GameUtils from 'GameUtils';
import BoardRenderer from 'BoardRenderer';
import BoardCardRenderer from 'BoardCardRenderer';
import BoardCardBetTurnRenderer from 'BoardCardBetTurnRenderer';

export default class BoardBaCayRenderer extends BoardCardBetTurnRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            gopGaButton: cc.Button,
            gopGaLabel: cc.Label,
        }

        this.gopGaCoinNode = {
            default: null,
            type: cc.Node
        }

        this.gopGaNode = {
            default: null,
            type: cc.Node
        }

        this.enableBottomTextOnReady = false
    }

    onEnable(){
        super.onEnable();
    }

    setVisibleGopGaComponent(visible){
        utils.setVisible(this.gopGaNode, visible);
    }

    setInteractableGopGaButton(interactable = true){
        utils.setInteractable(this.gopGaButton, interactable);
    }

    setGopGaLabelValue(value){
        this.gopGaLabel.string = `${GameUtils.formatBalanceShort(value)}`;
    }

    disableGopGaValue(disable = true){
        utils.setInteractable(this.gopGaButton, disable);
    }

    disableGopGaButton(){
        utils.setInteractable(this.gopGaButton, false);
    }

    setTimeLineMessage(message) {
        this.timelineTextView.setText(message);
    }

    /**
     * Disable set bottom timeline text
     * @param message
     */
    setBottomTimeLineMessage(message) {
    }
}

app.createComponent(BoardBaCayRenderer);