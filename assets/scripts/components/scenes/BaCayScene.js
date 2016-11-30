/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameScene from 'GameScene';

export default class BaCayScene extends GameScene {
    constructor() {
        super();
    }

    onLoad(){
        super.onLoad();
    }

    onEnable(){
        this.board = this.boardNode.getComponent('BoardBaCay');
        this.gameControls = this.gameControlsNode.getComponent('BaCayControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('SixPlayerPositions');
        this.gameResultPopup = this.gameResultPopupNode.getComponent('GameResultPopup');

        super.onEnable();
    }

}

app.createComponent(BaCayScene);

