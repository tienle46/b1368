import app from 'app';
import Actor from 'Actor';
import GameUtils from 'GameUtils';
import Utils from 'GeneralUtils';

class SlotTopItem extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            LblTime: cc.Label,
            lblSession: cc.Label,
            lblBetMin: cc.Label,
            lblBet: cc.Label,
            lblWin: cc.Label,

        });

    }

    loadData(data) {
        this.lblTime.string = this.formatDate(data.time)
        this.lblSession.string = data.session
        this.lblBetMin.string = GameUtils.formatNumberType1(data.betmin)
        this.lblBet.string = GameUtils.formatNumberType1(data.bet)
        this.lblWin.string = GameUtils.formatNumberType1(data.win)
    }

    formatDate(dateString) {
        return Utils.timeFormat(dateString, 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YY HH:mm');
    }

}


app.createComponent(SlotTopItem);