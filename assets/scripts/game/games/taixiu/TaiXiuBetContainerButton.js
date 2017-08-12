import app from 'app';
import GameBetContainerButton from 'GameBetContainerButton';

export default class TaiXiuBetContainerButton extends GameBetContainerButton {
    constructor() {
        super();
        this.BET_TYPE_BTN_COMPONENT = 'TaiXiuBetTypeBtn';
        
        // TAI(1),
        // XIU(2),

        // BO4(4), => // SUM = 4
        // BO5(5),
        // BO6(6),
        // BO7(7),
        // BO8(8),
        // BO9(9),
        // BO10(10),
        // BO11(11),
        // BO12(12),
        // BO13(13),
        // BO14(14),
        // BO15(15),
        // BO16(16),
        // BO17(17),

        
        // BOS_1(21), // SINGLE = 1
        // BOS_2(22),
        // BOS_3(23),
        // BOS_4(24),
        // BOS_5(25),
        // BOS_6(26)
        
        // BOG_3(30), // cái bét dài dài [1x3 -> 6x3]
        
        // BOG_31(31), // 1x3
        // BOG_32(32), // 2x3
        // BOG_33(33),
        // BOG_34(34),
        // BOG_35(35),
        // BOG_36(36),

            
        this.betTypeIdsMap = [
            1, 2, 
            4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
            21, 22, 23, 24, 25, 26,
            30 ,31 ,32 ,33 ,34 ,35, 36
        ]
    }
    
    /**
     * @extending
     * 
     * @param {any} id 
     * @param {any} dots 
     * @memberof TaiXiuBetContainerButton
     */
    doesBetTypeIdWin(id, winIds) {
        return app._.includes(winIds, id)
    }
    
    highLightBets(ids = []) {
        ids.forEach((id) => {
            this.groupBtns.forEach(type => {
                type.getComponent(this.BET_TYPE_BTN_COMPONENT).highlight(type.id == id)
            })
        })
    }
    
    /**
     * @override
     * 
     * @memberof TaiXiuBetContainerButton
     */
    resetBtns() {
        this.groupBtns.forEach((btn) => {
            btn.getComponent(this.BET_TYPE_BTN_COMPONENT).setLbls(0);
            btn.getComponent(this.BET_TYPE_BTN_COMPONENT).highlight(false);
        });
    }
}

app.createComponent(TaiXiuBetContainerButton);