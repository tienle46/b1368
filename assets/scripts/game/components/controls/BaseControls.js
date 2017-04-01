/**
 * Created by Thanh on 9/13/2016.
 */


import app from 'app';
import utils from 'utils';
import GameControls from 'GameControls';
import { Events } from 'events';

export default class BaseControls extends GameControls {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            readyButton: cc.Node,
            unreadyButton: cc.Node,
            startButton: cc.Node
        }

        this.showStartButtonOnBegin = false;
        this.serverAutoStartGame = false;
    }

    onEnable() {
        super.onEnable();
        this.hideAllControls();

        this.node.on('touchstart', (event) => true);

        this.scene.on(Events.ON_PLAYER_READY_STATE_CHANGED, this._onPlayerSetReadyState, this);
        this.scene.on(Events.SHOW_START_GAME_CONTROL, this._showStartGameControl, this);
    }

    onClickReadyButton() {
        this.scene.showShortLoading();
        app.service.send({ cmd: app.commands.PLAYER_READY, room: this.scene.room });
    }

    onClickUnreadyButton() {
        this.scene.showShortLoading();
        app.service.send({ cmd: app.commands.PLAYER_UNREADY, room: this.scene.room });
    }

    onClickStartButton() {
        this.scene.emit(Events.ON_CLICK_START_GAME_BUTTON);
        utils.deactive(this.startButton);
    }

    _onPlayerSetReadyState(playerId, ready, isItMe = this.scene.gamePlayers.isItMe(playerId)) {
        this.scene.hideLoading();
        isItMe && (ready ? this._onPlayerReady() : this._onPlayerUnready());
    }

    _onPlayerReady() {
        // utils.active(this.unreadyButton);
        utils.deactive(this.readyButton);
    }

    _onPlayerUnready() {
        // utils.deactive(this.unreadyButton);
        utils.active(this.readyButton);
    }

    _showGameBeginControls() {
        debug('_showGameBeginControls')
        if (app.system.currentScene.gamePlayers.isMeReady()) {
            this._onPlayerReady();
        } else {
            this._onPlayerUnready();
        }

        if(!this.serverAutoStartGame && this.showStartButtonOnBegin && this.scene.enoughPlayerToStartGame()){
            utils.active(this.startButton);
        }
    }

    hideAllControls() {
        utils.deactive(this.readyButton);
        // utils.deactive(this.unreadyButton);
        this.hideStartButton();
    }
    
    hideStartButton() {
        utils.deactive(this.startButton);
    }
    
    _showStartGameControl(){
        if(!this.serverAutoStartGame && this.scene.gamePlayers.owner && this.scene.gamePlayers.owner.isItMe()){
            this.showStartButtonOnBegin = true;
            utils.active(this.startButton);
        }
    }
}

app.createComponent(BaseControls);