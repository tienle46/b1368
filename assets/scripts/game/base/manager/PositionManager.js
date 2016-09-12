/**
 * Created by Thanh on 8/23/2016.
 */

import Component from 'Component'

export default class PositionManager extends Component{
    constructor() {
        super()

        this.playerAnchors = []
    }

    _initPlayerAnchors(maxAnchor){
        this.playerAnchors[0] = this.myAnchor;
        for (let i = 1; i <= maxAnchor; i++){
        }
    }

    getPlayerAnchorByPlayerId(playerId, isItMe) {
        return this.getPlayerAnchor(this.getPlayerAnchorOrder(playerId, isItMe))
    }

    getPlayerAnchorOrder(playerId, isItMe){
        return isItMe ? 0 : playerId <= 0 ? 1 : playerId;
        //TODO
    }

    hideAllInviteButton(order){
        this.playerAnchors.forEach(anchor => {
            this._setVisibleInviteButton(anchor, false)
        })
    }

    hideInviteButton(order){
        let anchor = this.getPlayerAnchor(order)
        this._setVisibleInviteButton(anchor, false)
    }

    showInviteButton(order){
        let anchor = this.getPlayerAnchor(order)
        this._setVisibleInviteButton(anchor, true)
    }

    _setVisibleInviteButton(anchor, visible){
        if(anchor){

            console.debug(anchor)

            for (let node of anchor.children){

                if(node.name == 'inviteButton'){
                    node.active = visible
                    break
                }
            }
        }
    }

    hideAnchor(order){
        let anchor = this.getPlayerAnchor(order)
        if(anchor) anchor.active = false
    }

    showAnchor(order){
        let anchor = this.getPlayerAnchor(order)
        if(anchor) anchor.active = true
    }
}