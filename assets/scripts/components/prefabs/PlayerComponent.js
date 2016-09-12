/**
 * Created by Thanh on 9/12/2016.
 */

import game from 'game'
import Player from 'Player'

class PlayerComponent extends Player {
    constructor(){
        super()
        this.extends = cc.Component
    }

    onLoad(){

    }
}

game.createComponent(PlayerComponent)