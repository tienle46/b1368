/**
 * Created by Thanh on 9/19/2016.
 */

import Actor from 'Actor'
import utils from 'PackageUtils';

export default class GameControls extends Actor {
    constructor() {
        super();
        this.scene = null;
    }

    onEnable() {
        super.onEnable();
        this.scene = app.system.currentScene;
    }

    setInteractable(control, interactable) {
        control instanceof cc.Button && (control.interactable = interactable);
    }

    setVisible(btn, visible = true){
        utils.setVisible(btn, visible);
    }

    enable(btn){
        this.setInteractable(btn, true);
    }

    disable(btn){
        this.setInteractable(btn, false);
    }
}