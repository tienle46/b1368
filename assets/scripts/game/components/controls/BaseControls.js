/**
 * Created by Thanh on 9/13/2016.
 */

import app from 'app'
import utils from 'utils'
import GameControls from 'GameControls'

class BaseControls extends GameControls {
    constructor() {
        super();

        this.readyButton = {
            default: null,
            type: cc.Node
        }

        this.unreadyButton = {
            default: null,
            type: cc.Node
        }
    }

    onLoad() {
        super.onLoad();
        this.hideAllControls();
    }

    onClickReadyButton() {
        
        console.log("onClickReadyButton")

        this.scene.showShortLoading('onClickReadyButton');

        app.service.send({ cmd: app.commands.PLAYER_READY, room: this.scene.room }, (resObj) => {

            this.scene.hideLoading('onClickReadyButton');

            let playerId = resObj[app.keywords.PLAYER_ID]

            if (this.scene.playerManager.isItMe(playerId)) {
                this._onPlayerReady()
            }
        });
    }

    onClickUnreadyButton() {

        console.log("onClickUnreadyButton")

        this.scene.showShortLoading('onClickUnreadyButton');

        app.service.send({ cmd: app.commands.PLAYER_UNREADY, room: this.scene.room }, (resObj) => {
            this.scene.hideLoading('onClickUnreadyButton');

            let playerId = resObj[app.keywords.PLAYER_ID]

            if (this.scene.playerManager.isItMe(playerId)) {
                this._onPlayerUnready()
            }
        });
    }

    _init(scene) {
        this.scene = scene;

        let isMeReady = false;
        let playerIds = this.scene.gameData[app.keywords.GAME_LIST_PLAYER];
        if (playerIds) {
            for (playerId of playerIds) {
                if (this.scene.playerManager.isItMe(playerId)) {
                    isMeReady = true;
                    break;
                }
            }
        }

        if (isMeReady) {
            this._onPlayerReady()
        } else {
            this._onPlayerUnready()
        }

        console.log(this.readyButton)
    }

    _onPlayerReady() {
        utils.show(this.unreadyButton)
        utils.hide(this.readyButton)
    }

    _onPlayerUnready() {
        utils.hide(this.unreadyButton)
        utils.show(this.readyButton)
    }

    hideAllControls(){
        utils.hide(this.readyButton)
        utils.hide(this.unreadyButton)
    }
}

app.createComponent(BaseControls)