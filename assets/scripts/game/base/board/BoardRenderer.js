/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import utils from 'utils';
import ActorRenderer from 'ActorRenderer';

export default class BoardRenderer extends ActorRenderer {
    constructor() {
        super();

        this.timelinePrefab = {
            default: null,
            type: cc.Prefab
        };

        this.playerPositionPrefab = {
            default: null,
            type: cc.Prefab
        }
    }

    _initUI(data){
        super._initUI(data);
    }

    _resetBoard(){

    }

    hideStartBoardTimeLine(){
        utils.hide(this.startBoardTimeLine);
    }
}

app.createComponent(BoardRenderer);