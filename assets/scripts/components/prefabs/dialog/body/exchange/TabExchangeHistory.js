import app from 'app';
import PopupTabBody from 'PopupTabBody';
import {
    isEmpty,
    numberFormat,
    timeFormat
} from 'Utils';
import ConfirmPopup from 'ConfirmPopup';

class TabExchangeHistory extends PopupTabBody {
    constructor() {
        super();
        this.flag = null;
        
        this.properties = this.assignProperties({
            bodyNode: cc.Node,
            getChipsBtnNode: cc.Node,
            cancelBtnNode: cc.Node,
            detailBtnNode: cc.Node,
        });
    }
    
    onLoad() {
       super.onLoad();
       this._clickedBtn = null; 
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
        // data && Object.keys(data).length > 0 && this._renderHistory(data);
    }
    
    onDestroy() {
        super.onDestroy();
        window.release(this._res);    
    }
    
    cancelRequestBtnClick(e) {
        let { transferId } = e.currentTarget.value;
        this._clickedBtn = e.currentTarget;
        
        //console.debug(transferId);
        let sendObject = {
            'cmd': app.commands.CANCEL_EXCHANGE_REQUEST,
            data: {
                [app.keywords.ID]: transferId,
            }
        };
        app.service.send(sendObject);
    }
    
    onGetChipBtnClikc(e) {
        let { transferId } = e.currentTarget.value;
        this._clickedBtn = e.currentTarget;
        
        //console.debug(transferId);
        let sendObject = {
            'cmd': app.commands.GET_CHIPS_BACK,
            data: {
                [app.keywords.ID]: transferId,
            }
        };
        app.service.send(sendObject);    
    }
    
    onDetailBtnClick(e) {
        let { transferId } = e.currentTarget.value;
        this._clickedBtn = e.currentTarget;
        
        let sendObject = {
            'cmd': app.commands.GET_EXCHANGE_DETAIL,
            data: {
                [app.keywords.ID]: transferId,
            }
        };
        app.service.send(sendObject);    
        
        // console.debug(cardSerial, serialNumber, telcoId);
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
        app.system.addListener(app.commands.CANCEL_EXCHANGE_REQUEST, this._onCancelExchange, this);
        app.system.addListener(app.commands.GET_CHIPS_BACK, this._onGetChipsBack, this);
        app.system.addListener(app.commands.GET_EXCHANGE_DETAIL, this._onGetExchangeDetail, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.EXCHANGE_HISTORY, this._onGetExchangeHistory, this);
        app.system.removeListener(app.commands.CANCEL_EXCHANGE_REQUEST, this._onCancelExchange, this);
        app.system.removeListener(app.commands.GET_CHIPS_BACK, this._onGetChipsBack, this);
        app.system.removeListener(app.commands.GET_EXCHANGE_DETAIL, this._onGetExchangeDetail, this);
    }
    
    _onGetExchangeDetail(data) {
        let {detail, code, serial, telco} = data;
       
        if(detail) {
            if(code && serial)
                ConfirmPopup.showCustomConfirm(app.system.getCurrentSceneNode(), detail, {
                    acceptLabel: app.res.string('label_topup_money'),
                    acceptCb: this._onChargeCard.bind(this, code, serial, telco)
                });
            else 
                app.system.info(detail);
        } 
    }
    
    _onChargeCard(code, serial, telcoId) {
        if (isEmpty(code) || isEmpty(serial)) {
            app.system.error(
                app.res.string('error_user_enter_empty_input')
            );
        } else {
            
            let sendObject = {
                'cmd': app.commands.USER_SEND_CARD_CHARGE,
                data: {
                    [app.keywords.CHARGE_CARD_PROVIDER_ID]: telcoId,
                    [app.keywords.CARD_CODE]: code,
                    [app.keywords.CARD_SERIAL]: serial
                }
            };

            app.service.send(sendObject); // send request and get `smsg` (system_message) response from server
        }
    }
    
