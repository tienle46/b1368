import app from 'app';
import BetTypeBtn from 'BetTypeBtn';
import CCUtils from 'CCUtils'

class TaiXiuBetTypeBtn extends BetTypeBtn {
    constructor() {
        super();
        this.properties = this.assignProperties({
            hightLight: cc.Node
        });
        
        this.allBetState = false;
        this.allBetState = false;
    }
    
    onLoad() {
        // super.onLoad();
        this.hide();
        this.highlight(false);
    }
    
    showAllBetLbl() {
        CCUtils.setActive(this.allBetWrap)
    }
    
    hideAllBetLbl() {
        CCUtils.setActive(this.allBetWrap, false)
    }
    
    showOwnBetLbl() {
        CCUtils.setActive(this.ownBetWrap)
    }
    
    hideOwnBetLbl() {
        CCUtils.setActive(this.ownBetWrap, false)
    }
    
    highlight(state = true) {
        CCUtils.setActive(this.hightLight, state);
    }
}

app.createComponent(TaiXiuBetTypeBtn);