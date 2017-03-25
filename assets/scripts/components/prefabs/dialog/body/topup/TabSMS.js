import app from 'app';
import DialogActor from 'DialogActor';
import RubUtils from 'RubUtils';
import {
    deactive,
    active,
    numberFormat
} from 'Utils';

class TabSMS extends DialogActor {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            toggleGroupNode: cc.Node,
            itemNode: cc.Node,
            moneyGetLbl: cc.Label,
            iconSprite: cc.Sprite,
            moneySend: cc.Label,
            promotionNode: cc.Node,
            promoteDescLbl: cc.Label
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
        let {
            code,
            command,
            sendTo
        } = e.currentTarget;
        // this.codeLbl.string = code
        // this.shortCodeLbl.string = command
        // this.numberLbl.string = sendTo;

        this._sendSMS('test', '0983369898');
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
            const smses = data[app.keywords.CHARGE_SMS_OBJECT_IAC]; // => {1000: {}, 2000: {}}
            this._sending = false;

            if (Object.keys(smses).length > 0) {
                this.hideLoader();
                Object.keys(smses).forEach(key => {
                    let moneySend = key,
                        infos = smses[key][app.keywords.CHARGE_SMS_OBJECT_INFORS] || [],
                        moneyGot = smses[key]['balance'],
                        promoteDesc = smses[key]['promoteDesc'];

                    infos.forEach((smsInfo, i) => {
                        let code = smsInfo.code,
                            sendTo = smsInfo.shortCode,
                            command = smsInfo.syntax,
                            isChecked = i === 0;

                        this._initItem(code, command, sendTo, moneySend, moneyGot, isChecked, moneyGot > moneySend, promoteDesc);
                    });
                });
            } else {
                this.pageIsEmpty(this.node);
            }
        }
    }

    _initItem(code, syntax, sendTo, moneySend, moneyGot, isChecked, hasPromotion, promoteDesc) {
        let iconNumber = Math.round(moneyGot / 10000) + 1;
        RubUtils.getSpriteFrameFromAtlas('blueTheme/atlas/chips', `scoreIcon_${iconNumber >= 5 ? 5 : iconNumber}`, (sprite) => {
            this.iconSprite.spriteFrame = sprite;

            this.moneyGetLbl.string = `${numberFormat(moneyGot)}`;
            this.moneySend.string = `${numberFormat(moneySend)} VNĐ`;
            
            this.promotionNode.active = hasPromotion;
            this.promoteDescLbl.string = promoteDesc || "";
            
            
            let item = cc.instantiate(this.itemNode);
            item.active = true;
            // let toggle = item.getComponent(cc.Toggle);
            item.code = code;
            item.command = syntax;
            item.sendTo = sendTo;
            // if (isChecked) {
            //     toggle.check();
            //     active(this.textContainer);
            //     this.onSMSBtnClick(toggle);
            // }
            this.toggleGroupNode.addChild(item);
        });
    }

    _sendSMS(message, recipient) {
        if (app.env.isBrowser()) {
            // TODO
        } else if (app.env.isMobile()) {
            if (app.env.isIOS()) {
                window.jsb.reflection.callStaticMethod("JSBUtils", "sendSMS", message, recipient);
            }
            if (app.env.isAndroid()) {
                // TODO
            }
        }
    }
}

app.createComponent(TabSMS);