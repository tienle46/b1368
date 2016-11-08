import app from 'app';
import Component from 'Component';
import MessageEvent from 'MessageEvent';
import ListItemToggleableRub from 'ListItemToggleableRub';

export default class TabEvents extends Component {
    constructor() {
        super()
        this.contentNode = {
            default: null,
            type: cc.Node
        }
        this.currentPage = 0;
        this.groupType = app.const.DYNAMIC_GROUP_NEW_EVENT;
    }

    onLoad() {
        this._requestEventList();
    }

    _requestEventList() {
        var sendObject = {
            'cmd': app.commands.LIST_SYSTEM_MESSAGE,
            'cbKey': 'dcn',
            'data': {
                [app.keywords.SYSTEM_MESSAGE.REQUEST.ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.GROUP_TYPE]: this.groupType,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.NODE_ID]: 0,
            }
        };

        app.service.send(sendObject, (data) => {
            debug(data);
            if (data) {
                //convert raw data to list models
                this.currentPage = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.CURRENT_PAGE];

                const listHeader = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.TITLE_LIST];
                const listSub = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.TIME_LIST];
                const listIds = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.ID_ITEM_LIST];

                const events = [];
                for (let i = 0; i < listHeader.length; i++) {
                    const event = new MessageEvent({ title: listHeader[i], sub: listSub[i], nodeId: listIds[i] });
                    events.push(event);
                }

                this._displayEvents(events);
            }

        }, app.const.scene.BOTTOM_BAR);
    }

    _requestEventDetail(nodeId) {
        var sendObject = {
            'cmd': app.commands.LIST_SYSTEM_MESSAGE,
            'cbKey': 'dcn',
            'data': {
                [app.keywords.SYSTEM_MESSAGE.REQUEST.ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.GROUP_TYPE]: this.groupType,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.NODE_ID]: nodeId,
            }
        };

        app.service.send(sendObject, (data) => {
            log(data);
            if (data) {

            }

        }, app.const.scene.BOTTOM_BAR);
    }

    _displayEvents(events) {
        events.forEach((event) => {
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
            this.contentNode.addChild(item.node());
        });
    }
}

app.createComponent(TabEvents);