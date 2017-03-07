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

        this._sending = false;
    }

    onLoad() {
        super.onLoad();
        deactive(this.textContainer);
    }

    start() {
        super.start();
        this._requestPaymentList();
    }

    onSMSBtnClick(e) {
        let { code, command, sendTo } = e;
        this.codeLbl.string = code
        this.shortCodeLbl.string = command
        this.numberLbl.string = sendTo;

        this._sendSMS('test','0983369898');
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
            data: {
                carrierNames: [
                    // carrier name is here.
                ]
            }
        };

        this.showLoader();
        this._sending = true;
        app.service.send(sendObject);
    }

    _onUserGetChargeList(data) {
        // app.keywords.CHARGE_SMS_OBJECT
        if (data.hasOwnProperty(app.keywords.CHARGE_SMS_OBJECT_IAC) && this._sending) {
            const smses = data[app.keywords.CHARGE_SMS_OBJECT_IAC];
            this._sending = false;

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
                window.release(smsInformations);
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
    _sendSMS(message, recipient){ 
        if (app.env.isBrowser()) {  
        } 
        else if (app.env.isMobile()) {
            if (app.env.isIOS()) { 
                window.jsb.reflection.callStaticMethod("JSBUtils", "sendSMS",message,recipient); 
            } if (app.env.isAndroid()) {  
            } 
        }
     }

}

app.createComponent(TabSMS);