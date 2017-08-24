import app from 'app'
import GameUtils from 'GameUtils'


export default class LiengUtils {

    static calculateBetable(player, defaultValue = 0) {
        if(!player) return defaultValue;

        let maxValueByPlayer = parseInt(GameUtils.getUserBalance(player.user))
        return Math.max(maxValueByPlayer, 0);
    }
    
    static toLiengPoint(point){
        let bacayPoint = point % 10;
        if(bacayPoint == 0 && point >= 10) bacayPoint = 10;
        return bacayPoint;
    }
    
    static getTotalPoint(cards) {
        return cards.reduce((initedPoint, card) => initedPoint + (card.rank >= 10 ? 0: card.rank), 0)
    }
    
    static createPlayerHandCardInfo(cards = []){
        let str = '';
        let point = this.toLiengPoint(this.getTotalPoint(cards));
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
            case 0:
                str = app.res.string('game_result_lieng_upbo');
                break;
            default:
                str = app.res.string('game_result_bacay_point', {point});
                break;
        }

        return str;
    }
}