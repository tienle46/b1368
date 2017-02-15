import app from 'app';
import DialogActor from 'DialogActor';
import numeral from 'numeral';
import { deactive, active } from 'Utils';

class TabIAP extends DialogActor {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            toggleGroupNode: cc.Node,
            itemNode: cc.Node,
            money: cc.Label,
            balance: cc.Label,
        };

        this.__rendered = false;
    }

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();

        this.showLoader();

        let data = this.getSharedData(this.getDialog(this.node), 'iap');
        data && this._onUserGetIAPList(data);
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_GET_CHARGE_LIST, this._onGetListDataFromServer, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_GET_CHARGE_LIST, this._onGetListDataFromServer, this);
    }

    _onGetListDataFromServer(data) {
        (!this.__rendered) && this._onUserGetIAPList(app.env.isAndroid() ? data[app.keywords.IN_BILLING_PURCHASE] : data[app.keywords.IN_APP_PURCHASE]);
    }

    onIapItemClick(e) {
        // click
    }

    _onUserGetIAPList(data) {
        this.hideLoader();

        this.__rendered = true;
        let { balances, currencies, prices, productIds } = data;

        // app.keywords.CHARGE_SMS_OBJECT
        if (balances.length > 0) {
            this.hideLoader();

            for (let i = 0; i < balances.length; i++) {
                let balance = balances[i];
                let currency = currencies[i];
                let price = prices[i];
                let productId = productIds[i];
                this._initItem(balance, currency ? currency : "$", price, productId, i === 0);
            }
        } else {
            this.pageIsEmpty(this.node);
        }
    }

    _initItem(balance, currency, price, productId, isChecked) {
        this.money.string = `${numeral(price).format('0,0')}${currency}`;
        this.balance.string = numeral(balance).format('0,0');

        let item = cc.instantiate(this.itemNode);
        item.active = true;
        let toggle = item.getComponent(cc.Toggle);
        if (isChecked) {
            toggle.check();
        }
        this.toggleGroupNode.addChild(item);
    }
}

app.createComponent(TabIAP);