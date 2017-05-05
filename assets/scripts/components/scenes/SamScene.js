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

    // setSoloGame(solo){
    //     super.setSoloGame(solo)
    //
    //     this.playerPositions.addToHideAnchor(2, 3, 5)
    // }

    onEnable(){
        this.board = this.boardNode.getComponent('BoardSam');
        this.gameControls = this.gameControlsNode.getComponent('SamControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('FivePlayerPositions');
        this.playerPositions.setScene && this.playerPositions.setScene(this);

        super.onEnable();
    }

}

app.createComponent(SamScene);

