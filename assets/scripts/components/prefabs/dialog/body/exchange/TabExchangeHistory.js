import app from 'app';
import PopupTabBody from 'PopupTabBody';
import RubResources from 'RubResources';
import {
    isEmpty,
    numberFormat,
    timeFormat
} from 'Utils';

class TabExchangeHistory extends PopupTabBody {
    constructor() {
        super();
        this.flag = null;
        
        this.properties = {
            ...this.properties,
            bodyNode: cc.Node,
            chargeBtnNode: cc.Node,
            getChipBtnNode: cc.Node,
            p404: cc.Node
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
    
    
    onChargeBtnClick(e) {
        let { cardSerial, serialNumber , telcoId} = e.currentTarget.value;
        // console.debug(cardSerial, serialNumber, telcoId);

        if (isEmpty(cardSerial) || isEmpty(serialNumber) || isNaN(cardSerial) || isNaN(serialNumber)) {
            app.system.error(
                app.res.string('error_user_enter_empty_input')
            );
        } else {
            let sendObject = {
                'cmd': app.commands.USER_SEND_CARD_CHARGE,
                data: {
                    [app.keywords.CHARGE_CARD_PROVIDER_ID]: telcoId,
                    [app.keywords.CARD_CODE]: cardSerial,
                    [app.keywords.CARD_SERIAL]: serialNumber
                }
            };

            app.service.send(sendObject); // send request and get `smsg` (system_message) response from server
        }
    }
    
    onGetChipBtnClick(e) {
        let { transferId } = e.currentTarget.value;
        //console.debug(transferId);
        let sendObject = {
            'cmd': app.commands.GET_BACK_CHIPS,
            data: {
                [app.keywords.ID]: transferId,
            }
        };
        app.service.send(sendObject);
    }
    
    onNextBtnClick(page) {
        this._getHistoriesFromServer(page);
    }
    
    onPreviousBtnClick(page) {
        this._getHistoriesFromServer(page);
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.EXCHANGE_HISTORY, this._onGetExchangeHistory, this);
        app.system.addListener(app.commands.GET_BACK_CHIPS, this._onGetChipBack, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.EXCHANGE_HISTORY, this._onGetExchangeHistory, this);
        app.system.removeListener(app.commands.GET_BACK_CHIPS, this._onGetChipBack, this);
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
        if(res[app.keywords.EXCHANGE_HISTORY.RESPONSE.ITEM_ID_HISTORY] && res[app.keywords.EXCHANGE_HISTORY.RESPONSE.ITEM_ID_HISTORY].length > 0) {
            let data = [
            res[app.keywords.EXCHANGE_HISTORY.RESPONSE.TIME_LIST].map(time => timeFormat(time)),
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
                        var exec = pattern.exec(res[app.keywords.DETAIL_LIST][index]);
                        if (exec && exec.length > 0) {
                            return exec[0];
                        }
                        return app.res.string('sent');
                    case 100:
                        return app.res.string('trading_is_denied');
                    case 101:
                        return app.res.string('got_money');
                    case 102:
                        return app.res.string('request_is_denied');
                    default:
                        return app.res.string('error_system');
                }
            }),
            res[app.keywords.EXCHANGE_HISTORY.RESPONSE.STATUS_LIST].map((status, index) => {
                switch (status) {
                    case 1:
                    case 2:
                        let transferId = res[app.keywords.EXCHANGE_HISTORY.RESPONSE.ITEM_ID_HISTORY][index];
                        
                        let btnNode = cc.instantiate(this.getChipBtnNode);
                            btnNode.value = { transferId };
                            return btnNode;
                    case 3:
                        var cardSerial, serialNumber;
                        var exec = pattern.exec(res[app.keywords.DETAIL_LIST][index]);
                        if (exec && exec.length > 0) {
                            let str = exec[0];
                            let info = str.match(/\d+/g);
                            let telcoId = res['telcoArr'][index];
                            if (info && info.length >= 2) {
                                cardSerial = info[0];
                                serialNumber = info[1];
                                info = null;
                            }
                            
                            let btnNode = cc.instantiate(this.chargeBtnNode);
                            btnNode.value = { cardSerial, serialNumber, telcoId };
                            return btnNode;
                        }
                        return '';
                    default:
                        return '';
                }
            }),
        ];
        this._initBody(data);
        } else {
            this.showEmptyPage(this.p404);
        }

    }
    
    _onGetChipBack(data) {
        if(data[app.keywords.RESPONSE_RESULT]) {
            app.system.showToast(data[app.keywords.RESPONSE_MESSAGE]);
        } else {
            app.system.error(app.res.string(data[app.keywords.RESPONSE_MESSAGE]));
        }
    }
    
    
    _initBody(data) {
        let next = this.onNextBtnClick;
        let prev = this.onPreviousBtnClick;

        let head = {
            data: ['Thời gian', 'Loại vật phẩm', 'Thông tin', 'x'],
            options: {
                fontColor: app.const.COLOR_YELLOW
            }
        };
        this.initView(head, data, {
            fontSize: 22,
            paging: { next, prev, context: this },
            size: this.bodyNode.getContentSize()
        });
        
        !this.getScrollViewNode().isChildOf(this.bodyNode) && this.bodyNode.addChild(this.getScrollViewNode());
    }
}

app.createComponent(TabExchangeHistory);