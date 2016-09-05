/**
 * Created by Thanh on 9/5/2016.
 */

import game from 'game'
import BoardCardTurnBase from 'BoardCardTurnBase'

export default class BoardTLMNDL extends BoardCardTurnBase{

    constructor(room) {
        super(room)
    }
}

game.createComponent(BoardTLMNDL);
