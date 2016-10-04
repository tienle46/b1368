/**
 * Created by Thanh on 9/8/2016.
 */

import app from 'app';
import PositionManager from 'PlayerPositions';

class FourPlayerPositions extends PositionManager {

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
}

app.createComponent(FourPlayerPositions);