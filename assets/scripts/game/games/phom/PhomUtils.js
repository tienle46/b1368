/**
 * Created by Thanh on 9/23/2016.
 */

import app from 'app'
import PhomList from 'PhomList';
import {GameUtils, utils} from 'utils'
import JoinSolution from "JoinSolution";
import JoinNode from "JoinNode";
import Card from 'Card';
import PhomGenerator from "PhomGenerator";
import ArrayUtils from "ArrayUtils";

export default class PhomUtils {

    constructor(){}

    static get GAME_TYPE() {
        return app.const.game.GAME_TYPE_TIENLEN;
    };

    static isPhomByRank(cards, sorted = false) {
        let sortedCards = sorted ? cards : PhomUtils.sortAsc([...cards], PhomUtils.SORT_BY_RANK);
        return sortedCards[0].rank == sortedCards[sortedCards.length - 1].rank;
    }

    static isPhomBySuit(cards, sorted = false) {
        let sortedCards = sorted ? cards : PhomUtils.sortAsc([...cards], PhomUtils.SORT_BY_RANK);
        return (sortedCards[0].suit == sortedCards[sortedCards.length - 1].suit)
            && ( sortedCards[sortedCards.length - 1].rank - sortedCards[0].rank == (sortedCards.length - 1) );
    }

    static getAllCards(phoms){
        
        console.log("getAllCards: ", phoms.reduce((cards, phom) => {
            return [...cards, ...phom.cards];
        }, []));
        
        return !ArrayUtils.isEmpty(phoms) && phoms.reduce((cards, phom) => {
            return [...cards, ...phom.cards];
        }, []) || [];
    }

    static isCa(card, caCard, isRank) {
        if (isRank) {
            return (card.rank == caCard.rank && card.suit != caCard.suit);
        } else {
            return ((card.suit == caCard.suit) && ((caCard.rank == (card.rank + 1)) || (caCard.rank == (card.rank + 2))
            || (caCard.rank == (card.rank - 1)) || (caCard.rank == (card.rank - 2))));
        }
    }

    static validateGuiPhom(cards, player) {

        let valid = false;
        let guiSolution = null;
        let selectedCards = player.getSelectedCards();

        if(player.currentGuiPhomSolutions.length > 0 && selectedCards.length > 0){
            player.currentGuiPhomSolutions.some(solution => {
                let joinCards = solution.map(joinNode => joinNode.card);
                if(ArrayUtils.containsAll(cards, joinCards)){
                    guiSolution = solution;
                    valid= true;
                    return true;
                }
            });
        }

        return {valid, guiSolution}
    }

    static checkDownPhom(cards, player) {

        let solutionIndex = -1;
        let haphomList = PhomUtils.bestPhomList(cards);

        if(haphomList.getCards().length == cards.length){
            let haphomValue = haphomList.value();
            player.currentHaPhomSolutions.some((phomList, i) => {

                console.log("haphomValue: ", haphomValue, " ", phomList.value())

                if(phomList.value() == haphomValue){
                    solutionIndex = i;
                    return true;
                }
            });
        }

        return solutionIndex >= 0;
    }

    static isPhom(cards){
        this.sortAsc(cards);
        return this.isPhomByRank(cards, true) || this.isPhomBySuit(cards, true);
    }

    static checkEatPhom(cards, eatingCard, player) {
        let eatable = cards.length == 2 && this.isPhom([...cards, eatingCard])
            && (player.eatenCards.length == 0 || !ArrayUtils.containsSome(cards, player.eatenCards));

        if(eatable){
            let checkPhomCards = [...player.handCards];
            ArrayUtils.removeAll(checkPhomCards, cards);
            let allGeneratedPhomList = PhomGenerator.generate(checkPhomCards);
            allGeneratedPhomList.some(phomList => {
                if(ArrayUtils.containsAll(phomList.getCards(), player.eatenCards)){
                    eatable = true;
                    return true;
                }
            });
        }

        return eatable;
    }

    static validateDownPhom(cards, player) {
        let downPhomList = null;

        let selectedCards = player.getSelectedCards();
        let valid = player.currentHaPhomSolutions.length > 0 && player.currentHaPhomSolutions[player.haPhomSolutionId].getCards().length == selectedCards.length;

        console.log("selectedCards: ", valid, selectedCards, player.currentHaPhomSolutions);

        valid && player.eatenCards.some(eatenCard => {
            if (ArrayUtils.findIndex(selectedCards, eatenCard) == -1) {
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

        console.log("on get join phom solution", cards);
        phoms.forEach(phom => {
            console.log(phom, phom.cards.length);
        })

        PhomUtils.generateJoinPhomSolutions(phoms, cards, branch, solutions);

        console.log("after on get join phom solution", cards);
        phoms.forEach(phom => {
            console.log(phom, phom.cards.length);
        })

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
                    ArrayUtils.remove(phom.cards, card);
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
            solutions.push(new JoinSolution(branch));
        }
    }

    static checkPlayCard(playCards = [], cards = []) {

        if (playCards.length != 1) return false;

        let playingCard = playCards[0];
        let eatenCards = cards.filter(card => PhomUtils.isEaten(card));
        let valid = eatenCards.length == 0 || !ArrayUtils.contains(eatenCards, playingCard);

        if(valid){
            let checkingCards = [...cards];
            ArrayUtils.remove(checkingCards, playingCard);
            valid = this.isContainPhomWithEatenCards(checkingCards, eatenCards);
        }

        return valid;
    }

    static isContainPhomWithEatenCards(cards, eatenCards) {

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
                    ArrayUtils.removeAll(cards, phomCards);
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