import app from 'app';
import BoardGameBet from 'BoardGameBet';
import utils from 'PackageUtils';
import Events from 'GameEvents';

export default class BoardXocDia extends BoardGameBet {
    constructor() {
        super();
        this.RENDERER_COMPONENT = 'BoardXocDiaRenderer';
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        super.onEnable();
    }

    onGameStateChanged(boardState, data, isJustJoined) {

    }


    // //@override
    // onBoardStarting(data = {}, isJustJoined) {

    //     if (isJustJoined) {

    //     }

    //     this.state = app.const.game.state.STARTING;
    //     // this.scene.gameControls.hideAllControlsBeforeGameStart();
    //     this.stopTimeLine();
    // }

    _onGameState(state, data, isJustJoined) {}

    // state === app.const.game.state.ENDING
    onBoardEnding(data) {
        let playerIds = utils.getValue(data, app.keywords.GAME_LIST_PLAYER, []);
        let bets = utils.getValue(data, app.keywords.XOCDIA_BET.AMOUNT, []);
        let playingPlayerIds = this.scene.gamePlayers.filterPlayingPlayer(playerIds);
        let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);
        let playerResults = utils.getValue(data, app.keywords.WIN, []);


        super.onBoardEnding(data);
        let dots = utils.getValue(data, app.keywords.XOCDIA_RESULT_END_PHASE);

        if (dots && dots.length > 0) {
            if(this.renderer.isShaking())
                return;
            this.renderer && this.renderer.placedOnDish(dots);
            
            this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(() => {
                this.renderer && this.renderer.openBowlAnim(); // total consumption: 1.5s
            }), cc.delayTime(2.5), cc.callFunc(() => {
                this.renderer && this.renderer.displayResultFromDots(dots);
            }), cc.delayTime(1), cc.callFunc(() => {
                this.renderer && this.renderer.hideResult();
            }), cc.delayTime(1), cc.callFunc(() => {
                this.scene && this.scene.emit(Events.GAMEBET_ON_DISTRIBUTE_CHIP, { playingPlayerIds, bets, playerResults }, dots);
            }), cc.delayTime(.5), cc.callFunc(() => {
                // emit anim
                playingPlayerIds && playingPlayerIds.forEach((id) => {
                    let playerId = id
                    let balance = balanceChangeAmounts[id]
                    this.scene && this.scene.emit(Events.GAMEBET_ON_PLAYER_RUN_MONEY_BALANCE_CHANGE_ANIM, { balance, playerId });
                });
            })));
        }

        // this.scene.emit(Events.XOCDIA_ON_CONTROL_SAVE_PREVIOUS_BETDATA, bets, playerIds);
    }
}

app.createComponent(BoardXocDia);