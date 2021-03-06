/**
 * Created by Thanh on 9/20/2016.
 */

import app from 'app';
import utils from 'PackageUtils';
import Card from 'Card';
import numeral from 'numeral';

export default class GameUtils {

    static isSoloGame(gameRoom) {
        let gameCode = utils.getGameCode(gameRoom);
        return gameCode ? app.config.soloGames.indexOf(gameCode) >= 0 : false;
    }

    static formatBalance(balance) {
        return utils.isNumber(balance) ? numeral(balance).format((balance < 1000000 ? '0,0' : '0.00a')) : "";
    }

    static formatBalance1(balance) {
        return utils.isNumber(balance) ? numeral(balance).format((balance < 10000 ? '0.0' : '0.00')) : "";
    }

    static formatNumberType1(value = 0) {
        return value <= 9999 && value >= -9999 ? value : numeral(value).format('00.0a');
    }

    static formatNumberType2(value = 0) {
        return value <= 99999 && value >= -99999 ? value : numeral(value).format('00.0a');
    }

    static formatNumberType3(value = 0) {
        return value <= 9999 && value >= -9999 ? value : numeral(value).format('0.0a');
    }

    static formatBalanceShort(balance) {

        if(isNaN(balance)) return ""

        let sign = ''
        let formatted = ''

        if(balance < 0){
            sign = '-'
            balance = Math.abs(balance)
        }

        if(balance <= 9999){
            formatted = balance
        }else if(balance <= 99999){
            // let adj = parseInt((balance / 1000 - parseInt(balance / 1000)) * 10)
            let adj = parseInt((balance - parseInt(balance / 1000) * 1000) / 100)
            formatted = adj == 0 ? `${parseInt(balance / 1000)}k` : `${parseInt(balance / 1000)}.${adj}k`
        }else if(balance <= 999999){
            formatted = `${parseInt(balance / 1000)}k`
        }else{
            let adj = parseInt((balance / 1000000 - parseInt(balance / 1000000)) * 10)
            formatted = adj == 0 ? `${parseInt(balance / 1000000)}m` : `${parseInt(balance / 1000000)}.${adj}m`
        }
        
        return sign + formatted
    }

    static formatBalanceWithSign(balance) {

        if(isNaN(balance)) return ""

        if(balance > 0){
            return '+' + this.formatBalanceShort(balance)
        }else{
            return this.formatBalanceShort(balance)
        }
    }

    static toChangedBalanceString(changeAmount) {
        return isNaN(changeAmount) ? '' : changeAmount > 0 ? `+${changeAmount}` : `${changeAmount}`;
    }

    static isStateAfterReady(checkState) {
        return utils.isNumber(checkState) && checkState != app.const.game.state.INITED && checkState != app.const.game.state.READY && checkState != app.const.game.state.BEGIN && checkState != app.const.game.state.WAIT;
    }

    static convertToLocalGameState(state) {

        // if (data && data.hasOwnProperty(app.keywords.DEAL_CARD_LIST_KEYWORD)) {
        //     state = app.const.game.state.DEAL_CARD;
        // }

        switch (state) {
            case app.const.game.state.INITED:
                return app.const.game.state.INITED;

            case app.const.game.state.READY:
                return app.const.game.state.BEGIN;

            case app.const.game.state.DEAL_CARD:
            case app.const.game.state.BOARD_STATE_ARRANGE_CARD:
                return app.const.game.state.STARTING;

            case app.const.game.state.STARTED:
                return app.const.game.state.STARTED;

            case app.const.game.state.PLAYING:
            case app.const.game.state.TURN_BASE_TRUE_PLAY:
                return app.const.game.state.PLAYING;

            case app.const.game.state.BOARD_STATE_END:
                return app.const.game.state.ENDING;

        }
    }

    static convertToBytes(cards = []) {
        return cards.map(card => card.byteValue);
    }

    static convertBytesToCards(bytes = []) {
        return bytes.map(byteValue => Card.from(byteValue));
    }

    static sortCardAsc(cards, gamePlayType, compareRankFirst) {

        for (let i = 0; i < cards.length - 1; i++) {
            let minCard = cards[i];
            let minIndex = i;

            for (let j = i + 1; j < cards.length; j++) {
                let comparedCard = cards[j];
                if (minCard.compareTo(comparedCard, gamePlayType, compareRankFirst) >= 0) {
                    minIndex = j;
                    minCard = comparedCard;
                }
            }

            if (minIndex != i) {
                let tmpCard = cards[i];
                cards[i] = cards[minIndex];
                cards[minIndex] = tmpCard;
            }
        }

        return cards;
    }

    static getRank(card, gameType) {
        if (gameType) {
            if (gameType == app.const.game.GAME_TYPE_MAU_BINH) {
                if (card.rank == Card.RANK_AT) {
                    return Card.RANK_ACE;
                }
            }

            if (gameType == app.const.game.GAME_TYPE_TIENLEN || gameType == app.const.game.GAME_TYPE_XAM) {
                if (card.rank == Card.RANK_AT) {
                    return Card.RANK_ACE;
                } else if (card.rank == Card.RANK_HAI) {
                    return Card.RANK_DEUCE;
                }
            }
        }

        return card.rank;
    }

    static getSuit(card, gameType) {
        return card.suit;
    }

    static getUserBalance(user) {
        return utils.getVariable(user, app.keywords.USER_VARIABLE_BALANCE, 0);
    }

    static getPlayerId(dataObj) {
        return utils.getValue(app.keywords.PLAYER_ID);
    }

    static isContainHeo(selectedCards) {

        let heoContained = false;

        selectedCards.some((card) => {
            if (card.isHeo()) {
                heoContained = true;
                return true;
            }
        });

        return heoContained;
    }

    static isTester(user) {
        return utils.getVariable(user, app.keywords.USER_VARIABLE_IS_TESTER, false)
    }

    static createFakeCard(length) {
        let cardBytes = new Array(length).fill(0);
        return GameUtils.convertBytesToCards(cardBytes);
    }

    static getTotalPoint(cards = []) {
        return cards.reduce((point, card) => point + card.rank, 0);
    }

    static getDisplayName(user){

        if(!user) return "";

        let displayName = utils.getVariable(user, app.keywords.USER_VARIABLE_DISPLAY_NAME);
        if(displayName && displayName.length > 0){
            if(displayName.length > 12){
                displayName = displayName.substr(0, 12) + '...';
            }
            return displayName;
        }else{
            return user.name;
        }
    }

    static getUserVipLevel(user){
        let vipLevel = 0;

        if(user){
            let userVip = utils.getVariable(user, app.keywords.VIP_LEVEL);
            vipLevel = userVip && userVip.value;
        }

        return vipLevel === undefined ? 0 : vipLevel;
    }

    static sortCardAscByRankFirstSuitLast(cards) {

        cards && cards.sort((card1, card2) => {
            let rankCompare = card1.rank - card2.rank
            let suitCompare = card1.suit - card2.suit
            
            return rankCompare == 0 ? suitCompare : rankCompare
        })

        return cards;
    }

}