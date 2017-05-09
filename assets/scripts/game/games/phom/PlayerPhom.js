/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import game from 'game';
import Card from 'Card';
import Events from 'Events';
import {utils, GameUtils} from 'utils';
import PlayerCardTurnBase from 'PlayerCardTurnBase';
import PhomList from 'PhomList';
import Commands from 'Commands';
import Phom from 'Phom';
import Keywords from 'Keywords';
import PhomUtils from "PhomUtils";
import PhomGenerator from "PhomGenerator";
import ArrayUtils from "ArrayUtils";

export default class PlayerPhom extends PlayerCardTurnBase {

    constructor() {
        super();

        this.state = -1;
        this.turnPharse = 0;
        this.downPhomPharse = -1;
        this.joinPhaseState = -1;
        this.haPhomSolutionId = 0;
        this.guiPhomSolutionId = 0;
        this.remainCardCount = PlayerPhom.DEFAULT_HAND_CARD_COUNT;
        this.sortCardSolutionIndex = PhomUtils.SORT_HAND_CARD_BY_PHOM_SOLUTION;
        this.currentHaPhomSolutions = [];
        this.currentGuiPhomSolutions = [];
        this.tempHoUPhoms = null;

        this.eatenCards = null;
        this.handCards = null;
        this._isPlayImmediateAfterTakeCard = false;
    }

    onLoad() {
        super.onLoad();

        this.eatenCards = [];
        this.handCards = [];
        this.currentHaPhomSolutions = [];
        this.currentGuiPhomSolutions = [];
    }

    start() {
        super.start();
        this.handCards = this.renderer.cardList.cards;
    }

    getPlayedCards(){
        return this.renderer.playedCardList.cards;
    }

    _addGlobalListener() {
        super._addGlobalListener();

        if(this.scene){
            this.scene.on(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn, this);
            this.scene.on(Events.ON_CLICK_EAT_CARD_BUTTON, this._onEatCard, this);
            this.scene.on(Events.ON_CLICK_TAKE_CARD_BUTTON, this._onTakeCard, this);
            this.scene.on(Events.ON_CLICK_SORT_BUTTON, this._onSortCards, this);
            this.scene.on(Events.ON_CLICK_DOWN_PHOM_BUTTON, this._onDownPhom, this);
            this.scene.on(Events.ON_CLICK_SKIP_DOWN_PHOM_BUTTON, this._onSkipDownPhom, this);
            this.scene.on(Events.ON_CLICK_JOIN_PHOM_BUTTON, this._onJoinPhom, this);
            this.scene.on(Events.ON_CLICK_SKIP_JOIN_PHOM_BUTTON, this._onSkipJoinPhom, this);
            this.scene.on(Events.ON_CLICK_CHANGE_PHOM_BUTTON, this._onChangePhom, this);
            this.scene.on(Events.ON_CLICK_CHANGE_JOIN_PHOM_BUTTON, this._changeGuiPhomSolution, this);
            this.scene.on(Events.ON_CLICK_U_BUTTON, this._onUPhom, this);
            this.scene.on(Events.ON_CLICK_DOI_U_TRON_BUTTON, this._onDoiUTron, this);
            this.scene.on(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount, this);
            this.scene.on(Events.HANDLE_PLAYER_TAKE_CARD, this._handlePlayerTakeCard, this);
            this.scene.on(Events.HANDLE_PLAYER_EAT_CARD, this._handlePlayerEatCard, this);
            this.scene.on(Events.HANDLE_PLAYER_DOWN_CARD, this._handlePlayerDownCard, this);
            this.scene.on(Events.HANDLE_PLAYER_HELP_CARD, this._handlePlayerHelpCard, this);
            this.scene.on(Events.HANDLE_PLAYER_LEAVE_BOARD, this._handlePlayerLeaveBoard, this);
            this.scene.on(Events.ON_PLAYER_TURN, this._onPlayerTurn, this);
            this.scene.on(Events.CLEAN_GAME_AFTER_SHOW_RESULT, this._cleanGameAfterShowResult, this);
            this.scene.on(Events.SHOW_PHOM_HIGHLIGHT, this._setPhomHighlight, this);
        }
    }

