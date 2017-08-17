import app from 'app';
import DialogActor from 'DialogActor';
import { numberFormat } from 'GeneralUtils';
import moment from 'moment';

class TabTransactionHistory extends DialogActor {
    constructor() {
        super();
        this.properties = {
            p404: cc.Node
        };
    }

    start() {
        super.start();
        this._getTransactionsFromServer(1);
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

        this.showLoader();

        app.service.send(sendObj);
    }

    _onTransactionHistory(res) {
        let golds = res[app.keywords.TRANSACTION_HISTORY.RESPONSE.GOLD] || [];
        let items = res[app.keywords.TRANSACTION_HISTORY.RESPONSE.ITEM_LIST] || [];
        let senders = res[app.keywords.TRANSACTION_HISTORY.RESPONSE.USER_SENDER_LIST] || [];
        let times = res[app.keywords.TRANSACTION_HISTORY.RESPONSE.TIME_LIST] || [];
        if (items && items.length > 0) {
            let titles = [];
            for (let i = 0; i < items.length; i++) {
                titles.push(app.res.string('user_transaction_money', { sender: senders[i], amount: numberFormat(golds[i]) }));
            }

            let next = this.onNextBtnClick;
            let prev = this.onPreviousBtnClick;

            this.initView({
                data: ['Thời gian', 'Nội dung'],
                options: {
                    fontColor: app.const.COLOR_YELLOW
                }
            }, [
                times.map(time => moment(time).format('DD/MM/YYYY - hh:mm')),
                titles
            ], {
                paging: { next, prev, context: this },
                size: this.contentNode.getContentSize(),
                group: {
                    widths: [150, '']
                }
            });

            this.hideLoader();
            
            !this.getScrollViewNode().isChildOf(this.node) && this.node.addChild(this.getScrollViewNode());

        } else {
            this.showEmptyPage(this.p404);
        }
    }

    onPreviousBtnClick(page) {
        this._getTransactionsFromServer(page);
    }

    onNextBtnClick(page) {
        this._getTransactionsFromServer(page);
    }
}

app.createComponent(TabTransactionHistory);