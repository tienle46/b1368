/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app'
import utils from 'utils'
import PlayerCard from 'PlayerCard';
import Keywords from 'Keywords'
import Commands from 'Commands'
import GameUtils from 'GameUtils'
import Events from 'Events'
import PlayerCardTurnBaseAdapter from 'PlayerCardTurnBaseAdapter';

export default class PlayerCardTurnBase extends PlayerCard {
    constructor(board, user) {
        super(board, user);
    }

    _init(board, user){
        super._init(board, user);

        this.turnAdapter = new PlayerCardTurnBaseAdapter();
        this.turnAdapter._init(board.scene, this);
    }

    onLoad(){
        super.onLoad();
    }

    onGamePlaying(){
        if (this.isItMe()) {
            this._onWaitTurn()
        }
    }

    _onWaitTurn(){

    }

}