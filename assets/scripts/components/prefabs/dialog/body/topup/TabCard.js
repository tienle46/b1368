import app from 'app';
import Component from 'Component';
import { isEmpty } from 'Utils';

class TabCard extends Component {
    constructor() {
        super();

        this.ratioItem = {
            default: null,
            type: cc.Node
        };

        this.ratioContainer = {
            default: null,
            type: cc.Node
        };

        this.dropDownContainer = {
            default: null,
            type: cc.Node
        };

        this.listCardContainer = {
            default: null,
            type: cc.Node
        };

        this.providerNode = {
            default: null,
            type: cc.Node
        };

        this.providerLbl = {
            default: null,
            type: cc.Label
        };

        this.cardSerialEditBox = {
            default: null,
            type: cc.EditBox
        };

        this.serialNumberEditBox = {
            default: null,
            type: cc.EditBox
        };

        this.providerId = null;
    }

    onLoad() {
        // wait til every requests is done
        this.node.active = false;
        // show loader
        app.system.showLoader();

        this._initCardsGroup();

        this._initRatioGroup();
    }

    _initRatioGroup() {
        let rateFaker = 0.8;
        let typesFaker = [10, 20, 50, 100, 200, 500];

        typesFaker.forEach(type => {
            let ratioItem = cc.instantiate(this.ratioItem);
            let ratioItemComponent = ratioItem.getComponent('RatioItem');
            ratioItemComponent.initItem(type * 1000, rateFaker);
            ratioItem.active = true;
            this.ratioContainer.addChild(ratioItem);
        });
    }

    _initCardsGroup() {
        let sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST
        };

        app.service.send(sendObject, (data) => {
            if (data) {
                let cardListIds = data[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ID_LIST];
                cardListIds.forEach((id, index) => {
                    let item = cc.instantiate(this.providerNode);
                    let lbl = item.getChildByName('providername').getComponent(cc.Label);
                    let providerName = data[app.keywords.TASK_NAME_LIST][index];
                    lbl.string = providerName;

                    item.active = true;
                    item.providerName = providerName;
                    item.providerId = id;

                    this.listCardContainer.addChild(item);
                });

                app.system.hideLoader();

                // active node
                this.node.active = true;

            }
        }, app.const.scene.DASHBOARD_SCENE);
    }

    onShowDropDownBtnClick() {
        this._toggleDropdown();
    }

    onProviderItemBtnClick(e) {
        let target = e.currentTarget;
        this.providerId = target.providerId;
        this.providerLbl.string = `${target.providerName}`;
        this._toggleDropdown();
    }

    onHanleChargeBtnClick() {
        let cardSerial = this.cardSerialEditBox.string.trim();
        let serialNumber = this.serialNumberEditBox.string.trim();

        if (!this.providerId) {
            app.system.error(
                app.res.string('error_topup_dialog_need_to_choice_item')
            );
            return;
        }

        if (isEmpty(cardSerial) || isEmpty(serialNumber) || isNaN(cardSerial) || isNaN(serialNumber)) {
            app.system.error(
                app.res.string('error_user_enter_empty_input')
            );
        } else {
            let data = {};
            // app.system.showLoader();
            data[app.keywords.CHARGE_CARD_PROVIDER_ID] = this.providerId;
            data[app.keywords.CARD_CODE] = cardSerial;
            data[app.keywords.CARD_SERIAL] = serialNumber;
            let sendObject = {
                'cmd': app.commands.USER_SEND_CARD_CHARGE,
                data
            };
            app.service.send(sendObject); // send request and get `smsg` (system_message) response from server
        }
    }

    _toggleDropdown() {
        let state = this.dropDownContainer.active;
        this.dropDownContainer.active = !state;
    }
}

app.createComponent(TabCard);