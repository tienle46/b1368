import app from 'app';
import Actor from 'Actor';
import ExchangeDialog from 'ExchangeDialog';
import RubResources from 'RubResources';

class TabExchangeHistory extends Actor {
    constructor() {
        super();
        this.flag = null;
        this.bodyNode = {
            default: null,
            type: cc.Node
        };
    }

    start() {
        super.start();
        this._getHistoriesFromServer();
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.EXCHANGE_HISTORY, this._onGetExchangeHistory, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.EXCHANGE_HISTORY, this._onGetExchangeHistory, this);
    }

    _getHistoriesFromServer() {
        let sendObject = {
            'cmd': app.commands.EXCHANGE_HISTORY,
            'data': {
                [app.keywords.PAGE]: 1,
            }
        };
        app.service.send(sendObject);
    }

    _onGetExchangeHistory(res) {
        let pattern = /Mã thẻ[^]*,/;
        console.debug(res);
        let d = (res[app.keywords.EXCHANGE_HISTORY.RESPONSE.ITEM_ID_HISTORY] && res[app.keywords.EXCHANGE_HISTORY.RESPONSE.ITEM_ID_HISTORY].length > 0 && [
            res[app.keywords.EXCHANGE_HISTORY.RESPONSE.TIME_LIST],
            res[app.keywords.EXCHANGE_HISTORY.RESPONSE.NAME_LIST],
            res[app.keywords.EXCHANGE_HISTORY.RESPONSE.STATUS_LIST].map((status, index) => {
                switch (status) {
                    case 1:
                    case 10:
                        return app.res.string('is_ineligible');
                    case 2:
                    case 11:
                        return app.res.string('is_waiting_card');
                    case 3:
                    case 12:
                        if (pattern.exec(res['dtl'][index]).length > 0) {
                            return pattern.exec(res['dtl'][index])[0];
                        }
                        return '';
                    case 100:
                        return app.res.string('trading_is_denied');
                }
            }),
            res[app.keywords.EXCHANGE_HISTORY.RESPONSE.STATUS_LIST].map((status, index) => {
                let width = 150;
                let height = 70;
                switch (status) {
                    case 1:
                    case 2:
                        return { text: 'NHẬN CHIP', button: { eventHandler: null, width, height, spriteFrame: RubResources.YELLOW_BTN } };
                    case 3:
                        var cardSerial, serialNumber;
                        if (pattern.exec(res['dtl'][index]) && pattern.exec(res['dtl'][index]).length > 0) {
                            let str = pattern.exec(res['dtl'][index])[0];
                            let info = str.match(/\d+/g);
                            if (info.length >= 2) {
                                cardSerial = info[0];
                                serialNumber = info[1];
                                info = null;
                            }
                        }
                        var event = new cc.Component.EventHandler();
                        event.target = this.node;
                        event.component = 'TabExchangeHistory';
                        event.handler = '_onChargeToGame';

                        return { text: 'NẠP GAME', button: { eventHandler: event, width, height, value: { cardSerial, serialNumber } } };
                    default:
                        return '';
                }
            }),
        ]) || [];

        this._initBody(d);
    }

    _onChargeToGame(e) {
        let { cardSerial, serialNumber } = e.currentTarget.getValue();
    }

    _initBody(d) {
        let head = {
            data: ['Thời gian', 'Loại vật phẩm', 'Thông tin', ''],
            options: {
                fontColor: app.const.COLOR_YELLOW,
                fontSize: 25
            }
        };
        this.initGridView(head, d, {
            width: 850,
            height: 415,
            spacingX: 0,
            spacingY: 0,
            cell: {
                height: 80,
                fontLineHeight: 80,
            }
        });

        this.bodyNode.addChild(this.getGridViewNode());

        d = null;
    }

    _getExchangeDialogComponent() {
        // this node -> body -> dialog -> dialog (parent)
        let dialogNode = this.node.parent.parent.parent;
        return dialogNode.getComponent(ExchangeDialog);
    }

}

app.createComponent(TabExchangeHistory);