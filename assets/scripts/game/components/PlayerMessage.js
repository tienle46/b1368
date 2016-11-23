/**
 * Created by Thanh on 10/24/2016.
 */

import app from 'app';
import Component from 'Component';
import TextView from 'TextView';
import {CCUtils, utils} from 'utils';

export default class PlayerMessage extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            textViewNode : cc.Node,
            anchorTop : cc.Node,
            anchorBottom : cc.Node
        }

        this.message = null;
        this.textView = null;
        this.timeoutId = null;
        this.loaded = false;
        this.anchorIndex = -1;
        this.playerRenderer = null;
    }

    setup(player){
        this.playerRenderer = player;
        this.anchorIndex = this.playerRenderer.anchorIndex;
    }

    onLoad(){
        this.textView = this.textViewNode.getComponent('TextView');
        this.textView.setMaxWidth(220);
        this.textView.setLines(1);
        this.textView.setIncreaseWidth(10);
        this.loaded = true;

        this.updateAnchor(this.anchorIndex);
        this._setMessage(this.message);
    }

    updateAnchor(anchorIndex){
        if(!this.loaded) return;

        this.anchorIndex = anchorIndex;
        if(this.anchorIndex >= 0){

            let isTopAnchor = this.playerRenderer.scene.gamePlayers.playerPositions.isPositionOnTop(anchorIndex);

            if(isTopAnchor){
                this.textViewNode.setAnchorPoint(0.5, 1);
                this.node.setPosition(this.anchorBottom.getPosition());
            }else{
                this.textViewNode.setAnchorPoint(0.5, 0);
                this.node.setPosition(this.anchorTop.getPosition());
            }

        }
    }

    show(message){
        if(!this.loaded){
            this.message = message;
            return;
        }

        this._setMessage(message);
    }

    hide(){
        if(!this.loaded){
            return;
        }

        this.timeoutId && clearTimeout(this.timeoutId);
        this.timeoutId = null;
        this.message = null;

        this.node.active = false;
        this.textView.setText("");
    }

    _setMessage(message){
        this.hide();

        if(!utils.isEmpty(message)){
            this.node.active = true;
            this.message = message;
            this.textView.setText(message);
            this.timeoutId = setTimeout(() => {
                this.hide();
            }, 5000);
        }
    }

}

app.createComponent(PlayerMessage);