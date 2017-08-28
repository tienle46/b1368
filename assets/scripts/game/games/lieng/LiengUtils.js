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
    
    /**
     * 
     * 
     * @static
     * @param {any} [cards=[]] 
     * @param {any} cardType SAP(7), LIENG(4, 5, 6), DI(3), DONG_HOA(2), TINH_DIEM(1), UP_BO(0);
     * @returns 
     * @memberof LiengUtils
     */
    static createPlayerHandCardInfo(cards = [], cardType){
        let str = '';
        switch(cardType) {
            case app.const.game.LIENG_LIENG_TYPE_UP_BO: {
                str = app.res.string('game_result_lieng_upbo')
                break;
            }
            case app.const.game.LIENG_LIENG_TYPE_DIEM: {
                let point = this.toLiengPoint(this.getTotalPoint(cards));
                switch (point) {
                    case 10:
                        point = 0;
                        str = app.res.string('game_result_bacay_point', {point});
                        break;
                    default:
                        str = app.res.string('game_result_bacay_point', {point});
                        break;
                }
                break;
            }
            case app.const.game.LIENG_LIENG_TYPE_DONG_HOA: {
                str = app.res.string('game_result_lieng_dong_hoa')
                break;
            }
            case app.const.game.LIENG_LIENG_TYPE_DI: {
                str = app.res.string('game_result_lieng_di')
                break;
            }
            case app.const.game.LIENG_LIENG_TYPE_LIENG_1:
            case app.const.game.LIENG_LIENG_TYPE_LIENG_2:
            case app.const.game.LIENG_LIENG_TYPE_LIENG_3: {
                str = app.res.string('game_result_lieng_lieng')
                break;
            }
            case app.const.game.LIENG_LIENG_TYPE_SAP: {
                str = app.res.string('game_result_lieng_sap')
                break;
            }
        }
        
        return str;
    }
}