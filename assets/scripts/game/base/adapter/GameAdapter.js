/**
 * Created by Thanh on 9/16/2016.
 */
import Actor from 'Actor'

export default class GameAdapter extends Actor {
    constructor() {
        super();
    }

    setPlayer(player){
        this.player = player;
    }

    setBoard(board){
        this.board = board;
    }

    play(){

    }
}