/**
 * Created by Thanh on 9/8/2016.
 */

import app from 'app';
import PlayerPositions from 'PlayerPositions';

const fourPlayerSeats = {
    [1]: {1: 0, 2: 3, 3: 2, 4: 4},
    [2]: {1: 3, 2: 0, 3: 4, 4: 2},
    [3]: {1: 4, 2: 2, 3: 0, 4: 3},
    [4]: {1: 2, 2: 4, 3: 3, 4: 0}
};

export default class FourPlayerPositions extends PlayerPositions {

    constructor() {
        super();

        this.ceilAnchor = 4;

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

        this.myAnchor = {
            default: null,
            type: cc.Node
        };
    }

    onLoad(){
        super.onLoad();
    }

    isPositionOnTop(anchorIndex) {
        return anchorIndex == 3;
    }

    isPositionOnRight(anchorIndex) {
        return anchorIndex == 4;
    }

    isPositionOnLeft(anchorIndex) {
        return anchorIndex == 2;
    }

    isMePositionOnLeft() {
        return true;
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
            default:
                return this.myAnchor;
        }
    }

    _getPlayerSeatIndexs(gameCode){
        switch (gameCode){
            case app.const.gameCode.TLMNDL:
                return fourPlayerSeats;
            case app.const.gameCode.PHOM:
                return fourPlayerSeats;
            default:
                return fourPlayerSeats;
        }
    }

    _getNextSeatIndex(seatIndex){

        let nextIndex = null;

        switch (seatIndex){
            case 0:
            case 1:
                nextIndex = 4;
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
                preIndex = this.scene.gamePlayers.me ? 0 : 1;
                break;
        }

        return preIndex;
    }
}

app.createComponent(FourPlayerPositions);