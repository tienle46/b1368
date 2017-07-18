import app from 'app';
import BetTypeBtn from 'BetTypeBtn';
import CCUtils from 'CCUtils'

class TaiXiuBetTypeBtn extends BetTypeBtn {
    constructor() {
        super();
        this.properties = this.assignProperties({
            hightLight: cc.Node
        });
    }
    
    onLoad() {
        super.onLoad();
        this.hide();
    }
    
    highlight() {
        CCUtils.active(this.highlight);
    }
}

app.createComponent(TaiXiuBetTypeBtn);