/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameScene from 'GameScene';
import BoardSam from 'BoardSam';
import SamControls from 'SamControls';
import FivePlayerPositions from 'FivePlayerPositions';
import GameResultPopup from 'GameResultPopup';

export default class SamScene extends GameScene {
    constructor() {
        super();
    }

    onLoad(){
        super.onLoad();
    }

    onEnable(){
        this.board = this.boardNode.getComponent('BoardSam');
        this.gameControls = this.gameControlsNode.getComponent('SamControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('FivePlayerPositions');

        super.onEnable();
    }

}

app.createComponent(SamScene);

