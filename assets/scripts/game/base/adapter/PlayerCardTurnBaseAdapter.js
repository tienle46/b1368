/**
 * Created by Thanh on 9/28/2016.
 */

import app from 'app';
import PlayerTurnBaseAdapter from 'PlayerTurnBaseAdapter';
import {utils, GameUtils} from 'utils';
import {Commands, Keywords} from 'core';
import {Events} from 'events';

export default class PlayerCardTurnBaseAdapter extends PlayerTurnBaseAdapter {
    constructor() {
        super();

    }

    /**
     * @abstract
     */
    handlePlayTurn(data){
        log("Handle play card: _handlePlayCards");

        let playerId = utils.getValue(data, Keywords.PLAYER_ID);
        let cards = GameUtils.convertBytesToCards(utils.getValue(data, Keywords.GAME_LIST_CARD, []));


        if(this.player.id === playerId && cards.length > 0){
            if(this.player.isItMe()){
                let cardsOnHand = this.player.findCards(cards);
                if(cardsOnHand){
                    this.scene.emit(Events.ON_PLAYER_PLAYED_CARDS, cardsOnHand, this.player.renderer.cardList);
                }
            }else{
                this.scene.emit(Events.ON_PLAYER_PLAYED_CARDS, cards);
            }

            //
            // this.board.playedCards = cards;
            // //TODO remove cards from player hand and add to deckCards
            // this.renderer.cardList.removeCards(cards);
        }
    }

    /**
     * @abstract
     */
    playTurn(cards){
        let cardBytes = GameUtils.convertToBytes(cards);
        let sendParams = {
            cmd: Commands.PLAYER_PLAY_CARD,
            data: {
                [Keywords.GAME_LIST_CARD]: cardBytes
            },
            room: this.scene.room
        }

        app.service.send(sendParams);
        this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
    }

    onTurn(){
        super.onTurn();
        if(this.player.isItMe()){
            this.player.renderer.cardList.onSelectedCardChanged();
        }
    }
}