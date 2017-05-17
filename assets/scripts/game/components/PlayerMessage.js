/**
 * Created by Thanh on 10/24/2016.
 */

import app from 'app';
import Component from 'Component';
import TextView from 'TextView';
import { CCUtils, utils } from 'utils';

export default class PlayerMessage extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            textViewNode: cc.Node,
            anchorTop: cc.Node,
            anchorBottom: cc.Node
        }

        this.message = null;
        this.textView = null;
        this.timeoutId = null;
        this.loaded = false;
        this.anchorIndex = -1;
        this.playerRenderer = null;
    }

    setup(player) {
        this.playerRenderer = player;

        this.anchorIndex = this.playerRenderer.getMessageAnchorIndex();
        this.updateAnchor(this.anchorIndex)
    }

    onLoad() {
        this.textView = this.textViewNode.getComponent('TextView');
        this.textView.setMaxWidth(220);
        this.textView.setLines(1);
        this.textView.setIncreaseWidth(10);
        this.loaded = true;

        this.updateAnchor(this.anchorIndex);
        this._setMessage(this.message);
    }

    updateAnchor(anchorIndex) {

        this.anchorIndex = anchorIndex;
        if (!this.loaded) return;

        //this.anchorIndex = (this.playerRenderer && this.playerRenderer.getMessageAnchorIndex(anchorIndex));

        if (this.anchorIndex == 0 && this.playerRenderer.isMePositionOnLeft()) {
            this.textViewNode.setAnchorPoint(0.5, 0);
            this.node.setPosition(35, -15);
        }else if (this.anchorIndex > 0) {
            if (this.playerRenderer.isPositionOnTop()) {
                this.textViewNode.setAnchorPoint(0.5, 1);
                this.node.setPosition(0, 0);
            } else if (this.playerRenderer.isPositionOnLeft()) {
                this.textViewNode.setAnchorPoint(0.5, 0.5);
                this.node.setPosition(35, 0);
            } else if (this.playerRenderer.isPositionOnRight()) {
                this.textViewNode.setAnchorPoint(0.5, 0.5);
                this.node.setPosition(-35, 0);
            }else{
                this.textViewNode.setAnchorPoint(0.5, 0);
                this.node.setPosition(0, 0);
            }
        } else {
            this.textViewNode.setAnchorPoint(0.5, 0);
            this.node.setPosition(0, 0);
        }
    }

    show(message) {
        if (!this.loaded) {
            this.message = message;
            this.node.active = true;
            return;
        }

        this._setMessage(message);
    }

    hide() {
        if (!this.loaded) {
            return;
        }

        this.timeoutId && clearTimeout(this.timeoutId);
        this.timeoutId = null;
        this.message = null;
 
        CCUtils.deactive(this.node);
        this.textView && this.textView.setText("");
    }

    _setMessage(message) {
        this.hide();

        if (!utils.isEmpty(message)) {
            CCUtils.active(this.node);
            this.message = message;
            this.textView && this.textView.setText(message);
            this.timeoutId = setTimeout(() => {
                this.hide();
            }, 4000);
        }
    }

}

app.createComponent(PlayerMessage);