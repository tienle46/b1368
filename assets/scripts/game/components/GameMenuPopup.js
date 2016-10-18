/**
 * Created by Thanh on 10/17/2016.
 */

import {Events} from 'events';

export default class GameMenuPopup {
    constructor() {
        this.exitButton = cc.Button;
        this.guideButton = cc.Button;
        this.exitLabel = cc.Label;
        this.guideLabel = cc.Label;
        this.scene = null;
    }

    _init(scene){
        this.scene = scene;
    }

    onClickExitButton(event){
        this.scene.emit(Events.ON_ACTION_EXIT_GAME);
    }

    onClickGuideButton(){
        this.scene.emit(Events.ON_ACTION_LOAD_GAME_GUIDE);
    }

}

app.createComponent(GameMenuPopup);