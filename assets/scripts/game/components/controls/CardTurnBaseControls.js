/**
 * Created by Thanh on 9/19/2016.
 */

import app from 'app'
import utils from 'utils'
import GameControls from 'GameControls'

export default class CardTurnBaseControls extends GameControls {
    constructor() {
        super();

        this.playButton = {
            default: null,
            type: cc.Button
        }

        this.sortButton = {
            default: null,
            type: cc.Button
        }

        this.skipTurnButton = {
            default: null,
            type: cc.Button
        }
    }

    onLoad(){
        super.onLoad();
        this.hideAllControls();
    }

    hideAllControls(){
        utils.hide(this.playButton)
        utils.hide(this.sortButton)
        utils.hide(this.skipTurnButton)
    }

}

app.createComponent(CardTurnBaseControls)