    _removeGlobalListener() {
        super._removeGlobalListener();

        if(this.scene) {
            this.scene.off(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn, this);
            this.scene.off(Events.ON_CLICK_EAT_CARD_BUTTON, this._onEatCard, this);
            this.scene.off(Events.ON_CLICK_TAKE_CARD_BUTTON, this._onTakeCard, this);
            this.scene.off(Events.ON_CLICK_SORT_BUTTON, this._onSortCards, this);
            this.scene.off(Events.ON_CLICK_DOWN_PHOM_BUTTON, this._onDownPhom, this);
            this.scene.off(Events.ON_CLICK_SKIP_DOWN_PHOM_BUTTON, this._onSkipDownPhom, this);
            this.scene.off(Events.ON_CLICK_JOIN_PHOM_BUTTON, this._onJoinPhom, this);
            this.scene.off(Events.ON_CLICK_SKIP_JOIN_PHOM_BUTTON, this._onSkipJoinPhom, this);
            this.scene.off(Events.ON_CLICK_CHANGE_PHOM_BUTTON, this._onChangePhom, this);
            this.scene.off(Events.ON_CLICK_CHANGE_JOIN_PHOM_BUTTON, this._changeGuiPhomSolution, this);
            this.scene.off(Events.ON_CLICK_U_BUTTON, this._onUPhom, this);
            this.scene.off(Events.ON_CLICK_DOI_U_TRON_BUTTON, this._onDoiUTron, this);
            this.scene.off(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount, this);
            this.scene.off(Events.HANDLE_PLAYER_TAKE_CARD, this._handlePlayerTakeCard, this);
            this.scene.off(Events.HANDLE_PLAYER_EAT_CARD, this._handlePlayerEatCard, this);
            this.scene.off(Events.HANDLE_PLAYER_DOWN_CARD, this._handlePlayerDownCard, this);
            this.scene.off(Events.HANDLE_PLAYER_HELP_CARD, this._handlePlayerHelpCard, this);
            this.scene.off(Events.HANDLE_PLAYER_LEAVE_BOARD, this._handlePlayerLeaveBoard, this);
            this.scene.off(Events.ON_PLAYER_TURN, this._onPlayerTurn, this);
            this.scene.off(Events.CLEAN_GAME_AFTER_SHOW_RESULT, this._cleanGameAfterShowResult, this);
            this.scene.off(Events.SHOW_PHOM_HIGHLIGHT, this._setPhomHighlight, this);
        }
    }

    _cleanGameAfterShowResult(){
        this.renderer.cleanPlayerCards();
    }

    _setPhomHighlight(phom, highlight) {
        if (!this.isItMe()) {
            this.renderer.setHighlightPhom(phom, highlight);
        }
    }

    _onUPhom(){
        if(!this.isItMe()) return;

        this.sendUCommand(this.tempHoUPhoms);
    }

    _onDoiUTron(){
        if(!this.isItMe()) return;

        this.renderer.cardList.cleanHighlight();
        this.renderer.cardList.cleanSelectedCard();
        this.setState(PlayerPhom.STATE_PHOM_PLAY);
    }

    _onDownPhom() {
        if (!this.isItMe()) return;

        let {valid, downPhomList, message} = PhomUtils.validateDownPhom(this.getSelectedCards(), this);
        if (!valid) {
            //TODO Play invalid
            message && app.system.showToast(message);
            return;
        }

        let data = {
            [Keywords.GAME_LIST_PLAYER_CARDS_SIZE]: downPhomList.getPhomLengths(),
            [Keywords.GAME_LIST_CARD]: downPhomList.toBytes()
        };

        app.service.send({cmd: Commands.PLAYER_DOWN_CARD, data: data, room: this.scene.room});
        this.setState(PlayerPhom.STATE_ACTION_WAIT);
    }

    _onSkipDownPhom() {
        if (!this.isItMe()) return;

        if(PhomUtils.isContainEatenCards(this.renderer.cardList.cards)){
            app.system.showToast(app.res.string('game_cannot_skip_down_if_eaten'))
        }else{
            this.setState(PlayerPhom.STATE_PHOM_PLAY);

            this.renderer.cardList.cleanSelectedCard();
            this.renderer.cardList.cleanHighlight();
            this.board.deHighLightPhomList();
        }
    }

