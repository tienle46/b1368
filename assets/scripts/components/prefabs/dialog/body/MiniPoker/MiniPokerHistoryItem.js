import app from 'app';
import Actor from 'Actor';
import MiniPokerCardHand from 'MiniPokerCardHand';
import MiniPokerCardType from 'MiniPokerCardType';
import Utils from 'GeneralUtils';

class MiniPokerHistoryItem extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            lblTime: cc.Label,
            lblCardTypeName: cc.Label,
            lblBet: cc.Label,
            lblWin: cc.Label,

            cardHand: MiniPokerCardHand
        });
    }

    loadData(data) {
        var time = this.formatTime(data.time);
        var win = data.winAmount || 0;
        var bet = data.bet || 0;
        var cardType = data.cardType || MiniPokerCardType.THUA;
        var cardTypeName = MiniPokerCardType.getNameForType(cardType);
        var cards = data.cards;

        this.lblTime.string = time;
        this.lblWin.string = Utils.formatNumberType1(win);
        this.lblBet.string = Utils.formatNumberType1(bet);
        this.lblCardTypeName.string = cardTypeName;
        this.cardHand.loadCardsByValues(cards);
    }

    formatTime(dateStr) {
        return Utils.timeFormat(dateStr, 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YY HH:mm');
    }

}

app.createComponent(MiniPokerHistoryItem);