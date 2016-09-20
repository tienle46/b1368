/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import Component from 'Component';
import utils from 'utils';

export default class PositionManager extends Component {
    constructor() {
        super();
        this.playerAnchors = [];
    }

    onLoad() {
        this.playerAnchors[0] = this.myAnchor;
        for (let i = 1; i <= this.ceilAnchor; i++) {
            this.playerAnchors[i] = this['anchor' + i];
        }

        this.hideAllInviteButtons();

        console.debug("onLoad PositionManager")
    }

    hideAllInviteButtons() {
        this.playerAnchors.forEach(anchor => {
            let inviteButton = anchor.getChildByName('inviteButton');
            utils.deactive(inviteButton);
        });
    }

    showAllInviteButtons() {

        let excludeAnchor;
        if(app.context.getMe()){
            excludeAnchor = this.playerAnchors[1];
            this.hideInviteButton(1)
        }

        this.playerAnchors.forEach(anchor => {
            if(excludeAnchor !== anchor){
                let inviteButton = anchor.getChildByName('inviteButton');


                utils.active(inviteButton);

                console.log("active: ", inviteButton);
            }

        });
    }

    getPlayerAnchorByPlayerId(playerId, isItMe) {

        console.log("Player Id: " + playerId + " " + isItMe);

        return this.getPlayerAnchor(this.getPlayerAnchorIndex(playerId, isItMe));
    }

    getPlayerAnchorIndex(playerId, isItMe) {

        console.log("getPlayerAnchorIndex: ", playerId, isItMe)

        if (isItMe) {
            return 0;
        } else {
            let tmpIndex = 0;

            if (app.context.getMe()) {
                tmpIndex = (playerId + 5) % 4; //TODO
                return tmpIndex;
            } else {
                tmpIndex = playerId;
                return tmpIndex; //TODO
            }
        }
    }

    hideInviteButton(index) {
        let anchor = this.getPlayerAnchor(index);
        this._setVisibleInviteButton(anchor, false);
    }

    showInviteButton(index) {
        let anchor = this.getPlayerAnchor(index);
        this._setVisibleInviteButton(anchor, true);
    }

    _setVisibleInviteButton(anchor, visible) {
        if (anchor) {

            for (let node of anchor.children) {

                if (node.name == 'inviteButton') {
                    node.active = visible;
                    break;
                }
            }
        }
    }

    hideAnchor(index) {
        let anchor = this.getPlayerAnchor(index);
        if (anchor) anchor.active = false;
    }

    showAnchor(index) {
        let anchor = this.getPlayerAnchor(index);
        if (anchor) anchor.active = true;
    }
}