/**
 * Created by Thanh on 9/8/2016.
 */

import game from 'game'
import PositionManager from 'PositionManager'

class SixPlayerPositions extends PositionManager {
    constructor() {
        super();

        this.anchor1 = {
            default: null,
            type: cc.Node
        }

        this.anchor2 = {
            default: null,
            type: cc.Node
        }

        this.anchor3 = {
            default: null,
            type: cc.Node
        }

        this.anchor4 = {
            default: null,
            type: cc.Node
        }

        this.anchor5 = {
            default: null,
            type: cc.Node
        }

        this.anchor6 = {
            default: null,
            type: cc.Node
        }

        this.myAnchor = {
            default: null,
            type: cc.Node
        }
    }

    getPlayerPosition(id){
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
            case 6:
                return this.anchor6;
            default:
                return this.myAnchor;
        }
    }
}

game.createComponent(SixPlayerPositions)