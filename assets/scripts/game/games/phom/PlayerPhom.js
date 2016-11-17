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
import CardList from 'CardList';
import Keywords from 'Keywords';
import PhomUtils from "./PhomUtils";
import JoinSolution from "./JoinSolution";
import PhomGenerator from "./PhomGenerator";

export default class PlayerPhom extends PlayerCardTurnBase {

    static get DEFAULT_HAND_CARD_COUNT() {
        return 9
    };

    static get DEFAULT_SORT_CARD_SOLUTION() {
        return 2
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
        this.sortCardSolutionIndex = PlayerPhom.DEFAULT_SORT_CARD_SOLUTION;
        this.currentHaPhomSolutions = [];
        this.currentGuiPhomSolutions = [];
        this.tempHoUPhoms = null;

        this.eatenCards = null;
        this.handCards = null;
        this.playedCards = null;
    }

    onLoad() {
        super.onLoad();

        this.eatenCards = [];
        this.handCards = [];
        this.playedCards = [];
        this.currentHaPhomSolutions = [];
        this.currentGuiPhomSolutions = [];
    }

    start() {
        super.start();
        this.handCards = this.renderer.cardList.cards;
        this.eatenCards = this.renderer.eatenCardList.cards;
        this.playedCards = this.renderer.playedCardList.cards;
    }

    _addGlobalListener() {
        super._addGlobalListener();

        this.scene.on(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn, this);
        this.scene.on(Events.ON_CLICK_EAT_CARD_BUTTON, this._onEatCard, this);
        this.scene.on(Events.ON_CLICK_TAKE_CARD_BUTTON, this._onTakeCard, this);
        this.scene.on(Events.ON_CLICK_SORT_BUTTON, this._onSortCards, this);
        this.scene.on(Events.ON_CLICK_DOWN_PHOM_BUTTON, this._onDownPhom, this);
        this.scene.on(Events.ON_CLICK_SKIP_DOWN_PHOM_BUTTON, this._onSkipDownPhom, this);
        this.scene.on(Events.ON_CLICK_JOIN_PHOM_BUTTON, this._onJoinPhom, this);
        this.scene.on(Events.ON_CLICK_SKIP_JOIN_PHOM_BUTTON, this._onSkipJoinPhom, this);
        this.scene.on(Events.ON_CLICK_CHANGE_PHOM_BUTTON, this._onChangePhom, this);

        this.scene.on(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount, this);

        this.scene.on(Events.HANDLE_PLAYER_TAKE_CARD, this._handlePlayerTakeCard, this);
        this.scene.on(Events.HANDLE_PLAYER_EAT_CARD, this._handlePlayerEatCard, this);
        this.scene.on(Events.HANDLE_PLAYER_DOWN_CARD, this._handlePlayerDownCard, this);
        this.scene.on(Events.HANDLE_PLAYER_HELP_CARD, this._handlePlayerHelpCard, this);
        this.scene.on(Events.HANDLE_PLAYER_LEAVE_BOARD, this._handlePlayerLeaveBoard, this);
        this.scene.on(Events.ON_PLAYER_TURN, this._onPlayerTurn, this);

        // this.scene.on(Events.ON_PLAYER_PLAYED_CARDS, this._onPlayerPlayedCards, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();

        this.scene.off(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn, this);
        this.scene.off(Events.ON_CLICK_EAT_CARD_BUTTON, this._onEatCard, this);
        this.scene.off(Events.ON_CLICK_TAKE_CARD_BUTTON, this._onTakeCard, this);
        this.scene.off(Events.ON_CLICK_SORT_BUTTON, this._onSortCards, this);
        this.scene.off(Events.ON_CLICK_DOWN_PHOM_BUTTON, this._onDownPhom, this);
        this.scene.off(Events.ON_CLICK_SKIP_DOWN_PHOM_BUTTON, this._onSkipDownPhom, this);
        this.scene.off(Events.ON_CLICK_JOIN_PHOM_BUTTON, this._onJoinPhom, this);
        this.scene.off(Events.ON_CLICK_SKIP_JOIN_PHOM_BUTTON, this._onSkipJoinPhom, this);
        this.scene.off(Events.ON_CLICK_CHANGE_PHOM_BUTTON, this._onChangePhom, this);

        this.scene.off(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount, this);

        this.scene.off(Events.HANDLE_PLAYER_TAKE_CARD, this._handlePlayerTakeCard, this);
        this.scene.off(Events.HANDLE_PLAYER_EAT_CARD, this._handlePlayerEatCard, this);
        this.scene.off(Events.HANDLE_PLAYER_DOWN_CARD, this._handlePlayerDownCard, this);
        this.scene.off(Events.HANDLE_PLAYER_HELP_CARD, this._handlePlayerHelpCard, this);
        this.scene.off(Events.HANDLE_PLAYER_LEAVE_BOARD, this._handlePlayerLeaveBoard, this);
        this.scene.off(Events.ON_PLAYER_TURN, this._onPlayerTurn, this);

        // this.scene.off(Events.ON_PLAYER_PLAYED_CARDS, this._onPlayerPlayedCards, this);
    }

