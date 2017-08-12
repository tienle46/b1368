import app from 'app';
import PlayerGameBet from 'PlayerGameBet';
import Events from 'Events';

export default class PlayerBauCua extends PlayerGameBet {
    constructor(board, user) {
        super(board, user);
        this.RENDERER_COMPONENT = 'PlayerBauCuaRenderer';
    }
}

app.createComponent(PlayerBauCua);