/**
 * Created by Thanh on 11/15/2016.
 */

import Phom from "./Phom";
import CardList from "../../base/card/CardList";
import PhomList from "./PhomList";
import PhomUtils from "./PhomUtils";

export default class PhomGenerator {

    static generate(cards) {

        let allPhoms = this._generateAllPhom(cards);
        let generatedPhomLists = [...allPhoms.map(phom => new PhomList([phom]))];

        this.generateSubsetAlgorithm(allPhoms.map((phom, i) => i), 2, (indexArr) => {
            let phoms = allPhoms.filter((value, i) => indexArr.indexOf(i) >= 0);
            if (!this.isDuplicateCardInPhom(phoms)) {
                generatedPhomLists.push(new PhomList(phoms));
            }
        })

        this.generateSubsetAlgorithm(allPhoms.map((phom, i) => i), 3, (indexArr) => {
            let phoms = allPhoms.filter((value, i) => indexArr.indexOf(i) >= 0);
            if (!this.isDuplicateCardInPhom(phoms)) {
                generatedPhomLists.push(new PhomList(phoms));
            }
        });

        console.log("all phoms: ", allPhoms);
        return this.sortPhomLists(generatedPhomLists);
    }

    static generatePhomByEatenCard(cards, eatenCards){
        let allPhoms = this._generateAllPhom(cards);
        let phomMap = {};

        eatenCards.forEach((eatenCard) => {
            phomMap[eatenCard] = allPhoms.filter(phom => CardList.contains(phom.cards, eatenCard));
        });

        return phomMap;
    }

    static _generateAllPhom(cards){
        cards = PhomUtils.sortAsc(cards);
        return [...this.findPhomByRank([...cards]), ...this.findPhomBySuit([...cards])];
    }

    static sortPhomLists(phomLists) {
        return phomLists.sort((phomList1, phomList2) => {
            console.log(phomList2);
            return phomList2.value() - phomList1.value()
        });
    }

    static isDuplicateCardInPhom(phoms) {

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

    static countEatenCard(cards) {
        return cards.reduce((count, card) => {
            return PhomUtils.isEaten(card) ? ++count : count
        }, 0);
    }

    static isValidPhomEatenCard(cards) {
        return PhomGenerator.countEatenCard(cards) <= 1
    }

    static isValidPhomLength(cards) {
        return cards.length >= 3;
    }

    static isSuitPhom(cards) {

        let preCard;
        let isSuitPhom = this.isValidPhomLength(cards);
        cards.some(card => {
            if (preCard) {
                console.log(card.rank, preCard.rank)
                if (card.rank - preCard.rank != 1) {
                    isSuitPhom = false;
                    return true;
                }
            }

            preCard = card;
        });

        return isSuitPhom;
    }

    static findPhomByRank(cards) {
        const phoms = [];
        const findRanks = [];

        cards.forEach(rankCard => {
            let rank = rankCard.rank;

            if (findRanks.indexOf(rank) < 0) {
                let sameRankCards = cards.filter(card => { return card.rank == rank });
                if (this.isValidPhomEatenCard(sameRankCards) && this.isValidPhomLength(sameRankCards)) {
                    phoms.push(new Phom(sameRankCards));
                }
                findRanks.push(rank)
            }
        });

        return phoms;
    }

    static findPhomBySuit(cards) {
        const phoms = [];

        console.log("Cards: ");
        cards.forEach(card => console.log("rank: ", card.rank, " suit: ", card.suit));

        for (let suit = 0; suit < 4; suit++) {

            let sameSuitCards = cards.filter(card => card.suit == suit);
            let sortedCards = PhomUtils.sortAsc(sameSuitCards);

            console.log("sortedCards: ");
            sortedCards.forEach(card => console.log("rank: ", card.rank, " suit: ", card.suit));

            for (let i = 3; i <= sortedCards.length && i < 6; i++) {
                for (let j = 0; j <= sortedCards.length - i; j++) {

                    let checkCards = sortedCards.slice(j, j + i);

                    console.log("checkCards")
                    checkCards.forEach(card => console.log("rank: ", card.rank, " suit: ", card.suit));

                    if (PhomGenerator.isSuitPhom(checkCards)) {
                        console.log("push suit phom: ", phoms);
                        phoms.push(new Phom(checkCards));
                    }
                }
            }
        }

        return phoms;
    }

    static generateSubsetAlgorithm(arr, setCount, cb, n = arr.length, i = 1) {
        for (let j = arr[i - 1] + 1; j <= n - setCount + i; j++) {
            arr[i] = j;
            if (i == setCount) {
                cb && cb(arr.slice(1, setCount + 1).map(val => val - 1));
            }
            else {
                this.generateSubsetAlgorithm(arr, setCount, cb, n, i + 1);
            }
        }
    }

    static _generateJoinPhomSolutions(cards, joiningCard){
        let allPhoms = this._generateAllPhom([...cards, joiningCard]);
        let joinablePhom = allPhoms.filter(phom => CardList.contains(phom.cards, joiningCard));
        return joinablePhom;
    }


}