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
        return !ArrayUtils.isEmpty(phoms) && phoms.reduce((cards, phom) => {
            return [...cards, ...phom.cards];
        }, []) || [];
    }

    static isCaRank(card, caCard) {
        return card.rank == caCard.rank && card.suit != caCard.suit;
    }

    static isCaSuit(card, caCard){
        return (card.suit == caCard.suit) && ((caCard.rank == (card.rank + 1)) || (caCard.rank == (card.rank + 2))
            || (caCard.rank == (card.rank - 1)) || (caCard.rank == (card.rank - 2)));
    }

    static isCa(card, caCard, isRank) {
        if (isRank) {
            return (card.rank == caCard.rank && card.suit != caCard.suit);
        } else {
            return (card.suit == caCard.suit) && ((caCard.rank == (card.rank + 1)) || (caCard.rank == (card.rank + 2))
            || (caCard.rank == (card.rank - 1)) || (caCard.rank == (card.rank - 2)));
        }
    }

    static checkCa(checkCard, cards){
        for (let i = 0; i < cards.length; i++) {
            if (this.isCaRank(checkCard, cards[i]) || this.isCaSuit(checkCard, cards[i])) {
                return true;
            }
        }
        return false;
    }

    static findBestJoinPhomSolution(allPhomList, cards){
        let joinPhomSolutions = PhomUtils.getJoinPhomSolutions(allPhomList, cards)
        return joinPhomSolutions.length > 0 ? joinPhomSolutions[0] : null;
    }

    static checkGuiPhom(allPhomList, player){

        let selectedCards = player.getSelectedCards();
        let bestJoinPhomSolution = this.findBestJoinPhomSolution(allPhomList.filter(phom => phom.owner != this.id), selectedCards);
        if(bestJoinPhomSolution && bestJoinPhomSolution.length == selectedCards.length) {
            return true
        }

        return false
    }

    static validateGuiPhom(allPhomList, player) {

        let valid = false;
        let guiSolution = null;
        let selectedCards = player.getSelectedCards();
        let bestJoinPhomSolution = this.findBestJoinPhomSolution(allPhomList.filter(phom => phom.owner != player.id), selectedCards);

        if(bestJoinPhomSolution && bestJoinPhomSolution.length == selectedCards.length) {
            valid = true
            guiSolution = bestJoinPhomSolution
        }

        return {valid, guiSolution}
    }

    static checkDownPhom(cards, player) {

        let solutionIndex = -1;
        if(this.containAllEatenCards(cards, player.eatenCards)){
            let haphomList = PhomUtils.findBestPhomListContainEatenCards(cards);
            if(haphomList.getCards().length == cards.length){
                return true;
            }
        }

        return false;

        // if(haphomList.getCards().length == cards.length){
        //     let haphomValue = haphomList.value();
        //     player.currentHaPhomSolutions.some((phomList, i) => {
        //         if(phomList.value() == haphomValue){
        //             solutionIndex = i;
        //             return true;
        //         }
        //     });
        // }
        //
        // return solutionIndex >= 0;
    }

    static isPhom(cards){
        let cardsCopy = [...cards];
        this.sortAsc(cardsCopy);
        return this.isPhomByRank(cardsCopy, true) || this.isPhomBySuit(cardsCopy, true);
    }

    static getEatenCards(cards){
        return cards == null ? [] : cards.filter(card => PhomUtils.isEaten(card));
    }

    static checkEatPhom(cards, eatingCard, player) {
        let eatable = cards && cards.length >= 2 && this.isPhom([...cards, eatingCard])
            && (player.eatenCards.length == 0 || !ArrayUtils.containsSome(cards, player.eatenCards));

        if(eatable && player.eatenCards.length > 0){
            let checkPhomCards = [...player.handCards];
            ArrayUtils.removeAll(checkPhomCards, cards);
            let allGeneratedPhomList = PhomGenerator.generate(checkPhomCards);

            eatable = false;
            allGeneratedPhomList.length > 0 && allGeneratedPhomList.some(phomList => {
                if (player.eatenCards.length == PhomUtils.getEatenCards(phomList.getCards()).length) {
                    eatable = true;
                    return true;
                }
                // if(ArrayUtils.containsAll(phomList.getCards(), player.eatenCards)){
                // eatable = true;
                // return true;
                // }
            });
        }

        return eatable;
    }

    static containAllEatenCards(cards, eatenCards){
        let selectedEatenCardCount = cards.filter(card => PhomUtils.isEaten(card)).length;
        return selectedEatenCardCount == eatenCards.length;
    }

    static validateDownPhom(selectedCards, player) {
        let valid = false, message, downPhomList;

        if(!this.containAllEatenCards(selectedCards, player.eatenCards)){
            message = app.res.string('game_phom_must_contain_all_eaten_card');
        }else{
            let haphomList = PhomUtils.findBestPhomListContainEatenCards(selectedCards);
            if(haphomList.getCards().length == selectedCards.length){
                valid = true;
                downPhomList = haphomList
            }else{
                message = app.res.string('game_phom_invalid_down_phom');
            }
        }

        return {valid, downPhomList, message}
    }

    static isEaten(card){
        return card.locked;
    }

    static setEaten(card, eaten = true){
        card.setLocked(eaten);
    }

    static findBestEatableCards(cards, eatenCards = [], eatingCard) {
        let bestEatableCards = []

        let checkEatingCard = eatingCard;
        // let checkEatingCard = Card.from(eatingCard.byteValue);
        // PhomUtils.setEaten(checkEatingCard)
        // if(checkEatingCard) {
            let allPhoms = PhomGenerator.generateAllPhom([...cards, checkEatingCard]).filter(phom => ArrayUtils.contains(phom.cards, checkEatingCard));
            if(allPhoms.length > 0){
                allPhoms.sort((phom1, phom2) => phom2.value() - phom1.value())

                if(eatenCards.length == 0){
                    bestEatableCards = allPhoms[0].cards
                }else{
                    allPhoms.some(phom => {
                        let checkCards = [...cards];
                        ArrayUtils.removeAll(checkCards, phom.cards)
                        if(this.isContainPhomWithEatenCards(checkCards, eatenCards)){
                            bestEatableCards = phom.cards
                            return true
                        }
                    })
                }

                ArrayUtils.remove(bestEatableCards, checkEatingCard)
            }
        // }

        return bestEatableCards;
    }

    static findBestPhomList(cards = []) {
        let phomLists = PhomGenerator.generate(cards);
        return phomLists.length > 0 ? phomLists[0] : new PhomList();
    }

    static findBestPhomListContainEatenCards(cards, eatenCards) {
        let phomLists = PhomGenerator.generatePhomContainEatenCards(cards, eatenCards);
        return phomLists.length > 0 ? phomLists[0] : new PhomList();
    }

    static isUTron(phomList, player) {
        if (player.handCards.length != 10 || phomList.getCards().length != player.handCards.length) {
            return false;
        }
        return true;
    }

    static getJoinPhomSolutions(phoms, cards) {

        let solutions = [];
        let joinSolution = new JoinSolution();

        PhomUtils.generateJoinPhomSolutions(phoms, cards, joinSolution, solutions);

        JoinSolution.sortSolution(solutions);
        JoinSolution.removeSubSolution(solutions);
        JoinSolution.removeEmptySolution(solutions);

        return solutions;
    }

    static generateJoinPhomSolutions(phoms, cards, joinSolution, solutions) {
        if (phoms.length == 0) return;

        for (let i = 0; i < cards.length; i++) {

            let card = cards[i];

            for (let j = 0; j < phoms.length; j++) {
                let phom = phoms[j];
                let checkJoinResult = phom.joinCard(card);

                if (checkJoinResult != -1) {

                    cards.splice(i, 1);
                    let node = new JoinNode(card, j);
                    joinSolution.addNode(node);

                    PhomUtils.generateJoinPhomSolutions(phoms, cards, joinSolution, solutions);

                    joinSolution.removeNodeAt(joinSolution.length - 1);
                    cards.splice(i, 0, card);
                    ArrayUtils.remove(phom.cards, card);
                }
            }
        }

        let isInside = ArrayUtils.contains(solutions, joinSolution);
        if (!isInside) {
            solutions.push(new JoinSolution(joinSolution));
        }
    }

    static checkPlayCard(playCards = [], cards = []) {

        if(playCards.length != 1) {
            app.system.showToast(app.res.string('game_error_phom_select_one_card_to_play'));
            return;
        }

        let playingCard = playCards[0];
        let eatenCards = cards.filter(card => PhomUtils.isEaten(card));
        let valid = eatenCards.length == 0 || !ArrayUtils.contains(eatenCards, playingCard);

        if(valid){
            let checkingCards = [...cards];
            ArrayUtils.remove(checkingCards, playingCard);
            valid = this.isContainPhomWithEatenCards(checkingCards, eatenCards);
            if(!valid){
                app.system.showToast(app.res.string('game_error_phom_cannot_play_card_in_eaten_phom'));
            }
        }

        return valid;
    }

    static isContainEatenCards(cards) {
        return cards && cards.filter(card => PhomUtils.isEaten(card)).length > 0;
    }

    static isContainPhomWithEatenCards(cards = [], eatenCards = []) {

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
        if(!cards || cards.length == 0) return cards;

        let phomListSolutions;
        switch (type){
            case PhomUtils.SORT_BY_RANK:
                return cards.sort(PhomUtils._compareByRank);
                break;
            case PhomUtils.SORT_BY_SUIT:
                return cards.sort(PhomUtils._compareBySuit);
                break;
            case PhomUtils.SORT_HAND_CARD_BY_RANK:
                phomListSolutions = PhomGenerator.generatePhomContainEatenCards(cards);
                if (phomListSolutions.length > 0) {
                    let phomCards = phomListSolutions[0].getCards();
                    ArrayUtils.removeAll(cards, phomCards);
                    cards.sort(PhomUtils._compareByRank);
                    cards.splice(0, 0, ...phomCards);
                } else {
                    cards.sort(PhomUtils._compareByRank);
                }
                return cards;
                break;
            case PhomUtils.SORT_HAND_CARD_BY_SUIT:
                phomListSolutions = PhomGenerator.generatePhomContainEatenCards(cards);
                if (phomListSolutions.length > 0) {
                    let phomCards = phomListSolutions[0].getCards();
                    ArrayUtils.removeAll(cards, phomCards);
                    cards.sort(PhomUtils._compareByRank);
                    cards.sort(PhomUtils._compareBySuit);
                    cards.splice(0, 0, ...phomCards);
                } else {
                    cards.sort(PhomUtils._compareByRank);
                    cards.sort(PhomUtils._compareBySuit);
                }
                return cards;
                break;
            case PhomUtils.SORT_HAND_CARD_BY_PHOM_SOLUTION:
                phomListSolutions = PhomGenerator.generatePhomContainEatenCards(cards);
                if (phomListSolutions.length > 0) {
                    let phomCards = phomListSolutions[0].getCards();
                    ArrayUtils.removeAll(cards, phomCards);
                    this._sortSingleCards(cards);
                    cards.splice(0, 0, ...phomCards);
                } else {
                    this._sortSingleCards(cards)
                }
                return cards;
                break;
            default:
                return cards.sort(PhomUtils._compareByRank)
        }
    }

    static _sortSingleCards(cards) {
        cards.sort(PhomUtils._compareByRank)

        let index = 0;
        let singleCards = [];
        while (index < cards.length) {
            let indexCard = cards[index];
            if (!PhomUtils.checkCa(indexCard, cards)) {
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

PhomUtils.SORT_BY_RANK = 2;
PhomUtils.SORT_BY_SUIT = 3;
PhomUtils.COMPARE_RANK = 1;
PhomUtils.COMPARE_SUIT = 2;
PhomUtils.SORT_HAND_CARD_BY_PHOM_SOLUTION = 4;
PhomUtils.SORT_HAND_CARD_BY_RANK = 5;
PhomUtils.SORT_HAND_CARD_BY_SUIT = 6;

PhomUtils.GAME_TYPE = app.const.game.GAME_TYPE_TIENLEN