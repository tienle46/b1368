/**
 * Created by Thanh on 1/24/2017.
 */

import app from 'app';
import utils from 'utils';
import Component from 'Component';
import RubUtils from 'RubUtils';

class ChattingBuddyItem extends Component {

    constructor() {
        super();

        this.properties = {
            ...this.properties,
            nameLabel: cc.Label,
            onlineNode: cc.Node,
            offlineNode: cc.Node,
            avatarNode: cc.Node,
            avatarSpriteNode: cc.Node,
            newMessageCountNode: cc.Node,
            newMessageCountLabel: cc.Label,
            toggle: cc.Toggle
        }

        this.selected = false;
        this.buddy = null;
        this.onCheckedListener = null;
    }

    onLoad() {
        super.onLoad();
    }

    setToggleGroup(toggleGroup) {
        this.toggle.toggleGroup = toggleGroup;
    }

    onEnable() {
        super.onEnable();
        this.isLoaded = true;
        this.onBuddyChanged();
    }

    start() {
        super.start()
    }

    onDestroy() {
        super.onDestroy();
        this.buddy = null;
        this.onCheckedListener = null;
    }

    select() {
        this.toggle.check();
    }

    onReadMessage() {
        utils.setVisible(this.newMessageCountNode, false);
        this.newMessageCountLabel.string = '';
        this.buddy && app.context.removeUnreadMessageBuddies(this.buddy.name);
    }

    isSelected() {
        return this.toggle.isChecked;
    }

    onSelected() {
        this.onCheckedListener && this.onCheckedListener(this);
    }

    onBuddyChanged() {

        if (this.buddy) {
            this.nameLabel.string = this.buddy.displayName || this.buddy.getNickName() || this.buddy.name;
            this.buddy.avatar && RubUtils.loadSpriteFrame(this.avatarSpriteNode.getComponent(cc.Sprite), this.buddy.avatar['tiny'], false, true);
            
            if (this.buddy.isOnline()) {
                utils.setVisible(this.onlineNode, true)
                utils.setVisible(this.offlineNode, false)
            } else {
                utils.setVisible(this.onlineNode, false)
                utils.setVisible(this.offlineNode, true)
            }

            if (this.buddy.newMessageCount > 0) {
                utils.setVisible(this.newMessageCountNode, true);
                this.newMessageCountLabel.string = `${this.buddy.newMessageCount}`;
            } else {
                this.onReadMessage();
            }
        }
    }

    setOnCheckedListener(listener) {
        this.onCheckedListener = listener;
    }

    setBuddy(buddy) {
        this.buddy = buddy;
    }
}

app.createComponent(ChattingBuddyItem);