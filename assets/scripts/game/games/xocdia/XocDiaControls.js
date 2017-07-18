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
}

app.createComponent(XocDiaControls);