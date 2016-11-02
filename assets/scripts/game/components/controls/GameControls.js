/**
 * Created by Thanh on 9/19/2016.
 */

import Actor from 'Actor'

export default class GameControls extends Actor {
    constructor() {
        super();

        this.scene = null;
    }

    setScene(scene) {
        this.scene = scene;
    }

    hideAllControls(){

    }

    hideAllControlsBeforeGameStart(){

    }

    setInteractable(control, interactable){
        control instanceof cc.Button && (control.interactable = interactable);
    }
}