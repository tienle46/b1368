/**
 * Created by Thanh on 9/19/2016.
 */

import app from 'app';
import utils from 'utils';
import Events from 'Events';
import GameControls from 'GameControls';

export default class CardTurnBaseControls extends GameControls {
    constructor() {
        super();

        this.playButton = {
            default: null,
            type: cc.Button
        };

        this.sortButton = {
            default: null,
            type: cc.Button
        };

        this.skipTurnButton = {
            default: null,
            type: cc.Button
        };
    }

    onLoad(){
        super.onLoad();
        this.hideAllControls();
    }

    hideAllControls(){
        utils.deactive(this.playButton);
        utils.deactive(this.sortButton);
        utils.deactive(this.skipTurnButton);
    }


    _showWaitTurnControls(){
        utils.deactive(this.playButton);
        utils.active(this.sortButton);
        utils.deactive(this.skipTurnButton);
    }

    _showOnTurnControls(isFirstTurn){
        utils.active(this.playButton);
        utils.active(this.sortButton);
        isFirstTurn ? utils.deactive(this.skipTurnButton) : utils.active(this.skipTurnButton);
    }

    onClickPlayButton(event){
        this.scene.emit(Events.ON_CLICK_PLAY_BUTTON);
        console.log("emitted click play button")
    }

    onClickSortButton(event){
        this.scene.emit(Events.ON_CLICK_SORT_BUTTON);

        console.log("emitted click sort button")
    }

    onClickSkipTurnButton(event){
        this.scene.emit(Events.ON_CLICK_SKIP_TURN_BUTTON);
        console.log("emitted click skip turn button")
    }

}

app.createComponent(CardTurnBaseControls);