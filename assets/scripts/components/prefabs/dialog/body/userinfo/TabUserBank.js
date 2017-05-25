import app from 'app';
import PopupTabBody from 'PopupTabBody';
import PromptPopup from 'PromptPopup';
import { isEmpty, isNumber, active, deactive, numberFormat, timeFormat } from 'Utils';

export default class TabUserBank extends PopupTabBody {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            balanceLbl: cc.Label,
            gridNode: cc.Node,

            mainBodyNode: cc.Node,
            chuyenTienBodyNode: cc.Node,
            withdrawNode: cc.Node,

            promptPrefab: cc.Prefab,
            promtpMainNode: cc.Node,
            hintRichText: cc.RichText,
            p404: cc.Node
        };


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

    // onConfirmRutTienBtnClick(value) {
    //     value = Number(value);
    //     if (isEmpty(value)) {
    //         app.system.error(app.res.string('error_user_enter_empty_input'));
    //         return;
    //     }
    //     if (!isNumber(value) || value < 0) {
    //         app.system.error(app.res.string('error_transfer_input_is_invalid', { type: 'rút' }));
    //         return;
    //     }

    //     if (value > (this._balance - this._remainTransfer)) {
    //         app.system.error(app.res.string('error_balance_is_not_enough', { amount: this._remainTransfer }));
    //         return;
    //     }

    //     if (value < this._minTransfer) {
    //         app.system.error(app.res.string('error_transfer_input_is_too_small', { type: 'rút', min: numberFormat(this._minTransfer) }));
    //         return;
    //     }

    //     if (value > this._maxTransfer) {
    //         app.system.error(app.res.string('error_transfer_input_is_not_over_allow', { type: 'rút', limit: numberFormat(this._maxTransfer) }));
    //         return;
    //     }

    //     this._previousValue = value;

    //     let sendObject = {
    //         cmd: app.commands.USER_GET_MONEY_FROM_BANK,
    //         data: {
    //             [app.keywords.GOLD]: value
    //         }
    //     };

    //     app.service.send(sendObject);

    //     return true;
    // }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.BANK_IN_HISTORY, this._fillContent, this);
        app.system.addListener(app.commands.USER_GET_MONEY_FROM_BANK, this._onUserGetMoney, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.BANK_IN_HISTORY, this._fillContent, this);
        app.system.removeListener(app.commands.USER_GET_MONEY_FROM_BANK, this._onUserGetMoney, this);
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
        if (data.times.length > 0) {
            this.hideEmptyPage(this.p404);
            
            this.initView({
                data: ['Thời gian', 'Nội dung'],
                options: {
                    fontColor: app.const.COLOR_YELLOW
                }
            }, [
                data.times.map(time => timeFormat(time)),
                data.messages
            ], {
                // paging: { next, prev, context: this },
                size: this.gridNode.getContentSize(),
                fontSize: 22,
                group: {
                    widths: [270, '']
                }
            });

            !this.getScrollViewNode().isChildOf(this.gridNode) && this.gridNode.addChild(this.getScrollViewNode());
        } else {
            this.showEmptyPage(this.p404);
        }
    }
}

app.createComponent(TabUserBank);