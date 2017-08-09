import BoardCard from 'BoardCard';
import Events from 'Events';
import app from 'app';
import utils from 'utils';

export default class BoardGameBet extends BoardCard {
    constructor(room, scene) {
        super(room, scene);
        
        this.RENDERER_COMPONENT = 'BoardGameBetRenderer';
    }

    onLoad(){
        super.onLoad();
    }
    
    onEnable() {
        this.renderer = this.node.getComponent(this.RENDERER_COMPONENT);
        super.onEnable();

        if(this.scene) {
            this.scene.on(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
            this.scene.on(Events.ON_GAME_STATE, this._onGameState, this);
            this.scene.on(Events.GAMEBET_ON_BOARD_UPDATE_PREVIOUS_HISTORY, this._onUpdateBoardResultHistory, this);
        }
    }

    onDestroy() {
        super.onDestroy();

        if(this.scene) {
            this.scene.off(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
            this.scene.off(Events.ON_GAME_STATE, this._onGameState, this);
            this.scene.off(Events.GAMEBET_ON_BOARD_UPDATE_PREVIOUS_HISTORY, this._onUpdateBoardResultHistory, this);
        }
    }
    
    startTimeLine(duration, message) {
        this.stopTimeLine();
        let hiddenText = false;
        if (utils.isEmpty(message)) {
            switch (this.scene.gameState) {
                case app.const.game.state.ENDING:
                    message = app.res.string('game_replay_waiting_time');
                    hiddenText = true;
                    break;
                // case app.const.game.state.READY:
                //     message = app.res.string('game_start');
                //     hiddenText = true;
                //     break;
                case app.const.game.state.STATE_BET:
                    this.renderer.stopDishShakeAnim();
                    message = 'Đặt cược';
                    break;
                default:          
                    message = app.res.string('game_waiting');
                    this.renderer.hideTimeLine();
                    break;
            }
        }
        
        this.scene.gameState && this.renderer.showTimeLine(duration, message, hiddenText);
        
        if (this.scene.gameState == app.const.game.state.READY) {
            this.renderer.hideTimeLine();
        }
    }
    
    /**
     * @interface
     * @param {any} data 
     * @memberof BoardGameBet
     */
    // state === app.const.game.state.ENDING
    onBoardEnding(data, isJustJoined) {
        super.onBoardEnding(data, isJustJoined)
    }

    _reset() {
        super._reset();
        this.renderer.hideElements();
    }
    
    _onUpdateBoardResultHistory(histories) {
        histories && this.renderer.updateBoardResultHistory(histories);
    }

    onGameStatePreChange(boardState, data, isJustJoined) {
        super.onGameStatePreChange(boardState, data);

        if (boardState === app.const.game.state.STATE_BET) {
            this.scene.emit(Events.ON_GAME_STATE_STARTING);
            // todo anything
            this.renderer.showElements();
        }

        let duration = utils.getValue(data, app.keywords.BOARD_PHASE_DURATION);
        duration && this.startTimeLine(duration);
    }

    onGameStateChanged(boardState, data, isJustJoined) {
        super.onGameStateChanged(boardState, data, isJustJoined);
    }
    
    _onGameState(state, data, isJustJoined) {
        super._onGameState(state, data, isJustJoined);
    }

    _loadGamePlayData(data) {
        super._loadGamePlayData(Object.assign({}, data, {masterIdOwner: true}));
        data.b && data.b.length > 0 && this.scene.gameControls.initBoard(data.b, data.pl);
        delete data.b;
        delete data.w;
    }

    _onGameBegin() {
        this.renderer.runDishShakeAnim();
        // hiding all bets and table on game board
        this.renderer.hideElements();
        // check if room has history, preload data
        if (this.room.variables[app.keywords.VARIABLE_XOCDIA_HISTORY]) {
            let histories = this.room.variables[app.keywords.VARIABLE_XOCDIA_HISTORY].value;
            histories && this.renderer.updateBoardResultHistory(histories);
        }
    }
}