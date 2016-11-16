import app from 'app';
import Component from 'Component';
import NodeRub from 'NodeRub';

class EventDialog extends Component {
    constructor() {
        super();
        this.contentNode = {
            default: null,
            type: cc.Node
        };

        this.groupType = app.const.DYNAMIC_GROUP_NEW_EVENT;
    }

    onLoad() {
        this.node.on('touch-start', () => {
            return null;
        });
        this.node.on('touch-end', () => {
            return null;
        });
        this._init();

        this._getEventsFromServer();
        this.node.on('event-clicked', (e) => {
            console.debug('click cmnr haha', e.detail);
        });
    }

    _init() {
        this.scrollview = this.node.getChildByName('scrollview');
        this.webview = this.contentNode.parent.parent.getChildByName('webview');

        let btnGroupNode = this.node.getChildByName('btnGroup');
        this.policyBtn = btnGroupNode.getChildByName('policy').getComponent(cc.Button);
        this.attendBtn = btnGroupNode.getChildByName('attend').getComponent(cc.Button);
        this.backBtn = btnGroupNode.getChildByName('back').getComponent(cc.Button);

        this._initState();
    }

    _initView(data) {
        const listHeader = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.TITLE_LIST];
        const listIds = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.ID_ITEM_LIST];

        if (listHeader.length > 0) {
            let size = this.scrollview.getChildByName('view').getContentSize();
            size.width -= 105;

            let event = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = 'EventDialog';
            event.handler = 'testCheckEvent';

            for (var i = 0; i < listHeader.length; i++) {
                let nodeOptions = {
                    anchor: cc.v2(0, 1),
                    name: 'item',
                    size: size,
                    sprite: {
                        spriteFrame: 'https://s-media-cache-ak0.pinimg.com/originals/6a/7c/e9/6a7ce948bca69401e159c648dcf22176.jpg',
                        isCORS: true
                    },
                    toggle: {
                        toggleGroup: this.contentNode.getComponent(cc.ToggleGroup),
                        event
                    }
                };

                let node = NodeRub.createNodeByOptions(nodeOptions);
                node.nodeId = listIds[i];
                this.contentNode.addChild(node);
            }
        }
    }

    testCheckEvent(e) {
        e.node.parent.children.forEach((child) => {
            if (child === e.node) {
                e.node.opacity = 120;
            } else {
                child.opacity = 255;
            }
        });
        this.node.emit('event-clicked', e.node.nodeId);
    }

    onPolicyBtnClick() {

    }

    _getEventsFromServer() {
        var sendObject = {
            'cmd': app.commands.LIST_SYSTEM_MESSAGE,
            'cbKey': 'dcn',
            'data': {
                [app.keywords.SYSTEM_MESSAGE.REQUEST.ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.GROUP_TYPE]: this.groupType,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.NODE_ID]: 0,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.PAGE_NUMBER]: 1
            }
        };

        app.service.send(sendObject, (data) => {
            this._initView(data);
        });
    }

    _initState() {
        // show scrollview
        this._show();
    }

    _show() {
        this.scrollview.active = true;
        this.policyBtn.node.active = true;

        this.webview.active = false;
        this.backBtn.node.active = false;
    }

    _hide() {
        this.scrollview.active = false;
        this.policyBtn.node.active = false;

        this.webview.active = true;
        this.backBtn.node.active = true;
    }
}

app.createComponent(EventDialog);