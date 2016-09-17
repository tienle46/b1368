/**
 * Created by Thanh on 9/12/2016.
 */

import app from 'app'
import Player from 'Player'

class PlayerComponent extends Player {
    constructor(){
        super()
        this.extends = cc.Component
    }

    onLoad(){

    }
}

app.createComponent(PlayerComponent)