import app from 'app';
import Component from 'Component';
import ListItemToggleableRub from 'ListItemToggleableRub';
import numeral from 'numeral';
import moment from 'moment';
import ListViewRub from 'ListViewRub';
import LoaderRub from 'LoaderRub';

class TabTransactionHistory extends Component {
    constructor() {
        super();
        this.currentPage = 1;
        this.endPage = false;
        this.itemPerPage = 0;
    }

    onLoad() {
        this.loader = new LoaderRub(this.node.parent.parent);

        this.loader.show();
        let next = this.onNextBtnClick.bind(this);
        let prev = this.onPreviousBtnClick.bind(this);

        this.viewRub = new ListViewRub([], { paging: { next, prev } });

        this._getTransactionItems(this.currentPage);
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
        this.loader.show();
        this._getTransactionItems(this.currentPage);
    }

    onNextBtnClick() {
        if (this.endPage) {
            return null;
        }
        this.loader.show();
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
                if (this.currentPage == 1) {
                    this.itemPerPage = items.length;
                } else {
                    this.endPage = items.length < this.itemPerPage;
                }
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
                let node = this.viewRub.getNode();

                (!node.parent) && this.node.addChild(node);
            } else {
                this.endPage = true;
            }
            this.loader.hide();
        });
    }
}

app.createComponent(TabTransactionHistory);