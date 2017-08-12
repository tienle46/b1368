import app from 'app';
import TaiXiuBetContainerButton from 'TaiXiuBetContainerButton';

class BauCuaBetContainerButton extends TaiXiuBetContainerButton {
    constructor() {
        super();
        this.BET_TYPE_BTN_COMPONENT = 'BauCuaBetTypeBtn';
        
        this.betTypeIdsMap = [
            1, 2, 
            4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
            21, 22, 23, 24, 25
        ]
    }
}

app.createComponent(BauCuaBetContainerButton);