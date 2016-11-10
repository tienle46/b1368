/**
 * Created by Thanh on 9/23/2016.
 */

import app from 'app'
import {GameUtils, utils} from 'utils'


export default class TLMNUtils {

    static get GAME_TYPE() {
        return app.const.game.GAME_TYPE_TIENLEN;
    };

    constructor() {
    }

    static checkPlayCard(playCards, deckCards, gameType = TLMNUtils.GAME_TYPE) {
        let valid = playCards && playCards.length > 0;

        if (valid){
            let cards = this.getValidSelectedCards(playCards, deckCards, gameType);
            valid = !utils.isEmptyArray(cards);
        }

        return valid;
    }

    static getValidSelectedCards(selectedCards = [], deckCards = [], gameType = TLMNUtils.GAME_TYPE) {

        if (selectedCards.length == 0) {
            return null;
        }

        const tempSelectedCards = [...selectedCards];
        const tempDeckCards = [...deckCards];
        const numberOfPlayCards = tempSelectedCards.length;

        GameUtils.sortCardAsc(tempSelectedCards, gameType);

        let selectedCardsGroupType = this.getGroupCardType(tempSelectedCards, gameType);

        if (utils.isEmptyArray(tempDeckCards)) {
            if (selectedCardsGroupType != this.GROUP_CARD_TYPE_INVALID) {
                return tempSelectedCards;
            }
        } else {
            let deckCardsGroupType = this.getGroupCardType(tempDeckCards, gameType);
            /**
             * Neu cung loai bai thi check xem bai danh ra co to hon bai cua
             * nguoi truoc danh khong Neu khac loai bai thi kiem tra cac truong
             * hop chat duoc biet
             */
            let maxSelectedCard = tempSelectedCards[numberOfPlayCards - 1];
            let maxDeckCard = tempDeckCards[tempDeckCards.length - 1];

            if (selectedCardsGroupType == deckCardsGroupType) {
                if (selectedCardsGroupType == this.GROUP_CARD_TYPE_SANH && numberOfPlayCards != tempDeckCards.length) {
                    return null;
                }
                return maxSelectedCard.compareTo(maxDeckCard, gameType) >= 0 ? tempSelectedCards : null;
            } else {
                switch (selectedCardsGroupType) {
                    case this.GROUP_CARD_TYPE_DOI_HEO:
                        if (deckCardsGroupType == this.GROUP_CARD_TYPE_DOI) {
                            return tempSelectedCards;
                        }
                        break;
                    case this.GROUP_CARD_TYPE_TU_QUY:
                        switch (deckCardsGroupType) {
                            case this.GROUP_CARD_TYPE_TU_QUY:
                                return maxSelectedCard.compareTo(maxDeckCard, gameType) >= 0 ? tempSelectedCards : null;
                            case this.GROUP_CARD_TYPE_BA_DOI_THONG:
                                return tempSelectedCards;
                            case this.GROUP_CARD_TYPE_DOI_HEO:
                                return gameType == app.const.game.GAME_TYPE_XAM ? null : tempSelectedCards;
                            case this.GROUP_CARD_TYPE_RAC:
                                return maxDeckCard.isHeo() ? tempSelectedCards : null;
                            default:
                                return null;
                        }
                    case this.GROUP_CARD_TYPE_BON_DOI_THONG:
                        switch (deckCardsGroupType) {
                            case this.GROUP_CARD_TYPE_TU_QUY:
                                return tempSelectedCards;
                            case this.GROUP_CARD_TYPE_BA_DOI_THONG:
                                return tempSelectedCards;
                            case this.GROUP_CARD_TYPE_DOI_HEO:
                                return tempSelectedCards;
                            case this.GROUP_CARD_TYPE_RAC:
                                return maxDeckCard.isHeo() ? tempSelectedCards : null;
                            default:
                                return null;
                        }
                    case this.GROUP_CARD_TYPE_BA_DOI_THONG:
                        switch (deckCardsGroupType) {
                            case this.GROUP_CARD_TYPE_RAC:
                                return maxDeckCard.isHeo() ? tempSelectedCards : null;
                            default:
                                return null;
                        }
                    default:
                        return null;
                }
            }
        }
        return null;
    }

