import app from 'app';
import Component from 'Component';
import ListItemToggleableRub from 'ListItemToggleableRub';
import numeral from 'numeral';
import moment from 'moment';
import ListViewRub from 'ListViewRub';

class TabTransactionHistory extends Component {
    constructor() {
        super();
        this.currentPage = 1;
    }

    onLoad() {
        this.viewRub = new ListViewRub([], { paging: {} });
        this.viewRub.getNode().then((view) => {
            let prev = new cc.Component.EventHandler();
            prev.target = this.node;
            prev.component = 'TabTransactionHistory';
            prev.handler = 'onPreviousBtnClick';

            let next = new cc.Component.EventHandler();
            next.target = this.node;
            next.component = 'TabTransactionHistory';
            next.handler = 'onNextBtnClick';

            this.view = view;
            console.debug(this.view.parent);
            this.viewRub.addEventPagingBtn(prev, next);

            this._getTransactionItems(this.currentPage);
        });
    }

    _getTransactionsFromServer(page, cb) {
        let data = {};
        data[app.keywords.TRANSACTION_HISTORY.REQUEST.PAGE] = page;
        let sendObj = {
            cmd: app.commands.TRANSACTION_HISTORY,
            data
        };

        app.service.send(sendObj, (data) => {
            cb(data);
        });
    }

    onPreviousBtnClick() {
        this.currentPage -= 1;
        if (this.currentPage < 1) {
            this.currentPage = 1;
            return null;
        }
        this._getTransactionItems(this.currentPage);
    }

    onNextBtnClick() {
        this.currentPage += 1;
        this._getTransactionItems(this.currentPage);
    }

    _getTransactionItems(page) {
        this._getTransactionsFromServer(page, (res) => {
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
                }
                this.viewRub.resetData(data);
                (!this.view.parent) && this.node.addChild(this.view);
            }
        });
    }
}

app.createComponent(TabTransactionHistory);