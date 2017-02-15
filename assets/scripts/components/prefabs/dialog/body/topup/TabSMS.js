import app from 'app';
import DialogActor from 'DialogActor';
import numeral from 'numeral';
import { deactive, active } from 'Utils';

class TabSMS extends DialogActor {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            toggleGroupNode: cc.Node,
            itemNode: cc.Node,
            h1Lbl: cc.Label,
            sendToLbl: cc.Label,
            commandLbl: cc.Label,
            moneyGetLbl: cc.Label,
            codeLbl: cc.Label,
            shortCodeLbl: cc.Label,
            numberLbl: cc.Label,
            textContainer: cc.Node,
        };
        this.__rendered = false;
    }

    onLoad() {
        super.onLoad();
        deactive(this.textContainer);
    }

    start() {
        super.start();

        this.showLoader();
        let data = this.getSharedData(this.getDialog(this.node), 'sms');
        data && this._onUserGetChargeList(data);
    }

    onSMSBtnClick(e) {
        let { code, command, sendTo } = e;
        this.codeLbl.string = code
        this.shortCodeLbl.string = command
        this.numberLbl.string = sendTo;
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeListFromServer, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeListFromServer, this);
    }

    _onUserGetChargeListFromServer(data) {
        (!this.__rendered) && this._onUserGetChargeList(data[app.keywords.CHARGE_SMS_OBJECT_IAC]);
    }

    _onUserGetChargeList(data) {
        this.hideLoader();

        this.__rendered = true;

        const smses = data;

        if (smses.length > 0) {
            this.hideLoader();

            let smsInformations = [];
            smses.forEach((sms, index) => {
                let infos = sms[app.keywords.CHARGE_SMS_OBJECT_INFORS];
                infos.forEach((info, i) => {
                    smsInformations.push(info);
                });
            });

            smsInformations.forEach((smsInfo, i) => {
                let moneyGot = smsInfo.balance,
                    code = smsInfo.code,
                    sendTo = smsInfo.shortCode,
                    command = smsInfo.syntax,
                    isChecked = i === 0;

                this._initItem(code, command, sendTo, moneyGot, isChecked);
            });

            smsInformations.length = 0;
        } else {
            this.pageIsEmpty(this.node);
        }
    }

    _initItem(code, syntax, sendTo, moneyGot, isChecked) {
        this.h1Lbl.string = code;
        this.commandLbl.string = syntax;
        this.sendToLbl.string = `Gửi ${sendTo}`;
        this.moneyGetLbl.string = `${numeral(moneyGot).format('0,0')}`;

        let item = cc.instantiate(this.itemNode);
        item.active = true;
        let toggle = item.getComponent(cc.Toggle);
        toggle.code = code;
        toggle.command = syntax;
        toggle.sendTo = sendTo;
        if (isChecked) {
            toggle.check();
            active(this.textContainer);
            this.onSMSBtnClick(toggle);
        }
        this.toggleGroupNode.addChild(item);
    }
}

app.createComponent(TabSMS);