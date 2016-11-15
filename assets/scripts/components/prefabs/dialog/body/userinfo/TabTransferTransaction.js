import app from 'app';
import Component from 'Component';
import ListItemBasicRub from 'ListItemBasicRub';
import numeral from 'numeral';
import moment from 'moment';
import ListViewRub from 'ListViewRub';
import LoaderRub from 'LoaderRub';


class TabTransferTransaction extends Component {
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

        // send request to server.
        this._getTransactionItems(this.currentPage);
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

    _getTransactionsFromServer(page, cb) {
        let data = {};
        data[app.keywords.TRANSFER_TRANSACTION.REQUEST.PAGE] = page;
        let sendObj = {
            cmd: app.commands.TRANSFER_TRANSACTION,
            data
        };

        app.service.send(sendObj, (data) => {
            cb(data);
        });
    }

    _getTransactionItems(page) {
        this._getTransactionsFromServer(page, (res) => {
            let golds = res[app.keywords.TRANSFER_TRANSACTION.RESPONSE.GOLD];
            let items = res[app.keywords.TRANSFER_TRANSACTION.RESPONSE.ITEM_LIST];
            let senders = res[app.keywords.TRANSFER_TRANSACTION.RESPONSE.USER_SENDER_LIST];
            let times = res[app.keywords.TRANSFER_TRANSACTION.RESPONSE.TIME_LIST];
            let data = [];
            if (items && items.length > 0) {
                if (this.currentPage == 1) {
                    this.itemPerPage = items.length;
                } else {
                    this.endPage = items.length < this.itemPerPage;
                }

                for (let i = 0; i < items.length; i++) {
                    let transactionItem = new ListItemBasicRub(`<color=eeaa22>${senders[i]}</color> đã chuyển <color=eeaa22>${numeral(golds[i]).format('0,0')}</color> coin cho bạn`, { contentWidth: 470 });
                    transactionItem.initChild();

                    let label = {
                        type: 'label',
                        text: moment(times[i]).format('DD/MM/YYYY - hh:mm'),
                        size: {
                            width: 170
                        },
                        align: {
                            right: 0,
                            horizontalAlign: cc.Label.HorizontalAlign.RIGHT,
                            isOnBottom: true
                        }
                    };
                    transactionItem.pushEl(label);
                    data.push(transactionItem.node());
                }
                this.viewRub.resetData(data);
                let node = this.viewRub.getNode();

                (!node.parent) && this.node.addChild(node);
                // ListViewRub.show(this.node, data);
            } else {
                this.endPage = true;
            }
        });
        this.loader.hide();
    }
}

app.createComponent(TabTransferTransaction);