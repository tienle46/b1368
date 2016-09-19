/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app'
import Component from 'Component'
import utils from 'utils'

export default class PositionManager extends Component {
    constructor() {
        super()
        this.playerAnchors = []
    }

    onLoad(){
        this.playerAnchors[0] = this.myAnchor;
        for (let i = 1; i <= this.ceilAnchor; i++){
            this.playerAnchors[i] = this['anchor' + i];
        }

        this.hideAllInviteButton();
    }

    hideAllInviteButton(){
        this.playerAnchors.forEach(anchor => {
            let inviteButton = anchor.getChildByName('inviteButton')
            utils.hide(inviteButton)
        })
    }

    showAllInviteButton(){
        this.playerAnchors.forEach(anchor => {
            let inviteButton = anchor.getChildByName('inviteButton')
            utils.show(inviteButton)
        })
    }

    getPlayerAnchorByPlayerId(playerId, isItMe) {

        console.log("Player Id: " + playerId + " " + isItMe)

        return this.getPlayerAnchor(this.getPlayerAnchorOrder(playerId, isItMe))
    }

    getPlayerAnchorOrder(playerId, isItMe){
        if(isItMe){
            return 0;
        }else{
            let tmpIndex = 0;

            if(app.context.getMe()){
                tmpIndex = (playerId + 5) % 4; //TODO
                return tmpIndex;
            }else{
                tmpIndex = playerId;
                return tmpIndex; //TODO
            }
        }
        return order
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