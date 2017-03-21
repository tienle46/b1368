/**
 * Created by Thanh on 8/23/2016.
 */

import PlayerCard from 'PlayerCard';
import PlayerCardTurnBaseAdapter from 'PlayerCardTurnBaseAdapter';

export default class PlayerCardTurnBase extends PlayerCard {
    constructor(board, user) {
        super(board, user);
    }

    onEnable(...args){
        super.onEnable(...args);
        this.turnAdapter = new PlayerCardTurnBaseAdapter(this);
        this.turnAdapter.onEnable();
    }

    onDisable(){
        this.turnAdapter.onDisable();
    }

    onGamePlaying(data, isJustJoined){
        super.onGamePlaying(data, isJustJoined);
        if (this.isItMe()) {
            this._onWaitTurn()
        }
    }

    _onWaitTurn(){

    }

    _onSkipTurn() {
        this.turnAdapter.skipTurn();
    }

    isTurnOwner(){
        this.id == this.board.turnAdapter.currentTurnPlayerId;
    }

    getPrePlayedCards() {
        return this.board.playedCards;
    }

    onGameReset(){
        super.onGameReset();
        this.turnAdapter && this.turnAdapter._reset();
    }

    _updateRemainCardCount(count, visible = false){

        if(this.isPlaying()){
            if(!this.isItMe()){
                this.renderer.setVisibleRemainCardNode(count > 0 && visible)
            }

            this.renderer.setRemainCardCount(count);
        }
    }

}