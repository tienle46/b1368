/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameBetScene from 'GameBetScene';

export default class TaiXiuScene extends GameBetScene {
    constructor() {
        super();
        
        this.BOARD_COMPONENT = 'BoardTaiXiu';
        this.CONTROL_COMPONENT = 'TaiXiuControls';
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        super.onEnable();
    }
    
}

app.createComponent(TaiXiuScene);