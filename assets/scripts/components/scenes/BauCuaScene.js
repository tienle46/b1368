import app from 'app';
import GameBetScene from 'GameBetScene';

export default class BauCuaScene extends GameBetScene {
    constructor() {
        super();
        
        this.BOARD_COMPONENT = 'BoardBauCua';
        this.CONTROL_COMPONENT = 'BauCuaControls';
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        super.onEnable();
    }
    
}

app.createComponent(BauCuaScene);