    _onJoinPhom() {
        if (!this.isItMe()) return;

        let {valid, guiSolution} = PhomUtils.validateGuiPhom(this.board.getAllBoardPhomList(), this);

        if (!valid) {
            //TODO play show invalid
            return;
        }

        let uniquePhomList = guiSolution.getPhomList(this.board.getAllBoardPhomList());
        let joinPhomMap = {};
        uniquePhomList.forEach((value) => {
            joinPhomMap[value] = {
                ownerId: 0,
                joinCards: [],
                phomCards: []
            };
        });

        guiSolution.forEach((node, i) => {
            
            let phom = this.board.allPhomList[node.phomId]
            let renderPhom = phom.renderComponent
            let joinSolution = joinPhomMap[node.phomId];
            if(!joinSolution){
                joinSolution = {
                    ownerId: phom.owner,
                    joinCards: [],
                    phomCards: (renderPhom || phom).cards.map(card => card.byteValue)
                };
                joinPhomMap[node.phomId] = joinSolution;
            }

            joinSolution.joinCards.push(node.card.byteValue);
        });

        app.service.send({
            cmd: Commands.PLAYER_HELP_CARD,
            data: {
                joinPhoms: Object.values(joinPhomMap).filter(joinSolution => joinSolution.ownerId > 0)
            },
            room: this.scene.room
        })

        this.board.deHighLightPhomList();
        this.setState(PlayerPhom.STATE_ACTION_WAIT);
    }

    _onSkipJoinPhom() {
        if (!this.isItMe()) return;

        this.setState(PlayerPhom.STATE_PHOM_PLAY);
        this.renderer.cardList.cleanSelectedCard();
        this.renderer.cardList.cleanHighlight();
        this.board.deHighLightPhomList();
    }

    _onChangePhom() {
        if (!this.isItMe()) return;

        this._changeHaPhomSolution(++this.haPhomSolutionId);
    }

    onGameReset() {
        super.onGameReset();

        this.turnPharse = 0;
        this.state = -1;
        this.downPhaseState = -1;
        this.joinPhaseState = -1;
        this.sortCardSolutionIndex = PhomUtils.SORT_HAND_CARD_BY_PHOM_SOLUTION;
        this.eatenCards = [];
        this._isPlayImmediateAfterTakeCard = false;
    }

