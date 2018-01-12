import app from 'app';
import Actor from 'Actor';
import GameUtils from 'GameUtils';
import Utils from 'GeneralUtils';

class HighLowTopItem extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            rank: cc.Node,
            lblTime: cc.Label,
            lblUsername: cc.Label,
            lblBet: cc.Label,
            lblInfo: cc.Label,
            lblWin: cc.Label,

            highLowAtlas: cc.SpriteAtlas,

        });

        this.topRankColor1 = new cc.Color(255, 242, 0, 255);
        this.topRankColor2 = new cc.Color(235, 235, 235, 255);
        this.MAX_USER_LENGTH = 8;
    }

    loadData(idx, data) {
        let rank = idx + 1;
        let spriteRank
        if (rank < 4) {
            switch (rank) {
                case 1:
                    spriteRank = 'rank_first'
                    break
                case 2:
                    spriteRank = 'rank_second'
                    break
                case 3:
                    spriteRank = 'rank_third'
                    break
            }
            this.rank.getComponentInChildren(cc.Sprite).spriteFrame = this.highLowAtlas.getSpriteFrame(spriteRank)
        } else {
            this.rank.getComponentInChildren(cc.Label).string = rank
        }
        
        var time = this.formatDate(data.time);
        var username = this.formatUsername(data.playerName);
        var bet = data.bet || 0;
        var info = data.info || '';
        var win = data.winAmount || 0;
        // var cards = data.cards;

        // this.lblRank.string = rank;
        this.lblTime.string = '' + time;
        this.lblUsername.string = username;
        this.lblBet.string = GameUtils.formatNumberType1(bet);
        this.lblInfo.string = info;
        this.lblWin.string = GameUtils.formatNumberType1(win);

        // this.cardHand.loadCardsByValues(cards);
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

app.createComponent(HighLowTopItem);