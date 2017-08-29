/**
 * Created by Thanh on 9/19/2016.
 */

import app from 'app';
import GameBetControls from 'GameBetControls';

export default class TaiXiuControls extends GameBetControls {
    constructor() {
        super();
        this.BET_COINTAINER_BUTTON_COMPONENT = 'TaiXiuBetContainerButton';
        this.BET_TYPE_BTN_COMPONENT = 'TaiXiuBetTypeBtn';
    }

    onEnable() {
        super.onEnable();
    }

    onDestroy() {
        super.onDestroy();
    }
    
    highLightWinBets(ids) {
        if(ids.length === 0) return
            
        this.betContainerButton.highLightBets(ids)
    }
    
    /**
     * @override
     * 
     * @param data => betData: {<betid1> : <amount>, <betid2> : <amount>}
     * @param dots // <- result data responsed by server
     */
    _onPlayerReceiveChip(data, winIds) {
        let {
            userPos,
            playerId,
            betData,
            isItMe
        } = data;
        let toPos = isItMe ? this.receiveChipDestinationNode.parent.convertToWorldSpaceAR(this.receiveChipDestinationNode.getPosition()) : userPos;

        for (let id in betData) {
            let isWinner = this.betContainerButton.doesBetTypeIdWin(Number(id), winIds);
            if (!isWinner) {
                toPos = this.dealer.parent.convertToWorldSpaceAR(this.dealer.getPosition());
            }
            this.betChipAnim.receiveChip(toPos, playerId, id);
        }
    }
    
    /**
     * @extending
     * 
     * @param {any} data 
     * @param {any} isJustJoined 
     * @memberof TaiXiuControls <- GameBetControls
     */
    _onGameEnding(data, isJustJoined) {
        this.node.runAction(cc.sequence(cc.delayTime(6), cc.callFunc(() => {
            super._onGameEnding(data, isJustJoined)
        })))
    }
    
}

app.createComponent(TaiXiuControls);