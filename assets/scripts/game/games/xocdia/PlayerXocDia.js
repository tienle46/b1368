import app from 'app';
import PlayerCardBetTurn from 'PlayerCardBetTurn';

export default class PlayerXocDia extends PlayerCardBetTurn {
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

    onEnable() {
        super.onEnable(this.getComponent('PlayerXocDiaRenderer'));
    }

    onGameEnding(data) {
        super.onGameEnding(data);
        this.renderer.stopAllAnimation();
    }
}

app.createComponent(PlayerXocDia);