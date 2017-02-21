import app from 'app';
import DialogActor from 'DialogActor';
import { isEmpty, isNumber, active, deactive, numberFormat } from 'Utils';

export default class TabUserInfo extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            balanceLbl: cc.Label,
            gridNode: cc.Node,

            mainBodyNode: cc.Node,
            chuyenTienBodyNode: cc.Node,

            promptPrefab: cc.Prefab,
            promtpMainNode: cc.Node,
            hintRichText: cc.RichText
        };


        this._balance = 0;
        this._minTransfer = 0;
        this._maxTransfer = 0;
        this._remainTransfer = 0;
        this._previousValue = 0;
    }

    onLoad() {
        super.onLoad();
        this.balanceLbl.string = numberFormat(this.balance);
        this._showMainBody();
    }

    start() {
        super.start();
        this._initUserData();
    }

    onRutTienBtnClick() {
        let prompt = cc.instantiate(this.promptPrefab);
        let mainNode = cc.instantiate(this.promtpMainNode);
        mainNode.active = true;
        let editBox = mainNode.getChildByName('sprite').getChildByName('editbox');
        let edBoxComponent = editBox && editBox.getComponent(cc.EditBox);

        prompt.getComponent('PromptPopup').init(null, mainNode, 'RÚT TIỀN', edBoxComponent, this.onConfirmRutTienBtnClick.bind(this));
    }

    onChuyenTienBtnClick() {
        this._showChuyenTienBody();
    }

    onBackBtnClick() {
        this._showMainBody();
    }

    onConfirmRutTienBtnClick(value) {
        value = Number(value);
        if (isEmpty(value)) {
            app.system.error(app.res.string('error_user_enter_empty_input'));
            return;
        }
        if (!isNumber(value) || value < 0) {
            app.system.error(app.res.string('error_transfer_input_is_invalid', { type: 'rút' }));
            return;
        }

        if (value > (this._balance - this._remainTransfer)) {
            app.system.error(app.res.string('error_balance_is_not_enough', { amount: this._remainTransfer }));
            return;
        }

        if (value < this._minTransfer) {
            app.system.error(app.res.string('error_transfer_input_is_too_small', { type: 'rút', min: numberFormat(this._minTransfer) }));
            return;
        }

        if (value > this._maxTransfer) {
            app.system.error(app.res.string('error_transfer_input_is_not_over_allow', { type: 'rút', limit: numberFormat(this._maxTransfer) }));
            return;
        }

        this._previousValue = value;

        let sendObject = {
            cmd: app.commands.USER_GET_MONEY_FROM_BANK,
            data: {
                [app.keywords.GOLD]: value
            }
        };

        app.service.send(sendObject);
    }

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
            this._balance -= this._previousValue;
            this.balanceLbl.string = numberFormat(this._balance);
            app.system.info(app.res.string('get_transfer_success', { amount: this._previousValue }));
        } else {
            let msg = data[app.keywords.RESPONSE_MESSAGE];
            if (msg) {
                app.system.error(msg);
            } else {
                app.system.error(app.res.string('error_unknow'));
            }
        }
        this._previousValue = 0;
    }

    _initUserData() {
        // send Request
        let sendObject = {
            cmd: app.commands.BANK_IN_HISTORY,
            data: {
                page: 1
            }
        };

        app.service.send(sendObject);
    }

    _fillContent(data) {
        // let next = this.onNextBtnClick;
        // let prev = this.onPreviousBtnClick;
        if (data.balance) {
            this._balance = data.balance;
            this.balanceLbl.string = numberFormat(this._balance);

            this._minTransfer = data.minTransfer;
            this._maxTransfer = data.maxTransfer;

            this._remainTransfer = data.remainBalance;

            this.hintRichText.string = `<outline width=2 color=#000>Số tiền rút tối thiểu: <color=#FF0000>${numberFormat(this._minTransfer)}</c>. Tối thiểu cần có <color=#FF0000> ${numberFormat(this._remainTransfer)} </c> trong tài khoản.</o>`;
        }

        this.initView({
            data: ['Thời gian', 'Nội dung'],
            options: {
                fontColor: app.const.COLOR_YELLOW
            }
        }, [
            data.times,
            data.messages
        ], {
            // paging: { next, prev, context: this },
            size: this.gridNode.getContentSize(),
            group: {
                widths: [270, '']
            }
        });
        this.hideLoader();

        this.gridNode.addChild(this.getScrollViewNode());
    }

    _showMainBody() {
        active(this.mainBodyNode);
        deactive(this.chuyenTienBodyNode);
    }

    _showChuyenTienBody() {
        deactive(this.mainBodyNode);
        active(this.chuyenTienBodyNode);
    }

}

app.createComponent(TabUserInfo);