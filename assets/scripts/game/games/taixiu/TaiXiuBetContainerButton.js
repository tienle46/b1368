import app from 'app';
import GameBetContainerButton from 'GameBetContainerButton';

class TaiXiuBetContainerButton extends GameBetContainerButton {
    constructor() {
        super();
        this.BET_TYPE_BTN_COMPONENT = 'TaiXiuBetTypeBtn';
    }
    
    //override
    doesBetTypeIdWin(id, dots) {
        
    }
}

app.createComponent(TaiXiuBetContainerButton);