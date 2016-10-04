/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import Component from 'Component';
import utils from 'utils';
import Events from 'Events'

export default class PlayerPositions extends Component {

    static get ALIGN_TOP() {return 'TOP';}
    static get ALIGN_BOTTOM() {return 'BOTTOM';}
    static get ALIGN_LEFT() {return 'LEFT';}
    static get ALIGN_RIGHT() {return 'RIGHT';}

    constructor() {
        super();
        this.playerAnchors = null;
        this.scene;
    }

    _init(scene){
        this.scene = scene;

        console.debug("Init PlayerPositions");

        this._initPlayerAnchors();

        this.scene.on(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
        this.scene.on(Events.ON_GAME_STATE_STARTING, this._onGameStarting, this);

        console.debug(this)
    }

    onLoad() {
    }

    _initPlayerAnchors(){
        this.playerAnchors = [];
        this.playerAnchors[0] = this.myAnchor;
        for (let i = 1; i <= this.ceilAnchor; i++) {
            this.playerAnchors[i] = this['anchor' + i];
        }

        this.hideAllInviteButtons();
    }

    _onGameBegin(){
        console.debug("_onGameBegin")
        this.showAllInviteButtons();
    }

    _onGameStarting(){
        this.hideAllInviteButtons();
    }
    
    hideAllInviteButtons() {
        this.playerAnchors.forEach(anchor => {
            let inviteButton = anchor.getChildByName('inviteButton');
            utils.deactive(inviteButton);
        });
    }

    showAllInviteButtons() {

        console.debug("showAllInviteButtons: ", this)

        let excludeAnchor;
        if(app.context.getMe()){
            excludeAnchor = this.playerAnchors[1];
            this.hideInviteButton(1);
        }

        this.playerAnchors.forEach(anchor => {
            if(excludeAnchor !== anchor){
                let inviteButton = anchor.getChildByName('inviteButton');
                utils.active(inviteButton);
            }

        });
    }

    getPlayerAnchorByPlayerId(playerId, isItMe) {

        console.log("Player Id: " + playerId + " " + isItMe);

        return this.getPlayerAnchor(this.getPlayerAnchorIndex(playerId, isItMe));
    }

    getPlayerAnchorIndex(playerId, isItMe) {

        console.log("getPlayerAnchorIndex: ", playerId, isItMe);

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