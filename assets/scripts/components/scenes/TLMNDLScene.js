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

    onEnable(){

        this.board = this.boardNode.getComponent(BoardTLMNDL.name);
        this.gameControls = this.gameControlsNode.getComponent(TLMNDLControls.name);
        this.playerPositions = this.playerPositionAnchorsNode.getComponent(FourPlayerPositions.name);
        this.gameResultPopup = this.gameResultPopupNode.getComponent(GameResultPopup.name);

        super.onEnable();
    }

}

app.createComponent(TLMNDLScene);

