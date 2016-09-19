/**
 * Created by Thanh on 8/23/2016.
 */

import Board from 'Board'

export default class BoardCard extends Board {
    constructor(room, scene) {
        super(room, scene)

        this.handCardSize = 0;
    }

    onLoad(){
        super.onLoad();
    }

    _deal(data){

    }
}