/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameScene from 'GameScene';
import BoardTLMNDL from 'BoardTLMNDL';
import TLMNDLControls from 'TLMNDLControls';
import FourPlayerPositions from 'FourPlayerPositions';
import Events from 'Events';

export default class TLMNDLScene extends GameScene {
    constructor() {
        super();
    }

    onLoad(){
        super.onLoad();
    }

    _addGlobalListener(){
        super._addGlobalListener();

        this.on(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
    }

    _onGamePlaying(){
        this.firstTimePlay = false;
    }

    setSoloGame(solo){
        super.setSoloGame(solo)

        this.playerPositions.addToHideAnchor(2, 4)
    }

    onEnable(){
        this.board = this.boardNode.getComponent('BoardTLMNDL');
        this.gameControls = this.gameControlsNode.getComponent('TLMNDLControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('FourPlayerPositions');
        super.onEnable();

        this.isSoloGame && this.playerPositions.addToHideAnchor(2, 4);
    }

}

app.createComponent(TLMNDLScene);

