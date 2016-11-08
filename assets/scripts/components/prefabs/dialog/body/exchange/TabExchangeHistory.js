import app from 'app';
import Component from 'Component';
import GridViewRub from 'GridViewRub';
import ExchangeDialog from 'ExchangeDialog';

class TabExchangeHistory extends Component {
    constructor() {
        super();
        this.flag = null;
    }

    onLoad() {
        // wait til every requests is done
        // this.node.active = false;

        // get content node
        // this.contentNode = this.node.getChildByName('view').getChildByName('content');
        // this._initItemsList();
        // init tabRub
        this._getExchangeDialogComponent().hideUpdatePhone();
        this._initData((data) => {
            this._initBody(data);
        });
        // this._initTabs();
    }

    _initData(cb) {
        let sendObject = {
            'cmd': app.commands.EXCHANGE_HISTORY,
            'data': {
                [app.keywords.PAGE]: 1,
            }
        };
        app.service.send(sendObject, (res) => {
            let pattern = /Mã thẻ[^]*,/;

            let d = (res[app.keywords.EXCHANGE_HISTORY.RESPONSE.ITEM_ID_HISTORY] && res[app.keywords.EXCHANGE_HISTORY.RESPONSE.ITEM_ID_HISTORY].length > 0 && [
                res[app.keywords.EXCHANGE_HISTORY.RESPONSE.TIME_LIST],
                res[app.keywords.EXCHANGE_HISTORY.RESPONSE.NAME_LIST],
                res[app.keywords.EXCHANGE_HISTORY.RESPONSE.STATUS_LIST].map((status, index) => {
                    switch (status) {
                        case 1:
                        case 10:
                            return 'Không đủ điều kiện';
                        case 2:
                        case 11:
                            return 'Đang chờ duyệt thẻ';
                        case 3:
                        case 12:
                            if (pattern.exec(res['dtl'][index]).length > 0) {
                                return pattern.exec(res['dtl'][index])[0];
                            }
                            return '';

                        case 100:
                            return 'Giao dịch bị huỷ bỏ';

                    }
                }),
                res[app.keywords.EXCHANGE_HISTORY.RESPONSE.STATUS_LIST].map((status) => {
                    switch (status) {
                        case 1:
                        case 2:
                            return { text: 'NHẬN LẠI CHIP', button: { eventHandler: null, width: 150, height: 45 } };
                        case 3:
                            return { text: 'NẠP VÀO GAME', button: { eventHandler: null, width: 150, height: 45 } };
                        default:
                            return '';
                    }
                }),
            ]) || [];

            cb(d);
        });
    }

    _initBody(d) {
        let bodyNode = this.node.getChildByName('body');

        let event = null;
        GridViewRub.show(bodyNode, { data: ['Thời gian', 'Loại vật phẩm', 'Thông tin', ''], options: { fontColor: app.const.COLOR_YELLOW } }, d, { position: cc.v2(2, 120), width: 780, event });
    }

    _getExchangeDialogComponent() {
        // this node -> body -> dialog -> dialog (parent)
        let dialogNode = this.node.parent.parent.parent;
        return dialogNode.getComponent(ExchangeDialog);
    }

}

app.createComponent(TabExchangeHistory);