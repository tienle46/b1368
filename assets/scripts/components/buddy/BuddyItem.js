/**
 * Created by Thanh on 1/24/2017.
 */

import app from 'app';
import utils from 'utils';
import Component from 'Component';

class BuddyItem extends Component {
    
    constructor() {
        super();

        this.nameLabel = {
            default: null,
            type: cc.Label
        }

        this.onlineNode = {
            default: null,
            type: cc.Node
        }

        this.offlineNode = {
            default: null,
            type: cc.Node
        }

        /**
         * @type {cc.Toggle}
         */
        this.toggle = null;
        this.online = false;
        this.selected = false;
        this.name = "";
        this.isLoaded = false;
        this.buddyList = null;
        this.toggleGroup = cc.ToggleGroup;
        this.onClickListener = null;
    }

    onLoad(){
        super.onLoad();
        this.toggle = this.node.getComponent(cc.Toggle);
    }

    onEnable(){
        super.onEnable();
        this.isLoaded = true;

        this.toggleGroup && (this.toggle.toggleGroup = this.toggleGroup);

        if(this.buddy){
            this._onBuddyChanged();
        }
    }

    _onBuddyChanged(){
        if(this.buddy) {
            this.nameLabel.string = this.buddy.name;
            this.setOnlineState(this.buddy.isOnline());
        }
    }

    setBuddyList(buddyList){
        this.buddyList = buddyList;
    }

    setOnlineState(online = false){
        this.online = online;
        utils.setVisible(this.onlineNode, online);
        utils.setVisible(this.offlineNode, !online);
    }

    setSelected(selected = false){
        this.selected = selected;
        if(this.isLoaded){
            selected ? this.toggle.check() : this.toggle.uncheck();
        }
    }

    setBuddy(buddy){
        this.buddy = buddy;
        if(this.isLoaded){
            this._onBuddyChanged();
        }
    }

    setToggleGroup(toggleGroup){
        this.toggleGroup = toggleGroup;
        if(this.isLoaded){
            this.toggle.toggleGroup = toggleGroup;
        }
    }

    setOnClickListener(listener){
        this.onClickListener = listener;
    }

    onClickItem(){
        this.onClickListener && this.onClickListener(this);
    }
}

app.createComponent(BuddyItem);