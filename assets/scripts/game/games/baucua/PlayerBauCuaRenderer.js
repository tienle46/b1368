import app from 'app';
import PlayerGameBetRenderer from 'PlayerGameBetRenderer';

export default class PlayerBauCuaRenderer extends PlayerGameBetRenderer {
    constructor() {
        super();
    }
}

app.createComponent(PlayerBauCuaRenderer);