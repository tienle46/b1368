import app from 'app';
import Component from 'Component';
import {active, deactive} from 'CCUtils';

export default class ItemMessage extends Component {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            titleLbl: cc.Label,
            contentLbl: cc.RichText,
            btnLbl: cc.Label,
            btn: cc.Button
        }
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
        this.node._id = id;
        // this.node.groupType = groupType;
        
        deactive(this.btn.node);
        let maxWidth = 825;
        this.titleLbl.node.setContentSize(maxWidth, this.titleLbl.node.getContentSize().height);
        this.contentLbl.maxWidth = maxWidth;
        
        this._fillData(title, description, time);
        
        // let clickEvent = new cc.Component.EventHandler();
        // clickEvent.target = this.node;
        // clickEvent.component = 'ItemMessage';
        // clickEvent.handler = 'requestMessagesList';

        // this.btn.clickEvents = [clickEvent];
    }
    
    createItemWithButton(id, title, description, time, action, actionData, isReaded) {
        if (action) {
            this.btnLbl.string = action;
            active(this.btn.node);
        } else {
            deactive(this.btn.node);
        }
        this._fillData(title, description, time, action, actionData);
    }
    
    _fillData(title, description, time, action, actionData) {
        if (action) {
            this.btnLbl.string = action;
            active(this.btn.node);
        } else {
            deactive(this.btn.node);
        }
        
        this.titleLbl.string = title;
        this.contentLbl.string = description;
    }
    
    requestMessagesList(e) {
        let target = e.currentTarget;

        if (target) {
            let id = target.id;
            let groupType = target.groupType;

            var sendObject = {
                'cmd': app.commands.LIST_SYSTEM_MESSAGE,
                'cbKey': app.commands.LIST_SYSTEM_MESSAGE,
                'data': {
                    [app.keywords.SYSTEM_MESSAGE_DETAIL.REQUEST.ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                    [app.keywords.SYSTEM_MESSAGE_DETAIL.REQUEST.GROUP_TYPE]: groupType,
                    [app.keywords.SYSTEM_MESSAGE_DETAIL.REQUEST.NODE_ID]: id,
                    // [app.keywords.SYSTEM_MESSAGE.REQUEST.PAGE_NUMBER]: page
                }
            };

            app.service.send(sendObject);
        }
    }
}

app.createComponent(ItemMessage);