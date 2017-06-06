import app from 'app';

export default class IAPManager {
    constructor() {
        this.purchases = []; // all purchase in this session
        
        this.users = {}; // purchase bought by specified username
        this._addEventListeners();
    }
    
    init(sdkboxIAP) {
        this._initPluginIAP(sdkboxIAP);
    }
    
    _addEventListeners() {
        app.env.isIOS() && app.system.addListener(app.commands.IOS_IN_APP_PURCHASE, this._onSubmitPurchaseIOS, this);
        app.env.isAndroid() && app.system.addListener(app.commands.ANDROID_IN_APP_PURCHASE, this._onSubmitPurchaseAndroid, this);
    }
    
    getPurchases() {
        return this.purchases;    
    }
    
    setPurchases(items) {
        this.users = {};
        
        items.forEach(item => {
            this.addPurchaseByUsername(item.username, item);
        });
        
        this.purchases = items;    
    } 
    
    addPurchaseByUsername(username, item) {
        if(!this.users[username])
            this.users[username] = [];
        
        this.users[username].push(item);
    }
    
    getPurchasesByUsername(username) {
        if(!this.users[username])
            this.users[username] = [];
            
        return this.users[username];    
    }
    
    addPurchase(item) {
        this.purchases.push(item);
        
        this.addPurchaseByUsername(item.username, item);
        
        // set to local storage
        let stringData = this._getIAPItemsFromStorage();
        if(stringData != "" || stringData.length > 0)
            stringData += `;`;
    
        stringData += `${JSON.stringify(item)}`;
        
        this._setIAPItemsForStorage(stringData);
    }
    
