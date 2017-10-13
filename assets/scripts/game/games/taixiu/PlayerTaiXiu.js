import app from 'app';
import PlayerGameBet from 'PlayerGameBet';
import Events from 'GameEvents';

export default class PlayerTaiXiu extends PlayerGameBet {
    constructor(board, user) {
        super(board, user);
        this.RENDERER_COMPONENT = 'PlayerTaiXiuRenderer';
    }
    
    onLoad() {
        super.onLoad();
    }
    
    onEnable() {
        super.onEnable()
        // hide money    
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
    }

    // onEnable(renderer, renderData = {}) {
    //     console.warn(this.RENDERER_COMPONENT, this.getComponent(this.RENDERER_COMPONENT))
    //     super.onEnable(this.getComponent(this.RENDERER_COMPONENT));
    // }
    
    /**
     * @override
     * 
     * @param {any} data 
     * @param {any} winIds 
     * @returns 
     * @memberof PlayerTaiXiu
     */
    _onDistributeChip(data, winIds) {
        let { playingPlayerIds, bets } = data;
        let playerIdIndex = playingPlayerIds.findIndex(id => id == this.id);

        if (playerIdIndex !== undefined) {
            let playerId = this.id;
            let isItMe = this.scene.gamePlayers.isItMe(playerId);
            let { myPos } = this._getPosBasedOnWorldSpace(playerId);
            let betData = bets[playerIdIndex];
            // user will be get chip after dealer got it
            setTimeout(() => {
                this.scene && this.scene.emit(Events.GAMEBET_ON_PLAYER_RECEIVE_CHIP_ANIMATION, { userPos: myPos, playerId, betData, isItMe }, winIds);
            }, 500);
        }
    }
    
    onGameEnding(data, isJustJoined) {
        super.onGameEnding(data, isJustJoined);
        this.renderer.stopAllAnimation();
    }

    _onGameRejoin(data) {
        super._onGameRejoin(data);
    }
    
    /**
     * @extending
     * 
     * @param {any} state 
     * @param {any} data 
     * @param {any} isJustJoined 
     * @memberof PlayerXocDia
     */
    _onGameState(state, data, isJustJoined) {
        super._onGameState(state, data, isJustJoined);
        if (state == app.const.game.state.STATE_BET) {
            this.isItMe() && this.renderer.showPlayerComponentOnShake();
        }
    }
}

app.createComponent(PlayerTaiXiu);