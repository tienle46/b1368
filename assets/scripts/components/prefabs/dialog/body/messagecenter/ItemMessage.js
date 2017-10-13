import app from 'app';
import Component from 'Component';
import {active, deactive} from 'CCUtils';
import ScrollMessagePopup from 'ScrollMessagePopup';

export default class ItemMessage extends Component {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            titleLbl: cc.Label,
            contentLbl: cc.RichText,
            btnLbl: cc.Label,
            btn: cc.Button,
            newIcon: cc.Node
        });
        
        this._id = null; // personal message only
        this._resized = false;
        this._listener = null;
    }

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
    }

    onEnable() {
        super.onEnable();
        !this._resized && this.node.setContentSize(this.node.getContentSize().width, this.node.getContentSize().height - 25 + this.contentLbl.node.getContentSize().height);
        this._resized = true;
    }
    
    onDestroy() {
        super.onDestroy();
        this._id = null; // only personal message has
        this._listener = null;
    }

    createItem(id, title, description, time, isNew, listener) {
        deactive(this.btn.node);
        if(isNew) {
            active(this.newIcon);
        } else {
            let maxWidth = 825;
            this.titleLbl.node.setContentSize(maxWidth, this.titleLbl.node.getContentSize().height);
            this.contentLbl.maxWidth = maxWidth;
            deactive(this.newIcon);
        }
       
        this._fillData(id, title, description, time, null, listener);
    }
    
    createItemWithButton(id, title, description, time, action, handler, isReaded, listener) {
        isReaded ? deactive(this.newIcon): active(this.newIcon);
        
        if (action) {
            this.btnLbl.string = action;
            
            active(this.btn.node);
            this.btn.node.on(cc.Node.EventType.TOUCH_END, handler);
        } else {
            deactive(this.btn.node);
        }
        this._fillData(id, title, description, time, action, listener);
    }
    
    _fillData(id, title, description, time, action, listener) {
        if (action) {
            this.btnLbl.string = action;
            active(this.btn.node);
        } else {
            deactive(this.btn.node);
        }
        if(listener) {
            this._listener = listener;
        }
        
        this._id = {id, description};
        
        this.titleLbl.string = title;
        if(description.length > 130) {
            description = `${description.slice(0, 130)}...`;
        }
        this.contentLbl.string = description;
        
        this.node.active = true;
    }
    
    onMessageClick(e) {
        this._listener && (() => {
            deactive(this.newIcon);
            this._listener();
        })();
    }
}

app.createComponent(ItemMessage);