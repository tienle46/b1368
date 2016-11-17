/**
 * Created by Thanh on 11/4/2016.
 */

import app from 'app';
import CardList from 'CardList';
import PhomUtils from "./PhomUtils";

export default class Phom extends CardList {
    constructor(cards = [], keepReference) {
        super();

        this.cards = keepReference ? cards : [...cards];
        PhomUtils.sortAsc(this.cards, PhomUtils.SORT_BY_RANK);

        this.owner = 0;

    }

    setCards(cards){
        super.setCards(PhomUtils.sortAsc(cards, PhomUtils.SORT_BY_RANK));
    }

    setOwner(owner) {
        this.owner = owner;
    }

    static from(cards) {
        let phom = new Phom(cards);
        return Phom.isPhomByRank(phom.cards) || !Phom.isPhomBySuit(phom.cards) ? phom : null;
    }

    equals(phom) {
        return this.cards.length > 2
            && this.cards.length == phom.cards.length
            && this.cards[0].byteValue == phom.cards[0].byteValue
            && this.cards[this.cards.length - 1].byteValue == phom.cards[this.cards.length - 1].byteValue
    }

    static isPhomByRank(cards) {
        let sortedCards = PhomUtils.sortAsc([...cards], PhomUtils.SORT_BY_RANK);
        return sortedCards[0].rank == sortedCards[sortedCards.length - 1].rank;
    }

    static isPhomBySuit(cards) {
        let sortedCards = PhomUtils.sortAsc([...cards], PhomUtils.SORT_BY_RANK);
        return (sortedCards[0].suit == sortedCards[sortedCards.length - 1].suit)
            && ( sortedCards[sortedCards.length - 1].rank - sortedCards[0].rank == (sortedCards.length - 1) );
    }

    value() {
        let retV = 0;

        for (let i = 0; i < this.cards.length; i++) {
            retV += this.cards[i].rank;
            if (PhomUtils.isEaten(this.cards[i])) {
                retV += 100;
            }
        }

        return retV;
    }

    sortAsc(){
        PhomUtils.sortAsc(this.cards, PhomUtils.SORT_BY_RANK);
    }

    isLongPhom() {
        return this.cards.length > 5;
    }

    joinCard(card) {
        let joinRet = this.joinable(card);
        if (joinRet == 0) {
            this.cards.splice(card.suit, 0, card);
        } else if (joinRet == 1) {
            this.cards.splice(0, 0, card);
        } else if (joinRet == 2) {
            this.cards.push(card);
        }
        return joinRet;
    }

    joinable(card) {
        let phomCard0 = this.cards[0];
        let phomCard1 = this.cards[1];

        if (phomCard0.rank == phomCard1.rank) {
            if (this.length == 4) {
                return -1;
            }
            if (card.rank == phomCard0.rank) {
                let phomCard2 = this.cards[2];

                if (!PhomUtils.isEaten(card) || (!PhomUtils.isEaten(phomCard0) && !PhomUtils.isEaten(phomCard1) && !PhomUtils.isEaten(phomCard2))) {
                    return 0;
                }
            }
        } else if (card.suit == phomCard0.suit) {
            let phomCardn = this.cards[this.cards.length - 1];
            let isPhomHasEatenCard = false;

            for (let i = 0; i < this.cards.length; i++) {
                if (PhomUtils.isEaten(this.cards[i])) {
                    isPhomHasEatenCard = true;
                    break;
                }
            }

            if (card.rank == (phomCard0.rank - 1) && (!PhomUtils.isEaten(card) || !isPhomHasEatenCard)) {
                return 1;
            }

            if (card.rank == (phomCardn.rank + 1) && (!PhomUtils.isEaten(card) || !isPhomHasEatenCard)) {
                return 2;
            }
        }

        return -1;
    }
}

app.createComponent(Phom);