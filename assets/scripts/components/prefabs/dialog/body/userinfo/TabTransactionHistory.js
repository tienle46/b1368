import app from 'app';
import Component from 'Component';
import ListItemToggleableRub from 'ListItemToggleableRub';
import numeral from 'numeral';
import moment from 'moment';
import ListViewRub from 'ListViewRub';

class TabTransactionHistory extends Component {
    constructor() {
        super();
        this.contentNode = {
            default: null,
            type: cc.Node
        }
    }

    onLoad() {
        // for (let i = 0; i < 3; i++) {
        //     
        // }

        this._getTransactionItems();
    }

    _getTransactionsFromServer(cb) {
        let data = {};
        data[app.keywords.TRANSACTION_HISTORY.REQUEST.PAGE] = 1;
        let sendObj = {
            cmd: app.commands.TRANSACTION_HISTORY,
            data
        };

        app.service.send(sendObj, (data) => {
            cb(data);
        });
    }

    _getTransactionItems() {
        this._getTransactionsFromServer((res) => {
            let golds = res[app.keywords.TRANSACTION_HISTORY.RESPONSE.GOLD];
            let items = res[app.keywords.TRANSACTION_HISTORY.RESPONSE.ITEM_LIST];
            let senders = res[app.keywords.TRANSACTION_HISTORY.RESPONSE.USER_SENDER_LIST];
            let times = res[app.keywords.TRANSACTION_HISTORY.RESPONSE.TIME_LIST];
            let data = [];
            if (items && items.length > 0) {
                for (let i = 0; i < items.length; i++) {
                    let body = {
                        title: {
                            content: `${senders[i]} đã chuyển ${numeral(golds[i]).format('0,0')} coin cho bạn`
                        },
                        subTitle: {
                            content: `${moment(times[i]).format('DD/MM/YYYY - hh:mm')}`
                        },
                        detail: {
                            content: `${senders[i]} đã chuyển ${numeral(golds[i]).format('0,0')} coin cho bạn`
                        },
                        options: {
                            align: {
                                left: 10
                            }
                        }
                    };

                    let options = {
                        group: {
                            widths: ['80%', 54]
                        }
                    };

                    let item = ListItemToggleableRub.create(body, null, options);
                    data.push(item.node());
                    // this.contentNode.addChild(item.node());
                }
                console.debug(data);
                ListViewRub.show(this.node, data);
            }
        });
    }
}

app.createComponent(TabTransactionHistory);