    _onDownPhom() {
        if (!this.isItMe()) return;

        let {valid, downPhomList} = PhomUtils.validateDownPhom(this.getSelectedCards(), this);

        console.log("valid, down: ", valid, downPhomList);

        if (!valid) {
            //TODO Play invalid
            return;
        }

        let data = {
            [Keywords.GAME_LIST_PLAYER_CARDS_SIZE]: downPhomList.getPhomLengths(),
            [Keywords.GAME_LIST_CARD]: downPhomList.toBytes()
        };

        console.log("data: ", data);

        app.service.send({cmd: Commands.PLAYER_DOWN_CARD, data: data, room: this.scene.room});

        this.setState(PlayerPhom.STATE_ACTION_WAIT);
    }

    _onSkipDownPhom() {
        if (!this.isItMe()) return;

        this.setState(PlayerPhom.STATE_PHOM_PLAY);

        this.renderer.cardList.cleanSelectedCard();
        this.board.deHighLightPhomList();
    }

    _onJoinPhom() {
        if (!this.isItMe()) return;

        let {valid, joinPhomList} = PhomUtils.validateJoinPhom(this.getSelectedCards(), this);

        if (!valid) {
            //TODO play show invalid
            return;
        }

        let jc = [];
        let ji = [];
        let pl = joinPhomList.map(phom => {
            return phom.owner
        });

        joinPhomList.forEach((node, i) => {
            let phom = this.board.allPhomList[node.phomId];
            jc[i] = node.card.byteValue;
            ji[i] = joinPhomList.indexOf(phom);
        });

        app.service.send({
            cmd: Commands.PLAYER_HELP_CARD, data: {
                [Keywords.GAME_LIST_PLAYER_CARDS_SIZE]: joinPhomList.getPhomLengths(),
                [Keywords.GAME_LIST_CARD]: joinPhomList.toBytes(),
                [Keywords.GAME_LIST_JOIN_CARD]: jc,
                [Keywords.GAME_LIST_JOIN_CARD_TO_PHOM_ID]: ji,
                [Keywords.GAME_LIST_PLAYER]: pl
            }, room: this.scene.room
        })

        this.board.deHighLightPhomList();
        this.setState(PlayerPhom.STATE_ACTION_WAIT);
    }

    _onSkipJoinPhom() {
        if (!this.isItMe()) return;

        this.setState(PlayerPhom.STATE_PHOM_PLAY);
        this.renderer.cardList.cleanSelectedCard();
        this.board.deHighLightPhomList();
    }

    _onChangePhom() {
        if (!this.isItMe()) return;

        this._changeHaPhomSolution(++this.haPhomSolutionId);
    }

    _reset() {
        super._reset();

        this.turnPharse = 0;
        this.state = -1;
        this.downPhaseState = -1;
        this.joinPhaseState = -1;
        this.sortCardSolutionIndex = 2;
    }

    _setDownPhraseState(state) {
        this.downPhaseState = state;
        switch (this.downPhaseState) {
            case PlayerPhom.STATE_DOWN_JOIN_PHASE_SKIP:
                this.scene.emit(Events.SHOW_DOWN_PHOM_CONTROLS, false, true);
                break;
            case PlayerPhom.STATE_DOWN_JOIN_PHASE_SELECT_SOLUTION:
                this.scene.emit(Events.SHOW_DOWN_PHOM_CONTROLS);
                break;
            case PlayerPhom.STATE_DOWN_JOIN_PHASE_UNKNOW:
                this.scene.emit(Events.SHOW_DOWN_PHOM_CONTROLS, true, false);
                break;
        }
    }

