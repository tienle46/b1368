import app from 'app';
import Actor from 'Actor';
import { isEmpty, setVisibility } from 'Utils';

class TabCard extends Actor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            ratioItem: cc.Node,
            ratioContainer: cc.Node,
            dropDownContainer: cc.Node,
            listCardContainer: cc.Node,
            providerNode: cc.Node,
            providerLbl: cc.Label,
            cardSerialEditBox: cc.EditBox,
            serialNumberEditBox: cc.EditBox
        };

        this.providerId = null;
    }

    onLoad() {
        super.onLoad();
        // wait til every requests is done
        this._initRatioGroup();
    }

    start() {
        super.start();
        this.node.active = false;
        this._initCardsGroup();
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
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

        setVisibility(this.node, false);

        // show loader
        app.system.showLoader();

        app.service.send(sendObject);
    }

    _onUserGetChargeList(data) {
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
        setVisibility(this.node, true);
        this.node.active = true;
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