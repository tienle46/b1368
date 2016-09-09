/**
 * Created by Thanh on 8/23/2016.
 */

import Component from 'Component'

export default class PositionManager extends Component{
    constructor() {
        super()
    }

    getPlayerAnchorByPlayerId(playerId ) {
        return this.getPlayerAnchor(this.getPlayerAnchorOrder(playerId))
    }

    getPlayerAnchorOrder(playerId){
        return playerId < 0 ? 1 : playerId;
        //TODO
    }
}