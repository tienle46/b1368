/**
 * Created by Thanh on 3/3/2017.
 */

import app from 'app';
import TopupDialogRub from 'TopupDialogRub';

class Linking {

    static goTo(action, data){
        switch(action){
            case Linking.ACTION_TOPUP:
                TopupDialogRub.show(app.system.getCurrentSceneNode());
                break;
        }
    }

}

Linking.ACTION_TOPUP = "TOPUP";

export default Linking;