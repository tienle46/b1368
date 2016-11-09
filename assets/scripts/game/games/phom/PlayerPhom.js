/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import game from 'game';
import Card from 'Card';
import Events from 'Events';
import {utils, GameUtils} from 'utils';
import TLMNUtils from 'TLMNUtils';
import PlayerCardTurnBase from 'PlayerCardTurnBase';
import PhomPlayerRenderer from 'PlayerPhomRenderer';
import PhomList from 'PhomList';
import Commands from 'Commands';
import Phom from 'Phom';
import Keywords from 'Keywords';
import PhomUtils from "./PhomUtils";

export default class PlayerPhom extends PlayerCardTurnBase {

    static get DEFAULT_HAND_CARD_COUNT() {
        return 9
    };

    constructor() {
        super();

        this.state = -1;
        this.turnPharse = 0;
        this.downPhomPharse = -1;
        this.joinPhaseState = -1;
        this.haPhomSolutionId = 0;
        this.guiPhomSolutionId = 0;
        this.remainCardCount = PlayerPhom.DEFAULT_HAND_CARD_COUNT;
        this.sortCardSolutionIndex = 2;
        this.currentHaPhomSolutions = [];
        this.currentGuiPhomSolutions = [];
    }

    onLoad() {
        super.onLoad();
        this.currentHaPhomSolutions = [];
        this.currentGuiPhomSolutions = [];
    }

