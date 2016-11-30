/**
 * Created by Thanh on 9/23/2016.
 */

import app from 'app'
import {GameUtils, utils} from 'utils'
import Card from "../../base/card/Card";
import ArrayUtils from "../../../utils/ArrayUtils";


export default class BaCayUtils {

    static get GAME_TYPE() {
        return app.const.game.GAME_TYPE_XAM;
    };

    static checkBetValue(betValue, player){
        return true;
    }

    static createPlayerHandCardInfo(cards = []){

        if(this.isSameRank(cards)){
            return app.res.string('game_bacay_sap');
        }else{
            let point = GameUtils.getTotalPoint(cards);
            return app.res.string('game_result_point', {point});
        }
    }

    static toBaCayPoint(point){
        return point <= 10 ? point : point % 10;
    }

    static isSameRank(cards = []){

        if(cards.length == 0) return false;
        if(cards.length == 1) return true;

        let checkCard = cards[0];
        for (let i = 1; i < cards.length; i++) {
            let card = cards[i];
            if(checkCard.rank != card.rank) return false;
            checkCard = card;
        }

        return true;
    }

    static checkPlayCard(playCards, playedCards) {
        return playCards && playCards.length > 0 && !ArrayUtils.isEmpty(this.getValidSelectedCards(playCards, playedCards));
    }

    static getValidSelectedCards(selectedCards = [], prePlayedCards = []) {
        if (ArrayUtils.isEmpty(selectedCards)) return null;

        let prePlayedSortedCards = this.sortAsc([...prePlayedCards]);
        let selectedSortedCards = this.sortAsc([...selectedCards]);

        let playedCardsGroupType = this.getGroupCardType(prePlayedSortedCards);
        let selectedCardsGroupType = this.getGroupCardType(selectedSortedCards);

        if (ArrayUtils.isEmpty(prePlayedCards)) {
            if (selectedCardsGroupType != BaCayUtils.GROUP_CARD_TYPE_INVALID) {
                return selectedCards;
            }
        } else {
            /**
             * Neu cung loai bai thi check xem bai danh ra co to hon bai cua
             * nguoi truoc danh khong Neu khac loai bai thi kiem tra cac truong
             * hop chat duoc biet
             */
            let maxSelectedCard = selectedSortedCards[selectedCards.length - 1];
            let maxPlayedCard = prePlayedSortedCards[prePlayedCards.length - 1];
            let compareMaxCardValue = BaCayUtils.compareBaCayRank(maxSelectedCard, maxPlayedCard);
            
            if (selectedCardsGroupType == playedCardsGroupType) {
                // if (selectedCardsGroupType == BaCayUtils.GROUP_CARD_TYPE_SANH && selectedCards.length != tempPlayedCards.length) {
                //     return null;
                // }
                return selectedCards.length == prePlayedCards.length && compareMaxCardValue > 0 ? selectedCards : null;
            } else {
                switch (selectedCardsGroupType) {
                    /**
                     * Trường hợp cùng đôi 2 thì đã được bắt ở trên
                     */
                    case BaCayUtils.GROUP_CARD_TYPE_DOI:
                        if (playedCardsGroupType == BaCayUtils.GROUP_CARD_TYPE_DOI && compareMaxCardValue) {
                            return selectedCards;
                        }
                        break;
                    case BaCayUtils.GROUP_CARD_TYPE_TU_QUY:
                        switch (playedCardsGroupType) {
                            case BaCayUtils.GROUP_CARD_TYPE_TU_QUY:
                                return compareMaxCardValue > 0 ? selectedCards : null;
                            case BaCayUtils.GROUP_CARD_TYPE_BA_DOI_THONG:
                                return selectedCards;
                            case BaCayUtils.GROUP_CARD_TYPE_DOI_HEO:
                                return null;
                            case BaCayUtils.GROUP_CARD_TYPE_RAC:
                                return maxPlayedCard.isHeo() ? selectedCards : null;
                        }
                        break;
                    case BaCayUtils.GROUP_CARD_TYPE_BON_DOI_THONG:
                        switch (playedCardsGroupType) {
                            case BaCayUtils.GROUP_CARD_TYPE_TU_QUY:
                                return selectedCards;
                            case BaCayUtils.GROUP_CARD_TYPE_BA_DOI_THONG:
                                return selectedCards;
                            case BaCayUtils.GROUP_CARD_TYPE_DOI_HEO:
                                return selectedCards;
                            case BaCayUtils.GROUP_CARD_TYPE_RAC:
                                return maxPlayedCard.isHeo() ? selectedCards : null;
                        }
                        break;
                    case BaCayUtils.GROUP_CARD_TYPE_BA_DOI_THONG:
                        if(playedCardsGroupType == BaCayUtils.GROUP_CARD_TYPE_RAC) {
                            return maxPlayedCard.isHeo() ? selectedCards : null;
                        }
                        break;
                }
            }
        }

        return null;
    }

