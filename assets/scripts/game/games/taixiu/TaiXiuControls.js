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
}

app.createComponent(TaiXiuControls);