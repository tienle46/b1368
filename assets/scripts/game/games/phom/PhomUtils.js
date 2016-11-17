/**
 * Created by Thanh on 9/23/2016.
 */

import app from 'app'
import PhomList from 'PhomList';
import CardList from 'CardList';
import {GameUtils, utils} from 'utils'
import JoinSolution from "./JoinSolution";
import JoinNode from "./JoinNode";
import Card from 'Card';
import Phom from 'Phom';
import PhomGenerator from "./PhomGenerator";

export default class PhomUtils {

    static get GAME_TYPE() {
        return app.const.game.GAME_TYPE_TIENLEN;
    };

    constructor() {
    }

    static isCa(card, caCard, isRank) {
        if (isRank) {
            return (card.rank == caCard.rank && card.suit != caCard.suit);
        } else {
            return ((card.suit == caCard.suit) && ((caCard.rank == (card.rank + 1)) || (caCard.rank == (card.rank + 2))
            || (caCard.rank == (card.rank - 1)) || (caCard.rank == (card.rank - 2))));
        }
    }

    static validateJoinPhom(cards, player) {

        let joinPhomList = null;
        let valid = !(player.currentGuiPhomSolutions.length == 0 || player.currentGuiPhomSolutions[0] < player.getSelectedCards().length);

        if(valid){
            let solution = player.currentGuiPhomSolutions[player.guiPhomSolutionId];
            joinPhomList = solution && PhomUtils.bestPhomList(player.board.allPhomList);
        }

        return {valid, joinPhomList}
    }

    static checkDownPhom(cards, player) {

        let solutionIndex = -1;
        let haphomList = PhomUtils.bestPhomList(cards);
        let haphomValue = haphomList.value();

        player.currentHaPhomSolutions.some((phomList, i) => {
            
            console.log("haphomValue: ", haphomValue, " ", phomList.value())
            
            if(phomList.value() == haphomValue){
                solutionIndex = i;
                return true;
            }
        });

        return solutionIndex >= 0;
    }

    static validateDownPhom(cards, player) {
        let downPhomList = null;

        let selectedCards = player.getSelectedCards();
        let valid = player.currentHaPhomSolutions.length > 0 && player.currentHaPhomSolutions[player.haPhomSolutionId].getCards().length == selectedCards.length;

        console.log("selectedCards: ", valid, selectedCards, player.currentHaPhomSolutions);

        valid && player.eatenCards.some(eatenCard => {
            if (selectedCards.indexOf(eatenCard) == -1) {
                valid = false;
                return true;
            }
        });

        valid && (downPhomList = player.currentHaPhomSolutions[player.haPhomSolutionId]);

        return {valid, downPhomList}
    }

    static isEaten(card){
        return card.locked;
    }

    static setEaten(card, eaten = true){
        card.setLocked(eaten);
    }

    static bestPhomList(cards) {
        let phomLists = PhomGenerator.generate(cards);
        return phomLists.length > 0 ? phomLists[0] : new PhomList();
    }

    static isUTron(phomList, player) {
        if (player.handCards.length != 10 || player.eatenCards.length > 2 || phomList.getCards().length != player.handCards.length) {
            return false;
        }
        return true;
    }

    static getJoinPhomSolutions(phoms, cards) {

        let solutions = [];
        let branch = new JoinSolution();

        PhomUtils.generateJoinPhomSolutions(phoms, cards, branch, solutions);

        JoinSolution.sortSolution(solutions);
        JoinSolution.removeSubSolution(solutions);
        JoinSolution.removeEmptySolution(solutions);

        return solutions;
    }

    static generateJoinPhomSolutions(phoms, cards, branch, solutions) {
        if (phoms.length == 0) return;

        for (let i = 0; i < cards.length; i++) {

            let card = cards[i];

            for (let j = 0; j < phoms.length; j++) {
                let phom = phoms[j];
                let checkJoinResult = phom.joinCard(card);

                if (checkJoinResult != -1) {

                    cards.splice(i, 1);
                    let node = new JoinNode(card, j);
                    branch.addNode(node);

                    PhomUtils.generateJoinPhomSolutions(phoms, cards, branch, solutions);

                    branch.removeNodeAt(branch.length - 1);
                    cards.splice(i, 0, card);
                    CardList.removeAllCards(phom.cards, [card]);
                }
            }
        }

        let isInside = false;

        for (let i = 0; i < solutions.length; i++) {
            let solution = solutions[i];
            if (solution.equals(branch)) {
                isInside = true;
                break;
            }
        }

        if (!isInside) {
            solutions.add(new JoinSolution(branch));
        }
    }

