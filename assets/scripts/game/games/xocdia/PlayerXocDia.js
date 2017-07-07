import app from 'app';
import PlayerGameBet from 'PlayerGameBet';
import GameUtils from 'GameUtils';

export default class PlayerXocDia extends PlayerGameBet {
    constructor(board, user) {
        super(board, user);
        this.RENDER_COMPONENT = 'PlayerXocDiaRenderer';
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

    onEnable() {}
    

    onGameEnding(data, isJustJoined) {
        super.onGameEnding(data, isJustJoined);
        this.renderer.stopAllAnimation();
    }

    _onGameRejoin(data) {
        super._onGameRejoin(data);
    }
    
    _onGameStateBet() {}
}

app.createComponent(PlayerXocDia);