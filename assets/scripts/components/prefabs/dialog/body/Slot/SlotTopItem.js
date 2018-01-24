import app from 'app';
import Actor from 'Actor';
import GameUtils from 'GameUtils';
import Utils from 'GeneralUtils';

class SlotTopItem extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            LblStt: cc.Label,
            lblUsername: cc.Label,
            lblBet: cc.Label,
            lblWin: cc.Label,


        });

    }

    loadData(data) {
        console.log('dataItem', data)
        this.LblStt.string = data.stt
        this.lblUsername.string = data.username
        this.lblBet.string = data.bet
        this.lblWin.string = data.win
    }


}

app.createComponent(SlotTopItem);