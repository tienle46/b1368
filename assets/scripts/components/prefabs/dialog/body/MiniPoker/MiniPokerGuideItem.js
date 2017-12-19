import app from 'app';
import Actor from 'Actor';
import MiniPokerCardHand from 'MiniPokerCardHand';

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
        this.prize1.string = listPrizes[0];
        this.prize2.string = listPrizes[1];
        this.prize3.string = listPrizes[2];
    }
}

app.createComponent(MiniPokerGuideItem);
