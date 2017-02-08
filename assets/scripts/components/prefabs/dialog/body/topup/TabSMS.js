import app from 'app';
import DialogActor from 'DialogActor';
import numeral from 'numeral';

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
        };
    }

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this._requestPaymentList();
    }

    onSMSBtnClick() {

    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
    }

    _requestPaymentList() {
        var sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST,
        };

        this.showLoader();
        app.service.send(sendObject);
    }

    _onUserGetChargeList(data) {
        // app.keywords.CHARGE_SMS_OBJECT
        if (data.hasOwnProperty(app.keywords.CHARGE_SMS_OBJECT_IAC)) {
            const smses = data[app.keywords.CHARGE_SMS_OBJECT_IAC];

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
    }

    _initItem(code, syntax, sendTo, moneyGot, isChecked) {
        this.h1Lbl.string = code;
        this.commandLbl.string = syntax;
        this.sendToLbl.string = `Gửi ${sendTo}`;
        this.moneyGetLbl.string = `${numeral(moneyGot).format('0,0')}`;

        let item = cc.instantiate(this.itemNode);
        item.active = true;
        let toggle = item.getComponent(cc.Toggle);
        toggle.isChecked = isChecked;

        this.toggleGroupNode.addChild(item);
    }
}

app.createComponent(TabSMS);