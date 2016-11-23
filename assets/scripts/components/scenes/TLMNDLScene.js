/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameScene from 'GameScene';
import BoardTLMNDL from 'BoardTLMNDL';
import TLMNDLControls from 'TLMNDLControls';
import FourPlayerPositions from 'FourPlayerPositions';
import GameResultPopup from 'GameResultPopup';

export default class TLMNDLScene extends GameScene {
    constructor() {
        super();
    }

    onLoad(){
        super.onLoad();
    }

    onEnable(){
        this.board = this.boardNode.getComponent('BoardTLMNDL');
        this.gameControls = this.gameControlsNode.getComponent('TLMNDLControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('FourPlayerPositions');
        this.gameResultPopup = this.gameResultPopupNode.getComponent('GameResultPopup');

        super.onEnable();
    }

}

app.createComponent(TLMNDLScene);

