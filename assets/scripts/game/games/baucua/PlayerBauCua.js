import app from 'app';
import PlayerTaiXiu from 'PlayerTaiXiu';
import Events from 'Events';

export default class PlayerBauCua extends PlayerTaiXiu {
    constructor(board, user) {
        super(board, user);
        this.RENDERER_COMPONENT = 'PlayerBauCuaRenderer';
    }
}

app.createComponent(PlayerBauCua);