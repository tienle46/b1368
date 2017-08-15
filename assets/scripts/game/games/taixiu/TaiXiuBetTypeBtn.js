import app from 'app';
import BetTypeBtn from 'BetTypeBtn';

export default class TaiXiuBetTypeBtn extends BetTypeBtn {
    constructor() {
        super();
        this.properties = this.assignProperties({
            highlightNode: cc.Node
        });
       
        this.updateTimer = 0;
        this.updateInterval = 0.2;
    }
    
    onLoad() {
        super.onLoad()
        this.highlight(false)
    }
    
    reset() {
        super.reset()
        this.highlight(false)
    }
    
    highlight(state = true) {
        if(state) {
            this.highlightNode.stopAllActions()
            this.highlightNode.runAction(cc.fadeIn(.2))
        } else {
            this.highlightNode.opacity = 0
        }
    }
    
    update(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        this.allBetAmount == 0 && this.hideAllBetLbl()
        this.ownBetAmount == 0 && this.hideOwnBetLbl()
        
        this.allBetAmount > 0 && !this.allBetWrap.active && this.showAllBetLbl()
        this.ownBetAmount > 0 && !this.ownBetWrap.active && this.showOwnBetLbl()
    }
}

app.createComponent(TaiXiuBetTypeBtn);