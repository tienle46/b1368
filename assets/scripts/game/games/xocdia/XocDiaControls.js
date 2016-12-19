/**
 * Created by Thanh on 9/19/2016.
 */

import utils from 'utils';
import app from 'app';
import Events from 'Events';
import GameControls from 'GameControls';
import BaseControls from 'BaseControls';
import CardBetTurnControls from 'CardBetTurnControls';
import XocDiaAnim from 'XocDiaAnim';

export default class XocDiaControls extends GameControls {
    constructor() {
        super();


        this.properties = {
            ...this.properties,
            baseControlsNode: cc.Node,
            betOptionsGroupNode: cc.Node,
            btnGroupNode: cc.Node,
            betContainerNode: cc.Node,
            miniChip: cc.Prefab,
            dealer: cc.Node
        }

        /**
         * @type {BaseControls}
         */
        this.baseControls = null;
        /**
         * @type {CardBetTurnControls}
         */
        this.cardBetTurnControls = null;


        // used to save currently in-phase-betted data of this user, 
        // because client's connection will be occured while betting, 
        // it is more neccessary when save betData on its event emitter `XOCDIA_ON_PLAYER_BET`;
        this.betData = [];
        this.previousBetData = [];

        this.isInReBetPhase = false;
        this.isInCancelPhase = false;
        this.playerId = null; // used when get playerId from previous event
    }

