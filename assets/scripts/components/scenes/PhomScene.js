/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameScene from 'GameScene';
import BoardPhom from 'BoardPhom';
import PhomControls from 'PhomControls';
import FourPlayerPositions from 'FourPlayerPositions';
import GameResultPopup from 'GameResultPopup';

export default class PhomScene extends GameScene {
    constructor() {
        super();
    }

    onEnable(){

        this.board = this.boardNode.getComponent('BoardPhom');
        this.gameControls = this.gameControlsNode.getComponent('PhomControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('FourPlayerPositions');
        this.gameResultPopup = this.gameResultPopupNode.getComponent('GameResultPopup');

        super.onEnable();
    }

}

app.createComponent(PhomScene);