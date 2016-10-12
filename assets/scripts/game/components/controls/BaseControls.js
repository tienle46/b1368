/**
 * Created by Thanh on 9/13/2016.
 */


import app from 'app';
import utils from 'utils';
import GameControls from 'GameControls';
import {Events} from 'events';

class BaseControls extends GameControls {
    constructor() {
        super();

        this.readyButton = {
            default: null,
            type: cc.Node
        };

        this.unreadyButton = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {
        super.onLoad();
        this.hideAllControls();
    }

    onClickReadyButton() {
        this.scene.showShortLoading('ready');
        app.service.send({cmd: app.commands.PLAYER_READY, room: this.scene.room});
    }

    onClickUnreadyButton() {
        this.scene.showShortLoading('ready');
        app.service.send({cmd: app.commands.PLAYER_UNREADY, room: this.scene.room});
    }

    _init(scene) {
        this.scene = scene;
        this.scene.on(Events.ON_PLAYER_READY_STATE_CHANGED, this._onPlayerSetReadyState, this);
    }

    _onPlayerSetReadyState(playerId, ready, isItMe) {
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