import app from 'app';
import TaiXiuBetContainerButton from 'TaiXiuBetContainerButton';

class BauCuaBetContainerButton extends TaiXiuBetContainerButton {
    constructor() {
        super();
        this.BET_TYPE_BTN_COMPONENT = 'BauCuaBetTypeBtn';
        
        
        // BAU(1),
        // CUA(2),
        // TOM(3),
        // CA(4),
        // GA(5),
        // HUOU(6),
        // BAU_CUA(7),
        // BAU_TOM(8),
        // BAU_CA(9),
        // BAU_GA(10),
        // BAU_HUOU(11),
        // CUA_TOM(12),
        // CUA_CA(13),
        // CUA_GA(14),
        // CUA_HUOU(15),
        // TOM_CA(16),
        // TOM_GA(17),
        // TOM_HUOU(18),
        // CA_GA(19),
        // CA_HUOU(20),
        // GA_HUOU(21),
        this.betTypeIdsMap = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
        ]
    }
}

app.createComponent(BauCuaBetContainerButton);