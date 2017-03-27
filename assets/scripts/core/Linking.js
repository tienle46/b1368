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
                case Linking.ACTION_TOPUP:
                    TopupDialogRub.show(app.system.getCurrentSceneNode());
                    break;
                case Linking.ACTION_PLAY_GAME:
                    let {gameCode} = data;
                    app.context.setSelectedGame(gameCode);
                    app.system.loadScene(app.const.scene.LIST_TABLE_SCENE);
                    break;
            }
        } catch(e) {
            console.error(e);
            //TODO: need handle action when parse error occured !
        }
    }
}

Linking.ACTION_TOPUP = "TOPUP";
Linking.ACTION_PLAY_GAME = "PLAY_GAME";

export default Linking;