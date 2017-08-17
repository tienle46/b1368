import app from 'app';
import BoardGameBet from 'BoardGameBet';
import utils from 'PackageUtils';
import { requestTimeout, clearRequestTimeout } from 'TimeHacker';
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
            var t1 = requestTimeout(() => {
                this.renderer && this.renderer.openBowlAnim(); // this will end up 1s
                clearRequestTimeout(t1);
                var t2 = requestTimeout(() => {
                    clearRequestTimeout(t2);
                    // show result
                    this.renderer && this.renderer.displayResultFromDots(dots);

                    var t3 = requestTimeout(() => {
                        clearRequestTimeout(t3);

                        this.renderer && this.renderer.hideResult();
                    }, 3500); // hide it after 2s
                    // emit anim
                    playingPlayerIds && playingPlayerIds.forEach((id, index) => {
                        let playerId = id;
                        let balance = balanceChangeAmounts[id];
                        this.scene && this.scene.emit(Events.GAMEBET_ON_PLAYER_RUN_MONEY_BALANCE_CHANGE_ANIM, { balance, playerId });
                    });
                }, 1200); // show result and runing money balance anim after 1.2s

                var t4 = requestTimeout(() => {
                    clearRequestTimeout(t4);

                    this.scene && this.scene.emit(Events.GAMEBET_ON_DISTRIBUTE_CHIP, { playingPlayerIds, bets, playerResults }, dots);
                }, 1500); // emit event after 1.5s
            }, 500);
        }

        // this.scene.emit(Events.XOCDIA_ON_CONTROL_SAVE_PREVIOUS_BETDATA, bets, playerIds);
    }
}

app.createComponent(BoardXocDia);