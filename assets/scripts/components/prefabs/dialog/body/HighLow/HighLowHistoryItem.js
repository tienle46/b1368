import app from 'app';
import Actor from 'Actor';
import GameUtils from 'GameUtils';
import Utils from 'GeneralUtils';

class HighLowHistoryItem extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            lblSession: cc.Label,
            lblStepNumber: cc.Label,
            lblBet: cc.Label,
            lblWin: cc.Label,
        });
        this.popupInfo = null;
        this.itemId = null;
        this.time = null;
    }

    loadData(data) {
        let session = data.i
        let stepNumber = data.step
        let bet = data.bet || 0;
        let win = data.winAmount || 0;
        
        this.lblSession.string = session
        this.lblStepNumber.string = stepNumber
        this.lblBet.string = GameUtils.formatNumberType1(bet)
        this.lblWin.string = GameUtils.formatNumberType1(win);

        this.itemId = data.i
        this.time = this.formatTime(data.time)
    }

    formatTime(dateStr) {
        return Utils.timeFormat(dateStr, 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YY HH:mm');
    }

}

app.createComponent(HighLowHistoryItem);