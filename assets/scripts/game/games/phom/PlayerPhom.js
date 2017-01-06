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

    static get DEFAULT_HAND_CARD_COUNT() {
        return 9
    };

    static get DEFAULT_SORT_CARD_SOLUTION() {
        return
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
        this.scene.on(Events.ON_CLICK_SKIP_JOIN_PHOM_BUTTON, this._onSkipJoinPhom, this);
        this.scene.on(Events.ON_CLICK_CHANGE_PHOM_BUTTON, this._onChangePhom, this);
        this.scene.on(Events.ON_CLICK_U_BUTTON, this._onUPhom, this);
        this.scene.on(Events.ON_CLICK_DOI_U_TRON_BUTTON, this._onDoiUTron, this);

        this.scene.on(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount, this);

        this.scene.on(Events.HANDLE_PLAYER_TAKE_CARD, this._handlePlayerTakeCard, this);
        this.scene.on(Events.HANDLE_PLAYER_EAT_CARD, this._handlePlayerEatCard, this);
        this.scene.on(Events.HANDLE_PLAYER_DOWN_CARD, this._handlePlayerDownCard, this);
        this.scene.on(Events.HANDLE_PLAYER_HELP_CARD, this._handlePlayerHelpCard, this);
        this.scene.on(Events.HANDLE_PLAYER_LEAVE_BOARD, this._handlePlayerLeaveBoard, this);
        this.scene.on(Events.ON_PLAYER_TURN, this._onPlayerTurn, this);

        this.scene.on(Events.SHOW_PHOM_HIGHLIGHT, this._setPhomHighlight, this);

        // this.scene.on(Events.ON_PLAYER_PLAYED_CARDS, this._onPlayerPlayedCards, this);

        console.log("add game phom listener: ");
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

        this.scene.off(Events.SHOW_PHOM_HIGHLIGHT, this._setPhomHighlight, this);

        // this.scene.off(Events.ON_PLAYER_PLAYED_CARDS, this._onPlayerPlayedCards, this);
    }

    _setPhomHighlight(phom, highlight) {
        if (!this.isItMe()) {
            this.renderer.setHighlightPhom(phom, highlight);
        }
    }

    _onUPhom(){
        this.sendUCommand(this.tempHoUPhoms);
    }

    _onDoiUtron(){
        this.renderer.cardList.cleanHighlight();
        this.setState(PlayerPhom.STATE_PHOM_PLAY);
    }

    _onDownPhom() {
        if (!this.isItMe()) return;

        let {valid, downPhomList} = PhomUtils.validateDownPhom(this.getSelectedCards(), this);
        if (!valid) {
            //TODO Play invalid
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

        this.setState(PlayerPhom.STATE_PHOM_PLAY);

        this.renderer.cardList.cleanSelectedCard();
        this.board.deHighLightPhomList();
    }

    _onJoinPhom() {
        if (!this.isItMe()) return;

        let {valid, guiSolution} = PhomUtils.validateGuiPhom(this.getSelectedCards(), this);

        if (!valid) {
            //TODO play show invalid
            return;
        }

        let phomList = guiSolution.getPhomList(this.board.allPhomList);

        let jc = [];
        let ji = [];
        let pl = phomList.map(phom => phom.owner);

        guiSolution.forEach((node, i) => {
            let phom = this.board.allPhomList[node.phomId];
            jc[i] = node.card.byteValue;
            ji[i] = ArrayUtils.findIndex(phomList, phom);
        });

        app.service.send({
            cmd: Commands.PLAYER_HELP_CARD,
            data: {
                [Keywords.GAME_LIST_PLAYER_CARDS_SIZE]: phomList.getPhomLengths(),
                [Keywords.GAME_LIST_CARD]: phomList.toBytes(),
                [Keywords.GAME_LIST_JOIN_CARD]: jc,
                [Keywords.GAME_LIST_JOIN_CARD_TO_PHOM_ID]: ji,
                [Keywords.GAME_LIST_PLAYER]: pl
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
                card.equals(eatCard) && PhomUtils.setEaten(card, true);
            });
        });

        if (!this.turnAdapter.isTurn()) return;

        let doneActionsInTurn = utils.getValue(data, Keywords.GAME_LIST_DONE_ACTION_WHEN_REJOIN);
        if (doneActionsInTurn) {

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
                this._processJoinPhomPhase(true);
            } else if (isAnOrBoc) {
                this._processAfterEatOrTake();
            }
        }
    }

    setState(state) {
        this.state = state;

        switch (state) {
            case PlayerPhom.STATE_PHOM_PLAY:
                this.scene && this.scene.emit(Events.SHOW_PLAY_CONTROL_ONLY);
                this._checkInteractableOnStateChanged();
                break;
            case PlayerPhom.STATE_PHOM_JOIN:
                this.scene && this.scene.emit(Events.SHOW_JOIN_PHOM_CONTROLS);
                break;
            case PlayerPhom.STATE_PHOM_EAT_TAKE:
                this.scene && this.scene.emit(Events.SHOW_EAT_AND_TAKE_CONTROLS);
                this._checkInteractableOnStateChanged();
                break;
            case PlayerPhom.STATE_PHOM_DOWN:
                this.scene && this.scene.emit(Events.SHOW_DOWN_PHOM_CONTROLS);
                break;
            case PlayerPhom.STATE_PHOM_PLAY_HO_U:
                this.scene && this.scene.emit(Events.SHOW_U_PHOM_CONTROLS);
                break;
            default:
                this.scene && this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
        }
    }

    _onPlayerTurn(playerId) {

        if (this.id != playerId) return;

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
                this.renderer.cleanHighlightDownPhom();
            }
        }

        this.renderer.addPlayedCard(playedCards, srcCardList, isItMe);
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
     * TODO: Play sound on take card
     *
     * @param data
     * @private
     */
    _handlePlayerTakeCard(playerId, data) {
        if (this.id != playerId) return;

        if (this.board.getTotalPlayedCardsSize() == 15) {
            this.board.renderer.cleanDeckCards();
        }

        let card = this.isItMe() ? Card.from(utils.getValue(data, Keywords.GAME_LIST_CARD)) : Card.from(5);
        this.renderer.cardList.transferFrom(this.board.getDeckCards(), [card], {reverse: true, cb: () => {
            if (this.isItMe()) {
                this._processAfterEatOrTake();
            } else {
                this.renderer.cardList.clear();
            }
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
            this.board.swapPlayedCards();

            if (this.isItMe()) {
                this._processAfterEatOrTake();
            }
        }});


        if (playedCardLength == 3) {
            this.renderer.showAnChot();
        }

        // TODO play sound eat
    }

    _processAfterEatOrTake() {
        this.tempHoUPhoms = null;
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
                this.renderer.cardList.setSelecteds(currentPhomCards);
                this.renderer.cardList.setHighlight(currentPhomCards);
                this.setState(PlayerPhom.STATE_PHOM_PLAY_HO_U);
            }
            else {
                this.setState(PlayerPhom.STATE_PHOM_PLAY);
            }

            // this.sortCardSolutionIndex = PlayerPhom.DEFAULT_SORT_CARD_SOLUTION;
            // this._onSortCards();
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

        this.setState(PlayerPhom.STATE_PHOM_JOIN);

        let processCards = isAllCard ? [...this.renderer.cardList.cards] : [...this.getSelectedCards()];

        // this.board.deHighLightPhomList();

        this.currentGuiPhomSolutions = PhomUtils.getJoinPhomSolutions([...this.board.allPhomList], processCards);

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

    _changeGuiPhomSolution(guiPhomSolutionId) {
        this.guiPhomSolutionId = guiPhomSolutionId;

        if (this.guiPhomSolutionId >= this.currentGuiPhomSolutions.length) {
            this.guiPhomSolutionId = 0;
        }

        if (this.currentGuiPhomSolutions.length == 0 && this.guiPhomSolutionId >= this.currentGuiPhomSolutions.length) {
            return;
        }

        console.warn("down phom render on change gui: ", this.renderer._downPhomListComponent);

        this.board.deHighLightPhomList();
        this.isItMe() && this.renderer.cardList.clean();

        let currentGuiSolution = this.currentGuiPhomSolutions[this.guiPhomSolutionId];
        currentGuiSolution.forEach((node, k) => {
            let nodeCard = node.card;
            nodeCard.setHighlight(true);
            nodeCard.setSelected(true);
            // this.scene.emit(Events.SHOW_PHOM_HIGHLIGHT,  this.board.allPhomList[node.phomId]);
            // this.board.allPhomList[node.phomId].setHighlightAll(true);
        });

        console.warn("after phom render on change gui: ", this.renderer._downPhomListComponent);
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


        console.log("cllear on eatenCardList")

        this.renderer.eatenCardList.clear();

        this.renderer.downPhom(playerPhomList, this);
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

        let phomDataSize = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE);
        let phomData = utils.getValue(data, Keywords.GAME_LIST_CARD);
        let jc = utils.getValue(data, Keywords.GAME_LIST_JOIN_CARD);
        let ji = utils.getValue(data, Keywords.GAME_LIST_JOIN_CARD_TO_PHOM_ID);
        let pl = utils.getValue(data, Keywords.GAME_LIST_PLAYER);
        //
        let joinedPhomList = new PhomList();
        let dataIndex = 0;

        for (let i = 0; i < phomDataSize.length; i++) {
            let phomLength = phomDataSize[i];

            let phom = new Phom(GameUtils.convertBytesToCards(phomData.slice(dataIndex, dataIndex + phomLength))).sortAsc();
            dataIndex += phomLength;

            let index = ArrayUtils.findIndex(this.board.allPhomList, phom);

            joinedPhomList.push(index >= 0 ? this.board.allPhomList[index].renderComponent : null);
        }

        let joiningCards = GameUtils.convertBytesToCards(jc);
        for (let i = 0; i < joiningCards.length; i++) {
            let card = joiningCards[i];
            let joinPhom = joinedPhomList[i];

            if (this.isItMe()) {
                if (joinPhom) {
                    this.renderer.cardList.transferTo(joinPhom, [card], () => {
                        this._sortCardList(joinPhom);
                    });
                } else {
                    this.renderer.cardList.removeCards([card]);
                }
            } else {
                if (joinPhom) {
                    joinPhom.transferFrom(this.renderer.cardList, [card], () => {
                        this._sortCardList(joinPhom);
                    });
                }
            }
        }

        if (this.isItMe()) {
            this.setState(PlayerPhom.STATE_PHOM_PLAY);
        }

        // // TODO sound join phom
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

    _sortCardList(cardList){
        if(cardList){
            PhomUtils.sortAsc(cardList.cards);
            cardList.onCardsChanged();
        }
    }

    //TODO
    _onSortCards() {

        if (this.isItMe()) {
            if(this.sortCardSolutionIndex == PlayerPhom.SORT_CARD_BY_PHOM_SOLUTION){
                PhomUtils.sortAsc(this.renderer.cardList.cards, PhomUtils.SORT_BY_PHOM_SOLUTION);
            }else{
                PhomUtils.sortAsc(this.renderer.cardList.cards, PhomUtils.SORT_BY_PHOM_FIRST);
            }

            this._updateSortCardSolutionIndex();
            this.renderer.cardList.onCardsChanged(true);
        }
    }

    _updateSortCardSolutionIndex() {
        if (++this.sortCardSolutionIndex > PlayerPhom.SORT_CARD_SOLUTION_MAX) {
            this.sortCardSolutionIndex = 1;
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
    }

    _onSelectedCardsChanged(selectedCards){
        switch (this.state) {
            case PlayerPhom.STATE_PHOM_PLAY:
                let playable = PhomUtils.checkPlayCard([...selectedCards], this.handCards);
                this.scene.emit(Events.SET_INTERACTABLE_PLAY_CONTROL, playable);
                break;
            case PlayerPhom.STATE_PHOM_DOWN:
                let downable = PhomUtils.checkDownPhom([...selectedCards], this);
                this.scene.emit(Events.SET_INTERACTABLE_HA_PHOM_CONTROL, downable);
                if (downable) {
                    this.renderer.cardList.setHighlight(selectedCards);
                } else {
                    this.renderer.cardList.cleanHighlight();
                }
                break;
            case PlayerPhom.STATE_PHOM_EAT_TAKE:
                let eatable = PhomUtils.checkEatPhom([...selectedCards], this.board.lastPlayedCard, this);
                this.scene.emit(Events.SET_INTERACTABLE_EAT_CONTROL, eatable);

                if (eatable) {
                    this.renderer.cardList.setHighlight(selectedCards);
                } else {
                    this.renderer.cardList.cleanHighlight();
                }
                break;
            case PlayerPhom.STATE_PHOM_PLAY_HO_U:
                if (this.tempHoUPhoms) {
                    let phomCards = this.tempHoUPhoms.getCards();
                    this.renderer.cardList.setSelecteds(phomCards);
                    this.renderer.cardList.setHighlight(phomCards);
                }
                break;
        }
    }

    _checkInteractableOnStateChanged(){
        let selectedCards = this.getSelectedCards();
        switch (this.state) {
            case PlayerPhom.STATE_PHOM_PLAY:
                let playable = PhomUtils.checkPlayCard([...selectedCards], this.handCards);
                this.scene.emit(Events.SET_INTERACTABLE_PLAY_CONTROL, playable);
                break;
            case PlayerPhom.STATE_PHOM_DOWN:
                let downable = PhomUtils.checkDownPhom([...selectedCards], this);
                this.scene.emit(Events.SET_INTERACTABLE_HA_PHOM_CONTROL, downable);
                break;
            case PlayerPhom.STATE_PHOM_EAT_TAKE:
                let eatable = PhomUtils.checkEatPhom([...selectedCards], this.board.lastPlayedCard, this);
                this.scene.emit(Events.SET_INTERACTABLE_EAT_CONTROL, eatable);
                break;
        }
    }

    onGamePlaying(data, isJustJoined) {
        super.onGamePlaying(data, isJustJoined);

        !this.isItMe() && this.renderer.cardList.clear();

        if (this.scene.gameState == PlayerPhom.STATE_PHOM_PLAY) {
            this.turnPharse = PlayerPhom.TURN_PHRASE_PLAY_CARD
        } else if (this.scene.gameState == PlayerPhom.STATE_PHOM_EAT_TAKE) {
            this.turnPharse = PlayerPhom.TURN_PHRASE_TAKE_OR_EAT_CARD
        } else {
            this.turnPharse = 0;
        }
    }

    onGameEnding(data) {
        super.onGameEnding(data);
        this.renderer.playedCardList.clear();
    }
}

PlayerPhom.TURN_PHRASE_TAKE_OR_EAT_CARD = 1;
PlayerPhom.TURN_PHRASE_PLAY_CARD = 2;
PlayerPhom.SORT_CARD_SOLUTION_MAX = 2;
PlayerPhom.SORT_CARD_BY_PHOM_FIRST = 2;
PlayerPhom.SORT_CARD_BY_PHOM_SOLUTION = 1;
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
