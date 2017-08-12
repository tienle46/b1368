import app from 'app';
import BoardTaiXiu from 'BoardTaiXiu';
import utils from 'utils';
import Events from 'Events';

export default class BoardBauCua extends BoardTaiXiu {
    constructor() {
        super();
        
        this.RENDERER_COMPONENT = 'BoardBauCuaRenderer';
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

    // // state === app.const.game.state.ENDING
    // onBoardEnding(data) {
    //     console.warn('onBoardEnding', data)
    //     let playerIds = utils.getValue(data, app.keywords.GAME_LIST_PLAYER, []);
    //     let bets = utils.getValue(data, app.keywords.XOCDIA_BET.AMOUNT, []);
    //     let playingPlayerIds = this.scene.gamePlayers.filterPlayingPlayer(playerIds);
    //     let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);
    //     let playerResults = utils.getValue(data, app.keywords.WIN, []);


    //     super.onBoardEnding(data);
    //     this.renderer.shakenControlAppearance(true);
        
    //     let faces = utils.getValue(data, app.keywords.XOCDIA_RESULT_END_PHASE);
    //     let winIds = utils.getValue(data, 'winBetOptions', []);
        
    //     // console.warn('bets', bets);
        
    //     if (faces && faces.length > 0) {
    //         if(this.renderer.isShaking())
    //             return;
    //         this.renderer && this.renderer.placedOnDish(faces);
            
    //         this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(() => {
    //             this.renderer.clockAppearance(false);
    //             this.renderer && this.renderer.openBowlAnim(); // this will end up 1s
    //         }), cc.delayTime(1.2), cc.callFunc(() => {
    //             this.renderer && this.renderer.displayResult(faces)
    //             this.scene.gameControls.highLightWinBets(winIds)
                
    //             // emit anim
    //             playingPlayerIds && playingPlayerIds.forEach((id) => {
    //                 let playerId = id
    //                 let balance = balanceChangeAmounts[id]
    //                 this.scene && this.scene.emit(Events.GAMEBET_ON_PLAYER_RUN_MONEY_BALANCE_CHANGE_ANIM, { balance, playerId });
    //             });
    //         }), cc.delayTime(.3), cc.callFunc(() => {
    //             this.scene && this.scene.emit(Events.GAMEBET_ON_DISTRIBUTE_CHIP, { playingPlayerIds, bets, playerResults }, winIds);
    //         }), cc.delayTime(2),  cc.callFunc(() => {
    //             this.renderer && this.renderer.hideResult();
    //         })));
    //     }
        
    // }
}

app.createComponent(BoardBauCua);