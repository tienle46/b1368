import app from 'app';
import PopupTabBody from 'PopupTabBody';
import { deactive, active, numberFormat } from 'Utils';

class TabIAP extends PopupTabBody {
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
        window.release(this.__items);
    }

    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        super.loadData();
        
        this._requestPaymentList();

        this._initIAP();

        return false;
    }
    
    onDataChanged(data) {
        data && Object.keys(data).length > 0 && this._renderIAP(data);
    }

    _requestPaymentList() {
        var sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST,
        };

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

            app.system.showLoader(app.res.string('sending_item_store_iap', { provider: app.env.isIOS() ? 'Apple Store' : 'Google Play' }), 60);
            window.sdkbox.IAP.purchase(name);
        }
    }

    _initIAP() {
        if (app.env.isMobile()) {
            app.env.sdkIAPSetListener({
                onSuccess: (product) => {
                    cc.log('\nIAP: onSuccess', JSON.stringify(product));

                    let purchases = [];
                    let contextItem = null;


                    if (app.env.isIOS()) {
                        purchases = [product.receiptCipheredPayload];

                        contextItem = { id: product.id, receipt: product.receiptCipheredPayload };
                    } else if (app.env.isAndroid()) {
                        try {
                            cc.log('IAP -> ccc -> receipt', product.receipt);
                            product.receipt = (typeof product.receipt == 'string') ? product.receipt : `${product.receipt}`;

                            let productReceipt = JSON.parse(product.receipt);
                            if (!(productReceipt && productReceipt.hasOwnProperty('purchaseToken'))) {
                                cc.log('IAP: --> purchaseToken not found!');
                                return;
                            }

                            let token = productReceipt.purchaseToken;
                            purchases = [{
                                productId: product.id,
                                token
                            }];
                            cc.log('IAP purchase2', JSON.stringify(app.context.getPurchases()));
                            contextItem = { id: product.id, receipt: token, username: app.context.getMyInfo().name || "" };

                        } catch (e) {
                            cc.log('IAP : -> catch -> product.receipt is not in json format ', e)
                            return;
                        }
                    }
                    cc.log('IAP contextItem', JSON.stringify(contextItem));
                    (app.context.getPurchases() || []).push(contextItem);

                    if (contextItem) {
                        app.context.setPurchases(app.context.getPurchases());

                        let string = cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE);
                        string += `${JSON.stringify(contextItem)};`;
                        cc.sys.localStorage.setItem(app.const.IAP_LOCAL_STORAGE, string);

                        let sendObj = {
                            cmd: app.env.isIOS() ? app.commands.IOS_IN_APP_PURCHASE : app.commands.ANDROID_IN_APP_PURCHASE,
                            data: {
                                purchases
                            }
                        };

                        app.system.showLoader(app.res.string('iap_buying_successfully_wait_server_response'), 60);
                        cc.log('\nIAP sendObject:', JSON.stringify(sendObj))
                        app.service.send(sendObj);
                    } else {
                        app.system.hideLoader();
                    }
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
                    app.system.error(msg);
                    app.system.hideLoader();
                },
            });
        }
    }
    
    _renderIAP(data) {
        if (this.__sending) {
            this.__sending = false;

            let iapData = app.env.isAndroid() ? data[app.keywords.IN_BILLING_PURCHASE] : data[app.keywords.IN_APP_PURCHASE];
            let { balances, currencies, prices, productIds } = iapData;

            // app.keywords.CHARGE_SMS_OBJECT
            if (balances && balances.length > 0) {

                for (let i = 0; i < balances.length; i++) {
                    let balance = balances[i];
                    let currency = currencies[i];
                    let price = prices[i];
                    let productId = productIds[i];

                    this._initItem(balance, currency ? currency : "$", price, productId);
                }
            }
        }
    }
    
    _onUserGetIAPList(data) {
        this.setLoadedData(data);
    }

    _initItem(balance, currency, price, productId) {
        this.money.string = `${numberFormat(price)}${currency}`;
        this.balance.string = numberFormat(balance);

        let item = cc.instantiate(this.itemNode);
        item.active = true;
        item.productId = productId;
        this.__items.push(item);

        this.contentNode.addChild(item);
    }
}

app.createComponent(TabIAP);