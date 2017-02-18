import app from 'app';
import DialogActor from 'DialogActor';
import numeral from 'numeral';
import { deactive, active } from 'Utils';

class TabIAP extends DialogActor {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            contentNode: cc.Node,
            itemNode: cc.Node,
            money: cc.Label,
            balance: cc.Label,
        };

        this.__sending = false;
        this.__items = [];
    }

    onLoad() {
        super.onLoad();
    }

    onDestroy() {
        super.onDestroy();
        this.__items.length = 0;
    }

    start() {
        super.start();

        this.showLoader();

        this._requestPaymentList();
        this._initIAP();

        // let data = this.getSharedData(this.getDialog(this.node), 'iap');
        // data && this._onUserGetIAPList(data);
    }

    _requestPaymentList() {
        var sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST,
        };

        this.showLoader();
        this.__sending = true;
        app.service.send(sendObject);
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetIAPList, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetIAPList, this);
    }

    onIapItemClick(e) {
        // click
        let target = e.currentTarget;
        cc.log(target.productId);

        if (app.env.isMobile() && window.sdkbox.IAP) {
            let name = target.productId;

            app.system.showLoader('Đang thực hiện giao dịch apple .....', 60);
            window.sdkbox.IAP.purchase(name);
        }
    }

    _initIAP() {
        if (app.env.isMobile()) {
            app.env.sdkIAPSetListener({
                onSuccess: (product) => {
                    cc.log('\nIAP: onSuccess', JSON.stringify(product));

                    let sendObj = {
                        cmd: 'submitPurchase',
                        data: {
                            purchases: [product.receiptCipheredPayload]
                        }
                    };

                    // cc.sys.localStorage.setItem(app.const.IAP_LOCAL_STORAGE, `${cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE)}${JSON.stringify({ id: product.id, receipt: product.receiptCipheredPayload })};`)
                    app.context.setPurchases(app.context.getPurchases().push({ id: product.id, receipt: product.receiptCipheredPayload }));

                    app.system.showLoader('Item đã đc mua, đợi xác nhận từ server .....', 60);
                    cc.log('\nIAP sendObject:', JSON.stringify(sendObj))
                    app.service.send(sendObj);
                },
                onFailure: (product, msg) => {
                    //Purchase failed
                    //msg is the error message
                    app.system.hideLoader();
                    app.system.error(msg);
                    cc.log('\nIAP: onFailure', JSON.stringify(product), JSON.stringify(msg))
                },
                onCanceled: (product) => {
                    //Purchase was canceled by user
                    cc.log('\nIAP: onCanceled', JSON.stringify(product))
                    app.system.hideLoader();
                    app.system.error(msg);
                },
            });
        }
    }

    _onUserGetIAPList(data) {
        this.hideLoader();
        if (this.__sending) {
            this.__sending = false;

            let iapData = app.env.isAndroid() ? data[app.keywords.IN_BILLING_PURCHASE] : data[app.keywords.IN_APP_PURCHASE];
            let { balances, currencies, prices, productIds } = iapData;

            // app.keywords.CHARGE_SMS_OBJECT
            if (balances && balances.length > 0) {
                this.hideLoader();

                for (let i = 0; i < balances.length; i++) {
                    let balance = balances[i];
                    let currency = currencies[i];
                    let price = prices[i];
                    let productId = productIds[i];

                    this._initItem(balance, currency ? currency : "$", price, productId);
                }
            } else {
                this.pageIsEmpty(this.node);
            }
        }
    }

    _initItem(balance, currency, price, productId) {
        this.money.string = `${numeral(price).format('0,0')}${currency}`;
        this.balance.string = numeral(balance).format('0,0');

        let item = cc.instantiate(this.itemNode);
        item.active = true;
        item.productId = productId;
        this.__items.push(item);

        this.contentNode.addChild(item);
    }
}

app.createComponent(TabIAP);