    static getGroupCardType(selectedCards, gameType = TLMNUtils.GAME_TYPE) {
        const numberOfCards = selectedCards.length;

        if (numberOfCards == 1) {
            return this.GROUP_CARD_TYPE_RAC;
        } else if (numberOfCards > 1) {

            let minCard = selectedCards[0];
            let maxCard = selectedCards[numberOfCards - 1];
            let minRank = GameUtils.getRank(minCard, gameType);
            let maxRank = GameUtils.getRank(maxCard, gameType);

            if (minRank == maxRank) {
                switch (numberOfCards) {
                    case 2:
                        return minCard.isHeo() ? this.GROUP_CARD_TYPE_DOI_HEO : this.GROUP_CARD_TYPE_DOI;
                    case 3:
                        return this.GROUP_CARD_TYPE_SAM_CO;
                    case 4:
                        return minCard.isHeo() ? this.GROUP_CARD_TYPE_TU_QUY_HEO : this.GROUP_CARD_TYPE_TU_QUY;
                    default:
                        return this.GROUP_CARD_TYPE_INVALID;
                }
            } else if (numberOfCards == 2) {
                return this.GROUP_CARD_TYPE_INVALID;
            } else {
                let sanhType = this.getSanhType(selectedCards, gameType);

                if (sanhType > 0) {
                    return sanhType;
                }

                if (this.isDoiThong(selectedCards, gameType)) {
                    switch (numberOfCards) {
                        case 6:
                            return this.GROUP_CARD_TYPE_BA_DOI_THONG;
                        case 8:
                            return this.GROUP_CARD_TYPE_BON_DOI_THONG;
                        case 10:
                            return this.GROUP_CARD_TYPE_NAM_DOI_THONG;
                        case 12:
                            return this.GROUP_CARD_TYPE_SAU_DOI_THONG;
                        default:
                            return this.GROUP_CARD_TYPE_INVALID;
                    }
                }

                if (numberOfCards == 12) {
                    let is6Doi = true;
                    for (let i = 1; i < numberOfCards; i += 2) {

                        let cardBig1 = GameUtils.getRank(selectedCards[i], gameType);
                        let cardBig2 = GameUtils.getRank(selectedCards[i - 1], gameType);

                        if (cardBig1 == cardBig2) {
                            continue;
                        }

                        is6Doi = false;
                        break;
                    }
                    if (is6Doi) {
                        return this.GROUP_CARD_TYPE_SAU_DOI;
                    }
                }
            }
        }
        return this.GROUP_CARD_TYPE_INVALID;
    }

    static isValidSanhRule(selectedCards, gameType = TLMNUtils.GAME_TYPE) {
        let isSanh = true;

        for (let i = 1; i < selectedCards.length; i++) {

            let rank1 = GameUtils.getRank(selectedCards[i], gameType);
            let rank2 = GameUtils.getRank(selectedCards[i - 1], gameType);

            if ((rank1 - rank2) == 1) {
                continue;
            }

            isSanh = false;
            break;
        }

        return isSanh;
    }

    static isContainHeo(selectedCards) {
        let heoContained = false;

        selectedCards.some((card)=>{
            if (card.isHeo()) {
                heoContained = true;
                return true;
            }
        });

        return heoContained;
    }

    static getSanhType(cards, gameType = TLMNUtils.GAME_TYPE) {

        let selectedCards = [...cards];

        let isSanh = this.isValidSanhRule(selectedCards);
        let isContainHeo = this.isContainHeo(selectedCards);

        if (isSanh && !isContainHeo) {
            if (selectedCards[0].isBa() && selectedCards[selectedCards.length - 1].isAt()) {
                return this.GROUP_CARD_TYPE_SANH_RONG;
            }
            return this.GROUP_CARD_TYPE_SANH;
        }

        // sanh chua at,2.. or 2,3...
        if (isContainHeo && gameType == app.const.game.GAME_TYPE_XAM) {

            // kiem tra xem co phai loai rank 2,3... hay ko
            GameUtils.sortCardAsc(selectedCards, app.const.game.GAME_TYPE_SPECIAL_XAM);

            if (this.isValidSanhRule(selectedCards, app.const.game.GAME_TYPE_SPECIAL_XAM)) {
                return this.GROUP_CARD_TYPE_SANH;
            }
        }

        return -1;
    }

