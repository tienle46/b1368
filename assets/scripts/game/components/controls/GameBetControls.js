/**
 * Created by Thanh on 9/19/2016.
 */

import utils from 'utils';
import app from 'app';
import Events from 'Events';
import GameControls from 'GameControls';
import BetChipAnim from 'BetChipAnim';

export default class GameBetControls extends GameControls {
    constructor() {
        super();

        this.properties = this.assignProperties({
            baseControlsNode: cc.Node,
            betOptionsGroupNode: cc.Node,
            btnGroupNode: cc.Node,
            betContainerNode: cc.Node,
            dealer: cc.Node,
            receiveChipDestinationNode: cc.Node,
            reBetBtn: cc.Button
        });

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
        this.isInCancelPhase = false;
        this.xocDiaAnim = null;
        
        this.BET_COINTAINER_BUTTON_COMPONENT = 'BetContainerButton';
        this.BET_OPTION_GROUP_COMPONENT = 'BetOptionsGroup';
    }

    onEnable() {
        this.betData = [];
        this.previousBetData = [];
        this.isInCancelPhase = false;
        this.xocDiaAnim = null;
        
        this.baseControls = this.baseControlsNode.getComponent('BaseControls');
        /**
         * @type {BetOptionsGroup}
         */
        this.betOptionsGroup = this.betOptionsGroupNode.getComponent(this.BET_OPTION_GROUP_COMPONENT );
        this.betContainerButton = this.betContainerNode.getComponent(this.BET_COINTAINER_BUTTON_COMPONENT);
        this._setRebetBtnState(false);

        super.onEnable();        
        this.xocDiaAnim = new BetChipAnim(app.system.currentScene, this.betContainerButton.getBetTypeIdToNameMap());

        this.scene.on(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
        this.scene.on(Events.ON_GAME_STATE_STARTING, this._onGameStarting, this);
        this.scene.on(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
        this.scene.on(Events.ON_GAME_STATE, this._onGameState, this);

        this.scene.on(Events.ON_GAME_STATE_ENDING, this._onGameEnding, this);

        this.scene.on(Events.SHOW_GAME_BEGIN_CONTROLS, this._showGameBeginControls, this);
        this.scene.on(Events.HIDE_ALL_CONTROLS, this.hideAllControls, this);

        this.scene.on(Events.XOCDIA_ON_PLAYER_TOSSCHIP_ANIMATION, this._onPlayerTossChip, this);
        this.scene.on(Events.XOCDIA_ON_PLAYER_CANCEL_BET_SUCCESS, this._onPlayerCancelBetSuccess, this);
        this.scene.on(Events.XOCDIA_ON_PLAYER_RECEIVE_CHIP_ANIMATION, this._onPlayerReceiveChip, this);
    }

    onDestroy() {
        super.onDestroy();

        this.scene.off(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
        this.scene.off(Events.ON_GAME_STATE_STARTING, this._onGameStarting, this);
        this.scene.off(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
        this.scene.off(Events.ON_GAME_STATE, this._onGameState, this);
        this.scene.off(Events.ON_GAME_STATE_ENDING, this._onGameEnding, this);
        this.scene.off(Events.SHOW_GAME_BEGIN_CONTROLS, this._showGameBeginControls, this);
        this.scene.off(Events.HIDE_ALL_CONTROLS, this.hideAllControls, this);
        this.scene.off(Events.XOCDIA_ON_PLAYER_TOSSCHIP_ANIMATION, this._onPlayerTossChip, this);
        this.scene.off(Events.XOCDIA_ON_PLAYER_CANCEL_BET_SUCCESS, this._onPlayerCancelBetSuccess, this);
        this.scene.off(Events.XOCDIA_ON_PLAYER_RECEIVE_CHIP_ANIMATION, this._onPlayerReceiveChip, this);
        
        this.betData = [];
        this.previousBetData = [];
        this.isInCancelPhase = false;
        this.xocDiaAnim = null;
    }

    _showGameControls() {
        this.hideAllControls();
        this.setVisible(this.betContainerNode);

        if (this.scene.gamePlayers.isMePlaying()) {
            this.setVisible(this.betOptionsGroupNode);
            this.setVisible(this.btnGroupNode);
        }
    }

    onBetBtnClick(event) {
        let chipOptionsNode = this.betOptionsGroup.getCheckedItem();
        if (chipOptionsNode) {
            let amount = chipOptionsNode.getComponent('BetChip').getChipAmount();

            if (app.context.getMeBalance() - this._getTotalGoldUserBettedInBoard() < 0) {
                app.system.error('Không đủ chip để tiếp tục cược !');
                return;
            }
            this._setRebetBtnState(this.previousBetData.length > 0);

            let betTypeId = event.currentTarget.id;

            this.isInCancelPhase = false;

            // sent bet request
            let bet = {};
            bet[app.keywords.XOCDIA_BET.AMOUNT] = Number(amount);
            bet[app.keywords.XOCDIA_BET.TYPE] = betTypeId;

            this._sendBetRequest(bet);
        }
    }

    onX2BtnClick(event) {
        if (app.context.getMeBalance() - 2 * this._getTotalGoldUserBettedInBoard() < 0) {
            app.system.showToast(app.res.string('is_not_enough_money_to_bet'));
            return;
        }

        if (this.betData.length > 0) {
            this._setRebetBtnState(true);
            
            this.isInCancelPhase = false;
            let data = this.betData;
            this._sendBetRequest(data);
        }
    }

    onReBetBtnClick() {
        if (app.context.getMeBalance() - this._getPreviousUserGold() < 0) {
            app.system.showToast(app.res.string('is_not_enough_money_to_bet'));
            return;
        }

        this.isInCancelPhase = false;
        if (this.previousBetData.length > 0) {
            this._sendBetRequest(this.previousBetData, true);
            this._setRebetBtnState(false);
        }
    }
    
    initBoard(bets = [], playerIds = []) {
        bets.forEach((bet, index) => {
            for(let typeId in bet) {
                let amount = bet[typeId];
                let toNode = this.betContainerButton.getBetTypeByTypeId(typeId);
                let chip = this.betOptionsGroup.getChipByAmount(amount);
                let isItMe = this.scene.gamePlayers.isItMe(playerIds[index]);
                this._updateGoldAmountOnControl(typeId,amount, isItMe, false, false);
                
                let betIndex = this.betOptionsGroup.getChipIndexByAmount(amount, this.scene.board.minBet);
                let chipDisplayPoint = this.xocDiaAnim.getRealEndPoint(toNode);
                this.xocDiaAnim.addChip(toNode, chip, playerIds[index], typeId, betIndex, chipDisplayPoint);
            }
        })    
    }
    
    onCancelBetBtnClick() {
        let [data] = [{}];

        let sendObject = {
            cmd: app.commands.XOCDIA_CANCEL_BET,
            room: this.scene.room
        };
        app.service.send(sendObject);
    }
    
    /**
     * 
     * @param {Array} bet [{b,bo}, {b,bo}]
     * 
     * @memberof XocDiaControls 
     */
    _groupBetByType(array) {
        let groupObject = array.reduce((obj, bet) => {
            obj[bet.bo] = obj[bet.bo] || 0;
            obj[bet.bo] += Number(bet.b);
            return obj;
        }, {}); // => {boID1: number, boID2: number}
        
        let result = [];
        for(let key in groupObject) {
            result.push({bo: key, b: groupObject[key]});
        }
        return result;    
    }
    
    /**
     * 
     * @param {any} initArray []
     * @param {any} element {}
     * 
     * @memberof XocDiaControls
     */
    _addBetDataToArray(initArray, element, isReplace) {
        if(utils.isArray(element)) {
            initArray = isReplace ? [...element] : [...initArray, ...element];
            
            return this._groupBetByType(initArray);
        } else {
            initArray = this._groupBetByType(initArray);
            
            
            return initArray.map((initData, index) => {
            
                if(initData.bo === element.bo)
                        if(isReplace)
                            initData.b -= Number(element.b);
                        else 
                            initData.b += Number(element.b);
                            
                return initData 
            });
        }
    }
    
    _sendBetRequest(bet, isReplace) {
        let data = {};
        let b = null;
        if (utils.isArray(bet)) {
            b = bet;
        } else {
            b = [bet];
        }

        data[app.keywords.XOCDIA_BET.REQUEST.BET_LIST] = b;
        isReplace && (data[app.keywords.XOCDIA_BET.REQUEST.IS_REPLACE] = true);

        let sendObject = {
            cmd: app.commands.XOCDIA_BET,
            data,
            room: this.scene.room
        };
        app.service.send(sendObject);
    }

    _onPlayerTossChip(data) {
        let {
            betsList,
            myPos,
            isItMe,
            isReplace,
            playerId,
            prevList
        } = data;
        if (isReplace) {
            this._clearUserGoldAmountOnControl(isItMe, prevList, playerId);
        }
        if (isItMe) {
            isReplace && this.scene.setPlayerBalance(app.context.getMeBalance() - this._getPreviousUserGold());
            
            this.betData = this._addBetDataToArray(this.betData, betsList, isReplace);
        }
        
        let len = betsList.length;
        for (let i = 0; i < len; i++) {
            this._onTossChipAnim(betsList[i], myPos, isItMe, playerId, isReplace);
        }
    }

    /**
     * @param userPos: cc.v2
     * @param betData: {<betid1> : <amount>, <betid2> : <amount>}
     */
    _onPlayerReceiveChip(data) {
        let {
            userPos,
            playerId,
            betData,
            dots,
            isItMe
        } = data;
        let toPos = isItMe ? this.receiveChipDestinationNode.parent.convertToWorldSpaceAR(this.receiveChipDestinationNode.getPosition()) : userPos;

        for (let id in betData) {
            let isWinner = this.betContainerButton.doesBetTypeIdWin(Number(id), dots);
            if (!isWinner) {
                toPos = this.dealer.parent.convertToWorldSpaceAR(this.dealer.getPosition());
            }
            this.xocDiaAnim.receiveChip(toPos, playerId, id);
        }
    }

    _onTossChipAnim(data = {
        b: null,
        bo: null
    }, fromPos, isItMe, playerId, isReplace) {
        let amount = data[app.keywords.XOCDIA_BET.AMOUNT];
        let typeId = data[app.keywords.XOCDIA_BET.TYPE];

        if (data && utils.isNumber(amount) && utils.isNumber(typeId)) {
            let toNode = this.betContainerButton.getBetTypeByTypeId(typeId);
            let chip = this.betOptionsGroup.getChipByAmount(amount);
            // update gold
            this._updateGoldAmountOnControl(typeId, amount, isItMe, false, isReplace);

            if (isItMe && !isReplace) {
                this.scene.changePlayerBalance(-amount);
            }

            let betIndex = this.betOptionsGroup.getChipIndexByAmount(amount, this.scene.board.minBet);
            this.xocDiaAnim.tossChip(fromPos, toNode, chip, playerId, typeId, betIndex);
        }
    }

    /**
     * Get total gold user betted from board is started
     */
    _getTotalGoldUserBettedInBoard() {
        return this._getTotalGoldFromBetsData(this.betData);
    }

    // in previous game
    _getPreviousUserGold() {
        return this._getTotalGoldFromBetsData(this.previousBetData);
    }

    _getTotalGoldFromBetsData(betsList) {
        if (betsList.length == 0) return 0;
        // return betsList.length > 0 ? betsList.reduce((a, b) => (a.b + b.b)) : 0;
        let sum = 0;
        for (let i = 0; i < betsList.length; i++) {
            sum += Number(betsList[i].b) || Number(0);
        }

        return Number(sum);
    }

    _setRebetBtnState(state) {
        this.reBetBtn.interactable = state;
    }

    _updateGoldAmountOnControl(betTypeId, amount, isItMe, isMinus, isReplace) {
        let toNode = this.betContainerButton.getBetTypeByTypeId(betTypeId);
        let betTypeBtn = toNode.getComponent('BetTypeBtn');
        // control gold
        if (this.isInCancelPhase) {
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
        let {
            myPos,
            isItMe,
            betsList,
            playerId
        } = data;
        this.isInCancelPhase = true;

        if (isItMe) {
            this._resetBetData();
            this.scene.loadPlayerBalance();
            this._setRebetBtnState(this.previousBetData.length > 0);
        }

        this._clearUserGoldAmountOnControl(isItMe, betsList, playerId);
    }

    _clearUserGoldAmountOnControl(isItMe, betsList, playerId) {
        this.xocDiaAnim.clearPlayerChip(playerId);
        for (let i = 0; i < betsList.length; i++) {
            let betTypeId = betsList[i][app.keywords.XOCDIA_BET.TYPE];
            let amount = betsList[i][app.keywords.XOCDIA_BET.AMOUNT];
            this._updateGoldAmountOnControl(betTypeId, amount, isItMe, true, true);
        }
    }

    _showWaitTurnControls() {
        this.hideAllControls();
        this.cardTurnBaseControls._showWaitTurnControls();
    }

    _onGameBegin(data, isJustJoined) {
        this.betContainerButton.betable(false);
        this._resetBetData();
        this._setRebetBtnState(this.previousBetData.length > 0);
        this._resetBoardControlBtns();
        this.hideAllControls();
        this._showGameBeginControls();

        this.xocDiaAnim.clearAllChip();
    }

    _onGameStarting(data, isJustJoined) {
        debug('_onGameStarting', data, isJustJoined);
        // update betOptions lbls
        this._setBetOptionsLblsByRoomBet();
        // update usergold to controls
        this._hideGameBeginControls();
    }

    _onGamePlaying(data, isJustJoined) {
        debug('_onGamePlaying', data, isJustJoined);
        this._hideGameBeginControls();
    }

    _onGameEnding(data, isJustJoined) {
        debug('_onGameEnding data.b', data.b, this.previousBetData, this.betData);
        // save previous data before empty it 
        this.previousBetData = this.betData;

        this.isInCancelPhase = false;
        this._setRebetBtnState(true);
        this.betContainerButton.betable(false);
        
        this._resetBoardControlBtns();
        this._resetBetData();
        // this.hideAllControls();
    }

    hideAllControls() {
        this._hideGameBeginControls();

        this.setVisible(this.betContainerNode, true);
        this.hideBetControl();
    }

    hideBetControl() {
        this.setVisible(this.betOptionsGroupNode, false);
        this.setVisible(this.btnGroupNode, false);
    }

    _showGameBeginControls() {
        this.hideAllControls();
        if (this.scene.board.isBegin()) {
            // this.baseControls._showGameBeginControls();
        }
    }

    _onGameState(state, data, isJustJoined) {
        if (state === app.const.game.state.STATE_BET) {
            this.betContainerButton.betable(this.scene.gamePlayers.isMePlaying());
            this._resetBetData();
            this._showGameControls();
            
        } else if (state === app.const.game.state.READY) {
            this.hideBetControl();
            this.betContainerButton.betable(false);
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