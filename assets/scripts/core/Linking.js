/**
 * Created by Thanh on 3/3/2017.
 */

import app from 'app';
import TopupDialogRub from 'TopupDialogRub';

class Linking {
    
    static goTo(action, data){
        try {
            data = JSON.parse(data);
            switch(action) {
                case Linking.ACTION_TOPUP:{
                    TopupDialogRub.show(app.system.getCurrentSceneNode());
                    break;
                }
                case Linking.ACTION_PLAY_GAME:{
                    const {gameCode} = data;
                    app.context.setSelectedGame(gameCode);
                    app.system.loadScene(app.const.scene.LIST_TABLE_SCENE);
                    break;
                }
                case Linking.ACTION_CASH: break;
                case Linking.ACTION_TRANSFER: break;
                case Linking.ACTION_BUDDY: break;
                case Linking.ACTION_TOPUP_CARD: break;
                case Linking.ACTION_TOPUP_SMS: break;
                case Linking.ACTION_TOPUP_IAP: break;
                case Linking.ACTION_EVENT: break;
                case Linking.ACTION_BANK: break;
                case Linking.ACTION_GIFT_CODE: break;
                case Linking.ACTION_SYSTEM_MESSAGE: break;
                case Linking.ACTION_PERSONAL_MESSAGE: break;
                case Linking.ACTION_EXCHANGE: break;
                case Linking.ACTION_EXCHANGE_CARD: break;
                case Linking.ACTION_EXCHANGE_ITEM: break;
                case Linking.ACTION_EXCHANGE_HISTORY: break;
                case Linking.ACTION_BUDDY_CHAT: break;
                case Linking.ACTION_FEEDBACK: break;
                case Linking.ACTION_FANPAGE: break;
                case Linking.ACTION_WEBSITE: break;
                case Linking.ACTION_TOP_VIP: break;
                case Linking.ACTION_TOP_CAO_THU: break;
                case Linking.ACTION_TOP_DAI_GIA: break;
                case Linking.ACTION_AGENT: break;
                case Linking.ACTION_TOPUP_HISTORY: break;
                case Linking.ACTION_PERSONAL_INFO: break;
                case Linking.ACTION_PLAYER_INFO: break;
                case Linking.ACTION_PERSONAL_STATISTIC: break;
            }
        } catch(e) {
            console.error(e);
            //TODO: need handle action when parse error occured !
        }
    }
}

app.const.ACTION_CODES.forEach(actionCode => {
    Linking[`ACTION_${actionCode}`] = actionCode;
});
// Linking.ACTION_TOPUP = "TOPUP";
// Linking.ACTION_PLAY_GAME = "PLAY_GAME";

export default Linking;