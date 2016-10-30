import app from 'app';
import Component from 'Component';
import ListItemBasicRub from 'ListItemBasicRub';
import numeral from 'numeral';
import moment from 'moment';

class TabTransferTransaction extends Component {
    constructor() {
        super();
        this.contentNode = {
            default: null,
            type: cc.Node
        }
    }

    onLoad() {
        // send request to server.
        this._getTransactionItems();
    }

    onConfirmBtnClick(e) {
        e.stopPropagation();
        console.debug(e.currentTarget.value);
    }


    _hide() {
        this.node.active = false;
    }

    _getTransactionsFromServer(cb) {
        let data = {};
        data[app.keywords.TRANSFER_TRANSACTION.REQUEST.PAGE] = 1;
        let sendObj = {
            cmd: app.commands.TRANSFER_TRANSACTION,
            data
        };

        app.service.send(sendObj, (data) => {
            cb(data);
        });
    }

    _getTransactionItems() {
        this._getTransactionsFromServer((res) => {
            let golds = res[app.keywords.TRANSFER_TRANSACTION.RESPONSE.GOLD];
            let items = res[app.keywords.TRANSFER_TRANSACTION.RESPONSE.ITEM_LIST];
            let senders = res[app.keywords.TRANSFER_TRANSACTION.RESPONSE.USER_SENDER_LIST];
            let times = res[app.keywords.TRANSFER_TRANSACTION.RESPONSE.TIME_LIST];
            if (items.length > 0) {

                let btnClickEvent = new cc.Component.EventHandler();
                btnClickEvent.target = this.node;
                btnClickEvent.component = 'TabTransferTransaction'; // this
                btnClickEvent.handler = 'onConfirmBtnClick'; // -->this.onConfirmBtnClick()

                for (let i = 0; i < items.length; i++) {
                    let transactionItem = new ListItemBasicRub(`<color=eeaa22>${senders[i]}</color> đã chuyển <color=eeaa22>${numeral(golds[i]).format('0,0')}</color> coin cho bạn`, { contentWidth: 470 });
                    transactionItem.initChild();
                    // let image = {
                    //     type: 'button',
                    //     spriteFrame: 'dashboard/dialog/imgs/hopqua',
                    //     width: 118,
                    //     height: 126,
                    //     event: event,
                    //     value: { a: 123 },

                    //     align: {
                    //         right: 10,
                    //         isOnBottom: true
                    //     }
                    // };
                    let label = {
                        type: 'label',
                        text: moment(times[i]).format('DD/MM/YYYY - hh:mm'),
                        width: 170,
                        align: {
                            right: 0,
                            horizontalAlign: cc.Label.HorizontalAlign.RIGHT,
                            isOnBottom: true
                        }
                    };
                    transactionItem.pushEl(label);

                    this.contentNode.addChild(transactionItem.node());
                }
            }

        });
    }
}

app.createComponent(TabTransferTransaction);