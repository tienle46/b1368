import app from 'app';
import Component from 'Component';
import {active, deactive} from 'CCUtils';
import ScrollMessagePopup from 'ScrollMessagePopup';

export default class ItemMessage extends Component {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            titleLbl: cc.Label,
            contentLbl: cc.RichText,
            btnLbl: cc.Label,
            btn: cc.Button,
            newIcon: cc.Node
        };
        
        this._id = null; // only personal message has
    }

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
    }

    onEnable() {
        super.onEnable();
    }

    onDestroy() {
        super.onDestroy();
    }

    createItem(id, title, description, time, isNew) {
        deactive(this.btn.node);
        if(isNew) {
            active(this.newIcon);
        } else {
            let maxWidth = 825;
            this.titleLbl.node.setContentSize(maxWidth, this.titleLbl.node.getContentSize().height);
            this.contentLbl.maxWidth = maxWidth;
            deactive(this.newIcon);
        }
       
        this._fillData(id, title, description, time);
    }
    
    createItemWithButton(id, title, description, time, action, handler, isReaded) {
        isReaded ? deactive(this.newIcon): active(this.newIcon);
        
        if (action) {
            this.btnLbl.string = action;
            
            active(this.btn.node);
            this.btn.node.on(cc.Node.EventType.TOUCH_END, handler);
        } else {
            deactive(this.btn.node);
        }
        this._fillData(id, title, description, time, action);
    }
    
    _fillData(id, title, description, time, action) {
        if (action) {
            this.btnLbl.string = action;
            active(this.btn.node);
        } else {
            deactive(this.btn.node);
        }
        
        this._id = {id, description};
        
        this.titleLbl.string = title;
        if(description.length > 130) {
            description = `${description.slice(0, 130)}...`;
        }
        this.contentLbl.string = description;
    }
    
    onMessageClick(e) {
        if(this._id) {
            let {id, description} = this._id;
            app.service.send({
                cmd: app.commands.CHANGE_PERSONAL_MESSAGE_STATE,
                data: {
                    id
                }
            }, (data) => {
                app.system.info(description);
                if(data[app.keywords.RESPONSE_RESULT]) {
                    
                }
            });
        }
    }
}

app.createComponent(ItemMessage);