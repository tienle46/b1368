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
import PlayerTurnBaseAdapter from 'PlayerTurnBaseAdapter';

export default class PlayerCardTurnBase extends PlayerCard {
    constructor(board, user) {
        super(board, user);
    }

    _init(board, user){
        super._init(board, user);

        this.turnAdapter = new PlayerTurnBaseAdapter();
        this.turnAdapter._init(board.scene, this);

        this.turnAdapter.playTurn = (cards) => {
            let cardBytes = GameUtils.convertToBytes(cards);
            let sendParams = {
                cmd: Commands.PLAYER_PLAY_CARD,
                data: {
                    [Keywords.GAME_LIST_CARD]: cardBytes
                },
                room: this.board.scene.room
            }

            app.service.send(sendParams);
            this.board.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
        }
        
        this.turnAdapter.handlePlayTurn = this._handlePlayCards.bind(this);
    }
    
    _handlePlayCards(data){

        console.log("Handle play card: _handlePlayCards");

        let playerId = utils.getValue(data, Keywords.PLAYER_ID);
        let cards = GameUtils.convertBytesToCards(utils.getValue(data, Keywords.GAME_LIST_CARD, []));

        if(this.id === playerId && cards.length > 0){

            console.log("On remove cảds");

            this.board.playedCards = cards;
            //TODO remove cards from player hand and add to deckCards
            this.renderer.cardList.removeCards(cards);
        }

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