import app from 'app';
import Actor from 'Actor';
import HighLowCardHand from 'HighLowCardHand'
import Utils from 'GeneralUtils';

class HighLowHistoryItem extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            lblSession: cc.Label,
            lblTime: cc.Label,
            lblTurn: cc.Label,
            lblAction: cc.Label,
            lblBet: cc.Label,
            lblWin: cc.Label,
            cardHand: cc.Sprite,
            cardAtlas: cc.SpriteAtlas,
        });
    }

    loadData(data) {
        let session = data.session
        let time = this.formatTime(data.time);
        let turn = data.turn
        let action = data.action
        let bet = data.bet || 0;
        let win = data.winAmount || 0;
        let card = data.card
        
        this.lblSession.string = session
        this.lblTime.string = time
        this.lblTurn.string = turn
        this.lblAction.string = action
        this.lblBet.string = bet
        this.lblWin.string = win

        this.lblTime.string = time;
        this.lblWin.string = Utils.formatNumberType1(win);
        this.lblBet.string = Utils.formatNumberType1(bet);
        this.lblCardTypeName.string = cardTypeName;
        this.cardHand.spriteFrame = this.cardAtlas.getSpriteFrame(HighLowCardHand.getSpriteName(card))
    }

    formatTime(dateStr) {
        return Utils.timeFormat(dateStr, 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YY HH:mm');
    }

}

app.createComponent(HighLowHistoryItem);