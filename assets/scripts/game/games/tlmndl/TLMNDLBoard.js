/**
 * Created by Thanh on 9/5/2016.
 */

import game from 'game'
import BoardCardTurnBase from 'BoardCardTurnBase'

export default class TLMNDLBoard extends BoardCardTurnBase{

    constructor(room) {
        super(room)
    }
}

game.createComponent(TLMNDLBoard);
