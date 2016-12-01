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
}