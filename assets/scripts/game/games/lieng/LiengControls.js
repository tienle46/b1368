/**
 * Created by Thanh on 9/19/2016.
 */

import app from 'app';
import Events from 'GameEvents';
import GameControls from 'GameControls';
import GameUtils from "GameUtils";
import utils from "GeneralUtils";
import LiengUtils from 'LiengUtils';

export default class LiengControls extends GameControls {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            baseControlsNode: cc.Node,
            toBtnNode: cc.Node,
            theoBtnNode: cc.Node,
            theoBtn: cc.Button,
            toBtn: cc.Button,
            upboBtnNode: cc.Node,
            guide: cc.Node
        });

        /**
         * @type {BaseControls}
         */
        this.baseControls = null
        
        this._isGuideShowed = false
        this._isGuideShowing = false
    }
    
    onLoad() {
        super.onLoad()
        this._isGuideShowed = false
        this._isGuideShowing = false
    }
    
    onEnable() {

        this.baseControls = this.baseControlsNode.getComponent('BaseControls');

        super.onEnable();

        this.scene.on(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
        this.scene.on(Events.ON_GAME_STATE_STARTING, this._onGameStarting, this);
        this.scene.on(Events.ON_GAME_STATE_STARTED, this._onGameStarted, this, 0);
        this.scene.on(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
        this.scene.on(Events.ON_GAME_STATE_ENDING, this._onGameEnding, this);
        this.scene.on(Events.ON_PLAYER_TO, this._onPlayerTo, this);
        this.scene.on(Events.HANDLE_SKIP_TURN, this._handleSkipTurn, this);
        this.scene.on(Events.ON_LAST_PLAYER_TO, this._onLastPlayerTo, this);
    }
    
    hideAllControls() {
        this.baseControls.hideAllControls();
        
        this.setVisible(this.toBtnNode, false);
        this.setVisible(this.theoBtnNode, false);
        this.setVisible(this.upboBtnNode, false);
    }

    showBetControls(){
        this.hideAllControls();

        // this.scene.board.acceptedAmount() == 0 => 1st Tố -> disable Theo
        // this.theoBtn.interactable = this.scene.board.acceptedAmount() !== 0;
        
        this.setVisible(this.toBtnNode, true)
        this.setVisible(this.theoBtnNode, true)
        this.setVisible(this.upboBtnNode, true)
    }
    
    onClickToBtn(){
        let mePlayer = this.scene.gamePlayers.me;
        
        let maxValue = LiengUtils.calculateBetable(mePlayer);
        this.scene.showChooseBetSlider(this.scene.board.acceptedAmount(), maxValue);
    }

    onClickTheoBtn() {
        let maxValue = LiengUtils.calculateBetable(this.scene.gamePlayers.me)
        
        app.service.send({
            cmd: app.commands.PLAYER_PLAY_BET_TURN,
            data: {
                [app.keywords.PLAYER_BET_AMOUNT]: this.scene.board.acceptedAmount() >= maxValue ? maxValue : this.scene.board.acceptedAmount()
            },
            room: this.scene.room
        });
    }
    
    onClickUpBoBtn() {
        app.service.send({cmd: app.commands.PLAYER_SKIP_TURN, data: {}, room: this.scene.room});
    }
    
    toggleGuide() {
        if(this._isGuideShowing)
            return;

        this._isGuideShowed ? this._hideGuide() : this._showGuide();    
    }
    
    _onPlayerTo(previousPlayerId, onTurnPlayerId, betAmount, isLastBet) {
        this._skipTurn(onTurnPlayerId)
        if(this.scene.gamePlayers.isItMe(onTurnPlayerId)) {
            this.toBtn.interactable = !isLastBet
        }
    }
    
    _handleSkipTurn(data) {
        let onTurnPlayerId = utils.getValue(data, app.keywords.TURN_PLAYER_ID);
        this._skipTurn(onTurnPlayerId)
    }
    
    _skipTurn(playerId) {
        this.hideAllControls()
        if(this.scene.gamePlayers.isItMe(playerId)) {
            this.showBetControls()
        }
    }
    
    _onGameBegin(data, isJustJoined) {
        this.hideAllControls();
        this._showGameBeginControls(data, isJustJoined);
    }

    _onGameStarting(data, isJustJoined) {
        this._hideGameBeginControls(data, isJustJoined);
    }

    _onGameStarted(data, isJustJoined) {
        this._hideGameBeginControls(data, isJustJoined);
    }

    _onGamePlaying(data, isJustJoined) {
        this._hideGameBeginControls(data, isJustJoined);
    }

    _onGameEnding(data, isJustJoined) {
        this.hideAllControls();
    }

    _showGameBeginControls() {
        this.hideAllControls();
        if (this.scene.board.isBegin()) {
            this.baseControls._showGameBeginControls();
        }
    }

    _hideGameBeginControls(data, isJustJoined) {
        this.baseControls.hideAllControls();
        
        let gamePhase = utils.getValue(data, app.keywords.BOARD_STATE_KEYWORD)
        let onTurnPlayerId = utils.getValue(data, app.keywords.TURN_PLAYER_ID)
        if(gamePhase === undefined || onTurnPlayerId === undefined)
            return;
        
        this.toBtn.interactable = true;
        
        if(gamePhase == app.const.game.state.BET_TURNING && onTurnPlayerId && this.scene.gamePlayers.isItMe(onTurnPlayerId)) {
            this.showBetControls()
        } else {
            this.hideAllControls()
        }
    }
    
    _showGuide() {
        this.guide.runAction(cc.sequence(cc.callFunc(() => {
            this._isGuideShowing = true
        }), cc.moveTo(.1, cc.v2(200, 228)), cc.callFunc(() => {
            this._isGuideShowed = true
            this._isGuideShowing = false
        })))
    }
    
    _hideGuide() {
        this.guide.runAction(cc.sequence(cc.callFunc(() => {
            this._isGuideShowing = true
        }), cc.moveTo(.1, cc.v2(-190, 228)), cc.callFunc(() => {
            this._isGuideShowed = false
            this._isGuideShowing = false
        })))
    }
}

app.createComponent(LiengControls);