/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import Component from 'Component';
import utils from 'PackageUtils';
import CCUtils from 'CCUtils';
import Events from 'GameEvents'
import ActionBlocker from 'ActionBlocker'

export default class PlayerPositions extends Component {

    constructor() {
        super();
        
        this.properties = this.assignProperties({
            inviteButtonName: 'inviteButton'
        });
        
        this.playerAnchors = null;
        this.hiddenAnchors = null;
        this.scene;
    }

    isPositionOnTop() {
        return false;
    }

    onLoad(){
        super.onLoad()
        this.scene = app.system.currentScene;
        
        this.hiddenAnchors = []
        this.playerAnchors = []
    }

    onEnable() {
        super.onEnable();
        this._initPlayerAnchors();

        // this.scene = app.system.currentScene;
        
        if(this.scene){
            this.scene.on(Events.ON_GAME_RESET, this._onGameReset, this);
            this.scene.on(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
            this.scene.on(Events.ON_GAME_STATE_STARTING, this._onGameStarting, this);
            this.scene.on(Events.ON_GAME_STATE_STARTED, this._onGameStarted, this);
            this.scene.on(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
            this.scene.on(Events.ON_GAME_STATE_ENDING, this._onGameEnding, this);
        }

        this.hiddenAnchors && this._hideAllAnchor(...this.hiddenAnchors)
    }

    _initPlayerAnchors() {
        this.playerAnchors = [];
        this.playerAnchors[0] = this.myAnchor;

        for (let i = 1; i <= this.ceilAnchor; i++) {
            this.playerAnchors[i] = this['anchor' + i];
        }

        this.hideAllInviteButtons();
    }

    onClickAnchorButton() {
        ActionBlocker.runAction(ActionBlocker.INVITE_PLAYER, () => {
            app.service.send({ cmd: app.commands.PLAYER_INVITE, data: {}, room: this.scene.room });
            app.system.showToast(app.res.string('random_invite_player_successfully'));
        })
    }

    _onGameReset(){
        this._showInviteButtonOnBegin();
    }

    _showInviteButtonOnBegin(){
        let hidingAnchorIndexes = this.scene.gamePlayers.players.map(player => player.anchorIndex);
        this.showAllInviteButtons(hidingAnchorIndexes);
    }

    _onGameBegin(data, isJustJoined) {
        this._showInviteButtonOnBegin();
    }

    _onGameStarting(data, isJustJoined) {
        this.hideAllInviteButtons();
    }

    _onGameStarted(data, isJustJoined) {
        if (isJustJoined) {
            this.hideAllInviteButtons();
        }
    }

    _onGamePlaying(data, isJustJoined) {
        if (isJustJoined) {
            this.hideAllInviteButtons();
        }
    }

    _onGameEnding(data, isJustJoined) {
        if (isJustJoined) {
            this.hideAllInviteButtons();
        }
    }

    addToHideAnchor(...anchorIndexs){
        !this.hiddenAnchors && (this.hiddenAnchors = [])
        this.hiddenAnchors.push(...anchorIndexs)
    }

    hideAllInviteButtons() {
        // this.playerAnchors.forEach((anchor, index) => {
        //     let inviteButton = anchor.getChildByName(this.inviteButtonName);
        //     utils.deactive(inviteButton);
        // });
    }

    showAllInviteButtons(excludeAnchorIndexes = []) {

        this.playerAnchors.forEach(anchor => {
            let inviteButton = anchor.getChildByName(this.inviteButtonName);
            utils.active(inviteButton);
        });

        this.scene.gamePlayers.isMePlayGame() && excludeAnchorIndexes.push(1);
        [...excludeAnchorIndexes, ...this.hiddenAnchors].forEach(index => this.hideInviteButton(index));
    }

    getPlayerAnchorByPlayerId(playerId, isItMe) {
        return this.getPlayerAnchor(this.getPlayerAnchorIndex(playerId, isItMe));
    }

    /**
     * @param gameCode
     * @returns {{}}
     * @abstract
     */
    _getPlayerSeatIndexs(gameCode) {
        return {};
    }

    getPlayerAnchorIndex(playerId, isItMe, gameCode) {

        if (isItMe) {
            return 0;
        } else {
            if (app.context.getMe()) {
                let { seatIndex } = this._getPlayerSeatIndex(playerId, gameCode);
                return seatIndex;

            } else {
                return playerId;
            }
        }
    }

    _getPlayerSeatIndex(playerId, gameCode) {
        let seatIndexs = this._getPlayerSeatIndexs(gameCode);
        let meId = app.context.getMe().getPlayerId(app.system.currentScene.board.room);
        let seatIndex = seatIndexs[meId][playerId];
        return { seatIndex, seatIndexs, meId };
    }

    hideInviteButtonByPlayerId(playerId) {
        let anchorIndex = this.getPlayerAnchorIndex(playerId, app.context.getMe().id == playerId);
        if (anchorIndex) {
            this.hideInviteButton(anchorIndex);
        }
    }

    showInviteButtonByPlayerId(playerId) {
        let anchorIndex = this.getPlayerAnchorIndex(playerId, app.context.getMe().id == playerId);
        if (anchorIndex) {
            this.showInviteButton(anchorIndex);
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

            for (let i = 0; i < anchor.children.length; i++) {
                let node = anchor.children[i];
                if (node.name == this.inviteButtonName) {
                    node.active = visible;
                    break;
                }
            }
        }
    }

    hideAnchor(index) {
        // let anchor = index >= 0 && this.getPlayerAnchor(index);
        // if (anchor) anchor.active = false;
    }

    _hideAllAnchor(...indexs) {
        indexs.forEach(index => {
            let anchor = index >= 0 && this.getPlayerAnchor(index);
            anchor && CCUtils.setVisible(anchor, false)
        })
    }

    showAnchor(index) {
        let anchor = this.getPlayerAnchor(index);
        if (anchor) anchor.active = true;
    }

    /**
     * @param seatIndex
     * @abstract
     */
    _getNextSeatIndex(seatIndex) {}

    /**
     * @param seatIndex
     * @abstract
     */
    _getPreviousSeatIndex(seatIndex) {}

    getNextNeighbourID(playerId) {
        let { seatIndex, seatIndexs, meId } = this._getPlayerSeatIndex(playerId, this.scene.gameCode);
        let nextSeatIndex = this._getNextSeatIndex(seatIndex);

        return this._getPlayerIdBySeatIndex(seatIndexs, nextSeatIndex, meId);
    }

    getPreviousNeighbourPlayerID(playerId) {
        let { seatIndex, seatIndexs, meId } = this._getPlayerSeatIndex(playerId, this.scene.gameCode);
        let nextSeatIndex = this._getPreviousSeatIndex(seatIndex);
        return this._getPlayerIdBySeatIndex(seatIndexs, nextSeatIndex, meId);
    }

    _getPlayerIdBySeatIndex(seatIndexs, seatIndex, meId) {
        let nextPlayerId = 0;
        let seatIndexMap = seatIndexs[meId];
        Object.getOwnPropertyNames(seatIndexMap).some(name => {
            if (seatIndexMap[name] == seatIndex) {
                nextPlayerId = Number.parseInt(name);
                return true;
            }
        });

        return nextPlayerId;
    }

    isPositionOnTop(anchorIndex) {
        return false
    }

    isPositionOnRight(anchorIndex) {
        return false
    }

    isPositionOnLeft(anchorIndex) {
        return false
    }

    isMePositionOnLeft() {
        return false;
    }
}

PlayerPositions.ALIGN_TOP = 'TOP'
PlayerPositions.ALIGN_BOTTOM = 'BOTTOM'
PlayerPositions.ALIGN_LEFT = 'LEFT'
PlayerPositions.ALIGN_RIGHT = 'RIGHT'
