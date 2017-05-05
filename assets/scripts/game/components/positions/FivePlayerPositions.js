/**
 * Created by Thanh on 9/8/2016.
 */

import app from 'app';
import utils from 'utils';
import CCUtils from 'CCUtils';
import GameUtils from 'GameUtils';
import PlayerPositions from 'PlayerPositions';

const fivePlayerSeats = {
    [1]: {1: 0, 2: 5, 3: 4, 4: 3, 5: 2},
    [2]: {1: 2, 2: 0, 3: 5, 4: 4, 5: 3},
    [3]: {1: 3, 2: 2, 3: 0, 4: 5, 5: 4},
    [4]: {1: 4, 2: 3, 3: 2, 4: 0, 5: 5},
    [5]: {1: 5, 2: 4, 3: 3, 4: 2, 5: 0}
};

const soloPlayerSeats = {
    [1]: {1: 0, 2: 2},
    [2]: {1: 2, 2: 0},
};

class FivePlayerPositions extends PlayerPositions {
    constructor() {
        super();

        this.ceilAnchor = 5;

        this.anchor1 = {
            default: null,
            type: cc.Node
        };

        this.anchor2 = {
            default: null,
            type: cc.Node
        };

        this.anchor3 = {
            default: null,
            type: cc.Node
        };

        this.anchor4 = {
            default: null,
            type: cc.Node
        };

        this.anchor5 = {
            default: null,
            type: cc.Node
        };

        this.soloAnchor = {
            default: null,
            type: cc.Node
        };

        this.myAnchor = {
            default: null,
            type: cc.Node
        };

    }

    setScene(scene){
        this.scene = scene
    }

    _initPlayerAnchors() {
        if(this.scene.isSoloGame){
            this.playerAnchors = [];
            this.playerAnchors[0] = this.myAnchor;
            this.playerAnchors[1] = this.anchor1;
            this.playerAnchors[2] = this.soloAnchor;

            CCUtils.setVisible(this.anchor2, false);
            CCUtils.setVisible(this.anchor3, false);
            CCUtils.setVisible(this.anchor4, false);
            CCUtils.setVisible(this.anchor5, false);

            CCUtils.setVisible(this.soloAnchor, true);
        }else{
            super._initPlayerAnchors()
        }
    }

    isPositionOnTop(anchorIndex) {
        return this.scene.isSoloGame ? anchorIndex == 2 : anchorIndex == 3 || anchorIndex == 4;
    }

    isPositionOnRight(anchorIndex) {
        return anchorIndex == 5;
    }

    getPlayerAnchor(id){

        console.log("cc.director.getScene(): ", cc.director.getScene(), this.scene.isSoloGame)

        if(this.scene.isSoloGame){
            if(id == 1){
                return this.anchor1;
            }else if(id == 2){
                return this.soloAnchor;
            }else{
                return this.myAnchor;
            }
        }else{
            switch (id){
                case 1:
                    return this.anchor1;
                case 2:
                    return this.anchor2;
                case 3:
                    return this.anchor3;
                case 4:
                    return this.anchor4;
                case 5:
                    return this.anchor5;
                default:
                    return this.myAnchor;
            }
        }
    }

    _getPlayerSeatIndexs(gameCode){
        return this.scene.isSoloGame ? soloPlayerSeats : fivePlayerSeats;
    }

    _getNextSeatIndex(seatIndex){

        let nextIndex = null;

        if(this.scene.isSoloGame){
            if(seatIndex == 0 || seatIndex  == 1){
                nextIndex = 2;
            }else{
                nextIndex = this.scene.gamePlayers.me ? 0 : 1;
            }
        }else{
            switch (seatIndex){
                case 0:
                case 1:
                    nextIndex = 5;
                    break;
                case 2:
                    nextIndex = this.scene.gamePlayers.me ? 0 : 1;
                    break;
                case 3:
                    nextIndex = 2;
                    break;
                case 4:
                    nextIndex = 3;
                    break;
                case 5:
                    nextIndex = 4;
                    break;
            }
        }

        return nextIndex;
    }

    _getPreviousSeatIndex(seatIndex){
        let preIndex = null;

        if(this.scene.isSoloGame){
            if(seatIndex == 0 || seatIndex  == 1){
                preIndex = 2;
            }else{
                preIndex = this.scene.gamePlayers.me ? 0 : 1;
            }
        }else{
            switch (seatIndex){
                case 0:
                case 1:
                    preIndex = 2;
                    break;
                case 2:
                    preIndex = 3;
                    break;
                case 3:
                    preIndex = 4;
                    break;
                case 4:
                    preIndex = 5;
                    break;
                case 5:
                    preIndex = this.scene.gamePlayers.me ? 0 : 1;
                    break;
            }
        }

        return preIndex;
    }
}

app.createComponent(FivePlayerPositions);