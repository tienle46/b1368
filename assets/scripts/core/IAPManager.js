import app from 'app';
import Events from 'Events';

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
        app.system.addListener(Events.ON_SUBMIT_PURCHASE_IOS, this._onSubmitPurchaseIOS, this);
        app.system.addListener(Events.ON_SUBMIT_PURCHASE_ANDROID, this._onSubmitPurchaseAndroid, this);
    }
    
    getPurchases() {
        return this.purchases;    
    }
    
    setPurchases(items) {
        let arrayObject = [];
        items.forEach(item => {
            if(item=="null" || !window.isJSON(item))
                return;
            
            if(typeof item === 'string')
                try {
                    item = JSON.parse(item);
                } catch(e) {}
            
            this.addPurchaseByUsername(item.username, item);
            arrayObject.push(item);
        });

        this.purchases = arrayObject;    
    } 
    
    addPurchaseByUsername(username, item) {
        if(!username || !item)
            return;
        
        if(!this.users[username])
            this.users[username] = [];
        
        this.users[username].push(item);
    }
    
    getPurchasesByUsername(username) {
        if(!username)
            return;
        if(!this.users[username])
            this.users[username] = [];
            
        return this.users[username];    
    }
    
    addPurchase(item) {
        this.purchases.push(item);
        
        this.addPurchaseByUsername(item.username, item);
        
        // set to local storage
        let stringData = this._getIAPItemsFromStorage();
        let stringifyItem = JSON.stringify(item);
        
        if(stringData != "" || stringData.length > 0) {
            stringData = stringData.split(';').concat(stringifyItem).join(';');
            
        } else if(stringData == "") {
            stringData += `${stringifyItem}`;
        }
        
        this._setIAPItemsForStorage(stringData);
    }
    
    removePurchase(token) {
        let savedItems = this.getPurchases();

        if (savedItems.length == 0) {
            // log('IAP: savedItems1 === 0', savedItems.length);
            return;
        }
        
        // remove bought token
        app._.remove(savedItems, (item) => {
            return item && item.receipt == token; 
        }); // <-- affect to savedItems
        
        // renew string storage
        let stringData = "";
        savedItems.forEach((string) => {
            stringData += `${string};`;
        });
        stringData = stringData.substring(0, stringData.length - 1);
        
        this._setIAPItemsForStorage(stringData);
     
        if (savedItems.length == 0) {
            
            this._initEmptyLocalPurchase();
        }
        
        this.setPurchases(savedItems);
    }
    
    _initPluginIAP(sdkboxIAP) {
        // sdkboxIAP.init();
        // sdkboxIAP.setDebug(true);
        
        // save failed items to localStorage
        if (!this._hasPurchase()) {
            this._initEmptyLocalPurchase();
            this.setPurchases([]);
            // log('IAP: cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE) > init new > length', cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE), JSON.stringify(this.purchases));
        } else {
            // stringifyJSON array : [{id, receipt, username}]
            let receiptStringItems = this._getIAPItemsFromStorage(); // {id, receipt, username};{id, receipt, username};{id, receipt, username};
            let lastIndex = receiptStringItems.length - 1;
            let lastCharacter = receiptStringItems[lastIndex]
            if(lastCharacter === ";") 
                receiptStringItems = receiptStringItems.substring(0, lastIndex);
            
            if (receiptStringItems && receiptStringItems.length > 0) {
                let receipts = receiptStringItems.split(';');
                // remove last [""] element
                // array.pop();
                
                receipts.map(stringifiedItem => {
                    // log("\nIAP: stringifiedItem", JSON.stringify(stringifiedItem));
                    let o = stringifiedItem;
                    
                    try {
                        o = JSON.parse(stringifiedItem);
                    } catch (e) {
                        log('\nIAP -> ERROR: -->stringifiedItem', JSON.stringify(e));
                    }
                    return o;
                });
                
                this.setPurchases(receipts);
            } else {
                this._initEmptyLocalPurchase();
                this.setPurchases([]);
            }
        }
        
        // // setup listener
        // app.env.sdkIAPSetListener({
        //     onProductRequestSuccess: (products) => {
        //         //Returns you the data for all the iap products
        //         //You can get each item using following method

        //         let receipts = this.getPurchases();
        //         // log('\nIAP: receiptObjects', JSON.stringify(receipts));
        //         // log('\nIAP: receiptObjects > length', JSON.stringify(receipts.length));

        //         if (receipts.length > 0) {
        //             let productIds = [];
        //             for (let i = 0; i < products.length; i++) {
        //                 // loop
        //                 productIds.push(products[i].id);
        //             }

        //             let purchasedItems = [];
        //             receipts.forEach((stringifiedItem) => {
        //                 let item = JSON.parse(stringifiedItem);
        //                 if (app._.includes(productIds, item.id)) {
        //                     purchasedItems.push(item);
        //                 }
        //             });

        //             this.setPurchases(purchasedItems);

        //             productIds = [];
        //         }
        //     }
        // });
    }
    
    _initEmptyLocalPurchase() {
        (app.system.marker || cc.sys.localStorage).setItem(app.const.IAP_LOCAL_STORAGE, "");
    }
    
    _getIAPItemsFromStorage() {
        let data = app.system.marker ? app.system.marker.getItemData(app.const.IAP_LOCAL_STORAGE) : cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE); // <-- string
        if(typeof data !== 'string')
            data = JSON.stringify(data);
        
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
        
        if(typeof string !== "string")
            string = JSON.stringify(string);
        
        (app.system.marker || cc.sys.localStorage).setItem(app.const.IAP_LOCAL_STORAGE, string);
        
        // app.system.marker ? app.system.marker.setItem(app.const.IAP_LOCAL_STORAGE, string): cc.sys.localStorage.setItem(app.const.IAP_LOCAL_STORAGE, string);
    }
    
    _hasPurchase() {
        return this._getIAPItemsFromStorage() ? this._getIAPItemsFromStorage().length > 0 : false;
    }
    
    _onSubmitPurchaseIOS(data) {
        // log('\nIAP: _onSubmitPurchaseIOS', JSON.stringify(data));
        
        let messages = data['messages'] || [];
        let receipts = data['purchasedProducts'] || []; // [<string>]
        
        receipts.forEach(receipt => {
            this.removePurchase(receipt);
        });

        app.system.hideLoader();
        for (let i = 0; i < messages.length; i++) {
            if (data[app.keywords.RESPONSE_RESULT]) {
                messages[i] && app.system.showToast(messages[i]);
            } else {
                app.system.error(messages[i] || app.res.string('trading_is_cancelled'));
                break;
            }
        }
    }
    
    /**
     * (sfs_array) purchasedProducts: 
        (sfs_object) 
        (utf_string) msg: Bạn đã nạp thành công 20000 Chip vào tài khoản djoker
        (bool) su: true
        (utf_string) productId: com.1368inc.phatloc.20kc
        (utf_string) token: gadnjhbjlohdnijahkfebdej.AO-J1Oyf126egFrlky3FRZ_Li0VG4lxKFHb-yPeQx3lI6LIAsU0gGxqh_KvGgLogOTtcq3gbXKL825aysiEHKe0IZAe1JbZRp5A0y4CAi25Rw1ttJuXouqnjKD-k4BGXwTcW9t8u4ndRtm16o8dM1tqE6hM5eDVYgg
        
        (bool) su: true
        (sfs_array) unverifiedPurchases: 
        (sfs_array) consumedProducts:
     * 
     * @param {any} data 
     * @returns 
     * @memberof IAPManager
     */
    _onSubmitPurchaseAndroid(data) {
        if (!data[app.keywords.RESPONSE_RESULT]) {
            app.system.error(data.message || "");
            app.system.hideLoader();
            return;
        }
    
        let receipts = data['purchasedProducts'] || []; // [{}]
        let unverifiedPurchases = data['unverifiedPurchases'] || []; // [{}]
        let consumedProducts = data['consumedProducts'] || [];  // [{}]

        for (let i = 0; i < receipts.length; i++) {
            let receipt = receipts[i];
            if (receipt.su) {
                this.removePurchase(receipt.token);
                receipt.msg && app.system.showToast(receipt.msg);
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