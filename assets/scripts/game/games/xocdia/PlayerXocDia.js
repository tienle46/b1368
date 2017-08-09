import app from 'app';
import PlayerGameBet from 'PlayerGameBet';
import Events from 'Events';

export default class PlayerXocDia extends PlayerGameBet {
    constructor(board, user) {
        super(board, user);
        this.RENDERER_COMPONENT = 'PlayerXocDiaRenderer';
    }
    
    onLoad() {
        super.onLoad();
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
     * @param {any} data {playingPlayerIds, bets}
     * @param {any} dots 
     * @returns 
     * @memberof PlayerXocDia
     */
    _onDistributeChip(data, dots) {
        let { playingPlayerIds, bets } = data;
        let playerIdIndex = playingPlayerIds.findIndex(id => id == this.id);

        if (playerIdIndex !== undefined) {
            let playerId = this.id;
            let isItMe = this.scene.gamePlayers.isItMe(playerId);
            let { myPos } = this._getPosBasedOnWorldSpace(playerId);
            let betData = bets[playerIdIndex];
            // user will be get chip after dealer got it
            setTimeout(() => {
                this.scene && this.scene.emit(Events.GAMEBET_ON_PLAYER_RECEIVE_CHIP_ANIMATION, { userPos: myPos, playerId, betData, isItMe }, dots);
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
}

app.createComponent(PlayerXocDia);