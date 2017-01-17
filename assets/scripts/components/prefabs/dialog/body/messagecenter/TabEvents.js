import app from 'app';
import DialogActor from 'DialogActor';
import MessageEvent from 'MessageEvent';
import ListItemToggleableRub from 'ListItemToggleableRub';
import ListViewRub from 'ListViewRub';

export default class TabEvents extends DialogActor {
    constructor() {
        super();

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

        this.viewRub = new ListViewRub([], { paging: { next, prev } });
    }

    onDestroy() {
        super.onDestroy();
        this.viewRub.destroy();
    }

    start() {
        super.start();
        this._requestEventList(this.currentPage);
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
        this.currentPage -= 1;
        if (this.currentPage < 1) {
            this.currentPage = 1;
            return null;
        }
        app.system.showLoader();
        this._requestEventList(this.currentPage);
    }

    onNextBtnClick() {
        if (this.endPage) {
            return null;
        }
        app.system.showLoader();
        this.currentPage += 1;
        this._requestEventList(this.currentPage);
    }

    _requestEventList(page) {
        var sendObject = {
            'cmd': app.commands.LIST_SYSTEM_MESSAGE,
            'cbKey': 'dcn',
            'data': {
                [app.keywords.SYSTEM_MESSAGE.REQUEST.ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.GROUP_TYPE]: this.groupType,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.NODE_ID]: 0,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.PAGE_NUMBER]: page
            }
        };

        app.service.send(sendObject);
    }

    _onListSystemMessage(data) {
        app.system.hideLoader();
        if (data) {
            //convert raw data to list models
            // this.currentPage = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.CURRENT_PAGE];

            let listHeader = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.TITLE_LIST];
            let listSub = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.TIME_LIST];
            let listIds = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.ID_ITEM_LIST];

            let events = [];
            for (let i = 0; i < listHeader.length; i++) {
                let event = new MessageEvent({ title: listHeader[i], sub: listSub[i], nodeId: listIds[i] });
                events.push(event);
            }

            if (events.length < 1) {
                this.endPage = true;
                this.pageIsEmpty(this.node);
            } else {
                this._displayEvents(events);
                events = null;
            }
        }
    }

    _displayEvents(events) {
        let data = [];
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            let body = {
                title: {
                    content: `${event.title}`
                },
                subTitle: {
                    content: `${event.sub}`
                },
                detail: {
                    content: `${event.title}`
                },
                options: {
                    align: {
                        left: 100
                    }
                }
            };

            let options = {
                group: {
                    widths: [80, '80%', 54]
                }
            };

            let image = {
                spriteFrame: ''
            };

            if (this.groupType == app.const.DYNAMIC_GROUP_SYSTEM_MESSAGE) {
                image.spriteFrame = 'dashboard/dialog/imgs/thongbao-ico';
            } else if (this.groupType == app.const.DYNAMIC_GROUP_NOTIFY) {
                image.spriteFrame = 'dashboard/dialog/imgs/hopqua';
            }

            let item = ListItemToggleableRub.create(body, image, options);
            data.push(item.node());
            // this.contentNode.addChild(item.node());
        }
        this.viewRub.resetData(data);
        data = null;

        let node = this.viewRub.getNode();

        (!node.parent) && this.node.addChild(node);

        app.system.hideLoader();
    }
}

app.createComponent(TabEvents);