    removePurchase(item) {
        let token = item.token;
        
        let savedItems = this.getPurchases();
        log('IAP: savedItems > 0', savedItems.length);

        if (savedItems.length == 0) {
            log('IAP: savedItems1 === 0', savedItems.length);
            return;
        }
        
        // remove bought token
        let removed = app._.remove(savedItems, (item) => {
           return item.receipt == token; 
        }); // <-- affect to savedItems
        
        log('IAP: removed', JSON.stringify(removed));
        
        // renew string storage
        let stringData = savedItems.join(';');
        
        this._setIAPItemsForStorage(stringData);
        
        // let index = app._.findIndex(savedItems, ['receipt', token]);
        // log('IAP: savedItems1 > length:', savedItems.length);
        // log('iap: _onSubmitPurchase receipts >', index);
        // // update localStorage
        // if (index > -1) {
        //     let string = this._getIAPItemsFromStorage();
        //     let bought = savedItems[index];
        //     this._setIAPItemsForStorage(string.replace(`${JSON.stringify(bought)};`, ""))
        //     savedItems.splice(index, 1); // also affected to this.purchases
        // }

        if (savedItems.length == 0) {
            log('IAP: savedItems2 reset purchase === 0', savedItems.length);
            
            this._initEmptyLocalPurchase();
        }
        
        log('IAP localStorage2 ITEM :', cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE).split(';').length - 1);
        this.setPurchases(savedItems);
    }
    
    _initPluginIAP(sdkboxIAP) {
        sdkboxIAP.init();
        sdkboxIAP.setDebug(true);
                
        // save failed items to localStorage
        if (!this._hasPurchase()) {
            this._initEmptyLocalPurchase();
            this.setPurchases([]);
            log('IAP: cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE) > init new > length', cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE), JSON.stringify(this.purchases));
        } else {
            // stringifyJSON array : [{id, receipt, username}]
            let receiptStringItems = this._getIAPItemsFromStorage(); // {id, receipt, username};{id, receipt, username};{id, receipt, username};
            let lastIndex = receiptStringItems.length - 1;
            let lastCharacter = receiptStringItems[lastIndex]
            if(lastCharacter === ";") 
                receiptStringItems = receiptStringItems.substring(0, lastIndex);
            
            if (receiptStringItems && receiptStringItems.length > 0 && ~receiptStringItems.indexOf(';')) {
                (function() {
                    let receipts = receiptStringItems.split(';');
                    // remove last [""] element
                    // array.pop();
                    let users = {}; // receipts bought by user 
                    receipts.map(stringifiedItem => {
                        let o = stringifiedItem;

                        try {
                            o = JSON.parse(stringifiedItem);
                        } catch (e) {
                            log('IAP -> ERROR: -->stringifiedItem', JSON.stringify(e));
                        }
                        return o;
                    });
                    
                    this.setPurchases(receipts);
                    log('IAP: IF', JSON.stringify(this.purchases));
                }());
            } else {
                this._initEmptyLocalPurchase();
                this.setPurchases([]);
                log('IAP: ELSE');
            }
        }
        
        // setup listener
        app.env.sdkIAPSetListener({
            onProductRequestSuccess: (products) => {
                //Returns you the data for all the iap products
                //You can get each item using following method

                let receipts = this.getPurchases();
                log('\nIAP: receiptObjects', JSON.stringify(receipts));
                log('\nIAP: receiptObjects > length', JSON.stringify(receipts.length));

                if (receipts.length > 0) {
                    let productIds = [];
                    for (let i = 0; i < products.length; i++) {
                        // loop
                        productIds.push(products[i].id);
                    }

                    let purchasedItems = [];
                    receipts.forEach((stringifiedItem) => {
                        let item = JSON.parse(stringifiedItem);
                        if (app._.includes(productIds, item.id)) {
                            purchasedItems.push(item);
                            // if (app.env.isIOS()) {
                            //     purchases.push(item.receipt);
                            // } else if (app.env.isAndroid()) {
                            //     purchases.push({ productId: item.id, token: item.receipt });
                            // }
                        }
                    });

                    this.setPurchases(purchasedItems);

                    window.release(productIds);
                }
            }
        });
    }
    
    _initEmptyLocalPurchase() {
        (app.system.marker || cc.sys.localStorage).setItem(app.const.IAP_LOCAL_STORAGE, "");
    }
    
    _getIAPItemsFromStorage() {
        let data = app.system.marker ? app.system.marker.getItemData(app.const.IAP_LOCAL_STORAGE) : cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE); // <-- string
        if(!data)
            return "";
        
        data = data.trim();
        
        let lastIndex = data.length - 1;
        let lastCharacter = data[lastIndex]
        if(lastCharacter === ";") 
            data = data.substring(0, lastIndex);
                
        return data.trim() || "";
    }
    
    _setIAPItemsForStorage(string) {
        (app.system.marker || cc.sys.localStorage).setItem(app.const.IAP_LOCAL_STORAGE, string);
        
        // app.system.marker ? app.system.marker.setItem(app.const.IAP_LOCAL_STORAGE, string): cc.sys.localStorage.setItem(app.const.IAP_LOCAL_STORAGE, string);
    }
    
    _hasPurchase() {
        return this._getIAPItemsFromStorage() ? this._getIAPItemsFromStorage().length > 0 : false;
    }
    
    _onSubmitPurchaseIOS(data) {
        let messages = data['messages'] || [];
        let receipts = data['purchasedProducts'] || [];

        receipts.forEach(receipt => {
            this.removePurchase(receipt);
        });

        app.system.hideLoader();
        for (let i = 0; i < messages.length; i++) {
            if (data[app.keywords.RESPONSE_RESULT]) {
                app.system.showToast(messages[i]);
            } else {
                app.system.error(messages[i] || app.res.string('trading_is_cancelled'));
                break;
            }
        }
    }

    _onSubmitPurchaseAndroid(data) {
        log('IAP: adata', JSON.stringify(data));

        if (!data[app.keywords.RESPONSE_RESULT]) {
            app.system.error(data.message || "");
            app.system.hideLoader();
            return;
        }
        let receipts = data['purchasedProducts'] || [];
        let unverifiedPurchases = data['unverifiedPurchases'] || [];
        let consumedProducts = data['consumedProducts'] || [];

        for (let i = 0; i < receipts.length; i++) {
            let receipt = receipts[i];
            if (receipt.su) {
                this.removePurchase(receipt.token);
                app.system.showToast(receipt.msg);
            } else {
                app.system.error(receipt.msg);
            }
        }

        unverifiedPurchases.forEach(purchase => {
            this.removePurchase(purchase.token);
        });

        consumedProducts.forEach(purchase => {
            this.removePurchase(purchase.token);
        });

        app.system.hideLoader();
    }
}