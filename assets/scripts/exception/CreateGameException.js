/**
 * Created by Thanh on 9/8/2016.
 */

import GameException from 'GameException';

export default class CreateGameException extends GameException {
    constructor(message, data) {
        super(message, data);

    }
}