    _setDownPhraseState(state) {
        this.downPhaseState = state;
        switch (this.downPhaseState) {
            case PlayerPhom.STATE_DOWN_JOIN_PHASE_SKIP:
                this.scene.emit(Events.SHOW_DOWN_PHOM_CONTROLS, false, true);
                break;
            case PlayerPhom.STATE_DOWN_JOIN_PHASE_SELECT_SOLUTION:
                this.scene.emit(Events.SHOW_DOWN_PHOM_CONTROLS, PhomUtils.isContainEatenCards(this.renderer.cardList.cards));
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

        this.eatenCards.forEach(card => {
            let cardInHand = ArrayUtils.findFirst(this.renderer.cardList.cards, card);
            cardInHand && PhomUtils.setEaten(cardInHand, true);
        });

        this.renderer.cardList.cards.forEach(card => {
            this.renderer.eatenCardList.cards.forEach(eatCard => {
                card.equals(eatCard) && PhomUtils.setEaten(card, true);
            });
        });

        if (!this.isItMe() || !this.turnAdapter.isTurn()) return;

        let doneActionsInTurn = utils.getValue(data, Keywords.GAME_LIST_DONE_ACTION_WHEN_REJOIN);

        if (doneActionsInTurn) {

            let isGui, isHa, isAn, isBoc;

            doneActionsInTurn && doneActionsInTurn.forEach((action, i) => {
                switch (action) {
                    case PlayerPhom.SERVER_STATE_GUI:
                        isGui = true;
                        break;
                    case PlayerPhom.SERVER_STATE_HA_PHOM:
                        isHa = true;
                        break;
                    case PlayerPhom.SERVER_STATE_AN:
                        isAn = true;
                        break;
                    case PlayerPhom.SERVER_STATE_BOC:
                        isBoc = true;
                        break;
                }
            });

            if (isGui) {
                this.setState(PlayerPhom.STATE_PHOM_PLAY);
            } else if (isHa) {
                this._processJoinPhomPhase(true);
            } else if (isAn || isBoc) {
                this._processAfterEatOrTake(isAn);
            }
        }else{
            this.setState(PlayerPhom.STATE_PHOM_EAT_TAKE)
        }
    }

    setState(state) {
        this.state = state;

        switch (state) {
            case PlayerPhom.STATE_PHOM_PLAY:

                this.board._showTapHighlightOnMeTurn(false)
                this.renderer.cardList.cleanSelectedCard();

                if(this._isPlayImmediateAfterTakeCard){
                    this.scene && this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
                    this._isPlayImmediateAfterTakeCard = false
                }else {
                    this.scene && this.scene.emit(Events.SHOW_PLAY_CONTROL_ONLY);
                    if(this.renderer.cardList.cards.length == 1){
                        this.turnAdapter.playTurn(this.renderer.cardList.cards);
                    }
                }
                break;
            case PlayerPhom.STATE_PHOM_JOIN:
                this.scene && this.scene.emit(Events.SHOW_JOIN_PHOM_CONTROLS);
                this.board._showTapHighlightOnMeTurn(false)
                break;
            case PlayerPhom.STATE_PHOM_EAT_TAKE:

                this.isItMe() && this.board._showTapHighlightOnMeTurn()
                // this.scene && this.scene.emit(Events.SHOW_EAT_AND_TAKE_CONTROLS);
                // this.scene && this.scene.emit(Events.SHOW_PLAY_CONTROL_ONLY);
                this._suggestEatPhom();
                break;
            case PlayerPhom.STATE_PHOM_DOWN:
                this.scene && this.scene.emit(Events.SHOW_DOWN_PHOM_CONTROLS);
                this.board._showTapHighlightOnMeTurn(false)
                break;
            case PlayerPhom.STATE_PHOM_PLAY_HO_U:
                this.scene && this.scene.emit(Events.SHOW_U_PHOM_CONTROLS);
                this.board._showTapHighlightOnMeTurn(false)
                break;
            case PlayerPhom.STATE_ACTION_WAIT:
                this.scene && this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
                this.board._showTapHighlightOnMeTurn(false)
                this._isPlayImmediateAfterTakeCard = false;
                break;
            default:
                this.scene && this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
                this.board._showTapHighlightOnMeTurn(false)
        }
    }

    _suggestEatPhom() {
        if(this.isItMe()){
            let eatableCards = PhomUtils.findBestEatableCards(this.renderer.cardList.cards, this.eatenCards, this.board.lastPlayedCard);
            if (eatableCards.length > 0) {
                this.renderer.cardList.setSelecteds(eatableCards, true)
                this.renderer.cardList.setHighlight(eatableCards);
                this.board.lastPlayedCard && this.board.lastPlayedCard.setVisibleTapHighlightNode(true, () => this._onPlayerEatCard(this.scene.gamePlayers.me))
            }else{
                this.renderer.cardList.clean();
            }
        }
    }

    _onPlayerTurn(playerId) {

        if (this.id != playerId) return;

        if (this.isItMe()) {
            if (this.renderer.cardList.cards.length > PlayerPhom.DEFAULT_HAND_CARD_COUNT) {
                // chia phat u luon
                let startPhomList = PhomUtils.findBestPhomList(this.renderer.cardList.cards);
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
        if (utils.isEmptyArray(playedCards)) return;

        if (isItMe) {

            // if (this.renderer.playedCardList.length == 3) {
            //     this.renderer.cleanHighlightDownPhom();
            // }

            this.renderer.cardList.clean();
            this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);

            this._isPlayImmediateAfterTakeCard = true;
        }
        
        this.renderer.disableTappableAllPlayedCard();
        let addedCards = this.renderer.addPlayedCard(playedCards, srcCardList, isItMe);

        if(addedCards.length > 0){
            this.board.lastPlayedCard = addedCards[0];
            this.board.lastPlayedCard.setOnClickListener(() => this._onPlayerEatCard(this.scene.gamePlayers.me))
        }
    }

    sendUCommand(phomList) {

        if(!phomList) return;

        let phomDataSize = phomList.getPhomLengths();
        let phomCardsByte = phomList.toBytes();

        const data = {};
        data[Keywords.GAME_LIST_PLAYER_CARDS_SIZE] = phomDataSize;
        data[Keywords.GAME_LIST_CARD] = phomCardsByte;

        app.service.send({cmd: Commands.PLAYER_PLAY_CARD_U, data: data, room: this.scene.room});
        this.setState(PlayerPhom.STATE_ACTION_WAIT);
    }

    /**
     *
     * @param data
     * @private
     */
    _handlePlayerTakeCard(playerId, data) {
        if (this.id != playerId) return;

        if (this.board.getTotalPlayedCardsSize() == 15) {
            this.board.renderer.cleanDeckCards();
        }

        let card = this.isItMe() ? Card.from(utils.getValue(data, Keywords.GAME_LIST_CARD)) : Card.from(0);
        this.renderer.cardList.transferFrom(this.board.getDeckCards(), [card], {reverse: true, cb: () => {
            if (this.isItMe()) {
                this._processAfterEatOrTake();
            } else {
                this.renderer.cardList.removeCards([card]);
            }
            // play sound
            app.system.audioManager.play(app.system.audioManager.BOC_BAI);
        }});
    }

    _handlePlayerEatCard(playerId, data) {
        if (this.id != playerId) return;

        this.renderer.cardList.cleanHighlight();

        let eatenCard = Card.from(utils.getValue(data, Keywords.GAME_LIST_CARD));
        let lastPlayedTurnPlayer = this.scene.gamePlayers.findPlayer(this.board.turnAdapter.lastPlayedTurn);

        if (!lastPlayedTurnPlayer || eatenCard.isEmpty()) {
            return;
        }

        let playedCardLength = this.renderer.playedCardList.cards.length;
        let eatenCardList = this.isItMe() ? this.renderer.cardList : this.renderer.eatenCardList;
        eatenCardList.transferFrom(lastPlayedTurnPlayer.renderer.playedCardList, [eatenCard], {reverse: true, cb: (cards) => {
            cards && cards.forEach(card => PhomUtils.setEaten(card));

            if (this.isItMe()) {
                this._processAfterEatOrTake(true);
            }
        }});

        this.board.swapPlayedCards();
        this.eatenCards.push(eatenCard);

        if (playedCardLength == 3) {
            this.renderer.showAnChot();
        }

        // TODO play sound eat
        app.system.audioManager.play(app.system.audioManager.PHOM_AN_QUAN);
    }

    _processAfterEatOrTake(eatCard = false) {
        this.renderer.cardList.cleanHighlight()

        eatCard && this.setSortCardSolution(PhomUtils.SORT_HAND_CARD_BY_PHOM_SOLUTION)

        this.tempHoUPhoms = null;
        let currentPhomList = PhomUtils.findBestPhomList(this.renderer.cardList.cards);

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
                this.renderer.cardList.setSelecteds(currentPhomCards, true);
                this.renderer.cardList.setHighlight(currentPhomCards);
                this.setState(PlayerPhom.STATE_PHOM_PLAY_HO_U);
            }
            else {
                this.setState(PlayerPhom.STATE_PHOM_PLAY);
            }
        }

        this._isPlayImmediateAfterTakeCard = false
    }

