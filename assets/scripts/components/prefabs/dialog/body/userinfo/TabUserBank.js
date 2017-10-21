import app from 'app';
import PopupTabBody from 'PopupTabBody';
import PromptPopup from 'PromptPopup';
import { isEmpty, isNumber, active, deactive, numberFormat, timeFormat } from 'GeneralUtils';

export default class TabUserBank extends PopupTabBody {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            balanceLbl: cc.Label,
            gridNode: cc.Node,

            mainBodyNode: cc.Node,
            chuyenTienBodyNode: cc.Node,
            withdrawNode: cc.Node,

            promptPrefab: cc.Prefab,
            promtpMainNode: cc.Node,
            hintRichText: cc.RichText,
            p404: cc.Node,
            detailBtnNode: cc.Node
        });

        this._balance = 0;
        this._minTransfer = 0;
        this._maxTransfer = 0;
        this._remainTransfer = 0;
        this._withdrawComponent = null;
        this._transferMoneyComponent = null;
    }

    onLoad() {
        super.onLoad();
        this._showMainBody();
        this._withdrawComponent = this.withdrawNode.getComponent('WithdrawMoneyComponent')
        this._withdrawComponent.setOnClickBackButtonListener(() => this.onBackBtnClick())
        this._transferMoneyComponent = this.chuyenTienBodyNode.getComponent('TabBuddyTransfer')
        this._transferMoneyComponent.setOnClickBackButtonListener(() => this.onBackBtnClick());
    }

    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        super.loadData();
        
        this._initUserData();
        return false;
    }
    
    onDataChanged(data = {}) {
        if(this.popup.initData) {
            this.onChuyenTienBtnClick()
            let { username } = this.popup.initData;
            username && this._transferMoneyComponent.setReceiverName(username);
            this.popup.resetInitData();
            return;            
        }
        
        data.messages && data.messages.length > 0 && this._renderUserData(data);
    }
    
    onRutTienBtnClick() {
        this._withdrawComponent && this._withdrawComponent.setComponentData({balance: this._balance, minBalance: 0, remainBalance: 0})
        deactive(this.mainBodyNode);
        active(this.withdrawNode);

        // PromptPopup.showSingleLine(app.system.getCurrentSceneNode(), {
        //     handler: this.onConfirmRutTienBtnClick.bind(this),
        //     description: app.res.string('label_input_withdrawal_amount'),
        //     acceptLabelText: app.res.string('label_withdrawal'),
        //     inputMode: cc.EditBox.InputMode.NUMERIC
        // })
    }

    onChuyenTienBtnClick() {
        this._showChuyenTienBody();
    }

    onBackBtnClick() {
        this._showMainBody();
    }
    
    onDetailBtnClick(e) {
        let {_itemId} = e.currentTarget
        if(_itemId) {
            app.service.send({
                cmd: app.commands.BANK_TRANSFER_HISTORY_DETAIL,
                data: {
                    [app.keywords.ID]: _itemId
                }
            })
        }
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.BANK_IN_HISTORY, this._fillContent, this);
        app.system.addListener(app.commands.USER_GET_MONEY_FROM_BANK, this._onUserGetMoney, this);
        app.system.addListener(app.commands.BANK_TRANSFER_HISTORY_DETAIL, this._onBankHistoryDetail, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.BANK_IN_HISTORY, this._fillContent, this);
        app.system.removeListener(app.commands.USER_GET_MONEY_FROM_BANK, this._onUserGetMoney, this);
        app.system.removeListener(app.commands.BANK_TRANSFER_HISTORY_DETAIL, this._onBankHistoryDetail, this);
    }
    
    _onBankHistoryDetail(data) {
        const message = data[app.keywords.TRANSFER_REASON]
        message && app.system.info('Chi tiết chuyển khoản', message)    
    }
    
    _onUserTransferResponse(data) {
        let su = data[app.keywords.RESPONSE_RESULT];
        if (su) {
            let username = this.receiverEditBoxNode.string;
            let amount = numberFormat(this.transferAmountEditBoxNode.string);

            app.system.info(app.res.string('transfer_successfully', { amount, username }));
        } else {
            let msg = data[app.keywords.RESPONSE_MESSAGE];
            if (msg) {
                app.system.error(msg);
            } else {
                app.system.error(app.res.string('error_unknow'));
            }
        }
    }

    _onUserGetMoney(data) {
        let su = data[app.keywords.RESPONSE_RESULT];
        if (su) {
            let {amount} = data;
            this._balance -= amount;
            
            this.balanceLbl.string = numberFormat(this._balance);
            // app.system.info(app.res.string('get_transfer_success', { amount: this._previousValue }));
        } 
        // else {
        //     let msg = data[app.keywords.RESPONSE_MESSAGE];
        //     if (msg) {
        //         app.system.error(msg);
        //     } else {
        //         app.system.error(app.res.string('error_unknow'));
        //     }
        // }
        // this._previousValue = 0;
    }

    _initUserData() {
        // send Request
        let sendObject = {
            cmd: app.commands.BANK_IN_HISTORY,
            data: {
                page: 1
            }
        };
        
        this.showLoadingProgress();
        app.service.send(sendObject);
    }

    _fillContent(data) {
        this.setLoadedData(data);
    }

    _showMainBody() {
        active(this.mainBodyNode);
        deactive(this.chuyenTienBodyNode);
        deactive(this.withdrawNode);
    }

    _showChuyenTienBody() {
        deactive(this.mainBodyNode);
        active(this.chuyenTienBodyNode);
    }
    
    _renderUserData(data) {
        // let next = this.onNextBtnClick;
        // let prev = this.onPreviousBtnClick;
        if (data.hasOwnProperty('balance')) {
            this._balance = data.balance;
            this.balanceLbl.string = numberFormat(this._balance);

            this._minTransfer = data.minTransfer;
            this._maxTransfer = data.maxTransfer;

            this._remainTransfer = data.remainBalance;

            //this.hintRichText.string = `<outline width=2 color=#000>Số chip rút tối thiểu: <color=#FF0000>${numberFormat(this._minTransfer)}</c>. Tối thiểu cần có <color=#FF0000> ${numberFormat(this._remainTransfer)} </c> trong tài khoản.</o>`;
        }
        
        const d = [
            data.times.map(time => timeFormat(time)),
            data.messages,
            data[app.keywords.ID_LIST].map(id => {
                let btn = cc.instantiate(this.detailBtnNode)
                btn._itemId = id
                
                return btn
            })
        ]
        
        if (data.times.length > 0) {
            this.hideEmptyPage(this.p404);
            
            this.initView({
                data: ['Thời gian', 'Nội dung', 'Chi tiết'],
                options: {
                    fontColor: app.const.COLOR_YELLOW
                }
            }, [
                data.times.map(time => timeFormat(time)),
                data.messages,
                data[app.keywords.ID_LIST].map(id => {
                    let btn = cc.instantiate(this.detailBtnNode)
                    btn._itemId = id
                    
                    return btn
                })
            ], {
                // paging: { next, prev, context: this },
                size: this.gridNode.getContentSize(),
                fontSize: 22,
                group: {
                    widths: [270, '', 120]
                }
            });

            !this.getScrollViewNode().isChildOf(this.gridNode) && this.gridNode.addChild(this.getScrollViewNode());
        } else {
            this.showEmptyPage(this.p404);
        }
    }
}

app.createComponent(TabUserBank);