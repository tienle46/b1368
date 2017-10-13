import app from 'app';
import PopupTabBody from 'PopupTabBody';
import { deactive, active, numberFormat } from 'GeneralUtils';

class TabIAP extends PopupTabBody {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
             contentNode: cc.Node,
            itemNode: cc.Node,
            money: cc.Label,
            balance: cc.Label,
        });

        this.__items = [];
    }

    onLoad() {
        super.onLoad();
        this.__items = [];
    }

    onDestroy() {
        super.onDestroy();
        window.release(this.__items);
    }

    loadData() {
        if(this.loadedData)
            return false
        super.loadData();
        
        this.showLoadingProgress();
        if(!app.context.ctl)
            app.system.marker.initRequest(app.system.marker.TOPUP_DIALOG_CACHE_TAB_IAP, this._requestPaymentList.bind(this), this._renderIAP.bind(this))
        else
            this._onUserGetIAPList(app.context.ctl, true);
        
        this._initIAP();

        return false;
    }
    
    onDataChanged(data) {
        if(data && !app._.isEqual(data, this._data))
            Object.keys(data).length > 0 && this._renderIAP(data);
    }

    _requestPaymentList() {
        var sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST,
        };

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
        let target = e.currentTarget.parent;

        if (app.env.isMobile() && window.sdkbox.IAP) {
            let name = target.productId;
            log(`iap name ${name}`);
            app.system.showLoader(app.res.string('sending_item_store_iap', { provider: app.env.isIOS() ? 'Apple Store' : 'Google Play' }), 60);
            window.sdkbox.IAP.purchase(name);
        }
    }

    _initIAP() {
        if (app.env.isMobile()) {
            app.env.sdkIAPSetListener({
                onSuccess: (product) => {
                    log('\nIAP: onSuccess tab', JSON.stringify(product));

                    let purchases = [];
                    let contextItem = null;


                    if (app.env.isIOS()) {
                        purchases = [product.receiptCipheredPayload];

                        contextItem = { id: product.id, receipt: product.receiptCipheredPayload , username: app.context.getMyInfo().name || ""};
                    } else if (app.env.isAndroid()) {
                        try {
                            log('\nIAP -> ccc -> receipt', product.receipt);
                            product.receipt = (typeof product.receipt == 'string') ? product.receipt : `${product.receipt}`;

                            let productReceipt = JSON.parse(product.receipt);
                            if (!(productReceipt && productReceipt.hasOwnProperty('purchaseToken'))) {
                                log('\nIAP: --> purchaseToken not found!');
                                return;
                            }

                            let token = productReceipt.purchaseToken;
                            purchases = [{
                                productId: product.id,
                                token
                            }];
                            // log('IAP purchase2', JSON.stringify(app.iap.getPurchases()));
                            contextItem = { id: product.id, receipt: token, username: app.context.getMyInfo().name || "" };

                        } catch (e) {
                            log('\nIAP : -> catch -> product.receipt is not in json format ', e)
                            return;
                        }
                    }
                    // log('IAP contextItem', JSON.stringify(contextItem));
                    app.iap.addPurchase(contextItem)
                    
                    if (contextItem) {
                        let sendObj = {
                            cmd: app.env.isIOS() ? app.commands.IOS_IN_APP_PURCHASE : app.commands.ANDROID_IN_APP_PURCHASE,
                            data: {
                                purchases
                            }
                        };

                        this.currentScene && sceneName == app.const.scene.DASHBOARD_SCENE && app.system.showLoader(app.res.string('iap_buying_successfully_wait_server_response'), 60);
                        log('\nIAP sendObject:', JSON.stringify(sendObj))
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
                    log('\nIAP: onFailure tab', JSON.stringify(product), JSON.stringify(msg))
                },
                onCanceled: (product) => {
                    //Purchase was canceled by user
                    log('\nIAP: onCanceled tab', JSON.stringify(product))
                    app.system.hideLoader();
                },
            });
        }
    }
    
    _renderIAP(iapData) {

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
    
    _onUserGetIAPList(data, hasCtl = false) {
        this.loadedData = true;
        let renderData = app.env.isAndroid() ? data[app.keywords.IN_BILLING_PURCHASE] : data[app.keywords.IN_APP_PURCHASE];
        hasCtl ? this._renderIAP(renderData) : app.system.marker.renderRequest(app.system.marker.TOPUP_DIALOG_CACHE_TAB_IAP, renderData, this._renderIAP.bind(this));
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