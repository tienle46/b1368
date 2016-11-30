/**
 * Created by Thanh on 9/19/2016.
 */

import app from 'app';
import utils from 'utils';
import Events from 'Events';
import GameControls from 'GameControls';

export default class CardBetTurnControls extends GameControls {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            betButton: cc.Button
        }
    }

    onEnable(){
        super.onEnable();
        this.node.on('touchstart', (event) => true);
    }

    hideAllControls(){
        utils.deactive(this.betButton);
    }

    showBetControls(){
        utils.active(this.betButton);
    }

    onClickBetButton(event){
        this.scene.emit(Events.ON_CLICK_BET_BUTTON);
    }
}

app.createComponent(CardBetTurnControls);