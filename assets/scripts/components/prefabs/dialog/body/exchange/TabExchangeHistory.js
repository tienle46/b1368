import app from 'app';
import Component from 'Component';
import GridViewRub from 'GridViewRub';
import ExchangeDialog from 'ExchangeDialog';

class TabExchangeHistory extends Component {
    constructor() {
        super();
        this.flag = null;
        this.bodyNode = {
            default: null,
            type: cc.Node
        };
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
        let head = {
            data: ['Thời gian', 'Loại vật phẩm', 'Thông tin', ''],
            options: {
                font: 'fonts/newFonts/ICIELPANTON-BLACK',
                fontColor: app.const.COLOR_YELLOW,
                fontSize: 25
            }
        };
        let node = new GridViewRub(head, d, {
            width: 870,
            height: 425,
            spacingX: 0,
            spacingY: 0,
            cell: {
                font: 'fonts/newFonts/ICIELPANTON-BLACK',
            }
        }).getNode();
        this.bodyNode.addChild(node);
    }

    _getExchangeDialogComponent() {
        // this node -> body -> dialog -> dialog (parent)
        let dialogNode = this.node.parent.parent.parent;
        return dialogNode.getComponent(ExchangeDialog);
    }

}

app.createComponent(TabExchangeHistory);