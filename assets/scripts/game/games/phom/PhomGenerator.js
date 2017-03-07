/**
 * Created by Thanh on 11/15/2016.
 */

import Phom from "Phom";
import PhomList from "PhomList";
import PhomUtils from "PhomUtils";
import ArrayUtils from "ArrayUtils";

export default class PhomGenerator {

    static generate(cards) {

        let allPhoms = this.generateAllPhom(cards);

        let generatedPhomLists = [...allPhoms.map(phom => new PhomList([phom]))];
        
        this._generateSubsetAlgorithm(allPhoms.map((phom, i) => i), 2, (indexArr) => {
            let phoms = allPhoms.filter((value, i) => indexArr.indexOf(i) >= 0);
            !this._isDuplicateCardInPhom(phoms) && generatedPhomLists.push(new PhomList(phoms));
        })

        this._generateSubsetAlgorithm(allPhoms.map((phom, i) => i), 3, (indexArr) => {
            let phoms = allPhoms.filter((value, i) => indexArr.indexOf(i) >= 0);
            !this._isDuplicateCardInPhom(phoms) && generatedPhomLists.push(new PhomList(phoms));
        });

        return this._sortPhomLists(generatedPhomLists);
    }

    static generatePhomContainEatenCards(cards, eatenCards = []) {

        let phomLists = this.generate(cards);

        if(eatenCards.length > 0){
            phomLists = phomLists.filter(phomList => ArrayUtils.containsAll(phomList.cards, eatenCards))
        }

        return phomLists;

    }

    static generatePhomByEatenCard(cards, eatenCards){
        let allPhoms = this.generateAllPhom(cards);
        let phomMap = {};

        eatenCards.forEach((eatenCard) => {
            phomMap[eatenCard] = allPhoms.filter(phom => ArrayUtils.contains(phom.cards, eatenCard));
        });

        return phomMap;
    }

    static generateAllPhom(cards){
        cards = PhomUtils.sortAsc([...cards]);
        let phomByRanks = this._findPhomByRank([...cards]);
        let phomBySuits = this._findPhomBySuit([...cards]);

        return [...phomByRanks, ...phomBySuits];
    }

    static _sortPhomLists(phomLists) {
        return phomLists.sort((phomList1, phomList2) => {
            return phomList2.value() - phomList1.value()
        });
    }

    static _isDuplicateCardInPhom(phoms) {

        let cardValues = [];
        let duplicate = false;
        let cards = phoms.reduce((arr, phom) => arr.concat(phom.cards), []);
        cards.some(card => {
            let value = card.value();
            if (cardValues.indexOf(value) >= 0) {
                duplicate = true;
                return true;
            }
            cardValues.push(value);
        });

        return duplicate;
    }

    static _countEatenCard(cards) {
        return cards.reduce((count, card) => {
            return PhomUtils.isEaten(card) ? ++count : count
        }, 0);
    }

    static _isValidPhomEatenCard(cards) {
        return PhomGenerator._countEatenCard(cards) <= 1
    }

    static _isValidPhomLength(cards) {
        return cards.length >= 3;
    }

    static _isSuitPhom(cards) {

        let preCard;
        let isSuitPhom = this._isValidPhomLength(cards);
        cards.some(card => {
            if (preCard) {
                if (card.rank - preCard.rank != 1) {
                    isSuitPhom = false;
                    return true;
                }
            }

            preCard = card;
        });

        return isSuitPhom;
    }

    static _findPhomByRank(cards) {
        const phoms = [];
        const findRanks = [];

        cards.forEach(rankCard => {
            let rank = rankCard.rank;

            if (findRanks.indexOf(rank) < 0) {
                let sameRankCards = cards.filter(card => { return card.rank == rank });
                findRanks.push(rank)

                let phomCardsArr = [sameRankCards];
                if(sameRankCards.length == 4){
                    phomCardsArr.push([sameRankCards[0], sameRankCards[1], sameRankCards[2]]);
                    phomCardsArr.push([sameRankCards[0], sameRankCards[1], sameRankCards[3]]);
                    phomCardsArr.push([sameRankCards[0], sameRankCards[2], sameRankCards[3]]);
                    phomCardsArr.push([sameRankCards[1], sameRankCards[2], sameRankCards[3]]);
                }

                phomCardsArr.forEach(phomCards => {
                    if (this._isValidPhomEatenCard(phomCards) && this._isValidPhomLength(phomCards)) {
                        phoms.push(new Phom(phomCards));
                    }
                });
            }
        });

        return phoms;
    }

    static _findPhomBySuit(cards) {
        const phoms = [];
        // cards.forEach(card => console.log("rank: ", card.rank, " suit: ", card.suit));

        for (let suit = 0; suit < 4; suit++) {

            let sameSuitCards = cards.filter(card => card.suit == suit);
            let sortedCards = PhomUtils.sortAsc(sameSuitCards);
            // sortedCards.forEach(card => console.log("rank: ", card.rank, " suit: ", card.suit));

            for (let i = 3; i <= sortedCards.length && i < 6; i++) {
                for (let j = 0; j <= sortedCards.length - i; j++) {

                    let checkCards = sortedCards.slice(j, j + i);
                    // checkCards.forEach(card => console.log("rank: ", card.rank, " suit: ", card.suit));

                    if (PhomGenerator._isSuitPhom(checkCards)) {
                        phoms.push(new Phom(checkCards));
                    }
                }
            }
        }

        return phoms;
    }

    static _generateSubsetAlgorithm(arr, setCount, cb, n = arr.length, i = 1) {
        for (let j = arr[i - 1] + 1; j <= n - setCount + i; j++) {
            arr[i] = j;
            if (i == setCount) {
                cb && cb(arr.slice(1, setCount + 1).map(val => val - 1));
            }
            else {
                this._generateSubsetAlgorithm(arr, setCount, cb, n, i + 1);
            }
        }
    }
}