    onEnable() {
        this.baseControls = this.baseControlsNode.getComponent('BaseControls');
        this.betOptionsGroup = this.betOptionsGroupNode.getComponent('BetOptionsGroup');
        this.betContainerButton = this.betContainerNode.getComponent('BetContainerButton');
        this.btnGroup = this.btnGroupNode.getComponent('betOptionsGroup');

        super.onEnable();

        this.scene.on(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
        this.scene.on(Events.ON_GAME_STATE_STARTING, this._onGameStarting, this);
        this.scene.on(Events.ON_GAME_STATE_STARTED, this._onGameStarted, this, 0);
        this.scene.on(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
        this.scene.on(Events.ON_GAME_STATE, this._onGameState, this);

        this.scene.on(Events.ON_GAME_STATE_ENDING, this._onGameEnding, this);

        this.scene.on(Events.SHOW_GAME_BEGIN_CONTROLS, this._showGameBeginControls, this);
        this.scene.on(Events.HIDE_ALL_CONTROLS, this.hideAllControls, this);

        this.scene.on(Events.XOCDIA_ON_PLAYER_TOSSCHIP_ANIMATION, this._onPlayerTossChip, this);
        this.scene.on(Events.XOCDIA_ON_PLAYER_BET, this._onPlayerBet, this, 0);
        this.scene.on(Events.XOCDIA_ON_PLAYER_CANCEL_BET_SUCCESS, this._onPlayerCancelBetSuccess, this);
        this.scene.on(Events.XOCDIA_ON_CONTROL_SAVE_PREVIOUS_BETDATA, this._onSavePreviousBetData, this);
        this.scene.on(Events.XOCDIA_ON_DISTRIBUTE_CHIP, this._onDistributeChip, this);
        this.scene.on(Events.XOCDIA_ON_PLAYER_RECEIVE_CHIP_ANIMATION, this._onPlayerReceiveChip, this);
    }

    onDestroy() {
        super.onDestroy();

        this.scene.off(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
        this.scene.off(Events.ON_GAME_STATE_STARTING, this._onGameStarting, this);
        this.scene.off(Events.ON_GAME_STATE_STARTED, this._onGameStarted, this, 0);
        this.scene.off(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
        this.scene.off(Events.ON_GAME_STATE, this._onGameState, this);

        this.scene.off(Events.ON_GAME_STATE_ENDING, this._onGameEnding, this);

        this.scene.off(Events.SHOW_GAME_BEGIN_CONTROLS, this._showGameBeginControls, this);
        this.scene.off(Events.HIDE_ALL_CONTROLS, this.hideAllControls, this);

        this.scene.off(Events.XOCDIA_ON_PLAYER_BET, this._onPlayerBet, this, 0);
        this.scene.off(Events.XOCDIA_ON_PLAYER_TOSSCHIP_ANIMATION, this._onPlayerTossChip, this);
        this.scene.off(Events.XOCDIA_ON_PLAYER_CANCEL_BET_SUCCESS, this._onPlayerCancelBetSuccess, this);
        this.scene.off(Events.XOCDIA_ON_DISTRIBUTE_CHIP, this._onDistributeChip, this);
        this.scene.off(Events.XOCDIA_ON_CONTROL_SAVE_PREVIOUS_BETDATA, this._onSavePreviousBetData, this);
    }

    _showGameControls() {
        this.hideAllControls();
        this.setVisible(this.betOptionsGroupNode);
        this.setVisible(this.btnGroupNode);
        this.setVisible(this.betContainerNode);
    }

    updateUserGoldLbl(amount) {
        this.betOptionsGroup.updateUserGoldLbl(amount);
    }

    _onSavePreviousBetData(previousBetData, playerIds) {
        let playerId = playerIds.find((id) => this.player === id);

        if (playerId && previousBetData && previousBetData.length > 0) {
            // dataObject : [<betType> : <gold amount>] -> [{1: 3},{2: 31}] 
            let dataObject = previousBetData[playerId - 1]; // cuz we are only have a limit number playerID in a room
            let dataArray = [];
            for (let key in dataObject) {
                // object : {b: <gold amount>, bo : <betType>}
                let object = {};
                object[app.keywords.XOCDIA_BET.AMOUNT] = dataObject[key];
                object[app.keywords.XOCDIA_BET.TYPE] = key;
                dataArray.push(object);
            }

            this.previousBetData = dataArray;
        }
    }

    onBetBtnClick(event) {
        let chipOptionsNode = this.betOptionsGroup.getCheckedItem();
        let chipInfo = chipOptionsNode.getComponent('BetChip').getChipInfo();
        let amount = chipInfo.amount
        let betTypeId = event.currentTarget.id;
        // let startPoint = chipOptionsNode.parent.convertToWorldSpaceAR(chipOptionsNode.getPosition());

        this.isInCancelPhase = false;

        // sent bet request
        let bet = {};
        bet[app.keywords.XOCDIA_BET.AMOUNT] = Number(chipInfo.amount);
        bet[app.keywords.XOCDIA_BET.TYPE] = betTypeId;

        this._sendBetRequest(bet);
    }

    _sendBetRequest(bet, isReplace) {
        let data = {};
        if (utils.isArray(bet)) {
            this.betData = bet;
        } else {
            this.betData.push(bet);
        }

        data[app.keywords.XOCDIA_BET.REQUEST.BET_LIST] = this.betData;
        isReplace && (data[app.keywords.XOCDIA_BET.REQUEST.IS_REPLACE] = true);

        let sendObject = {
            cmd: app.commands.XOCDIA_BET,
            data,
            room: this.scene.room
        };
        app.service.send(sendObject);
    }

    _onPlayerTossChip(data) {
        let { betsList, myPos, isItMe, playerId, isReplace } = data;
        playerId && isItMe && (this.playerId = playerId);

        if (!this.isInReBetPhase && isReplace && betsList.length > 0) {
            for (let i = 0; i < betsList.length; i++) {
                this._onTossChipAnim(list, myPos, isItMe);

                if (i == betsList.length - 1) {
                    this.isInReBetPhase = true;
                }
            }
        } else {
            let lastList = betsList.length && betsList[betsList.length - 1];
            this._onTossChipAnim(lastList, myPos, isItMe);
        }
    }

    _onDistributeChip(data) {
        let { playingPlayerIds, bets, playerResults, dots } = data;
        playerResults.forEach((result, index) => {
            if (result === 0) {
                let dataTypes = bets[index];
                let destination = this.dealer.parent.convertToWorldSpaceAR(this.dealer.getPosition());
                this._runDistributeChipsAnim(dataTypes, dots, destination);
            }
        });
    }

    /**
     * @param userPos: cc.v2
     * @param previousDataTypes: {<betid1> : <amount>, <betid2> : <amount>}
     */
    _onPlayerReceiveChip(data) {
        let { userPos, previousDataTypes, dots } = data;

        this._runDistributeChipsAnim(previousDataTypes, dots, userPos, true);
    }

    /**
     * @dataTypes: bets Object  {<betid1> : <amount>, <betid2> : <amount>}
     * @resultDots: Array result dots
     * @destination: cc.v2 -> endPoint where chip will be placed, if player lost chip, they will be flied to dealer position
     */
    _runDistributeChipsAnim(dataTypes, resultDots, destination, isWinner) {
        let dataDifferences = this._convertDataType(dataTypes, this.betContainerButton.isShakedDotsReturnEvenResult(resultDots), isWinner);
        let dealerPosition = this.dealer.parent.convertToWorldSpaceAR(this.dealer.getPosition());

        dataDifferences.forEach((type) => {
            let { id, amount } = type;
            let fromNode = this.betContainerButton.getBetTypeByTypeId(id);

            let chipInfo = this.betOptionsGroup.getChipInfoByAmount(Math.abs(amount), true);
            destination = amount > 0 ? destination : dealerPosition;

            XocDiaAnim.receiveChip(fromNode, destination, chipInfo);
        });
    }

    /**
     * @param typeObj  {<betid1> : <amount>, <betid2> : <amount>} => [{id: <typeId1>, amount: <amount>}]
     * @param isWinner boolean: if you're winner, need to check exactly bet type you earned and lost
     * @param isEven boolean : if true, betId == 1||3||4 will be positive, others will be negative
     */
    _convertDataType(types, isEven, isWinner = false) {
        console.debug('isEven', isEven);
        let rs = [];
        for (let id in types) {
            let amount = types[id];
            if (isWinner && (isEven && (id == 2 || id == 5 || id == 6)) || (!isEven && (id == 1 || id == 3 || id == 4))) {
                amount *= -1;
            }

            rs.push({ id, amount });
        }
        return rs;
    }

    _onTossChipAnim(data = { b: null, bo: null }, fromPos, isItMe) {
        let amount = data[app.keywords.XOCDIA_BET.AMOUNT];
        let typeId = data[app.keywords.XOCDIA_BET.TYPE];

        if (data && utils.isNumber(amount) && utils.isNumber(typeId)) {
            let toNode = this.betContainerButton.getBetTypeByTypeId(typeId);
            let chipInfo = this.betOptionsGroup.getChipInfoByAmount(amount, true);
            console.table(chipInfo)

            // update gold
            this._updateGoldAmountOnControl(typeId, amount, isItMe);
            // user gold
            this.betOptionsGroup.updateUserGoldLbl(this.betOptionsGroup.getCurrentUserGold() - amount);
            XocDiaAnim.tossChip(fromPos, toNode, chipInfo);
        }
    }

    _updateGoldAmountOnControl(betTypeId, amount, isItMe, isMinus) {
        let toNode = this.betContainerButton.getBetTypeByTypeId(betTypeId);
        let betTypeBtn = toNode.getComponent('BetTypeBtn');
        // control gold
        if (this.isInCancelPhase) {
            console.debug('isInCancelPhase', this.isInCancelPhase);
            betTypeBtn.updateLbls(amount, isMinus);
            this.isInCancelPhase = false;
        } else {
            if (isItMe) {
                betTypeBtn.updateLbls(amount, isMinus);
            } else {
                betTypeBtn.updateAllLbl(amount, isMinus);
            }
        }
    }

    _onPlayerCancelBetSuccess(data) {
        let { myPos, isItMe, betsList } = data;
        console.debug('_onPlayerCancelBetSuccess XocDiaControls.js > data', data);
        this.isInCancelPhase = true;
        this.isInReBetPhase && (this.isInReBetPhase = false);

        for (let i = 0; i < betsList.length; i++) {
            let betTypeId = betsList[i][app.keywords.XOCDIA_BET.TYPE];
            let amount = betsList[i][app.keywords.XOCDIA_BET.AMOUNT];
            console.debug('_onPlayerCancelBetSuccess XocDiaControls.js > amount', amount);
            this._updateGoldAmountOnControl(betTypeId, amount, isItMe, true);
        }
    }

    onReBetBtnClick() {
        this.isInCancelPhase = false;
        console.debug('WTF this.previousBetData', this.previousBetData);
        if (this.previousBetData.length > 0) {
            console.debug('CO CMNR', this.previousBetData);
            this._sendBetRequest(this.previousBetData, true);
        }
    }

    // // @type 1: Chẵn, 2: Lẻ, 3: 4 Đỏ, 4: 4 Đen, 5: 3 Đỏ 1 Đen, 6: 3 Đen 1 Đỏ
    // getBetTypePositionFromType(type) {
    //     switch (type) {}
    // }

    onCancelBetBtnClick() {
        let [data] = [{}];

        let sendObject = {
            cmd: app.commands.XOCDIA_CANCEL_BET,
            room: this.scene.room
        };
        console.debug(sendObject);
        app.service.send(sendObject);
    }

    _showWaitTurnControls() {
        this.hideAllControls();
        this.cardTurnBaseControls._showWaitTurnControls();
    }

    _onGameBegin(data, isJustJoined) {
        this._resetBetData();
        this._resetBoardControlBtns();
        this.hideAllControls();
        this._showGameBeginControls();
    }

    _onGameStarting(data, isJustJoined) {
        console.debug('_onGameStarting', data, isJustJoined);

        this._hideGameBeginControls();
    }

    _onGameStarted(data, isJustJoined) {
        console.debug('_onGameStarted', data, isJustJoined);
        // update betOptions lbls
        this._setBetOptionsLblsByRoomBet();

        this._hideGameBeginControls();
    }

    _onGamePlaying(data, isJustJoined) {
        console.debug('_onGamePlaying', data, isJustJoined);
        this._hideGameBeginControls();
    }

    _onGameEnding(data, isJustJoined) {
        console.debug('_onGameEnding', data, isJustJoined);
        // save previous data before empty it 
        this.previousBetData = this.betData;

        this._resetBoardControlBtns();
        this._resetBetData();
        // this.hideAllControls();
    }

    hideAllControls() {
        this._hideGameBeginControls();

        this.setVisible(this.betOptionsGroupNode, false);
        this.setVisible(this.btnGroupNode, false);
        this.setVisible(this.betContainerNode, true);
    }

    _showGameBeginControls() {
        this.hideAllControls();
        if (this.scene.board.isBegin()) {
            this.baseControls._showGameBeginControls();
        }
    }

    _onGameState(state, data, isJustJoined) {
        if (state === app.const.game.state.STATE_BET) {
            this._resetBetData();
            // all users are already
            this._showGameControls();

            this._setBetOptionsLblsByRoomBet();
        }
    }

    _setBetOptionsLblsByRoomBet() {
        this.betOptionsGroup.setLblOptions(this.scene.room.variables[app.keywords.ROOM_BET].value);
    }

    _hideGameBeginControls() {
        this.baseControls.hideAllControls();
    }

    _resetBetData() {
        this.betData = [];
    }

    _resetBoardControlBtns() {
        this.betContainerButton.resetBtns();
    }
}

app.createComponent(XocDiaControls);