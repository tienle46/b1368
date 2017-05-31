/**
 * Created by Thanh on 2/20/2017.
 */

import app from 'app';
import utils from 'utils';
import Component from 'Component';

class BuddyMenu extends Component {

    constructor() {
        super();
        
        this.properties = this.assignProperties({
            blockButton: cc.Button,
            unblockButton: cc.Button,
            bodyNode: cc.Node,
        });
    
        this._buddy = null;
        this.popupPosition = null;
        this.payload = null;
    }

    onClickBlockBuddy() {
        app.buddyManager.blockBuddy(this._buddy);
        this.hide();
    }

    onClickUnblockBuddy() {
        app.buddyManager.unblockBuddy(this._buddy);
        this.hide();
    }

    onClickRemoveBuddy() {
        app.buddyManager.removeBuddy(this._buddy);

        // let buddyName = this._buddy.name;
        // app.system.confirm(app.res.string('confirm_remove_buddy', {buddyName}), null, () => {
        //     app.buddyManager.removeBuddy(this._buddy);
        // });
        
        this.hide();
    }

    onEnable() {
        super.onEnable();

        this._setBodyNodePosition(this.popupPosition);
        this._updateBlockButton();
    }

    _updateBlockButton(){
        if (this._buddy) {
            log('_updateBlockButton: ', this._buddy.isBlocked());
            let blocked = this._buddy.isBlocked();
            utils.setVisible(this.unblockButton, blocked);
            utils.setVisible(this.blockButton, !blocked);
        }
    }

    _setBodyNodePosition(position) {
        this.bodyNode.setPosition(position.x, position.y);
    }

    onDisable() {
        super.onDisable();
        this._buddy = null;
        this.payload = null;
    }

    hide() {
        this.node.active = false;
    }

    show(position, buddy, payload) {

        if (!position || !buddy) return;

        payload = payload || buddy.name;

        if (payload == this.payload) {
            this.hide();
        } else {
            this._buddy = buddy;
            this.payload = payload;
            this.popupPosition = position;

            if (this.node.active) {
                this._setBodyNodePosition(position);
                this._updateBlockButton();
            } else {
                this.node.active = true;
            }
        }

    }
}

app.createComponent(BuddyMenu);