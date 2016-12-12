import app from 'app';
import Component from 'Component';
import MessageEvent from 'MessageEvent';
import ListItemToggleableRub from 'ListItemToggleableRub';
import ListViewRub from 'ListViewRub';
import LoaderRub from 'LoaderRub';

export default class TabEvents extends Component {
    constructor() {
        super();

        this.endPage = false;
        this.itemPerPage = 0;
        this.currentPage = 1;

        this.groupType = app.const.DYNAMIC_GROUP_NEW_EVENT;
    }

    onLoad() {
        this.loader = new LoaderRub(this.node.parent.parent);

        this.loader.show();
        let next = this.onNextBtnClick.bind(this);
        let prev = this.onPreviousBtnClick.bind(this);

        this.viewRub = new ListViewRub([], { paging: { next, prev } });

        this._requestEventList(this.currentPage);
    }

    onPreviousBtnClick() {
        this.currentPage -= 1;
        if (this.currentPage < 1) {
            this.currentPage = 1;
            return null;
        }
        this.loader.show();
        this._requestEventList(this.currentPage);
    }

    onNextBtnClick() {
        if (this.endPage) {
            return null;
        }
        this.loader.show();
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

        app.service.send(sendObject, (data) => {
            debug(data);
            if (data) {
                //convert raw data to list models
                // this.currentPage = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.CURRENT_PAGE];

                const listHeader = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.TITLE_LIST];
                const listSub = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.TIME_LIST];
                const listIds = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.ID_ITEM_LIST];

                const events = [];
                for (let i = 0; i < listHeader.length; i++) {
                    const event = new MessageEvent({ title: listHeader[i], sub: listSub[i], nodeId: listIds[i] });
                    events.push(event);
                }

                if (events.length < 1) {
                    this.endPage = true;
                } else {
                    this._displayEvents(events);
                }
            }
        }, app.const.scene.BOTTOM_BAR);
        this.loader.hide();
    }

    // _requestEventDetail(nodeId) {
    //     var sendObject = {
    //         'cmd': app.commands.LIST_SYSTEM_MESSAGE,
    //         'cbKey': 'dcn',
    //         'data': {
    //             [app.keywords.SYSTEM_MESSAGE.REQUEST.ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
    //             [app.keywords.SYSTEM_MESSAGE.REQUEST.GROUP_TYPE]: this.groupType,
    //             [app.keywords.SYSTEM_MESSAGE.REQUEST.NODE_ID]: nodeId,
    //         }
    //     };

    //     app.service.send(sendObject, (data) => {
    //         log(data);
    //         if (data) {

    //         }

    //     }, app.const.scene.BOTTOM_BAR);
    // }

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
        let node = this.viewRub.getNode();

        (!node.parent) && this.node.addChild(node);

        this.loader.hide();
    }
}

app.createComponent(TabEvents);