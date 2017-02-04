import app from 'app';
import DialogActor from 'DialogActor';
import MessageEvent from 'MessageEvent';

export default class TabMessages extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            itemPrefab: cc.Prefab,
        };

        this.endPage = false;
        this.itemPerPage = 0;
        this.currentPage = 1;

        this.groupType = app.const.DYNAMIC_GROUP_NEW_EVENT;
    }

    onLoad() {
        super.onLoad();

        app.system.showLoader();
        let next = this.onNextBtnClick.bind(this);
        let prev = this.onPreviousBtnClick.bind(this);
    }


    start() {
        super.start();
        this._requestMessagesList(1);
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.LIST_SYSTEM_MESSAGE, this._onListSystemMessage, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.LIST_SYSTEM_MESSAGE, this._onListSystemMessage, this);
    }


    onPreviousBtnClick() {
        this._requestMessagesList(this.currentPage);
    }

    onNextBtnClick() {
        this._requestMessagesList(this.currentPage);
    }

    _requestMessagesList(page, nodeId = 0) {
        var sendObject = {
            'cmd': app.commands.LIST_SYSTEM_MESSAGE,
            'cbKey': app.commands.LIST_SYSTEM_MESSAGE,
            'data': {
                [app.keywords.SYSTEM_MESSAGE.REQUEST.ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.GROUP_TYPE]: this.groupType,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.NODE_ID]: nodeId,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.PAGE_NUMBER]: page
            }
        };

        app.system.showLoader();
        app.service.send(sendObject);
    }

    _onListSystemMessage(data) {
        //convert raw data to list models
        // this.currentPage = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.CURRENT_PAGE];

        let listHeader = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.TITLE_LIST] || [];
        let listSub = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.TIME_LIST] || [];
        let listIds = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.ID_ITEM_LIST] || [];

        let content = data[app.keywords.SYSTEM_MESSAGE_DETAIL.RESPONSE.CONTENT];
        if (content) {
            app.system.info(content);
            return;
        }

        if (listHeader.length > 0) {
            let messages = [];
            for (let i = 0; i < listHeader.length; i++) {
                // let event = new MessageEvent({ title: listHeader[i], sub: listSub[i], nodeId: listIds[i] });
                // events.push(event);
                let message = cc.instantiate(this.itemPrefab);
                let itemEventComponent = message.getComponent('ItemMessage');
                itemEventComponent.init(listIds[i], listHeader[i], listSub[i], this.groupType);
                messages.push(message);
            }
            this._displayEvents(messages);
        } else {
            this.pageIsEmpty(this.node);
        }
    }

    _displayEvents(events) {
        let next, prev;

        this.initView(null, events, {
            paging: { next, prev, context: this },
            size: this.node.getContentSize(),
            isListView: true
        });
        this.node.addChild(this.getScrollViewNode());
        app.system.hideLoader();
    }
}

app.createComponent(TabMessages);