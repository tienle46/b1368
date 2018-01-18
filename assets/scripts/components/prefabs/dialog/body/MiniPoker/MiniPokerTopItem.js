import app from 'app';
import Actor from 'Actor';
import MiniPokerCardHand from 'MiniPokerCardHand';
import GameUtils from 'GameUtils';
import Utils from 'GeneralUtils';

class MiniPokerTopItem extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            atlas: cc.SpriteAtlas,
            imgRank: cc.Sprite,
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
            // this.lblRank.node.color = this.topRankColor1;
            this.imgRank.node.active = true;
            this.lblRank.node.active = false;
            this.imgRank.spriteFrame = this.spriteFrameForIdx(idx);
        } else {
            this.imgRank.node.active = false;
            this.lblRank.node.active = true;
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
        this.lblBet.string = this.formatNumber(bet);
        this.lblWin.string = this.formatNumber(win);

        this.cardHand.loadCardsByValues(cards);
    }

    spriteFrameForIdx(idx) {
        return this.atlas.getSpriteFrame(this.spriteFrameNameForIdx(idx));
    }

    spriteFrameNameForIdx(idx) {
        switch (idx) {
            case 0:
                return 'rank_first';
            case 1:
                return 'rank_second';
            case 2:
                return 'rank_third';
            default:
                return 'rank_first';
        }
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

    formatNumber(number) {
        const K = 1000;
        const M = (K * K);
        const B = (M * K);

        if (Math.abs(number) > B) {
            return this._format(number, B, 'B');
        } else if (Math.abs(number) > M) {
            return this._format(number, M, 'M');
        } else if (Math.abs(number) > K) {
            return this._format(number, K, 'K');
        }
        return number;
    }

    _format(number, threshold, representStr) {
        var pre = Math.floor(number / threshold);
        var remaining = Math.floor((number % threshold) / 100);
        if (remaining === 0) {
            return pre + representStr;
        }
        return pre + ',' + remaining + representStr;
    }

}

app.createComponent(MiniPokerTopItem);