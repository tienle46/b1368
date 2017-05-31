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
        
        this.properties = this.assignProperties({
            playButton: cc.Button,
            sortButton: cc.Button,
            skipTurnButton: cc.Button
        });
    }

    onEnable(){
        super.onEnable();
        this.hideAllControls();

        this.node.on('touchstart', event => true);

        this.scene.on(Events.SET_INTERACTABLE_PLAY_CONTROL, this._setInteractablePlayControl, this);
        this.scene.on(Events.SHOW_PLAY_CONTROL, this._setVisiblePlayControl, this, 0);
    }

    hideAllControls(){
        utils.deactive(this.playButton);
        utils.deactive(this.sortButton);
        utils.deactive(this.skipTurnButton);
    }

    _showWaitTurnControls(playControlInteractable = true){
        if(this.scene.gamePlayers.isMePlaying()){
            /**
             * By default always show play button
             */
            utils.setInteractable(this.playButton, true);
            utils.setVisible(this.sortButton);
            utils.setVisible(this.skipTurnButton, false);
        }else{
            utils.setVisible(this.playButton, false);
            utils.setVisible(this.sortButton, false);
            utils.setVisible(this.skipTurnButton, false);
        }
    }

    _showOnTurnControls(showPlayControlOnly, playControlInteractable = true){
        if(this.scene.gamePlayers.isMePlaying()){
            utils.active(this.playButton);
            utils.active(this.sortButton);
            /**
             * By default always show play button
             */
            this.setInteractable(this.playButton, true);
            showPlayControlOnly ? utils.deactive(this.skipTurnButton) : utils.active(this.skipTurnButton);
        }else{
            utils.setVisible(this.playButton, false);
            utils.setVisible(this.sortButton, false);
            utils.setVisible(this.skipTurnButton, false);
        }

    }

    _setVisiblePlayControl(visible){
        utils.setActive(visible);
    }

    _setInteractablePlayControl(interactable){
        /**
         * By default always show play button
         */
        this.setInteractable(this.playButton, true);
    }

    onClickPlayButton(event){
        this.scene.emit(Events.ON_CLICK_PLAY_BUTTON);
    }

    onClickSortButton(event){
        this.scene.emit(Events.ON_CLICK_SORT_BUTTON);
    }

    onClickSkipTurnButton(event){
        this.scene.emit(Events.ON_CLICK_SKIP_TURN_BUTTON);
    }

}

app.createComponent(CardTurnBaseControls);