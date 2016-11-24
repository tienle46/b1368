/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameScene from 'GameScene';
import BoardXam from 'BoardXam';
import XamControls from 'XamControls';
import FourPlayerPositions from 'FourPlayerPositions';
import GameResultPopup from 'GameResultPopup';

export default class XamScene extends GameScene {
    constructor() {
        super();
    }

    onLoad(){
        super.onLoad();
    }

    onEnable(){
        this.board = this.boardNode.getComponent('BoardXam');
        this.gameControls = this.gameControlsNode.getComponent('XamControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('FourPlayerPositions');
        this.gameResultPopup = this.gameResultPopupNode.getComponent('GameResultPopup');

        super.onEnable();
    }

}

app.createComponent(XamScene);

