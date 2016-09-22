/**
 * Created by Thanh on 9/19/2016.
 */

import app from 'app';
import utils from 'utils';
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

    _showOnTurnControls(){

        console.log("_showOnTurnControls")

        utils.active(this.playButton);
        utils.active(this.sortButton);
        utils.active(this.skipTurnButton);
    }

    onClickPlayButton(event){
        console.log("click play button");
    }

    onClickSortButton(event){
        console.log("click sort button");
    }

    onClickSkipTurnButton(event){
        console.log("click skip turn button");
    }

}

app.createComponent(CardTurnBaseControls);