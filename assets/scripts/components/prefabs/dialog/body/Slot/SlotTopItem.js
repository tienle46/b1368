import app from 'app';
import Actor from 'Actor';
import GameUtils from 'GameUtils';
import Utils from 'GeneralUtils';

class SlotTopItem extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            LblTime: cc.Label,
            lblUsername: cc.Label,
            lblBet: cc.Label,
            lblWin: cc.Label,
            lblDetail: cc.Label


        });

    }

    loadData(data) {
        console.log('dataItem', data)
        this.LblTime.string = '' + this.formatDate(data.time)
        this.lblUsername.string = data.username
        this.lblBet.string = GameUtils.formatNumberType1(data.bet)
        this.lblWin.string = GameUtils.formatNumberType1(data.win)
        this.lblDetail.string = data.detail
    }

    formatDate(dateString) {
        return Utils.timeFormat(dateString, 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YY HH:mm');
    }

}


app.createComponent(SlotTopItem);