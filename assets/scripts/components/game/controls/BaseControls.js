/**
 * Created by Thanh on 9/13/2016.
 */

import game from 'game';
import utils from 'utils'
import Component from 'Component'
import Player from 'Player'

class BaseControls extends Component {
    constructor() {
        super();

        this.readyBtn = {
            default: null,
            type: cc.Button
        }

        this.unreadyBtn = {
            default: null,
            type: cc.Button
        }

        this.board = null;
        this.scene = null;
    }

    setBoard(board) {
        this.board = board;
    }

    setScene(scene) {
        this.scene = scene;
    }

    onLoad() {
        utils.hide(this.unreadyBtn)
        utils.hide(this.readyBtn)
    }

    onClickReadyButton() {

        this.scene.showShortLoading('onClickReadyButton');

        game.service.send({ cmd: game.commands.PLAYER_READY, room: this.board.room }, (resObj) => {

            this.scene.hideLoading('onClickReadyButton');

            let playerId = resObj[game.keywords.PLAYER_ID]

            if (this.scene.playerManager.isItMe(playerId)) {
                this._onPlayerReady()
            }
        });
    }

    onClickUnreadyButton() {
        this.scene.showShortLoading('onClickUnreadyButton');

        game.service.send({ cmd: game.commands.PLAYER_UNREADY, room: this.board.room }, (resObj) => {

            this.scene.hideLoading('onClickUnreadyButton');

            let playerId = resObj[game.keywords.PLAYER_ID]

            if (this.scene.playerManager.isItMe(playerId)) {
                this._onPlayerUnready()
            }
        });
    }

    _init(board, scene) {
        this.board = board;
        this.scene = scene;

        let isMeReady = false;
        let playerIds = this.scene.gameData[game.keywords.GAME_LIST_PLAYER];
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
    }

    _onPlayerReady() {
        utils.show(this.unreadyBtn)
        utils.hide(this.readyBtn)
    }

    _onPlayerUnready() {
        utils.hide(this.unreadyBtn)
        utils.show(this.readyBtn)
    }
}