/**
 * Created by Thanh on 9/8/2016.
 */

import app from 'app';
import PlayerPositions from 'PlayerPositions';

const fivePlayerSeats = {
    [1]: {1: 0, 2: 5, 3: 4, 4: 3, 5: 2},
    [2]: {1: 2, 2: 0, 3: 5, 4: 4, 5: 3},
    [3]: {1: 3, 2: 2, 3: 0, 4: 5, 5: 4},
    [4]: {1: 4, 2: 3, 3: 2, 4: 0, 5: 5},
    [5]: {1: 5, 2: 4, 3: 3, 4: 2, 5: 0}
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

        this.myAnchor = {
            default: null,
            type: cc.Node
        };
    }

    isPositionOnTop(anchorIndex) {
        return anchorIndex == 3 || anchorIndex == 4;
    }

    isPositionOnRight(anchorIndex) {
        return anchorIndex == 5;
    }

    getPlayerAnchor(id){
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

    _getPlayerSeatIndexs(gameCode){
        return fivePlayerSeats;
    }

    _getNextSeatIndex(seatIndex){

        let nextIndex = null;

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

        return nextIndex;
    }

    _getPreviousSeatIndex(seatIndex){
        let preIndex = null;
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

        return preIndex;
    }
}

app.createComponent(FivePlayerPositions);