/**
 * Created by Thanh on 9/19/2016.
 */

import app from 'app';
import GameBetControls from 'GameBetControls';

export default class XocDiaControls extends GameBetControls {
    constructor() {
        super();
        this.BET_COINTAINER_BUTTON_COMPONENT = 'XocDiaBetContainerButton';
    }

    onEnable() {
        super.onEnable();
    }

    onDestroy() {
        super.onDestroy();
    }
    
    /**
     * @override
     * 
     * @param data => betData: {<betid1> : <amount>, <betid2> : <amount>}
     * @param dots // <- result data responsed by server
     */
    _onPlayerReceiveChip(data, dots) {
        let {
            userPos,
            playerId,
            betData,
            isItMe
        } = data;
        let toPos = isItMe ? this.receiveChipDestinationNode.parent.convertToWorldSpaceAR(this.receiveChipDestinationNode.getPosition()) : userPos;

        for (let id in betData) {
            let isWinner = this.betContainerButton.doesBetTypeIdWin(Number(id), dots);
            if (!isWinner) {
                toPos = this.dealer.parent.convertToWorldSpaceAR(this.dealer.getPosition());
            }
            this.xocDiaAnim.receiveChip(toPos, playerId, id);
        }
    }
}

app.createComponent(XocDiaControls);