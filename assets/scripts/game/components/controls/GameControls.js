/**
 * Created by Thanh on 9/19/2016.
 */

import Actor from 'Actor'
import Events from 'Events';

export default class GameControls extends Actor {
    constructor() {
        super();
        this.scene = null;
    }

    onEnable() {
        super.onEnable();
        this.hideAllControls();
        this.scene = app.system.currentScene;
    }

    setInteractable(control, interactable) {
        control instanceof cc.Button && (control.interactable = interactable);
    }
}