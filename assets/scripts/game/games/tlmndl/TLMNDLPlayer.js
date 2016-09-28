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

        console.log("_onPlayTurn: ", this.isItMe())

        if(!this.isItMe()){
            return;
        }

        let cards = this.getSelectedCards();
        let preCards = this.getPrePlayedCards();

        console.log("checkPlayCard")

        if(TLMNUtils.checkPlayCard(cards, preCards)){
            console.log("play card valid")
            this.turnAdapter.playTurn(cards);
        }else{
            console.log("play card invalid")
            this.notify(app.res.string("invalid_play_card"));
        }
    }

    _onSkipTurn(){
        this.turnAdapter.skipTurn();
    }

    _onSortCards(){
        if(this.isItMe()){
            let sortedCard = GameUtils.sortCardAsc(this.renderer.cardList.cards, TLMNUtils.GAME_TYPE, true);
            this.renderer.cardList.setCards(sortedCard);
        }
    }

    getSelectedCards(){
        return this.renderer.cardList.getSelectedCards();
    }

    getPrePlayedCards(){
        return this.board.playedCards;
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
