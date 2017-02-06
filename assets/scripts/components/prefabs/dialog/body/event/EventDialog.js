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
        this.showLoader();

        this.node.on('touch-start', () => {
            return null;
        });

        this.node.on('touch-end', () => {
            return null;
        });

        this._init();

        this._getEventsFromServer();

        this.node.on('event-clicked', ((e) => {
            this.selectedId = e.detail.id;
            this.selectedUrl = e.detail.url;
        }).bind(this));
    }

    _init() {
        this.scrollview = this.node.getChildByName('scrollview');
        this.view = this.scrollview.getChildByName('view');
        this.webview = this.scrollview.getChildByName('webview');

        let btnGroupNode = this.node.getChildByName('btnGroup');
        this.policyBtn = btnGroupNode.getChildByName('policy').getComponent(cc.Button);
        this.attendBtn = btnGroupNode.getChildByName('attend').getComponent(cc.Button);
        this.backBtn = btnGroupNode.getChildByName('back').getComponent(cc.Button);

        this._initState();
    }

    viewLoaded() {
        debug('xxxxxxxx');
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
                let isChecked = i === 0;
                let nodeOptions = {
                    anchor: cc.v2(0, 1),
                    name: 'item',
                    size: size,
                    sprite: {
                        spriteFrame: 'https://crossorigin.me/http://photoservice.gamesao.vn/Resources/Upload/Images/Game/4cf35d11-19cc-43da-a3db-e089c7b787c7.jpg',
                        isCORS: true
                    },
                    toggle: {
                        toggleGroup: this.contentNode.getComponent(cc.ToggleGroup),
                        event,
                        isChecked
                    }
                };

                let node = NodeRub.createNodeByOptions(nodeOptions);
                node.nodeId = listIds[i];
                node.urlContent = `http://dantri.com.vn`;
                this.contentNode.addChild(node);

                if (!isChecked) {
                    node.opacity = 120;
                    this.node.emit('event-clicked', { id: node.nodeId, url: node.urlContent });
                }
            }
            this.hideLoader();
        }
    }

    testCheckEvent(e) {
        e.node.parent.children.forEach((child) => {
            if (child === e.node) {
                e.node.opacity = 255;
            } else {
                child.opacity = 120;
            }
        });
        this.node.emit('event-clicked', { id: e.node.nodeId, url: e.node.urlContent });
    }

    // hide main -> show webview
    onPolicyBtnClick() {
        // hide main
        this._hide();

        let webview = this.webview.getChildByName('view').getComponent(cc.WebView);
        webview.url = this.selectedUrl;
        debug(this.selectedUrl);
    }

    // hide webview -> show main
    onBackBtnClick() {
        this._show();
    }

    _getEventsFromServer() {
        var sendObject = {
            'cmd': app.commands.LIST_SYSTEM_MESSAGE,
            'cbKey': app.commands.LIST_SYSTEM_MESSAGE,
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

    // show scroll list
    _show() {
        this.view.active = true;
        this.policyBtn.node.active = true;

        this.webview.active = false;
        this.backBtn.node.active = false;
    }

    _hide() {
        this.view.active = false;
        this.policyBtn.node.active = false;

        this.webview.active = true;
        this.backBtn.node.active = true;
    }
}

app.createComponent(EventDialog);