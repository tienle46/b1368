import app from 'app';
import Actor from 'Actor';
import MiniPokerCardHand from 'MiniPokerCardHand';
import MIniPokerCardType from 'MiniPokerCardType';

class MiniPokerGuideItem extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            cardHand: MiniPokerCardHand,

            cardHandName: cc.Label,
            prize1: cc.Label,
            prize2: cc.Label,
            prize3: cc.Label
        });
    }

    loadItem(name, type, listPrizes) {
        this.cardHandName.string = name;
        this.cardHand.loadCardsByType(type);
        if (type === MIniPokerCardType.THUNG_PHA_SANH_CHUA) {
            var color = new cc.Color(241, 212, 97);
            this.prize1.node.color = color;
            this.prize2.node.color = color;
            this.prize3.node.color = color;
            return;
        }

        if (!listPrizes) {
            listPrizes = ['', '', ''];
        }
        this.prize1.string = listPrizes[0];
        this.prize2.string = listPrizes[1];
        this.prize3.string = listPrizes[2];
    }
}

app.createComponent(MiniPokerGuideItem);