    _setJoinPhomPhraseState(state) {
        this.joinPhaseState = state;
        switch (this.joinPhaseState) {
            case PlayerPhom.STATE_DOWN_JOIN_PHASE_SKIP:
                this.scene.emit(Events.SHOW_JOIN_PHOM_CONTROLS);
                break;
            case PlayerPhom.STATE_DOWN_JOIN_PHASE_SELECT_SOLUTION:
                this.scene.emit(Events.SHOW_JOIN_PHOM_CONTROLS);
                break;
        }
    }

    _onGameRejoin(data) {
        super._onGameRejoin(data);

        this.renderer.cardList.cards.forEach(card => {
            this.renderer.eatenCardList.cards.forEach(eatCard => {
                card.equals(eatCard) && card.setHighlight(true);
            });
        });

        if (!this.player.turnAdapter.isTurn()) return;

        let doneActionsInTurn = utils.getValue(data, Keywords.GAME_LIST_DONE_ACTION_WHEN_REJOIN);
        if (doneActionsInTurn != null) {

            let isGui, isHa, isAnOrBoc;

            doneActionsInTurn && doneActionsInTurn.forEach((action, i) => {
                switch (action) {
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

    setState(state) {
        this.state = state;

        switch (state) {
            case PlayerPhom.STATE_PHOM_PLAY:
                this.scene.emit(Events.SHOW_PLAY_CONTROL_ONLY);
                break;
            case PlayerPhom.STATE_PHOM_JOIN:
                this.scene.emit(Events.SHOW_JOIN_PHOM_CONTROLS);
                break;
            case PlayerPhom.STATE_PHOM_EAT_TAKE:
                this.scene.emit(Events.SHOW_EAT_AND_TAKE_CONTROLS);
                break;
            case PlayerPhom.STATE_PHOM_DOWN:
                this.scene.emit(Events.SHOW_DOWN_PHOM_CONTROLS);
                break;
            default:
                this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
        }
    }

    _onPlayerTurn(playerId) {

        if (this.id != playerId) return;

        console.log("_onPlayerTurn: ")

        if (this.isItMe()) {
            if (this.renderer.cardList.cards.length > PlayerPhom.DEFAULT_HAND_CARD_COUNT) {
                // chia phat u luon
                let startPhomList = PhomUtils.bestPhomList(this.renderer.cardList.cards);
                if (startPhomList && PhomUtils.isUTron(startPhomList, this)) {
                    this.sendUCommand(startPhomList);
                    return;
                }
                this.setState(PlayerPhom.STATE_PHOM_PLAY);
            } else {
                this.setState(PlayerPhom.STATE_PHOM_EAT_TAKE);
            }
        }
    }

    _onPlayerPlayedCards(playedCards, srcCardList, isItMe) {

        //Check player Id

        if (utils.isEmptyArray(playedCards)) return;

        this.board.lastPlayedCard = playedCards[0];

        if (this.isItMe()) {
            // this.renderer.cardList.cleanSelectedCard();
            if (this.renderer.playedCardList.length == 3) {
                this.renderer.downPhomList.cleanHighlight();
            }
        }

        this.renderer.addPlayedCard(playedCards, srcCardList, isItMe);
    }

    sendUCommand(phomList) {
        let phomDataSize = phomList.getPhomLengths();
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
        if (this.id != playerId) return;

        if (this.board.getTotalPlayedCardsSize() == 15) {
            this.board.cleanDeckCards();
        }

        let card = this.isItMe() ? Card.from(utils.getValue(data, Keywords.GAME_LIST_CARD)) : Card.from(5);
        if (!card.isEmpty()) {
            this.renderer.cardList.transferFrom(this.board.getDeckCards(), [card], () => {
                if (this.isItMe()) {
                    this._processAfterEatOrTake();
                } else {
                    this.renderer.cardList.clear();
                }
            });
        }
    }

    _handlePlayerEatCard(playerId, data) {
        if (this.id != playerId) return;

        let eatenCard = Card.from(utils.getValue(data, Keywords.GAME_LIST_CARD));
        let lastPlayedTurnPlayer = this.scene.gamePlayers.findPlayer(this.board.turnAdapter.lastPlayedTurn);

        if (!lastPlayedTurnPlayer || eatenCard.isEmpty()) {
            return;
        }

        let eatenCardList = this.isItMe() ? this.renderer.cardList : this.renderer.eatenCardList;
        eatenCardList.transferFrom(lastPlayedTurnPlayer.renderer.playedCardList, [eatenCard], (cards) => {
            cards && cards.forEach(card => PhomUtils.setEaten(card));
            if (this.isItMe()) {
                this._processAfterEatOrTake();
            }
        });

        this.board.swapPlayedCards();


        if (this.renderer.playedCardList.length == 3) {
            this.renderer.showAnChot();
        }

        // TODO play sound eat
    }


    _processAfterEatOrTake() {
        let currentPhomList = PhomUtils.bestPhomList(this.renderer.cardList.cards);

        if (PhomUtils.isUTron(currentPhomList, this)) {
            this.sendUCommand(currentPhomList);
            return;
        }

        if (this.renderer.playedCardList.cards.length == 3) {
            this.setState(PlayerPhom.STATE_PHOM_DOWN);
            this._processDownPhomPhase(true);
        } else {
            let currentPhomCards = currentPhomList.getCards();
            if (currentPhomList.length > 0 && currentPhomCards.length >= 9) {
                // co the u duoc
                this.tempHoUPhoms = currentPhomList;
                currentPhomCards.forEach(card => CardList.setSelected(card, true));
                this.setState(PlayerPhom.STATE_PHOM_PLAY_HO_U);
            }
            else {
                this.setState(PlayerPhom.STATE_PHOM_PLAY);
            }

            this.sortCardSolutionIndex = PlayerPhom.DEFAULT_SORT_CARD_SOLUTION;
        }
    }

    _isEmptyEatenCards() {
        return this.isItMe() ? this.handCards.filter(card => PhomUtils.isEaten(card)) == 0 : this.renderer.eatenCardList.cards.length == 0;
    }

    _processDownPhomPhase(allCard) {
        let processCards = allCard ? [...this.renderer.cardList.cards] : [...this.renderer.cardList.getSelectedCards()];

        this.renderer.cardList.cleanCardGroup();
        this.currentHaPhomSolutions = PhomGenerator.generate(processCards);

        if (this.currentHaPhomSolutions.length == 0) {
            if (allCard) {
                this.setState(PlayerPhom.STATE_PHOM_JOIN);
                this._processJoinPhomPhase(allCard);
            } else {
                this._isEmptyEatenCards() && this._setDownPhraseState(PlayerPhom.STATE_DOWN_JOIN_PHASE_SKIP);
            }
        } else {
            if (this.currentHaPhomSolutions.length > 1) {
                this._setDownPhraseState(PlayerPhom.STATE_DOWN_JOIN_PHASE_SELECT_SOLUTION);
            } else {
                if (this._isEmptyEatenCards()) {
                    this._setDownPhraseState(PlayerPhom.STATE_DOWN_JOIN_PHASE_SKIP);
                } else {
                    this._setDownPhraseState(PlayerPhom.STATE_DOWN_JOIN_PHASE_UNKNOW);
                }
            }

            if (allCard || (this.currentHaPhomSolutions[0].cards.length == processCards.length)) {
                this._changeHaPhomSolution(0);
            }
        }
    }

    _changeHaPhomSolution(haPhomSolutionId = 0) {
        this.haPhomSolutionId = haPhomSolutionId;

        if(this.haPhomSolutionId >= this.currentHaPhomSolutions.length){
            this.haPhomSolutionId = 0;
        }

        this.renderer.cardList.clean();

        if (this.currentHaPhomSolutions.length == 0 && this.haPhomSolutionId >= this.currentHaPhomSolutions.length) {
            return;
        }

        console.log("haPhomSolutionId: ", haPhomSolutionId, this.currentHaPhomSolutions);

        let currentPhomList = this.currentHaPhomSolutions[this.haPhomSolutionId];
        currentPhomList.forEach((phom, i) => {
            phom.cards.forEach(card => {
                card.setGroup(i);
                card.setSelected(true);
                card.setHighlight(true);
            });
        });
    }

    _processJoinPhomPhase(isAllCard) {

        let processCards = isAllCard ? [...this.renderer.cardList.cards] : [...this.renderer.cardList.cards.getSelectedCards()];

        this.board.deHighLightPhomList();

        this.currentGuiPhomSolutions = PhomUtils.getJoinPhomSolutions([...this.board.allPhomList], processCards);

        if (this.currentGuiPhomSolutions.length == 0) {
            if (isAllCard) {
                this.setState(PlayerPhom.STATE_PHOM_PLAY);
            } else {
                this._setJoinPhomPhraseState(PlayerPhom.STATE_DOWN_JOIN_PHASE_SKIP);
            }
        } else {
            if (PhomUtils.isMom(this)) {
                this.setState(PlayerPhom.STATE_PHOM_PLAY);
            } else {
                if (this.currentGuiPhomSolutions.length > 1) {
                    this._setJoinPhomPhraseState(PlayerPhom.STATE_DOWN_JOIN_PHASE_SELECT_SOLUTION);
                } else {
                    this._setJoinPhomPhraseState(PlayerPhom.STATE_DOWN_JOIN_PHASE_SKIP);
                }

                if (isAllCard || (this.currentGuiPhomSolutions[0].length == processCards.length)) {
                    this._changeGuiPhomSolution(0);
                }

            }
        }
    }

    _changeGuiPhomSolution(guiPhomSolutionId) {
        this.guiPhomSolutionId = guiPhomSolutionId;

        if(this.guiPhomSolutionId >= this.currentGuiPhomSolutions.length){
            this.guiPhomSolutionId = 0;
        }

        if (this.currentGuiPhomSolutions.length == 0 && this.guiPhomSolutionId >= this.currentGuiPhomSolutions.length) {
            return;
        }

        this.renderer.cardList.clean();
        this.board.deHighLightPhomList();

        let currentGuiSolution = this.currentGuiPhomSolutions[this.guiPhomSolutionId];
        currentGuiSolution((node, k) => {
            let nodeCard = node.card;
            nodeCard.setHighlight(true);
            nodeCard.setSelected(true);
            this.board.allPhomList[node.phomId].setHighlight(true);
        });
    }

    _handlePlayerDownCard(playerId, data) {

        if (this.id != playerId) return;

        let phomDataSize = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE);
        let phomData = utils.getValue(data, Keywords.GAME_LIST_CARD);

        let dataIndex = 0;
        let downPhomList = new PhomList();
        phomDataSize.forEach((size, i) => {
            let phom = new Phom(GameUtils.convertBytesToCards(phomData.slice(dataIndex, dataIndex + size)));

            dataIndex += size;
            phom.setOwner(this.id);

            downPhomList.add(phom);
        });

        this.renderer.downPhomList.clear();
        this.renderer.eatenCardList.clear();

        downPhomList = this.renderer.downPhomList.setPhomList(downPhomList, this);
        this.board.allPhomList.push(...downPhomList);

        if (this.isItMe()) {
            this.isItMe() && this.renderer.cardList.cleanCardGroup();
            this._onPlayerJoinPhom(playerId);
            this._processJoinPhomPhase(true);
        }

        //TODO play sound
    }

    /**
     *
     * @param playerId - If playerId is not defined mean player is joining is it me
     * @private
     */
    _onPlayerJoinPhom(playerId) {
        this.id == playerId && this.setState(PlayerPhom.STATE_PHOM_JOIN);
    }

    _handlePlayerHelpCard(data) {

        let phomDataSize = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE);
        let phomData = utils.getValue(data, Keywords.GAME_LIST_CARD);
        let jc = utils.getValue(data, Keywords.GAME_LIST_JOIN_CARD);
        let ji = utils.getValue(data, Keywords.GAME_LIST_JOIN_CARD_TO_PHOM_ID);
        let pl = utils.getValue(data, Keywords.GAME_LIST_PLAYER);

        let joinedPhomList = new PhomList();
        let dataIndex = 0;

        for (let i = 0; i < phomDataSize.length; i++) {
            let phom = new Phom();

            for (let j = 0; j < phomDataSize[i]; j++) {
                phom.add(Card.from(phomData[dataIndex + j]));
            }

            phom.sortAsc();
            dataIndex += phomDataSize[i];
            joinedPhomList.push(this.board.allPhomList[this.board.allPhomList.indexOf(phom)]);
        }

        let joiningCards = GameUtils.convertBytesToCards(jc);

        if (!this.isItMe()) {
            this.renderer.cardList.setCards(joiningCards);
        }

        let joinedCards = this.renderer.cardList.removeCards(joiningCards);

        for (let i = 0; i < joinedCards.size(); i++) {
            let joinedPhom = joinedPhomList.getPhomAt(ji[i]);
            joinedPhom.joinCard(joinedCards[i]);
        }

        if (this.isItMe()) {
            this.setState(PlayerPhom.STATE_PHOM_PLAY);
        }

        // TODO sound join phom
    }


    _handlePlayerLeaveBoard() {
        if (this.state == PlayerPhom.STATE_PHOM_JOIN) {
            this._processJoinPhomPhase(true);
        }
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

    onGamePlaying() {
        if (this.scene.gameState == PlayerPhom.STATE_PHOM_PLAY) {
            this.turnPharse = PlayerPhom.TURN_PHRASE_PLAY_CARD
        } else if (this.scene.gameState == PlayerPhom.STATE_PHOM_EAT_TAKE) {
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

        if (PhomUtils.checkPlayCard(cards, this.handCards)) {
            this.turnAdapter.playTurn(cards);
        } else {
            this.notify(app.res.string("invalid_play_card"));
        }
    }

    getSelectedCards() {
        return this.renderer.cardList.getSelectedCards();
    }

    setPlayedCards(cards) {
        this.renderer.playedCardList.setCards(cards);
    }

    setEatenCards(cards) {
        this.renderer.eatenCardList.setCards(cards);
    }

    _onEatCard(cards) {
        /**
         * TODO
         * - Valid eat phom
         * - play sound if invalid
         */
        this.isItMe() && app.service.send({cmd: Commands.PLAYER_EAT_CARD, data: {}, room: this.scene.room});
        this.setState(PlayerPhom.STATE_ACTION_WAIT);
    }

    _onTakeCard() {
        this.isItMe() && app.service.send({cmd: Commands.PLAYER_TAKE_CARD, data: {}, room: this.scene.room});
        this.setState(PlayerPhom.STATE_ACTION_WAIT);
    }

    //TODO
    _onSortCards() {

        console.log("this.sortCardSolutionIndex: ", this.sortCardSolutionIndex, this.isItMe());

        if (this.isItMe()) {
            switch (this.sortCardSolutionIndex) {
                case PlayerPhom.SORT_CARD_SOLUTION_1:
                    PhomUtils.sortAsc(this.renderer.cardList.cards, PhomUtils.SORT_BY_PHOM_FIRST);
                    break;
                case PlayerPhom.SORT_CARD_SOLUTION_2:
                    PhomUtils.sortAsc(this.renderer.cardList.cards, PhomUtils.SORT_BY_PHOM_SOLUTION);
                    break;
                default:
                    PhomUtils.sortAsc(this.renderer.cardList.cards);
            }

            console.log("this.renderer.cardList.cards: ", this.renderer.cardList.cards);

            this._updateSortCardSolutionIndex();
            this.renderer.cardList.onCardsChanged();
        }
    }

    _updateSortCardSolutionIndex() {
        this.sortCardSolutionIndex++;
        if (this.sortCardSolutionIndex > PlayerPhom.SORT_CARD_SOLUTION_MAX) {
            this.sortCardSolutionIndex = 0;
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

                if (this.state == PlayerPhom.STATE_PHOM_PLAY) {
                    let interactable = PhomUtils.checkPlayCard([...selectedCards], this.handCards);
                    this.scene.emit(Events.SET_INTERACTABLE_PLAY_CONTROL, interactable);
                }else if(this.state == PlayerPhom.STATE_PHOM_DOWN){
                    let interactable = PhomUtils.checkDownPhom([...selectedCards], this);
                    this.scene.emit(Events.SET_INTERACTABLE_HA_PHOM_CONTROL, interactable);
                    if(!interactable){
                        this.renderer.cardList.cleanHighlight();
                    }
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

    //     @Override
    //     public void showWinLoseInfo(byte winType, byte rankType, byte rank) {
    // //		super.showWinLoseInfo(winType, rankType, rank);
    //     if (winType == GameWin.PHOM_WIN_TYPE_U_DEN) {
    //     //thang thua kieu u den thi ko show thang thua icon cho nhung thang kia
    //     if (rank == GameRank.GAME_RANK_FIRST || rank == GameRank.GAME_RANK_FOURTH) {
    //     // nhat hoac bet duoc show icon nhat nhi ba bet
    //     showWinDrawLoseIcon(winType, rankType, rank);
    // }
    // }
    // else {
    //     showWinDrawLoseIcon(winType, rankType, rank);
    // }
    //
    // //		if ( (rank != GameRank.GAME_RANK_FIRST) ) {// && winType != GameWin.PHOM_WIN_TYPE_U_KHAN || (winType == GameWin.PHOM_WIN_TYPE_U_KHAN && rank != GameRank.GAME_RANK_FIRST)) {
    // //			// truong hop u khan thang nhat cung mom dam ra ko duoc show
    // //			if (isMom()) {
    // //				((UIPlayerPhom) getUIPlayer()).showMomAvatar(true);
    // //			}
    // //		}
    //
    // if (winType == GameWin.GENERAL_WIN_TYPE_NORMAL) {
    //     if (rank != GameRank.GAME_RANK_FIRST && isMom()) {
    //         //chi truong hop thang thua binh thuong moi show mom
    // //				if (isMom()) {
    //         ((UIPlayerPhom) getUIPlayer()).showMomAvatar(true);
    // //				}
    //     }
    //     showFirstLastRankIcon(winType, rankType, rank);
    // }
    //
    // showInfo(getWinLoseString(winType, rankType, rank), 5000);
    // }

    //     @Override
    //     public String getWinLoseString(byte winType, byte rankType, byte rank) {
    //     if (getBoardPhom().winType != GameWin.GENERAL_WIN_TYPE_NORMAL) {
    //     if (rank == GameRank.GAME_RANK_FIRST) {
    //     return GameWin.getPhomFirstRankSpecialString(getBoardPhom().winType);
    // } else {
    //     return super.getWinLoseString(winType, rankType, rank);
    // }
    // }
    //
    // if (!isMom()) {
    //     CardVector hands = getHandCards();
    //     int cardsPoint = 0;
    //     for (int i = 0; i < hands.size(); i++) {
    //         cardsPoint += hands.getCardAt(i).getRank();
    //     }
    //     return LanguageManager.getString(R.string.diem, cardsPoint);
    // }
    // return super.getWinLoseString(winType, rankType, rank);
    // }
}

PlayerPhom.TURN_PHRASE_TAKE_OR_EAT_CARD = 1;
PlayerPhom.TURN_PHRASE_PLAY_CARD = 2;
PlayerPhom.SORT_CARD_SOLUTION_MAX = 2;
PlayerPhom.SORT_CARD_SOLUTION_1 = 2;
PlayerPhom.SORT_CARD_SOLUTION_2 = 1;
PlayerPhom.SORT_CARD_SOLUTION_3 = 0;
PlayerPhom.SERVER_STATE_DANH = 0;
PlayerPhom.SERVER_STATE_AN = 1;
PlayerPhom.SERVER_STATE_GUI = 2;
PlayerPhom.SERVER_STATE_BOC = 3;
PlayerPhom.SERVER_STATE_HA_PHOM = 4;
PlayerPhom.SERVER_STATE_U = 5;

PlayerPhom.STATE_PHOM_PLAY = app.const.game.player.state.STATE_PHOM_PLAY;
PlayerPhom.STATE_PHOM_EAT_TAKE = app.const.game.player.state.STATE_PHOM_EAT_TAKE;
PlayerPhom.STATE_PHOM_DOWN = app.const.game.player.state.STATE_PHOM_DOWN;
PlayerPhom.STATE_PHOM_JOIN = app.const.game.player.state.STATE_PHOM_JOIN;
PlayerPhom.STATE_PHOM_PLAY_HO_U = app.const.game.player.state.STATE_PHOM_PLAY_HO_U;
PlayerPhom.STATE_ACTION_WAIT = app.const.game.player.state.STATE_ACTION_WAIT;
PlayerPhom.STATE_DOWN_JOIN_PHASE_SKIP = 2000;

PlayerPhom.STATE_DOWN_JOIN_PHASE_UNKNOW = -1;
PlayerPhom.STATE_DOWN_JOIN_PHASE_SELECT_SOLUTION = 1;
PlayerPhom.STATE_DOWN_JOIN_PHASE_SKIP = 2;


app.createComponent(PlayerPhom);