    _isEmptyEatenCards() {
        return this.isItMe() ? this.handCards.filter(card => PhomUtils.isEaten(card)) == 0 : this.renderer.eatenCardList.cards.length == 0;
    }

    _processDownPhomPhase(allCard) {
        let processCards = allCard ? [...this.renderer.cardList.cards] : [...this.renderer.cardList.getSelectedCards()];

        this.renderer.cardList.cleanCardGroup();
        this.currentHaPhomSolutions = PhomGenerator.generatePhomContainEatenCards(processCards, this.eatenCards);

        if (this.currentHaPhomSolutions.length == 0) {
            if (allCard) {
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

        if (this.haPhomSolutionId >= this.currentHaPhomSolutions.length) {
            this.haPhomSolutionId = 0;
        }

        this.renderer.cardList.clean();

        if (this.currentHaPhomSolutions.length == 0 && this.haPhomSolutionId >= this.currentHaPhomSolutions.length) {
            return;
        }

        this.renderer.cardList.finishAllCardActions()
        let currentPhomList = this.currentHaPhomSolutions[this.haPhomSolutionId];
        currentPhomList.forEach((phom, i) => {
            phom.cards.forEach(card => {
                card.setGroup(i);
                card.setSelected(true, true, true);
                card.setHighlight(true);
            });
        });
    }

    _processJoinPhomPhase(isAllCard) {

        this.setState(PlayerPhom.STATE_PHOM_JOIN);

        let processCards = isAllCard ? [...this.renderer.cardList.cards] : [...this.getSelectedCards()];

        // this.board.deHighLightPhomList();

        this.currentGuiPhomSolutions = PhomUtils.getJoinPhomSolutions(this.board.getAllBoardPhomList().filter(phom => phom.owner != this.id), processCards);

        if (this.currentGuiPhomSolutions.length == 0) {
            if (isAllCard) {
                this.setState(PlayerPhom.STATE_PHOM_PLAY);
            } else {
                this._setJoinPhomPhraseState(PlayerPhom.STATE_DOWN_JOIN_PHASE_SKIP);
            }
        } else {
            if (this.renderer.cardList.cards.length >= 9) {
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

    _changeGuiPhomSolution(guiPhomSolutionId = 0) {
        this.guiPhomSolutionId = guiPhomSolutionId;
        if (this.guiPhomSolutionId >= this.currentGuiPhomSolutions.length) {
            this.guiPhomSolutionId = 0;
        }

        if (this.currentGuiPhomSolutions.length == 0 && this.guiPhomSolutionId >= this.currentGuiPhomSolutions.length) {
            return;
        }

        this.board.deHighLightPhomList();
        this.isItMe() && this.renderer.cardList.clean();

        this.renderer.cardList.finishAllCardActions();
        let currentGuiSolution = this.currentGuiPhomSolutions[this.guiPhomSolutionId];
        currentGuiSolution.forEach((node, k) => {
            let nodeCard = node.card;
            nodeCard.setHighlight(true);
            nodeCard.setSelected(true, true, true);
        });
    }

    _handlePlayerDownCard(playerId, data) {

        if (this.id != playerId) return;

        let phomDataSize = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE);
        let phomData = utils.getValue(data, Keywords.GAME_LIST_CARD);

        let dataIndex = 0;
        let playerPhomList = new PhomList();
        phomDataSize.forEach((size, i) => {
            let phom = new Phom(GameUtils.convertBytesToCards(phomData.slice(dataIndex, dataIndex + size))).sortAsc();

            dataIndex += size;
            phom.setOwner(this.id);

            playerPhomList.add(phom);
        });
        this.renderer.downPhom(playerPhomList, this);
        this.eatenCards.length = 0;
        this.renderer.eatenCardList.clear();
        this.board.allPhomList.push(...playerPhomList);

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

    _handlePlayerHelpCard(playerId, data) {
        
        if (playerId != this.id) return;

        let phomIndexToJoinCardMap = {}
        let joinPhomDataArr = utils.getValue(data, "joinPhoms");

        joinPhomDataArr && joinPhomDataArr.forEach(joinPhomData => {
            let phomCardBytes = joinPhomData.phomCards;
            let joinCardBytes = joinPhomData.joinCards;
            let phomOwnerId = joinPhomData.ownerId;

            let phom = new Phom(GameUtils.convertBytesToCards(phomCardBytes)).sortAsc();
            let index = ArrayUtils.findIndex(this.board.getAllBoardPhomList(), phom);

            if(index >= 0){
                !phomIndexToJoinCardMap[index] && (phomIndexToJoinCardMap[index] = []);
                joinCardBytes && phomIndexToJoinCardMap[index].push(...GameUtils.convertBytesToCards(joinCardBytes));
            }
        })
        
        Object.keys(phomIndexToJoinCardMap).forEach(phomIndex => {
            let phomJoinCards = phomIndexToJoinCardMap[phomIndex]
            let joinPhomComponent = this.board.allPhomList[phomIndex].renderComponent;

            if(joinPhomComponent && phomJoinCards.length > 0){
                let addedCards;
                if (this.isItMe()) {
                    if (joinPhomComponent) {
                        addedCards = this.renderer.cardList.transferTo(joinPhomComponent, phomJoinCards, () => this._sortCardList(joinPhomComponent))
                    } else {
                        addedCards = this.renderer.cardList.removeCards(phomJoinCards)
                    }
                } else {
                    if (joinPhomComponent) {
                        addedCards = joinPhomComponent.transferFrom(this.renderer.cardList, phomJoinCards, () => this._sortCardList(joinPhomComponent))
                    }
                }
            }
        })

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

    _onPlayTurn() {
        if (!this.isItMe()) {
            return;
        }

        let cards = this.getSelectedCards();
        if (PhomUtils.checkPlayCard(cards, this.handCards)) {
            this.turnAdapter.playTurn(cards);
        }
    }

    getSelectedCards() {
        return this.renderer.cardList.getSelectedCards();
    }

    setPlayedCards(cards) {
        this.renderer.playedCardList.setCards(cards);
    }

    setEatenCards(cards = []) {
        if(!this.isItMe()){
            this.renderer.eatenCardList.setCards(cards);
            this.renderer.eatenCardList.cards.forEach(card => PhomUtils.setEaten(card))
        }

        this.eatenCards.push(...cards)
    }

    _onPlayerEatCard(player, checked = false) {

        if(!checked && (!player || !player.isPlaying()) ) return;

        let eatable;
        let selectedCards = player.getSelectedCards();

        if(selectedCards.length == 0){
            let eatableCards = PhomUtils.findBestEatableCards(player.renderer.cardList.cards, player.eatenCards, player.board.lastPlayedCard);
            if(eatableCards.length > 0){
                eatable = true;
            }else{
                app.system.showToast(app.res.string('game_phom_not_found_eat_card'));
            }
        }else{
            eatable = PhomUtils.checkEatPhom(player.getSelectedCards(), this.board.lastPlayedCard, player);
            if(!eatable){
                app.system.showToast(app.res.string('game_phom_cannot_eat'));
            }
        }

        if(eatable){
            app.service.send({cmd: Commands.PLAYER_EAT_CARD, data: {}, room: player.scene.room});
            player.setState(PlayerPhom.STATE_ACTION_WAIT);
        }
    }

    _onEatCard() {
        /**
         * TODO
         * - Valid eat phom
         * - play sound if invalid
         */
        if(!this.isItMe()) return;

        this._onPlayerEatCard(this, true);

        // let eatable;
        // let selectedCards = this.getSelectedCards();
        // if(selectedCards.length == 0){
        //     let eatableCards = PhomUtils.findBestEatableCards(this.renderer.cardList.cards, this.eatenCards, this.board.lastPlayedCard);
        //     if(eatableCards.length > 0){
        //         eatable = true;
        //     }else{
        //         app.system.showToast(app.res.string('game_phom_not_found_eat_card'));
        //     }
        // }else{
        //     eatable = PhomUtils.checkEatPhom(this.getSelectedCards(), this.board.lastPlayedCard, this);
        //     if(!eatable){
        //         app.system.showToast(app.res.string('game_phom_cannot_eat'));
        //     }
        // }
        //
        // if(eatable){
        //     app.service.send({cmd: Commands.PLAYER_EAT_CARD, data: {}, room: this.scene.room});
        //     this.setState(PlayerPhom.STATE_ACTION_WAIT);
        // }
    }

    _onTakeCard() {
        if(!this.isItMe()) return;

        app.service.send({cmd: Commands.PLAYER_TAKE_CARD, data: {}, room: this.scene.room});
        this.setState(PlayerPhom.STATE_ACTION_WAIT);
    }

    _sortCardList(cardList){
        if(cardList){
            PhomUtils.sortAsc(cardList.cards);
            cardList.cleanHighlight();
            cardList.onCardsChanged();
        }
    }

    _onSortCards() {

        if (this.isItMe()) {

            PhomUtils.sortPhomCardSingleSolution(this.renderer.cardList.cards);
            this.renderer.cardList.cleanHighlight();
            this.renderer.cardList.onCardsChanged(true);

            // if(this.sortCardSolutionIndex == PhomUtils.SORT_HAND_CARD_BY_PHOM_SOLUTION){
            //     PhomUtils.sortAsc(this.renderer.cardList.cards, PhomUtils.SORT_HAND_CARD_BY_PHOM_SOLUTION);
            // }else if(this.sortCardSolutionIndex == PhomUtils.SORT_HAND_CARD_BY_RANK){
            //     PhomUtils.sortAsc(this.renderer.cardList.cards, PhomUtils.SORT_HAND_CARD_BY_RANK);
            // } else{
            //     PhomUtils.sortAsc(this.renderer.cardList.cards, PhomUtils.SORT_HAND_CARD_BY_SUIT);
            // }
            //
            // this.renderer.cardList.cleanHighlight();
            // this._updateSortCardSolutionIndex();
            // this.renderer.cardList.onCardsChanged(true);
        }
    }

    setSortCardSolution(sortSolution = 1){
        this.sortCardSolutionIndex = sortSolution;
        this._onSortCards()
    }

    _updateSortCardSolutionIndex() {
        if (++this.sortCardSolutionIndex > PhomUtils.SORT_HAND_CARD_BY_SUIT) {
            this.sortCardSolutionIndex = PhomUtils.SORT_HAND_CARD_BY_PHOM_SOLUTION;
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
        super.onEnable(this.node.getComponent('PlayerPhomRenderer'));

        if (this.isItMe()) {
            this.renderer.setSelectCardChangeListener(this._onSelectedCardsChanged.bind(this));
        }

        this.renderer.setOnClickPlayedCardListener((card) => {
            if(card.equals(this.board.lastPlayedCard)){
                this._onEatCard();
            }
        });
    }

    isSelectSingleCard(){
        return this.state === PlayerPhom.STATE_PHOM_PLAY;
    }

    _onSelectedCardsChanged(selectedCards){
        switch (this.state) {
            case PlayerPhom.STATE_PHOM_PLAY:
                //let playable = PhomUtils.checkPlayCard([...selectedCards], this.handCards);
                //this.scene.emit(Events.SET_INTERACTABLE_PLAY_CONTROL, playable);
                break;
            case PlayerPhom.STATE_PHOM_DOWN:
                let downable = PhomUtils.checkDownPhom([...selectedCards], this);
                //this.scene.emit(Events.SET_INTERACTABLE_HA_PHOM_CONTROL, downable);

                if (downable) {
                    this.renderer.cardList.setHighlight(selectedCards);
                } else {
                    this.renderer.cardList.cleanHighlight();
                }
                break;
            case PlayerPhom.STATE_PHOM_EAT_TAKE:
                let eatable = PhomUtils.checkEatPhom([...selectedCards], this.board.lastPlayedCard, this);
                //this.scene.emit(Events.SET_INTERACTABLE_EAT_CONTROL, eatable);

                if (eatable) {
                    this.renderer.cardList.setHighlight(selectedCards);
                    this.board.lastPlayedCard && this.board.lastPlayedCard.setVisibleTapHighlightNode(true, () => this._onPlayerEatCard(this.scene.gamePlayers.me))
                } else {
                    this.renderer.cardList.cleanHighlight();
                    this.board.lastPlayedCard && this.board.lastPlayedCard.setVisibleTapHighlightNode(false)
                }
                break;
            case PlayerPhom.STATE_PHOM_PLAY_HO_U:
                if (this.tempHoUPhoms) {
                    let phomCards = this.tempHoUPhoms.getCards();
                    this.renderer.cardList.setSelecteds(phomCards, true);
                    this.renderer.cardList.setHighlight(phomCards);
                }
                break;
            case PlayerPhom.STATE_PHOM_JOIN:
                let joinable = PhomUtils.checkGuiPhom([...this.board.getAllBoardPhomList()], this);
                //this.scene.emit(Events.SET_INTERACTABLE_JOIN_PHOM_CONTROL, joinable);
                if (joinable) {
                    this.renderer.cardList.setHighlight(this.getSelectedCards());
                } else {
                    this.renderer.cardList.cleanHighlight();
                }
                break;
        }
    }

    onGamePlaying(data, isJustJoined) {
        super.onGamePlaying(data, isJustJoined);

        // if(!ArrayUtils.isEmpty(this.scene.board.meDealCards)){
        //     this.setMeDealCards();
        //     this.scene.board.onDoneDealCards()
        // }

        if (this.scene.gameState == PlayerPhom.STATE_PHOM_PLAY) {
            this.turnPharse = PlayerPhom.TURN_PHRASE_PLAY_CARD
        } else if (this.scene.gameState == PlayerPhom.STATE_PHOM_EAT_TAKE) {
            this.turnPharse = PlayerPhom.TURN_PHRASE_TAKE_OR_EAT_CARD
        } else {
            this.turnPharse = 0;
        }

        if(this.isItMe()){
            let nextTurnPlayerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);
            if (nextTurnPlayerId === this.id) {
                this.setState(PlayerPhom.STATE_PHOM_PLAY);
            }
        }else{
            this.renderer.cardList.clear();
        }
    }

    onGameEnding(data) {
        super.onGameEnding(data);
        // /this.renderer.cleanPlayerCards()
    }

    showEndGameInfo({text = null, balanceChanged = NaN, info = "", cards = [], isWinner = false, point = 0} = {}){
        if(!this.isItMe()){
            this.renderer.showDownCards(cards, info);
        }
        
        this.playSoundBaseOnBalanceChanged(balanceChanged);
        this.renderer.showEndGameCardInfo(info)
        this.renderer.showPlayerWinLoseInfo(text, isWinner)
        this.renderer.startPlusBalanceAnimation(balanceChanged);
        this.renderer.playedCardList.disableAllCard();
    }
}

PlayerPhom.TURN_PHRASE_TAKE_OR_EAT_CARD = 1;
PlayerPhom.TURN_PHRASE_PLAY_CARD = 2;
PlayerPhom.SORT_CARD_SOLUTION_MAX = 6;
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

PlayerPhom.DEFAULT_HAND_CARD_COUNT = 9


app.createComponent(PlayerPhom);