    _onGetChipsBack(data) {
        if(data[app.keywords.RESPONSE_RESULT]) {
            if(this._clickedBtn) {
                let { transferId } = this._clickedBtn.value;
                if(transferId === data[app.keywords.ID]) {
                    this._clickedBtn.removeFromParent();
                }
            }
        } else {
            app.system.error(data[app.keywords.RESPONSE_MESSAGE] ? data[app.keywords.RESPONSE_MESSAGE] : app.res.string('error_system'));
        }
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
        this._renderHistory(data)
    }
    
    _renderHistory(res) {
        let pattern = /Mã thẻ[^]*,/;
        this._rendered = true;
        let data = [
            (res[app.keywords.EXCHANGE_HISTORY.RESPONSE.TIME_LIST] || []).map(time => timeFormat(time)),
            (res[app.keywords.EXCHANGE_HISTORY.RESPONSE.NAME_LIST] || []),
            (res[app.keywords.EXCHANGE_HISTORY.RESPONSE.STATUS_LIST] || []).map((status, index) => {
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
                        return app.res.string('trading_is_cancelled');
                    case 101:
                        return app.res.string('got_money');
                    case 102:
                        return app.res.string('request_is_cancelled');
                    default:
                        return app.res.string('error_system');
                }
            }),
            (res[app.keywords.EXCHANGE_HISTORY.RESPONSE.STATUS_LIST] || []).map((status, index) => {
                let transferId = res[app.keywords.EXCHANGE_HISTORY.RESPONSE.ITEM_ID_HISTORY][index];
                
                switch (status) {
                    case 1:
                        let getChipBtnNode = cc.instantiate(this.getChipsBtnNode);
                        getChipBtnNode.value = {
                            transferId
                        };
                        return getChipBtnNode;
                        // var cardSerial, serialNumber;
                        // var exec = pattern.exec(res[app.keywords.DETAIL_LIST][index]);
                        // if (exec && exec.length > 0) {
                        //     let str = exec[0];
                        //     let info = str.match(/\d+/g);
                        //     let telcoId = res['telcoArr'][index];
                        //     if (info && info.length >= 2) {
                        //         cardSerial = info[0];
                        //         serialNumber = info[1];
                        //         info = null;
                        //     }

                        //     let btnNode = cc.instantiate(this.getChipsBtnNode);
                        //     btnNode.value = {
                        //         cardSerial,
                        //         serialNumber,
                        //         telcoId
                        //     };
                        //     return btnNode;
                        // }
                        // return '';
                    case 11:
                    case 2:
                        let cancelBtnNode = cc.instantiate(this.cancelBtnNode);
                        cancelBtnNode.value = {
                            transferId
                        };
                        return cancelBtnNode;
                    case 101:
                    case 102:
                    case 3:
                    case 12:
                        let detailBtnNode = cc.instantiate(this.detailBtnNode);
                        detailBtnNode.value = {
                            transferId
                        };
                        return detailBtnNode;
                    default:
                        return '';
                }
            }),
        ];
        this._initBody(data);
    }
    
    _onCancelExchange(data) {
        if(data[app.keywords.RESPONSE_RESULT]) {
            if(this._clickedBtn) {
                let { transferId } = this._clickedBtn.value;
                if(transferId === data[app.keywords.ID]) {
                    this._clickedBtn.removeFromParent();
                }
            }
        } else {
            app.system.error(data[app.keywords.RESPONSE_MESSAGE] ? data[app.keywords.RESPONSE_MESSAGE] : app.res.string('error_system'));
        }
    }
    
    
    _initBody(data) {
        this.hideLoadingProgress();
        let next = this.onNextBtnClick;
        let prev = this.onPreviousBtnClick;

        let head = {
            data: ['Thời gian', 'Loại vật phẩm', 'Thông tin', ''],
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