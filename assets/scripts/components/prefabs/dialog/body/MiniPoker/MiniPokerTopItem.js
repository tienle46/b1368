import app from 'app';
import Actor from 'Actor';
import MiniPokerCardHand from 'MiniPokerCardHand';
import GameUtils from 'GameUtils';
import Utils from 'GeneralUtils';

class MiniPokerTopItem extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            lblRank: cc.Label,
            lblTime: cc.Label,
            lblUsername: cc.Label,
            lblBet: cc.Label,
            lblWin: cc.Label,

            cardHand: MiniPokerCardHand
        });

        this.topRankColor1 = new cc.Color(255, 242, 0, 255);
        this.topRankColor2 = new cc.Color(235, 235, 235, 255);
        this.MAX_USER_LENGTH = 8;
    }

    loadData(idx, data) {
        if (idx <= 2) {
            this.lblRank.node.color = this.topRankColor1;
        } else {
            this.lblRank.node.color = this.topRankColor2;
        }

        var rank = idx + 1;
        var time = this.formatDate(data.time);
        var username = this.formatUsername(data.playerName);
        var bet = data.bet || 0;
        var win = data.winAmount || 0;
        var cards = data.cards;

        this.lblRank.string = rank;
        this.lblTime.string = '' + time;
        this.lblUsername.string = username;
        this.lblBet.string = GameUtils.formatNumberType1(bet);
        this.lblWin.string = GameUtils.formatNumberType1(win);

        this.cardHand.loadCardsByValues(cards);
    }

    formatUsername(username) {
        var result = username;
        if (username.length > this.MAX_USER_LENGTH) {
            result = username.slice(0, this.MAX_USER_LENGTH) + '...';
        }

        return result;
    }

    formatDate(dateString) {
         return Utils.timeFormat(dateString, 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YY HH:mm');
    }

}

app.createComponent(MiniPokerTopItem);