    _addGlobalListener() {
        super._addGlobalListener();

        this.scene.on(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn, this);
        this.scene.on(Events.ON_CLICK_EAT_CARD_BUTTON, this._onEatCard, this);
        this.scene.on(Events.ON_CLICK_TAKE_CARD_BUTTON, this._onTakeCard, this);
        this.scene.on(Events.ON_CLICK_SORT_BUTTON, this._onSortCards, this);
        this.scene.on(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
        this.scene.on(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount, this);

        this.scene.on(Events.HANDLE_PLAYER_TAKE_CARD, this._handlePlayerTakeCard, this);
        this.scene.on(Events.HANDLE_PLAYER_EAT_CARD, this._handlePlayerEatCard, this);
        this.scene.on(Events.HANDLE_PLAYER_DOWN_CARD, this._handlePlayerDownCard, this);
        this.scene.on(Events.HANDLE_PLAYER_HELP_CARD, this._handlePlayerHelpCard, this);
        this.scene.on(Events.HANDLE_PLAYER_LEAVE_BOARD, this._handlePlayerLeaveBoard, this);

        this.scene.on(Events.ON_PLAYER_PLAYED_CARDS, this._onPlayerPlayedCards, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();

        this.scene.off(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn, this);
        this.scene.off(Events.ON_CLICK_EAT_CARD_BUTTON, this._onEatCard, this);
        this.scene.off(Events.ON_CLICK_TAKE_CARD_BUTTON, this._onTakeCard, this);
        this.scene.off(Events.ON_CLICK_SORT_BUTTON, this._onSortCards, this);
        this.scene.off(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
        this.scene.off(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount, this);

        this.scene.off(Events.HANDLE_PLAYER_TAKE_CARD, this._handlePlayerTakeCard, this);
        this.scene.off(Events.HANDLE_PLAYER_EAT_CARD, this._handlePlayerEatCard, this);
        this.scene.off(Events.HANDLE_PLAYER_DOWN_CARD, this._handlePlayerDownCard, this);
        this.scene.off(Events.HANDLE_PLAYER_HELP_CARD, this._handlePlayerHelpCard, this);
        this.scene.off(Events.HANDLE_PLAYER_LEAVE_BOARD, this._handlePlayerLeaveBoard, this);

        this.scene.off(Events.ON_PLAYER_PLAYED_CARDS, this._onPlayerPlayedCards, this);
    }

    _reset(){
        super._reset();

        this.turnPharse = 0;
        this.state = -1;
        this.downPhaseState = -1;
        this.joinPhaseState = -1;
        this.sortCardSolutionIndex = 2;
    }

    _onGameRejoin(data){
        super._onGameRejoin(data);

        this.renderer.cardList.cards.forEach(card => {
            this.eatCards.forEach(eatCard => {
                card.equals(eatCard) && card.setHighlight(true);
            });
        });

        if(!this.player.turnAdapter.isTurn()) return;

        let doneActionsInTurn = utils.getValue(data, Keywords.GAME_LIST_DONE_ACTION_WHEN_REJOIN);
        if (doneActionsInTurn != null) {

            let isGui,isHa, isAnOrBoc;

            doneActionsInTurn && doneActionsInTurn.forEach((action, i) => {
                switch (action){
                    case PlayerPhom.SERVER_STATE_GUI:
                        isGui = true;
                        break;
                    case PlayerPhom.SERVER_STATE_HA_PHOM:
                        isHa = true;
                        break;
                    case PlayerPhom.SERVER_STATE_AN:
                    case PlayerPhom.SERVER_STATE_BOC:
                        isAnOrBoc = true;
                        break;
                }
            });

            if (isGui) {
                this.setState(PlayerPhom.STATE_PHOM_PLAY);
            } else if (isHa) {
                this.setState(PlayerPhom.STATE_PHOM_JOIN);
                this._onPlayerJoinPhom();
            } else if (isAnOrBoc) {
                this._processAfterEatOrTake();
            }
        }
    }

    setState(state){
        this.state = state;

        switch (state) {

        }
    }

    _handleGetTurn(){
        if (this.isItMe()) {
            if (this.renderer.cardList.length > PlayerPhom.DEFAULT_HAND_CARD_COUNT) {
                // chia phat u luon
                let startPhomList = PhomUtils.getUPhomList(this.renderer.cardList.cards);
                if (startPhomList && PhomUtils.checkUTron(startPhomList)) {
                    this.sendUCommand(startPhomList);
                    return;
                }
                this.setState(PlayerPhom.STATE_PHOM_PLAY);
            } else {
               this.setState(PlayerPhom.STATE_PHOM_EAT_TAKE);
            }
        }
    }

    _onPlayerPlayedCards(playedCards, srcCardList, isItMe){

        //Check player Id

        if(utils.isEmptyArray(playedCards)) return;

        this.board.lastPlayedCard = playedCards[0];

        if(this.isItMe()){
            this.renderer.cardList.cleanSelectedCard();
            if(this.renderer.playedCardList.length == 3) {
                this.renderer.downPhomList.cleanHighlight();
            }
        }

        this.renderer.addPlayedCard(playedCards, srcCardList, isItMe);
    }

    sendUCommand(phomList) {
        let phomDataSize = phomList.length;
        let phomCardsByte = phomList.toBytes();

        const data = {};
        data[Keywords.GAME_LIST_PLAYER_CARDS_SIZE] = phomDataSize;
        data[Keywords.GAME_LIST_CARD] = phomCardsByte;

        app.service.send({cmd: Commands.PLAYER_PLAY_CARD_U, data: data, room: this.scene.room});
        this.setState(PlayerPhom.STATE_ACTION_WAIT);
    }

    /**
     * TODO: Play sound on take card
     *
     * @param data
     * @private
     */
    _handlePlayerTakeCard(playerId, data) {

        if(this.id != playerId) return;

        if (this.board.getTotalPlayedCardsSize() == 15) {
            this.board.cleanDeckCards();
        }

        let card = this.isItMe() ? Card.from(utils.getValue(data, Keywords.GAME_LIST_CARD)) : Card.from(5);
        if(!card.isEmpty()){
            this.renderer.cardList.transferFrom(this.board.getDeckCards(), [card], () => {
                if(this.isItMe()){
                    card.reveal(true);
                    this._processAfterEatOrTake();
                }else{
                    //TODO clear hand cards
                }
            });
        }
    }

    _handlePlayerEatCard(playerId, data) {
        if(this.id != playerId) return;

        let eatenCard = Card.from(utils.getValue(data, Keywords.GAME_LIST_CARD));
        let lastPlayedTurnPlayer = this.scene.gamePlayers.findPlayer(this.board.lastPlayedTurn);

        if (!lastPlayedTurnPlayer || eatenCard.isEmpty()) {
            return;
        }

        this.renderer.eatenCardList.transferFrom(lastPlayedTurnPlayer.renderer.playedCardList, [eatenCard], () => {
            if(this.isItMe()){
                eatenCard.reveal(true);
                this._processAfterEatOrTake();
            }
        });

        if (this.renderer.playedCardList.length == 3) {
            this.renderer.showAnChot();
        }

        // TODO play sound eat
    }

    _processAfterEatOrTake(){
        //TODO
    }

    _handlePlayerDownCard(playerId, data) {

        if(this.id != playerId) return;

        let phomDataSize = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE);
        let phomData = utils.getValue(data, Keywords.GAME_LIST_CARD);

        let dataIndex = 0;
        let downPhomList = new PhomList();
        phomDataSize.forEach((size, i) => {
            let phom = new Phom(GameUtils.create);
            phom.setCards(GameUtils.convertBytesToCards(phomData.substring(dataIndex, dataIndex + size)));

            dataIndex += size;
            phom.setOwner(this.id);

            downPhomList.add(phom);
        });

        this.eatCards.clear();
        this.isItMe() && this.renderer.cardList.cleanCardGroup();

        this.renderer.downPhomList.setPhomList(downPhomList);
        this._onPlayerJoinPhom(playerId);

        // if (isMySelf()) {
        //     getHandCards().getUiCardList().setAfterChildrenFinishActionRunable(new Runnable() {
        //     @Override
        //         public void run() {
        //             setState(PlayerState.STATE_PHOM_JOIN);
        //             processJoinPhomPhase(true);
        //         }
        //     });
        // }
        //
        // getHandCards().getUiCardList().apply(true);

        //TODO play sound
    }

    /**
     *
     * @param playerId - If playerId is not defined mean player is joining is it me
     * @private
     */
    _onPlayerJoinPhom(playerId){
        this.setState(PlayerPhom.STATE_PHOM_JOIN);
    }

    _onPlayerPlayTurn(){

    }

    _handlePlayerHelpCard() {

    }

    _handlePlayerLeaveBoard() {

    }

    _setRemainCardCount(id, remain = 0) {
        if (id == this.id) {
            this.setRemainCardCount(remain);
        }
    }

    setRemainCardCount(remain) {
        this.remainCardCount = remain;
        this.createFakeCards(remain);
    }

    _onGamePlaying() {
        if (this.scene.gameState == game.state.STATE_PHOM_PLAY) {
            this.turnPharse = PlayerPhom.TURN_PHRASE_PLAY_CARD
        } else if (this.scene.gameState == game.state.STATE_PHOM_EAT_TAKE) {
            this.turnPharse = PlayerPhom.TURN_PHRASE_TAKE_OR_EAT_CARD
        } else {
            this.turnPharse = 0;
        }
    }

    _onPlayTurn() {
        if (!this.isItMe()) {
            return;
        }

        let cards = this.getSelectedCards();
        let preCards = this.getPrePlayedCards();

        if (TLMNUtils.checkPlayCard(cards, preCards)) {
            this.turnAdapter.playTurn(cards);
        } else {
            this.notify(app.res.string("invalid_play_card"));
        }
    }

    setPlayedCards(cards) {

    }

    setEatenCards(cards) {

    }

    setDownCards(cards) {

    }

    _onEatCard(cards) {
        /**
         * TODO
         * - Valid eat phom
         * - play sound if invalid
         */
        app.service.send({cmd: Commands.PLAYER_EAT_CARD, data: {}, room: this.scene.room});
    }

    _onTakeCard() {
        app.service.send({cmd: Commands.PLAYER_TAKE_CARD, data: {}, room: this.scene.room});
    }

    //TODO
    _onSortCards() {
        if (this.isItMe()) {
            let sortedCard = GameUtils.sortCardAsc(this.renderer.cardList.cards, game.const.GAME_TYPE_PHOM);
            this.renderer.cardList.setCards(sortedCard);
        }
    }

    getPrePlayedCards() {
        return this.board.playedCards;
    }

    setCards(cards, reveal) {
        super.setCards(cards, reveal);
    }

    createFakeCards(size = PlayerPhom.DEFAULT_HAND_CARD_COUNT) {
        super.createFakeCards(size);
    }

    onEnable() {
        super.onEnable(this.getComponent(PhomPlayerRenderer.name));

        if (this.isItMe()) {
            this.renderer.setSelectCardChangeListener((selectedCards) => {
                if (this.turnPharse == PlayerPhom.TURN_PHRASE_TAKE_OR_EAT_CARD) {
                    //TODO check card on take or eat card phrase
                } else {
                    //TODO check card on play card phrase
                }
            });
        }
    }

    _onGameRejoin(data) {
        super._onGameRejoin(data);

        if (this.isPlaying() && !this.scene.isEnding() && !this.isItMe()) {
            let cards = Array(PlayerPhom.DEFAULT_HAND_CARD_COUNT).fill(5).map(value => {
                return Card.from(value)
            });
            this.setCards(cards, false);
        }
    }
}

PlayerPhom.TURN_PHRASE_TAKE_OR_EAT_CARD = 1;
PlayerPhom.TURN_PHRASE_PLAY_CARD = 2;
PlayerPhom.SORT_CARD_SOLUTION_1 = 2;
PlayerPhom.SORT_CARD_SOLUTION_2 = 1;
PlayerPhom.SORT_CARD_SOLUTION_3 = 0;
PlayerPhom.SERVER_STATE_DANH = 0;
PlayerPhom.SERVER_STATE_AN = 1;
PlayerPhom.SERVER_STATE_GUI = 2;
PlayerPhom.SERVER_STATE_BOC = 3;
PlayerPhom.SERVER_STATE_HA_PHOM = 4;
PlayerPhom.SERVER_STATE_U = 5;

PlayerPhom.STATE_PHOM_PLAY          = app.const.game.player.state.STATE_PHOM_PLAY;
PlayerPhom.STATE_PHOM_EAT_TAKE      = app.const.game.player.state.STATE_PHOM_EAT_TAKE;
PlayerPhom.STATE_PHOM_DOWN          = app.const.game.player.state.STATE_PHOM_DOWN;
PlayerPhom.STATE_PHOM_JOIN          = app.const.game.player.state.STATE_PHOM_JOIN;
PlayerPhom.STATE_PHOM_PLAY_HO_U     = app.const.game.player.state.STATE_PHOM_PLAY_HO_U;
PlayerPhom.STATE_ACTION_WAIT        = app.const.game.player.state.STATE_ACTION_WAIT;


app.createComponent(PlayerPhom);
