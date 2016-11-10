/**
 * Created by Thanh on 9/13/2016.
 */


import app from 'app';
import utils from 'utils';
import GameControls from 'GameControls';
import {Events} from 'events';

export default class BaseControls extends GameControls {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            readyButton: cc.Node,
            unreadyButton: cc.Node
        }
    }

    onEnable() {
        super.onEnable();
        this.hideAllControls();

        this.node.on('touchstart', (event) => true);

        this.scene.on(Events.ON_PLAYER_READY_STATE_CHANGED, this._onPlayerSetReadyState, this);
    }

    onClickReadyButton() {
        this.scene.showShortLoading('ready');
        app.service.send({cmd: app.commands.PLAYER_READY, room: this.scene.room});
    }

    onClickUnreadyButton() {
        this.scene.showShortLoading('ready');
        app.service.send({cmd: app.commands.PLAYER_UNREADY, room: this.scene.room});
    }

    _onPlayerSetReadyState(playerId, ready, isItMe = this.scene.gamePlayers.isItMe(playerId)) {
        this.scene.hideLoading('ready');
        isItMe && (ready ? this._onPlayerReady() : this._onPlayerUnready());
    }

    _onPlayerReady() {
        utils.active(this.unreadyButton);
        utils.deactive(this.readyButton);
    }

    _onPlayerUnready() {
        utils.deactive(this.unreadyButton);
        utils.active(this.readyButton);
    }

    _showGameBeginControls() {
        utils.deactive(this.unreadyButton);
        utils.active(this.readyButton);
    }

    hideAllControls() {
        utils.deactive(this.readyButton);
        utils.deactive(this.unreadyButton);
    }
}

app.createComponent(BaseControls);