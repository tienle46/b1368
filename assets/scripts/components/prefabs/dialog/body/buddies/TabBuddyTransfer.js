/**
 * Created by Thanh on 1/25/2017.
 */
import app from 'app';
import utils from 'utils';
import DialogActor from 'DialogActor';
import numeral from 'numeral';
import { isNumber } from 'Utils';

export default class TabBuddiesTransfer extends DialogActor {

    constructor() {
        super();

        this.properties = {
            ...this.properties,
            buddyNameLabel: cc.Label,
            balanceLabel: cc.Label,
            playingGameLabel: cc.Label,
            buddyInfoComponent: cc.Node,
            formTransferNode: cc.Node,
            receiverEditBoxNode: cc.EditBox,
            transferAmountEditBoxNode: cc.EditBox,
            transferReasonEditBoxNode: cc.EditBox,
            feeAmountLbl: cc.Label,
            maxAmountLbl: cc.Label,
            minAmountLbl: cc.Label,
            warningLbl: cc.Label,
            maxLblNode: cc.Node
        };

        this._userId = 0;
        this._fee = 0;
        this._min = 0;
        this._max = 0;
    }

    start() {
        super.start();

        this._sendRequest();
    }

    onTransferMoneyBtnClick() {
        this.receiverEditBoxNode.stayOnTop = false;

        let receiver = this.receiverEditBoxNode.string;
        if (!receiver) {
            app.system.error(app.res.string('error_user_enter_empty_input'));
            return;
        }

        let money = Number(this.transferAmountEditBoxNode.string);
        if (!isNumber(money)) {
            app.system.error(app.res.string('error_transfer_input_is_invalid', { input: 'Số tiền gửi' }));
            return;
        }

        if (money < this._min) {
            app.system.error(app.res.string('error_transfer_input_is_too_small', { min: this._min }));
            return;
        }

        if (money < (this._min + this._fee)) {
            app.system.error(app.res.string('error_transfer_input_is_not_enough', { amount: (this._min + this._fee) }));
            return;
        }

        if (money > this._max) {
            app.system.error(app.res.string('error_transfer_input_is_over_max', { max }));
            return;
        }

        let reason = this.transferReasonEditBoxNode.string;

        let data = {};
        data[app.keywords.USERNAME] = receiver;
        data[app.keywords.TRANSFER_USER_ID] = this._userId || 0;
        data[app.keywords.GOLD] = money;
        data[app.keywords.TRANSFER_REASON] = reason;

        let reqObj = {
            cmd: app.commands.USER_TRANSFER_TO_USER,
            data
        };

        app.service.send(reqObj);
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_TRANSFER_CONFIG, this._onGetTransferInfo, this);
        app.system.addListener(app.commands.USER_TRANSFER_TO_USER, this._onUserTransferResponse, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_TRANSFER_CONFIG, this._onGetTransferInfo, this);
        app.system.removeListener(app.commands.USER_TRANSFER_TO_USER, this._onUserTransferResponse, this);
    }

    _sendRequest() {
        let reqObj = {
            cmd: app.commands.USER_TRANSFER_CONFIG
        };

        app.service.send(reqObj);
    }

    _onGetTransferInfo(data) {
        let su = data[app.keywords.RESPONSE_RESULT];
        if (su) {
            this._fee = data[app.keywords.MONEY_FEE] || 0;
            this._min = data[app.keywords.MIN_TRANSFER_AMOUNT] || 0;
            this._max = data[app.keywords.MAX_TRANSFER_AMOUNT] || 0;

            let currentMoney = app.context.getMeBalance();

            this.feeAmountLbl.string = numeral(this._fee).format('0,0');
            this.minAmountLbl.string = numeral(this._min).format('0,0');

            if (this._max) {
                utils.active(this.maxLblNode);

                let maxAmount = numeral(this._max).format('0,0');

                this.maxAmountLbl.string = maxAmount;
            } else {
                utils.deactive(this.maxLblNode);
            }

            if (currentMoney < (this._fee + this._min)) {
                utils.active(this.warningLbl);
                this.warningLbl.string = app.res.string('error_long_is_ineligible');
                utils.deactive(this.formTransferNode);
            }
        } else {
            utils.active(this.warningLbl);
            this.warningLbl.string = app.res.string('error_long_is_ineligible');
        }
    }

    _onUserTransferResponse(data) {
        let su = data[app.keywords.RESPONSE_RESULT];
        if (su) {
            let username = data[app.keywords.USERNAME];
            let amount = data[app.keywords.GOLD];
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

    _onDataChanged() {
        if (this.data && this.data.buddy) {
            this._userId = this.data.buddy.id;
            utils.active(this.buddyInfoComponent);

            this.buddyNameLabel.string = this.data.buddy.name;
            this.receiverEditBoxNode.string = this.data.buddy.name;
            this.receiverEditBoxNode.stayOnTop = true;
            this.balanceLabel.string = `${this.data.buddy.balance || 0}`;

            let gameCode = utils.getVariable(this.data.buddy, 'playingGame');
            let gameName = app.res.gameName[gameCode];
            this.playingGameLabel.string = app.res.string('game_playing_game', { gameName: gameName || "" });
        }
        // else {
        //     this.buddyNameLabel.string = "";
        //     this.balanceLabel.string = '0';
        //     this.playingGameLabel.string = app.res.string('game_playing_game', "");
        //     this.receiverEditBoxNode.string = "";
        // }
    }

}

app.createComponent(TabBuddiesTransfer);