    static isValidDoiThongRule(cards, gameType = TLMNUtils.GAME_TYPE) {

        let lastDoiRank = -1;
        let index = 0;

        while (index < cards.length) {

            let fCard = cards[index];
            let sCard = cards[index + 1];

            if (fCard.rank == sCard.rank) {

                let gRank = GameUtils.getRank(fCard, gameType);

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

    static isDoiThong(cards, gameType = TLMNUtils.GAME_TYPE) {

        let isDoiThong = false;
        let numberOfCards = cards.length;

        if (numberOfCards >= 6 && numberOfCards % 2 == 0) {

            let selectedCards = [...cards];
            let isContainHeo = this.isContainHeo(selectedCards);

            //Neu la xam thi xet ca truong hop 1, 2, 3,....
            if (isContainHeo) {
                if (gameType == app.const.game.GAME_TYPE_XAM) {
                    GameUtils.sortCardAsc(selectedCards, app.const.game.GAME_TYPE_SPECIAL_XAM);
                    isDoiThong = this.isValidDoiThongRule(selectedCards, app.const.game.GAME_TYPE_SPECIAL_XAM);
                }
            } else {
                isDoiThong = this.isValidDoiThongRule(selectedCards, gameType);
            }
        }

        return isDoiThong;
    }

    static getTLMNThoiString(thoiType) {
        let retString = "";
        switch (thoiType) {
            case TLMNUtils.THOI_TYPE_HEO_DEN:
                retString = app.res.string('game_heo_den');
                break;
            case TLMNUtils.THOI_TYPE_HEO_DO:
                retString = app.res.string('game_heo_do');
                break;
            case TLMNUtils.THOI_TYPE_BA_DOI_THONG:
                retString = app.res.string('game_ba_doi_thong');
                break;
            case TLMNUtils.THOI_TYPE_TU_QUY:
                retString = app.res.string('game_tu_quy');
                break;
            case TLMNUtils.THOI_TYPE_BON_DOI_THONG:
                retString = app.res.string('game_bon_doi_thong');
                break;
            case TLMNUtils.THOI_TYPE_BA_BICH:
                retString = app.res.string('game_ba_bich');
                break;
        }
        return retString;
    }

}


TLMNUtils.THOI_TYPE_HEO_DEN = 0;
TLMNUtils.THOI_TYPE_HEO_DO = 1;
TLMNUtils.THOI_TYPE_BA_DOI_THONG = 2;
TLMNUtils.THOI_TYPE_TU_QUY = 3;
TLMNUtils.THOI_TYPE_BON_DOI_THONG = 4;
TLMNUtils.THOI_TYPE_BA_BICH = 5;
TLMNUtils.GROUP_CARD_TYPE_INVALID = 0;
TLMNUtils.GROUP_CARD_TYPE_RAC = 1;
TLMNUtils.GROUP_CARD_TYPE_DOI = 2;
TLMNUtils.GROUP_CARD_TYPE_SAM_CO = 3;
TLMNUtils.GROUP_CARD_TYPE_SANH = 4;
TLMNUtils.GROUP_CARD_TYPE_SANH_RONG = 5;
TLMNUtils.GROUP_CARD_TYPE_TU_QUY = 6;
TLMNUtils.GROUP_CARD_TYPE_DOI_THONG = 7;
TLMNUtils.GROUP_CARD_TYPE_BA_DOI_THONG = 8;
TLMNUtils.GROUP_CARD_TYPE_BON_DOI_THONG = 9;
TLMNUtils.GROUP_CARD_TYPE_NAM_DOI_THONG = 1;
TLMNUtils.GROUP_CARD_TYPE_SAU_DOI_THONG = 1;
TLMNUtils.GROUP_CARD_TYPE_SAU_DOI = 1;
TLMNUtils.GROUP_CARD_TYPE_DOI_HEO = 1;
TLMNUtils.GROUP_CARD_TYPE_TU_QUY_HEO = 1;
TLMNUtils.GROUP_CARD_TYPE_TU_QUY_BA = 1;