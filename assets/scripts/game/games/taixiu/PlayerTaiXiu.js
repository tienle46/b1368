import app from 'app';
import PlayerGameBet from 'PlayerGameBet';

export default class PlayerTaiXiu extends PlayerGameBet {
    constructor(board, user) {
        super(board, user);
        this.RENDERER_COMPONENT = 'PlayerTaiXiuRenderer';
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
    

    onGameEnding(data, isJustJoined) {
        super.onGameEnding(data, isJustJoined);
        this.renderer.stopAllAnimation();
    }

    _onGameRejoin(data) {
        super._onGameRejoin(data);
    }
}

app.createComponent(PlayerTaiXiu);