    static getGroupCardType(selectedCards) {
        const numberOfCards = selectedCards.length;

        if (numberOfCards == 1) {
            return BaCayUtils.GROUP_CARD_TYPE_RAC;
        } else if (numberOfCards > 1) {

            let minCard = selectedCards[0];
            let maxCard = selectedCards[numberOfCards - 1];
            let minRank = GameUtils.getRank(minCard, this.GAME_TYPE);
            let maxRank = GameUtils.getRank(maxCard, this.GAME_TYPE);

            if (minRank == maxRank) {
                switch (numberOfCards) {
                    case 2:
                        return BaCayUtils.GROUP_CARD_TYPE_DOI;
                    case 3:
                        return BaCayUtils.GROUP_CARD_TYPE_SAM_CO;
                    case 4:
                        return BaCayUtils.GROUP_CARD_TYPE_TU_QUY;
                    default:
                        return BaCayUtils.GROUP_CARD_TYPE_INVALID;
                }
            } else if (numberOfCards == 2) {
                return BaCayUtils.GROUP_CARD_TYPE_INVALID;
            } else {
                let sanhType = this.getSanhType(selectedCards);
                if (sanhType > 0) return sanhType;

                if (this.isDoiThong(selectedCards)) {
                    switch (numberOfCards) {
                        case 6:
                            return BaCayUtils.GROUP_CARD_TYPE_BA_DOI_THONG;
                        case 8:
                            return BaCayUtils.GROUP_CARD_TYPE_BON_DOI_THONG;
                        case 10:
                            return BaCayUtils.GROUP_CARD_TYPE_NAM_DOI_THONG;
                        default:
                            return BaCayUtils.GROUP_CARD_TYPE_INVALID;
                    }
                }
            }
        }
        return BaCayUtils.GROUP_CARD_TYPE_INVALID;
    }

    static isValidSanhRule(selectedCards) {
        let isSanh = true;

        for (let i = 1; i < selectedCards.length; i++) {

            let rank1 = GameUtils.getRank(selectedCards[i], this.GAME_TYPE);
            let rank2 = GameUtils.getRank(selectedCards[i - 1], this.GAME_TYPE);

            if ((rank1 - rank2) != 1){
                isSanh = false;
                break;
            }
        }

        return isSanh;
    }

    static getSanhType(cards) {

        let selectedCards = [...cards];
        let isSanh = this.isValidSanhRule(selectedCards);
        let isContainHeo = GameUtils.isContainHeo(selectedCards);

        if (isSanh && !isContainHeo) {
            if (selectedCards[0].isBa() && selectedCards[selectedCards.length - 1].isAt()) {
                return BaCayUtils.GROUP_CARD_TYPE_SANH_RONG;
            }
            return BaCayUtils.GROUP_CARD_TYPE_SANH;
        }

        // sanh chua at,2.. or 2,3...
        if (isContainHeo && this.isValidSanhRule(this.sortSpecialAsc(selectedCards), app.const.game.GAME_TYPE_SPECIAL_XAM)) {
            return BaCayUtils.GROUP_CARD_TYPE_SANH;
        }

        return -1;
    }

    static isValidDoiThongRule(cards) {

        let lastDoiRank = -1;
        let index = 0;

        while (index < cards.length) {

            let fCard = cards[index];
            let sCard = cards[index + 1];

            if (fCard.rank == sCard.rank) {

                let gRank = GameUtils.getRank(fCard, this.GAME_TYPE);

                if (index == 0) {
                    lastDoiRank = gRank;
                } else {
                    if (gRank - lastDoiRank != 1) {
                        // khong phai hai doi thong
                        return false;
                    } else {
                        lastDoiRank = gRank;
                    }
                }
            } else {
                // khong phai doi
                return false;
            }

            index += 2;
        }

        return true;
    }

    static isDoiThong(cards) {

        let isDoiThong = false;
        let numberOfCards = cards.length;

        if (numberOfCards >= 6 && numberOfCards % 2 == 0) {

            let selectedCards = [...cards];
            if (GameUtils.isContainHeo(selectedCards)) {
                    isDoiThong = this.isValidDoiThongRule(this.sortSpecialAsc(selectedCards, app.const.game.GAME_TYPE_SPECIAL_XAM));
            } else {
                isDoiThong = this.isValidDoiThongRule(selectedCards);
            }
        }

        return isDoiThong;
    }

    static sortAsc(cards){
        return cards.sort(this.compareBaCayRank);
    }

    static sortSpecialAsc(cards){
        return cards.sort(this.compareRank);
    }

    static compareBaCayRank(card1, card2){
        return GameUtils.getRank(card1, app.const.game.GAME_TYPE_XAM) - GameUtils.getRank(card2, app.const.game.GAME_TYPE_XAM);
    }
}


BaCayUtils.THOI_TYPE_HEO_DEN = 0;
BaCayUtils.THOI_TYPE_HEO_DO = 1;
BaCayUtils.THOI_TYPE_BA_DOI_THONG = 2;
BaCayUtils.THOI_TYPE_TU_QUY = 3;
BaCayUtils.THOI_TYPE_BON_DOI_THONG = 4;
BaCayUtils.THOI_TYPE_BA_BICH = 5;
BaCayUtils.GROUP_CARD_TYPE_INVALID = 0;
BaCayUtils.GROUP_CARD_TYPE_RAC = 1;
BaCayUtils.GROUP_CARD_TYPE_DOI = 2;
BaCayUtils.GROUP_CARD_TYPE_SAM_CO = 3;
BaCayUtils.GROUP_CARD_TYPE_SANH = 4;
BaCayUtils.GROUP_CARD_TYPE_SANH_RONG = 5;
BaCayUtils.GROUP_CARD_TYPE_TU_QUY = 6;
BaCayUtils.GROUP_CARD_TYPE_DOI_THONG = 7;
BaCayUtils.GROUP_CARD_TYPE_BA_DOI_THONG = 8;
BaCayUtils.GROUP_CARD_TYPE_BON_DOI_THONG = 9;
BaCayUtils.GROUP_CARD_TYPE_NAM_DOI_THONG = 1;
BaCayUtils.GROUP_CARD_TYPE_SAU_DOI_THONG = 1;
BaCayUtils.GROUP_CARD_TYPE_SAU_DOI = 1;
BaCayUtils.GROUP_CARD_TYPE_DOI_HEO = 1;
BaCayUtils.GROUP_CARD_TYPE_TU_QUY_HEO = 1;
BaCayUtils.GROUP_CARD_TYPE_TU_QUY_BA = 1;