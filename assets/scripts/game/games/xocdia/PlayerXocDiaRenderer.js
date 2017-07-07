/**
 * Created by Thanh on 9/15/2016.
 */

import utils from 'utils';
import app from 'app';
import PlayerCardBetTurnRenderer from 'PlayerCardBetTurnRenderer';
import GameUtils from "../../base/utils/GameUtils";

export default class PlayerXocDiaRenderer extends PlayerCardBetTurnRenderer {
    constructor() {
        super();
    }

    onEnable(...args) {
        super.onEnable(...args);
    }

    

    

    // setVisibleReady(visible) {
    //     super.setVisibleReady(visible);
    //     // hide user while playing game or fade while waiting
    //     this.node.opacity = visible ? ((this.isItMe && this.scene.isStarting()) ? 0 : 255) : 150;
    // }

    hidePlayerComponentOnBetting(){
        utils.deactive(this.playerNameLabel);
    }

    showPlayerComponentOnShake(){
        utils.active(this.playerNameLabel);
    }
}

app.createComponent(PlayerXocDiaRenderer);