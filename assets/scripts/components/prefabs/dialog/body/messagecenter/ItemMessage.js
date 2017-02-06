import app from 'app';
import DialogActor from 'DialogActor';

export default class ItemMessage extends DialogActor {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            titleLbl: cc.Label,
            contentLbl: cc.RichText,
            btnLbl: cc.Label,
            btn: cc.Button,
            nodeButton: cc.Button
        }
    }

    onLoad() {
        super.onLoad();
        this.btn.node.active = false;
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

    init(id, title, content, groupType, btnText) {
        this.node.id = id;
        this.node.groupType = groupType;

        this.titleLbl.string = title;
        this.contentLbl.string = content;
        if (btnText) {
            this.btnLbl.string = btnText;
            this.btn.node.active = true;
        }

        let clickEvent = new cc.Component.EventHandler();
        clickEvent.target = this.node;
        clickEvent.component = 'ItemMessage';
        clickEvent.handler = 'requestMessagesList';

        this.nodeButton.clickEvents = [clickEvent];
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