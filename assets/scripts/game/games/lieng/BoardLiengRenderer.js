/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import utils from 'PackageUtils';
import GameUtils from 'GameUtils';
import BoardRenderer from 'BoardRenderer';
import BoardCardRenderer from 'BoardCardRenderer';
import BoardCardBetTurnRenderer from 'BoardCardBetTurnRenderer';

export default class BoardLiengRenderer extends BoardCardBetTurnRenderer {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            totalLabel: cc.Label,
            totalAmoutNode: cc.Node
        });

        this.enableBottomTextOnReady = false
    }

    onEnable(){
        super.onEnable();
    }

    setVisibleTotalAmountComponent(visible){
        utils.setVisible(this.totalAmoutNode, visible);
    }

    setInteractableGopGaButton(interactable = true){
        utils.setInteractable(this.gopGaButton, interactable);
    }

    setTotalValue(value){
        this.totalLabel.string = `${GameUtils.formatBalanceShort(value)}`;
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

app.createComponent(BoardLiengRenderer);