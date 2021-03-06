import app from 'app';
import TaiXiuBetTypeBtn from 'TaiXiuBetTypeBtn';

class BauCuaBetTypeBtn extends TaiXiuBetTypeBtn {
    constructor() {
        super();
    }
    
    /**
     * @override
     * 
     * @param {any} dt 
     * @memberof BauCuaBetTypeBtn <- TaiXiuBetTypeBtn
     */
    update(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        // this.allBetAmount == 0 && this.hideAllBetLbl()
        this.ownBetAmount == 0 && this.hideOwnBetLbl()
        
        // this.allBetAmount > 0 && !this.allBetWrap.active && this.showAllBetLbl()
        this.ownBetAmount > 0 && !this.ownBetWrap.active && this.showOwnBetLbl()
    }
}

app.createComponent(BauCuaBetTypeBtn);