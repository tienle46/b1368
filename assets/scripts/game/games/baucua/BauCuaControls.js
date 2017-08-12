/**
 * Created by Thanh on 9/19/2016.
 */

import app from 'app';
import TaiXiuControls from 'TaiXiuControls';

export default class BauCuaControls extends TaiXiuControls {
    constructor() {
        super();
        this.BET_COINTAINER_BUTTON_COMPONENT = 'BauCuaBetContainerButton';
        this.BET_TYPE_BTN_COMPONENT = 'BauCuaBetTypeBtn';
    }
}

app.createComponent(BauCuaControls);