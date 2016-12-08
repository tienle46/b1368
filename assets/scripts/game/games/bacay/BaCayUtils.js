/**
 * Created by Thanh on 9/23/2016.
 */

import app from 'app'
import {GameUtils, utils} from 'utils'
import Card from "../../base/card/Card";
import ArrayUtils from "../../../utils/ArrayUtils";


export default class BaCayUtils {

    static checkBetValue(betValue, player){
        return true;
    }

    static createPlayerHandCardInfo(cards = []){

        if(this.isSameRank(cards)){
            return app.res.string('game_bacay_sap');
        }else{
            let str = '';
            let point = this.toBaCayPoint(GameUtils.getTotalPoint(cards));
            switch (point) {
                case 10:
                    str = app.res.string('game_result_bacay_10_point');
                    break;
                case 1:
                    str = app.res.string('game_result_bacay_tit');
                    // str = "Tịt..";
                    break;
                case 2:
                    str = app.res.string('game_result_bacay_nai');
                    // str = "Nái..";
                    break;
                case 5:
                    str = app.res.string('game_result_bacay_nua_doi');
                    // str = "Nửa đời";
                    break;
                default:
                    str = app.res.string('game_result_bacay_point', {point});
                    break;
            }

            return str;
        }
    }

    static toBaCayPoint(point){
        let bacayPoint = point % 10;
        if(bacayPoint == 0 && point >= 10) bacayPoint = 10;
        return bacayPoint;
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

    static calculateMaxCuocBien(player){
        let maxValue = player.board.minBet * 5;
        //TODO
        return maxValue;
    }

    static checkCuocBienWithPlayer(me, player){
        let checkResult = true;
        let msg = '';

        let board = me.board;
        let usernames = [me.user.name, player.user.name];
        let cuocBienPlayers = [
            ...me.getExcludeCuocBienPlayers(),
            ...player.getExcludeCuocBienPlayers(),
            ...utils.getAllKeys(me.pendingBiCuocBiens),
            ...utils.getAllKeys(player.pendingBiCuocBiens)
        ];

        if(ArrayUtils.containsSome(cuocBienPlayers, usernames)){
            checkResult = false
            msg = app.res.string('game_bacay_chi_cuoc_bien_mot_lan');
        }else{
            //More check action
        }

        return {checkResult, msg};
    }

    static checkAcceptCuocBienWithPlayer(me, player){
        let checkResult = true;
        let msg = '';

        let board = me.board;
        let usernames = [me.user.name, player.user.name];
        let excludePlayers = [...me.getExcludeCuocBienPlayers(), ...player.getExcludeCuocBienPlayers()];

        if(ArrayUtils.containsSome(excludePlayers, usernames)){
            checkResult = false
            msg = app.res.string('game_bacay_chi_cuoc_bien_mot_lan');
        }else{
            //More check action
        }

        return {checkResult, msg};
    }

    static validateCuocBienValue(value, me, player){
        let valid = true;
        let {checkResult, msg} = this.checkCuocBienWithPlayer(me, player);

        if(checkResult){
            //TODO vevify cuoc bien value
        }else{
            valid = false;
        }

        return {valid, msg};
    }

    static validateAcceptCuocBienValue(value, me, player){
        let valid = true;
        let {checkResult, msg} = this.checkAcceptCuocBienWithPlayer(me, player);

        if(checkResult){
            //TODO vevify cuoc bien value
        }else{
            valid = false;
        }

        return {valid, msg};
    }

    static calculateMaxBet(player){
        return player && player.board.minBet * 5;
    }

    static validateBetValue(value, player){
        return {valid: true, msg: ''};
    }
}