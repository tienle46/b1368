/**
 * Created by Thanh on 3/4/2017.
 */
import app from 'app';
import Actor from 'Actor'
import Utils from 'Utils';
import CCUtils from 'CCUtils';

class WithdrawMoneyComponent extends Actor {

    constructor() {
        super();
        this.properties = this.assignProperties({
            availableBalanceLabel: cc.Label,
            minLabel: cc.Label,
            inputEditBox: cc.EditBox,
            mainNode: cc.Node,
            loadingNode: cc.Node
        });

        this.loadedData = false
        this.onBackButtonClickListener = undefined
    }

    start() {
        super.start();

        if (!this.loadedData) {
            this._loadWithdrawInfo();
        }
    }

    onDestroy(){
        super.onDestroy();
        this.onBackButtonClickListener = false;
    }

    _addGlobalListener(){
        app.system.addListener(app.commands.GET_WITHDRAW_INFO, this._onWithdrawInfoResponse, this)
        app.system.addListener(app.commands.USER_GET_MONEY_FROM_BANK, this._onWithdrawResponse, this)
    }

    _removeGlobalListener(){
        app.system.removeListener(app.commands.GET_WITHDRAW_INFO, this._onWithdrawInfoResponse, this)
        app.system.removeListener(app.commands.USER_GET_MONEY_FROM_BANK, this._onWithdrawResponse, this)
    }

    setOnClickBackButtonListener(onBackButtonClickListener){
        this.onBackButtonClickListener = onBackButtonClickListener;
    }

    onClickBackButton(){
        this.onBackButtonClickListener && this.onBackButtonClickListener();
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
        this.setComponentData({balance: data.balance || 0, minAmount: data.minAmount || 0})
        this.renderComponentData(this.getComponentData())
    }

    _loadWithdrawInfo() {
        this.showLoading();
        app.service.send({
            cmd: app.commands.GET_WITHDRAW_INFO,
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
        this.hideLoading();
        data.availableBalance = (data.balance - data.remainBalance) || data.balance || 0;
        super.setComponentData(data);
    }

    renderComponentData({balance = 0, minAmount = 0, availableBalance = 0} = this.getComponentData()) {
        this.availableBalanceLabel.string = Utils.numberFormat(availableBalance)
        this.minLabel.string = Utils.numberFormat(minAmount)
        this.inputEditBox.string = `${availableBalance}`;
    }

    showLoading(){
        CCUtils.setVisible(this.loadingNode, true)
        CCUtils.setVisible(this.mainNode, false)
    }

    hideLoading(){
        CCUtils.setVisible(this.loadingNode, false)
        CCUtils.setVisible(this.mainNode, true)
    }

    onClickWithdrawButton(){
        let valueStr = this.inputEditBox.string;
        let data = this.getComponentData();
        if(!data.availableBalance){
            app.system.showToast(app.res.string('error_account_out_of_money'));
        }else if (Utils.isEmpty(valueStr)) {
            app.system.showToast(app.res.string('error_please_input_withdraw_amount'));
        }else{
            let amount = Number(valueStr);
            if(amount > 0){
                if(amount > data.availableBalance){
                    app.system.showToast(app.res.string('error_withdraw_amount_unable_to_greater_than', {amount: Utils.numberFormat(data.availableBalance)}));
                }else{

                    let minAmount = data.minAmount || 0;
                    if(minAmount == 0 || amount >= minAmount){
                        this.showLoading()
                        app.service.send({
                            cmd: app.commands.USER_GET_MONEY_FROM_BANK,
                            data: {
                                [app.keywords.AMOUNT]: amount
                            }
                        });

                    }else{
                        app.system.showToast(app.res.string('error_withdraw_amount_cannot_small_than', {amount: minAmount}));
                    }

                }
            }else{
                app.system.showToast(app.res.string('error_withdraw_amount_must_greater_than_zero'));
            }
        }
    }
}

app.createComponent(WithdrawMoneyComponent);