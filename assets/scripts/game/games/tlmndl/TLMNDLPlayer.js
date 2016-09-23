/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import Events from 'Events'
import GameUtils from 'GameUtils'
import TLMNUtils from 'TLMNUtils'
import PlayerCardTurnBase from 'PlayerCardTurnBase';
import TLMNDLPlayerRenderer from 'TLMNDLPlayerRenderer';

export default class TLMNDLPlayer extends PlayerCardTurnBase {

    constructor(board, user) {
        super(board, user);
    }

    _init(board, user){
        super._init(board, user);

        this.board.scene.on(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn, this);
        this.board.scene.on(Events.ON_CLICK_SKIP_TURN_BUTTON, this._onSkipTurn, this);
        this.board.scene.on(Events.ON_CLICK_SORT_BUTTON, this._onSortCards, this);
    }

    _onPlayTurn(){

        console.log("_onPlayTurn: ")
        
        let cards = this.getSelectedCards();
        let preCards = this.getPrePlayedCards();

        if(TLMNUtils.checkPlayCard(cards, preCards)){
            this.turnAdapter.playTurn(cards);
        }else{
            this.notify(app.res.string("invalid_play_card"));
        }
    }

    _onSkipTurn(){
        this.turnAdapter.skipTurn();
    }

    _onSortCards(){

    }

    getSelectedCards(){
        return this.renderer.cardList.selectedCards;
    }

    getPrePlayedCards(){
        return this.renderer.cardList.selectedCards;
    }

    setCards(cards){
        super.setCards(cards);
    }

    createFakeCards(size = 13){
        super.createFakeCards(size);
    }

    onLoad(){
        super.onLoad();
    }

}

app.createComponent(TLMNDLPlayer);
