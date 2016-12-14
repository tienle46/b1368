/**
 * Created by Thanh on 9/19/2016.
 */

import utils from 'utils';
import app from 'app';
import Events from 'Events';
import GameControls from 'GameControls';
import BaseControls from 'BaseControls';
import Keywords from 'Keywords'
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
            miniChip: cc.Prefab
        }

        /**
         * @type {BaseControls}
         */
        this.baseControls = null;
        /**
         * @type {CardBetTurnControls}
         */
        this.cardBetTurnControls = null;

        this.betData = [];
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
        this.scene.on('xocdia.on.player.cancelBet', this._onPlayerCancelBet, this);
        this.scene.on('xocdia.on.player.bet', this._onPlayerBet, this);
        this.scene.on('xocdia.on.player.tosschip', this._onPlayerTossChip, this);
        // this.scene.on(Events.SHOW_DOWN_CARD_CONTROLS, this._showDownCardControls, this);
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
        this.scene.off('xocdia.on.player.cancelBet', this._onPlayerCancelBet, this);
        this.scene.off('xocdia.on.player.bet', this._onPlayerBet, this);
        this.scene.off('xocdia.on.player.tosschip', this._onPlayerTossChip, this);
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

    onBetBtnClick(event) {
        let chipOptionsNode = this.betOptionsGroup.getCheckedItem();
        let chipInfo = chipOptionsNode.getComponent('BetChip').getChipInfo();
        let amount = chipInfo.amount
            // let startPoint = chipOptionsNode.parent.convertToWorldSpaceAR(chipOptionsNode.getPosition());
        let betTypeId = event.currentTarget.id;


        // // and node where chip would be tossed to
        // let toNode = event.currentTarget;
        // let toNodeSize = toNode.getContentSize();
        // let toNodePos = toNode.getPosition();
        // let amount = chipInfo.amount;

        // // 
        // this.toNode = toNode;
        // this.chipInfo = chipInfo;
        // console.debug('onBetBtnClick', toNode, chipInfo);


        // sent bet request
        let [data, bet] = [{}, {}];
        bet[app.keywords.XOCDIA_BET.AMOUNT] = Number(chipInfo.amount);
        bet[app.keywords.XOCDIA_BET.TYPE] = betTypeId;

        this.betData.push(bet);

        data[app.keywords.XOCDIA_BET.REQUEST.BET_LIST] = this.betData;
        let sendObject = {
            cmd: app.commands.XOCDIA_BET,
            data,
            room: this.scene.room
        };

        app.service.send(sendObject);
        // app.service.send(sendObject, this._onPlayerBet.bind(this));

        // XocDiaAnim.tossChip(startPoint, toNode, chipInfo, (() => {
        //     this.betOptionsGroup.updateUserGoldLbl(this.betOptionsGroup.getCurrentUserGold() - chipInfo.amount);
        // }).bind(this));

        // console.debug(fromNode);
        // console.debug(fromNode.getComponent('BetChip').getChipInfo());
    }

    /**
     * @param {any} data
     * 
     * {
     *  bl : bet list,
     *  s : success,
     *  p : player,
     *  errMsg 
     * }
     * 
     * @memberOf XocDiaControls
     */
    _onPlayerBet(data) {
        let { playerId, betsList, isSuccess, err } = data;
        if (isSuccess) {
            // re-assigned bet data
            this.betData = betsList;

            // update gold
            this.betOptionsGroup.updateUserGoldLbl(app.context.getMyInfo().coin);
        } else {
            app.system.error(err);
        }
    }

    _onPlayerTossChip(data) {
        console.debug(data);
        let { betsList, myPos } = data;
        let lastList = betsList[betsList.length - 1];
        if (lastList[app.keywords.XOCDIA_BET.AMOUNT] && lastList[app.keywords.XOCDIA_BET.TYPE]) {
            let toNode = this.betContainerButton.getBetTypeByTypeId(lastList[app.keywords.XOCDIA_BET.TYPE]);
            let chipInfo = this.betOptionsGroup.getChipInfoByAmount(lastList[app.keywords.XOCDIA_BET.AMOUNT]);
            XocDiaAnim.tossChip(myPos, toNode, chipInfo);
        }
    }

    _onPlayerCancelBet(data) {
        console.debug('_onPlayerCancelBet XocDiaControls', data);
    }

    // // @type 1: Chẵn, 2: Lẻ, 3: 4 Đỏ, 4: 4 Đen, 5: 3 Đỏ 1 Đen, 6: 3 Đen 1 Đỏ
    // getBetTypePositionFromType(type) {
    //     switch (type) {}
    // }

    onCancelBetBtnClick() {
        let [data] = [{}];

        let sendObject = {
            cmd: app.commands.XOCDIA_CANCEL_BET,
            data,
            room: this.scene.room
        };
        console.debug(sendObject);
        app.service.send(sendObject, (d) => {
            console.debug('d', d);
        });
    }

    _showWaitTurnControls() {
        this.hideAllControls();
        this.cardTurnBaseControls._showWaitTurnControls();
    }

    _onGameBegin(data, isJustJoined) {
        this.hideAllControls();
        this._showGameBeginControls();
    }

    _onGameStarting(data, isJustJoined) {
        console.debug('_onGameStarting', data, isJustJoined);

        this._hideGameBeginControls();
    }

    _onGameStarted(data, isJustJoined) {
        console.debug('_onGameStarted', data, isJustJoined);

        this._hideGameBeginControls();
    }

    _onGamePlaying(data, isJustJoined) {
        console.debug('_onGamePlaying', data, isJustJoined);
        this._hideGameBeginControls();
    }

    _onGameEnding(data, isJustJoined) {
        this.hideAllControls();
    }

    hideAllControls() {
        this._hideGameBeginControls();

        this.setVisible(this.betOptionsGroupNode, false);
        this.setVisible(this.btnGroupNode, false);
        this.setVisible(this.betContainerNode, false);
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
        }
    }

    _hideGameBeginControls() {
        this.baseControls.hideAllControls();
    }

    _resetBetData() {
        this.betData = [];
    }
}

app.createComponent(XocDiaControls);