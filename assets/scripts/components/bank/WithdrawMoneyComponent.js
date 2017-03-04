/**
 * Created by Thanh on 3/4/2017.
 */
import app from 'app';
import Actor from 'Actor'
import Utils from 'Utils';

class WithdrawMoneyComponent extends Actor {

    constructor() {
        super();
        this.properties = {
            ...this.properties,
            availableBalanceLabel: cc.Label,
            minLabel: cc.Label,
            inputEditBox: cc.EditBox,
        }

        this.loadedData = false;
    }

    start() {
        super.start();

        if (!this.loadedData) {
            this._loadWithdrawInfo();
        }
    }

    _addGlobalListener(){
        app.system.addListener(app.commands.GET_WITHDRAW_INFO, this._onWithdrawInfoResponse, this)
        app.system.addListener(app.commands.USER_GET_MONEY_FROM_BANK, this._onWithdrawResponse, this)
    }

    _removeGlobalListener(){
        app.system.removeListener(app.commands.GET_WITHDRAW_INFO, this._onWithdrawInfoResponse, this)
        app.system.removeListener(app.commands.USER_GET_MONEY_FROM_BANK, this._onWithdrawResponse, this)
    }

    _onWithdrawResponse(data){
        this.hideLoading()

        let su = data[app.keywords.RESPONSE_RESULT];
        if (su) {
            this.inputEditBox.string = '';
            this._onWithdrawSuccess(data.amount);
        } else {
            let msg = data[app.keywords.RESPONSE_MESSAGE];
            if (msg) {
                app.system.showToast(msg);
            } else {
                app.system.showToast(app.res.string('error_unknow'));
            }
        }
    }

    _onWithdrawInfoResponse(data = {}){
        this.loadedData = true;
        this.hideLoading();
        this.setComponentData({balance: data.balance || 0})
        this.renderComponentData()
    }

    _loadWithdrawInfo() {
        this.showLoading();
        app.service.send({
            cmd: app.commands.BANK_ACCOUNT_WITHDRAW_INFO,
            data: {}
        })
    }

    _onWithdrawSuccess(didWithdrawAmount = 0){
        let data = this.getComponentData();
        data.availableBalance = Math.max(0, data.availableBalance - didWithdrawAmount)
        this.availableBalanceLabel.string = Utils.numberFormat(data.availableBalance)
        app.system.showToast(app.res.string('get_transfer_success', { amount: didWithdrawAmount}));
    }

    setComponentData(data = {}) {
        data.availableBalance = (data.balance - data.remainBalance) || data.balance || 0;
        super.setComponentData(data);
    }

    renderComponentData({balance = 0, minBalance = 0, availableBalance = 0} = {}) {
        this.availableBalanceLabel.string = Utils.numberFormat(availableBalance)
        this.minLabel.string = Utils.numberFormat(this.minBalance)
        this.inputEditBox.string = `${availableBalance}`;
    }

    showLoading() {
        //TODO
    }

    hideLoading() {
        //TODO
    }

    onClickWithdrawButton(){
        let valueStr = this.inputEditBox.string;

        if (Utils.isEmpty(valueStr)) {
            app.system.showToast(app.res.string('error_please_input_withdraw_amount'));
         }else{
            let amount = Number(valueStr);
            if(amount > 0){
                if(amount > this.availableBalance){
                    app.system.showToast(app.res.string('error_withdraw_amount_unable_to_greater_than', {amount: Utils.numberFormat(this.availableBalance)}));
                }else{

                    this.showLoading()
                    app.service.send({
                        cmd: app.commands.USER_GET_MONEY_FROM_BANK,
                        data: {
                            [app.keywords.AMOUNT]: amount
                        }
                    });
                }
            }else{
                app.system.showToast(app.res.string('error_withdraw_amount_must_greater_than'), {amount: 0});
            }
        }
    }
}

app.createComponent(WithdrawMoneyComponent);