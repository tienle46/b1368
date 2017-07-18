import app from 'app';
import GameBetContainerButton from 'GameBetContainerButton';

class TaiXiuBetContainerButton extends GameBetContainerButton {
    constructor() {
        super();
    }
    
    //override
    doesBetTypeIdWin(id, dots) {
        
    }
}

app.createComponent(TaiXiuBetContainerButton);