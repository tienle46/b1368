import DialogRub from 'DialogRub';
import ExchangeDialog from 'ExchangeDialog';
import RubUtils from 'RubUtils';
import AlertPopupRub from 'AlertPopupRub';
import app from 'app';

export default class ExchangeDialogRub extends DialogRub {
    constructor(node, tabOptions) {
        super(node, tabOptions);
    }

    init() {
        return super.init().then(() => {
            this.exchangeDialogComponent = this.prefab.addComponent(ExchangeDialog);

            this._addPhoneUpdateBody();

            return null;
        }).catch(e => {
            console.error(e);
        });
    }

    _addPhoneUpdateBody() {
        let prefabUrl = 'dashboard/dialog/prefabs/exchange/update_phone_number';
        RubUtils.loadRes(prefabUrl).then((prefab) => {
            this.upn = cc.instantiate(prefab);
            // this.upn.y = this.upn.getPositionY() - 50;

            // add to dialogNode 
            this.dialogNode.addChild(this.upn);

            this.upnBtnGroupNode = this.upn.getChildByName('btnGroup');
            // hide this node
            this._hideUpdatePhoneNumberNode();
        }).then(() => {
            // register btn event
            this._registerBackBtnEvent();
            this._registerConfirmBtnEvent();
        });
    }

    // update_phone_number -> confirmBtn
    _registerConfirmBtnEvent() {
        let confirmBtnNode = this.upnBtnGroupNode.getChildByName('confirmBtn');

        confirmBtnNode.on(cc.Node.EventType.TOUCH_END, ((e) => {
            e.stopPropagation();
            this._onUpdatePhoneBtnClick();
        }).bind(this));
    }

    // update_phone_number -> backBtn
    _registerBackBtnEvent() {
        let backBtnNode = this.upnBtnGroupNode.getChildByName('backBtn');

        backBtnNode.on(cc.Node.EventType.TOUCH_END, (e) => {
            e.stopPropagation();

            this._toggleBody();
        });
    }

    // change state between update_phone_number node and current node inside body
    _toggleBody() {
        // show current body
        if (this.bodyNode.children[0]) this.bodyNode.children[0].active = true;

        // hide update_phone_number node
        this._hideUpdatePhoneNumberNode();
    }

    _hideUpdatePhoneNumberNode() {
        this.upn.active = false;
    }

    _onUpdatePhoneBtnClick() {
        let input = this.upn.getChildByName('input').getComponent(cc.EditBox);
        let phoneNumber = input.string;

        // invalid phone number
        if (!phoneNumber || isNaN(Number(phoneNumber)) || phoneNumber.length < 8) {
            AlertPopupRub.show(this.node, 'Số điện thoại không hợp lệ');
        } else {
            let data = {};
            data[app.keywords.PHONE_NUMBER] = phoneNumber;
            let sendObject = {
                cmd: app.commands.UPDATE_PHONE_NUMBER,
                data
            };

            app.service.send(sendObject, (data) => {
                if (data[app.keywords.RESPONSE_RESULT]) {
                    AlertPopupRub.show(this.node, 'Xác nhận số điện thoại thành công.', function() {
                        this._toggleBody();
                    }.bind(this));
                } else {
                    AlertPopupRub.show(this.node, 'Có lỗi xảy ra !');
                }
            });
        }
    }
}