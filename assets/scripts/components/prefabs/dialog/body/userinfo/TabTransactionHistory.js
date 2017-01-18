import app from 'app';
import DialogActor from 'DialogActor';
import ListItemToggleableRub from 'ListItemToggleableRub';
import numeral from 'numeral';
import moment from 'moment';
import ListViewRub from 'ListViewRub';

class TabTransactionHistory extends DialogActor {
    constructor() {
        super();
        this.currentPage = 1;
        this.endPage = false;
        this.itemPerPage = 0;
    }

    onLoad() {
        let next = this.onNextBtnClick.bind(this);
        let prev = this.onPreviousBtnClick.bind(this);

        this.viewRub = new ListViewRub([], { paging: { next, prev } });

    }

    start() {
        super.start();
        this._getTransactionsFromServer(this.currentPage);
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.TRANSACTION_HISTORY, this._onTransactionHistory, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.TRANSACTION_HISTORY, this._onTransactionHistory, this);
    }

    _getTransactionsFromServer(page) {
        let data = {};
        data[app.keywords.TRANSACTION_HISTORY.REQUEST.PAGE] = page;
        let sendObj = {
            cmd: app.commands.TRANSACTION_HISTORY,
            data
        };

        app.system.showLoader();
        app.service.send(sendObj);
    }

    _onTransactionHistory(res) {
        let golds = res[app.keywords.TRANSACTION_HISTORY.RESPONSE.GOLD] || [];
        let items = res[app.keywords.TRANSACTION_HISTORY.RESPONSE.ITEM_LIST] || [];
        let senders = res[app.keywords.TRANSACTION_HISTORY.RESPONSE.USER_SENDER_LIST] || [];
        let times = res[app.keywords.TRANSACTION_HISTORY.RESPONSE.TIME_LIST] || [];
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

            app.system.hideLoader();
            this.viewRub.resetData(data);
            let node = this.viewRub.getNode();

            (!node.parent) && this.node.addChild(node);
        } else {
            this.endPage = true;
            this.pageIsEmpty(this.node);
        }
    }

    onPreviousBtnClick() {
        this.currentPage -= 1;
        if (this.currentPage < 1) {
            this.currentPage = 1;
            return null;
        }
        this.loader.show();
        this._getTransactionsFromServer(this.currentPage);
    }

    onNextBtnClick() {
        if (!this.endPage) {
            this.loader.show();
            this.currentPage += 1;
            this._getTransactionsFromServer(this.currentPage);
        }
    }
}

app.createComponent(TabTransactionHistory);