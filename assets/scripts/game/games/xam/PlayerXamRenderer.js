/**
 * Created by Thanh on 9/15/2016.
 */

import utils from 'utils';
import app from 'app';
import PlayerCardTurnBaseRenderer from 'PlayerCardTurnBaseRenderer';

export default class PlayerXamRenderer extends PlayerCardTurnBaseRenderer {
    constructor() {
        super();
    }
}

app.createComponent(PlayerXamRenderer);
