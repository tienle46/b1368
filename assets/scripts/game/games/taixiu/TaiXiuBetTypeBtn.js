import app from 'app';
import BetTypeBtn from 'BetTypeBtn';
import CCUtils from 'CCUtils'

class TaiXiuBetTypeBtn extends BetTypeBtn {
    constructor() {
        super();
        this.properties = this.assignProperties({
            highlightNode: cc.Node
        });
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
        // CCUtils.setActive(this.hightLight, state);
    }
    
    update(dt) {
        if(this.ownBetAmount === 0 || this.allBetAmount === 0  ) {
            this.allBetAmount === 0 && this.hideAllBetLbl()
            this.ownBetAmount === 0 && this.hideOwnBetLbl()
        } else {
            this.allBetAmount > 0 && !this.allBetWrap.active && this.showAllBetLbl()
            this.ownBetAmount > 0 && !this.ownBetWrap.active && this.showOwnBetLbl()
        }
    }
}

app.createComponent(TaiXiuBetTypeBtn);