    static findPhomListAt(cards, index) {
        let pl = new PhomList();
        if (cards.length < 3) return pl;

        let firstCard = cards[index];
        pl.join(PhomUtils.findPhomListByRank(cards, firstCard, false));
        pl.join(PhomUtils.findPhomListBySuit(cards, firstCard, false));

        return pl;
    }

    static isMom(player) {
        let isMom = true;
        
        console.log("isMom: ",  player.renderer.downPhomList);
        
        player.renderer.downPhomList.some(phom => {
            if (phom.cards.length > 0) {
                isMom = false;
                return true;
            }
        });

        return isMom;
    }

    static checkPlayCard(playCards = [], cards = []) {

        if (playCards.length != 1) return false;

        let playingCard = playCards[0];
        let eatenCards = cards.filter(card => PhomUtils.isEaten(card));
        let valid = eatenCards.length == 0 || !CardList.contains(eatenCards, playingCard);

        if(valid){
            let checkingCards = [...cards];
            CardList.removeCard(checkingCards, playingCard);
            valid = this.isValidCards(checkingCards, eatenCards);
        }

        return valid;
    }

    static isValidCards(cards, eatenCards) {

        let valid = true;
        let eatenPhoms = PhomGenerator.generatePhomByEatenCard(cards, eatenCards);

        eatenCards.some(eatenCard => {
            let phoms = eatenPhoms[eatenCard];

            if(!(phoms.length > 0)){
                valid = false;
                return true;
            }
        });

        return valid;
    }

    static findPhomListAt(cards, index) {
        let pl = new PhomList();
        if (cards.length >= 3) {
            let firstCard = cards[index];
            pl.join(PhomUtils.findPhomListByRank(cards, firstCard, false));
            pl.join(PhomUtils.findPhomListBySuit(cards, firstCard, false));
        }
        return pl;
    }

    static findPhomListByEatenCard(cards, eatenCard) {

        let pl = new PhomList();

        if (!eatenCard.locked || cards.length < 3) return pl;

        pl.join(PhomUtils.findPhomListByRank(cards, eatenCard, true));
        pl.join(PhomUtils.findPhomListBySuit(cards, eatenCard, true));

        return pl;
    }

    static findPhomListByRank(cards, rankCard, isFullCase) {
        let pl = new PhomList();
        let generateRankCards = [];
        let indexOfRankCard = -1;
        let begin = 0;

        if (!isFullCase) {
            begin = rankCard.suit;
        }

        for (let suit = begin; suit < 4; suit++) {
            indexOfRankCard = cards.indexOf(Card.from(rankCard.rank, suit));
            if (indexOfRankCard != -1) {
                generateRankCards.push(cards[indexOfRankCard]);
            }
        }

        CardList.removeCard(cards, rankCard);
        for (let i = 0; i < generateRankCards.length - 1; i++) {
            for (let j = i + 1; j < generateRankCards.length; j++) {

                let rankPhom = new Phom();
                rankPhom.push(rankCard);
                rankPhom.push(generateRankCards[i]);
                rankPhom.push(generateRankCards[j]);

                if (PhomUtils.isValidEatenPhom(rankPhom)) {
                    pl.add(rankPhom);
                }
            }
        }

        return pl;
    }

