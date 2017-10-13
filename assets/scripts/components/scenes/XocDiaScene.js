/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameBetScene from 'GameBetScene';

export default class XocDiaScene extends GameBetScene {
    constructor() {
        super();
        
        this.BOARD_COMPONENT = 'BoardXocDia';
        this.CONTROL_COMPONENT = 'XocDiaControls';
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        super.onEnable();
    }
    
}

app.createComponent(XocDiaScene);