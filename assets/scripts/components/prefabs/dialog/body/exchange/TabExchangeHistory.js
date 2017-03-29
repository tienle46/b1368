import app from 'app';
import PopupTabBody from 'PopupTabBody';
import RubResources from 'RubResources';

class TabExchangeHistory extends PopupTabBody {
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
    }
    
    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        super.loadData();
        
        this._getHistoriesFromServer();
        return true;
    }
    
    onDataChanged(data) {
        data && Object.keys(data).length > 0 && this._renderHistory(data);
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.EXCHANGE_HISTORY, this._onGetExchangeHistory, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.EXCHANGE_HISTORY, this._onGetExchangeHistory, this);
    }

    _getHistoriesFromServer(page = 1) {
        let sendObject = {
            'cmd': app.commands.EXCHANGE_HISTORY,
            'data': {
                [app.keywords.PAGE]: page,
            }
        };
        
        this.showLoadingProgress();
        app.service.send(sendObject);
    }

    _onGetExchangeHistory(data) {
        this.setLoadedData(data);
    }
    
    _renderHistory(res) {
        let pattern = /Mã thẻ[^]*,/;
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
        let next = this.onNextBtnClick;
        let prev = this.onPreviousBtnClick;

        let head = {
            data: ['Thời gian', 'Loại vật phẩm', 'Thông tin', ''],
            options: {
                fontColor: app.const.COLOR_YELLOW
            }
        };
        this.initView(head, d, {
            paging: { next, prev, context: this },
            size: this.bodyNode.getContentSize()
        });

        this.bodyNode.addChild(this.getScrollViewNode());
    }

    onNextBtnClick(p) {
        this.onNextBtnClick(p);
    }

    onPreviousBtnClick(p) {
        this._getHistoriesFromServer(p);
    }
}

app.createComponent(TabExchangeHistory);