    static findPhomListBySuit(cards, suitCard, isFullCase) {
        let pl = new PhomList();

        let generateSuitCard0, generateSuitCard1, generateSuitCard3, generateSuitCard4;

        if (isFullCase) {
            generateSuitCard0 = Card.from(suitCard.rank - 2, suitCard.suit);
            generateSuitCard1 = Card.from(suitCard.rank - 1, suitCard.suit);
        }

        generateSuitCard3 = Card.from(suitCard.rank + 1, suitCard.suit);
        generateSuitCard4 = Card.from(suitCard.rank + 2, suitCard.suit);

        let i0 = cards.indexOf(generateSuitCard0);
        let i1 = cards.indexOf(generateSuitCard1);
        let i3 = cards.indexOf(generateSuitCard3);
        let i4 = cards.indexOf(generateSuitCard4);

        if (i0 != -1 && i1 != -1) {
            let suitPhom = new Phom();
            suitPhom.push(suitCard);
            suitPhom.push(cards[i0]);
            suitPhom.push(cards[i1]);
            if (PhomUtils.isValidEatenPhom(suitPhom)) {
                pl.add(suitPhom);
            }
        }

        if (i1 != -1 && i3 != -1) {
            let suitPhom = new Phom();
            suitPhom.push(suitCard);
            suitPhom.push(cards[i1]);
            suitPhom.push(cards[i3]);
            if (PhomUtils.isValidEatenPhom(suitPhom)) {
                pl.add(suitPhom);
            }
        }

        if (i3 != -1 && i4 != -1) {
            let suitPhom = new Phom();
            suitPhom.push(suitCard);
            suitPhom.push(cards[i3]);
            suitPhom.push(cards[i4]);
            if (PhomUtils.isValidEatenPhom(suitPhom)) {
                pl.push(suitPhom);
            }
        }

        return pl;
    }

    static findPhomListByEatenCard(cards, eatenCard) {
        let pl = new PhomList();

        if (!eatenCard.locked || cards.length < 3) return pl;

        pl.join(PhomUtils.findPhomListByRank(cards, eatenCard, true));
        pl.join(PhomUtils.findPhomListBySuit(cards, eatenCard, true));

        return pl;
    }

    static isValidEatenPhom(phom) {
        let eatenCount = 0;
        for (let i = 0; i < phom.length; i++) {

            let phomCard = phom.cards[i];
            if (phomCard.locked) {
                eatenCount++;
                if (eatenCount > 1) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     *
     * @param card {Card}
     * @param type {Number} - PhomUtils.SORT_BY_RANK || PhomUtils.SORT_BY_SUIT;
     */
    static sortAsc(cards, type = PhomUtils.SORT_BY_RANK) {
        if(!cards) return;

        switch (type){
            case PhomUtils.SORT_BY_RANK:
                return cards.sort(PhomUtils._compareByRank);
                break;
            case PhomUtils.SORT_BY_SUIT:
                return cards.sort(PhomUtils._compareBySuit);
                break;
            case PhomUtils.SORT_BY_PHOM_FIRST:
                cards.sort(PhomUtils._compareByRank);
                this._sortSingleCards(cards);
                return cards;
                break;
            case PhomUtils.SORT_BY_PHOM_SOLUTION:
                let phomListSolutions = PhomGenerator.generate(cards);
                if (phomListSolutions.length > 0) {
                    let phomCards = phomListSolutions[0].getCards();
                    CardList.removeAllCards(cards, phomCards);
                    this._sortSingleCards(cards);
                    cards.splice(0, 0, ...phomCards);
                } else {
                    cards.sort(PhomUtils._compareByRank);
                }

                return cards;

                break;
            default:
                return cards.sort(PhomUtils._compareByRank);
        }
    }

    static _sortSingleCards(cards) {
        let index = 0;
        let singleCards = [];
        while (index < cards.length) {
            let indexCard = cards[index];
            if (!PhomUtils.isCa(indexCard, cards)) {
                singleCards.push(indexCard);
                cards.splice(index, 1);
            } else {
                index++;
            }
        }

        cards.push(...singleCards);
    }

    static compareCard(card1, card2, type){
        if (type == PhomUtils.SORT_BY_RANK) {
            return PhomUtils._compareByRank(card1, card2);
        } else {
            let compareBySuit = PhomUtils._compareBySuit(card1, card2);
            return compareBySuit != 0 ? compareBySuit : PhomUtils._compareByRank(card1, card2);
        }
    }

    static _compareByRank(card1, card2){
        return card1.rank - card2.rank;
    }

    static _compareBySuit(card1, card2){
        return card1.suit - card2.suit;
    }

}



PhomUtils.SORT_BY_RANK = 1;
PhomUtils.SORT_BY_SUIT = 2;
PhomUtils.SORT_BY_PHOM_FIRST = 3;
PhomUtils.SORT_BY_PHOM_SOLUTION = 4;

PhomUtils.COMPARE_RANK = 1;
PhomUtils.COMPARE_SUIT = 2;