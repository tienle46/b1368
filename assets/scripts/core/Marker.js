/**
 * local storage management
 * Its data needs to be refreshed if has any change between currently data and new one.
 */
import app from 'app';
import Utils from 'Utils';

export default class Marker {
    constructor() {
        cc.sys.localStorage = cc.sys.localStorage;
        this._RQ = '$[RQ]'; // $[namespace] for caching requested data
        
        this.caches = {};
                
        this._initCaches();
        this._addGlobalStaticKeys();
        this._initDefaultGameState();
    }
    
    _addGlobalStaticKeys() {
        this.SOUND_OPTION = 'sound_popup';
        this.SHOW_INVITATION_POPUP_OPTION = 'show_invitation_popup_option';
        // app.const.SOUND_OPTION = '!{{username}}sound_popup';
    }
    
    _initDefaultGameState() {
        if(!this.getItem(this.SOUND_OPTION)) {
            this.setItem(this.SOUND_OPTION, true);
        }
        if(!this.getItem(this.SHOW_INVITATION_POPUP_OPTION)) {
            this.setItem(this.SHOW_INVITATION_POPUP_OPTION, true);
        }
        
        // mark data login
        this.USER_LOCAL_STORAGE = app.const.USER_LOCAL_STORAGE;
        this.IAP_LOCAL_STORAGE = app.const.IAP_LOCAL_STORAGE;

        // cache requests
        this.TOPUP_DIALOG_CACHE_TAB_CARD = `${this._RQ}_TOPUP_DIALOG_CACHE_TAB_CARD`;
        this.TOPUP_DIALOG_CACHE_TAB_SMS = `${this._RQ}_TOPUP_DIALOG_CACHE_TAB_SMS`;
        this.TOPUP_DIALOG_CACHE_TAB_IAP = `${this._RQ}_TOPUP_DIALOG_CACHE_TAB_IAP`;
    }
    
    // cache then render key request
    renderRequest(key, renderData, callback) {
        this.setItem(key, renderData);
        
        // if any changes
        if(this.isUpdated(key)) {
            if(Utils.isFunction(callback)) {
                callback(renderData);     
            }
        }
    }
    
    initRequest(key, requestCb, renderCb) {
        // if key is cached
        if(this._isCached(key)) {
            let renderData = this.getItemData(key);
            // render
            renderData && renderCb(renderData);
        }
        
        requestCb(); 
    }
    
    /**
     * 
     * @param {any} key 
     * @param {any} data 
     * @param {any} stuff data 
     * @returns 
     * 
     * @memberOf Marker
     */
    setItem(key, data) {
        let k = this._validKey(key),
            _$isNew = true,
            _$isUpdated = true;
        if(!k)
            return;
        
        if(this._isCached(key)) {
            _$isNew = false;
            _$isUpdated = this.isUpdatedData(key, data);
        }
        
        let stateData = {
            data,
            _$isNew,
            _$isUpdated
        };
        
        this._setStateData(key, stateData);
        
        if(_$isNew || _$isUpdated) {
            // convert data to string in order to save into localStorage
            if(!Utils.isString(data)) {
                try {
                    if(!Utils.isObject(data))
                        data = JSON.parse(data);
                    
                    data = JSON.stringify(data);
                } catch(e) {
                    // INGORE ERROR
                }
            }
        
            cc.sys.localStorage.setItem(key, data);
        }
        
        return stateData;
    }
    
    getItem(key) {
        let k = this._validKey(key);
        if(!k)
            return null;
        let namespace = this._getNamespaceFromScope(k);
        
        let parentObject = namespace ? this.caches[namespace]: this.caches;
        
        // sometimes cc.sys need delayed time after mapping in initCaches
        if(!parentObject[k]) {
            cc.sys.localStorage.getItem(k) && (parentObject[k] = this.setItem(k, cc.sys.localStorage.getItem(k)));
        }
        
        return parentObject[k];
    }
    
    /**
     * Returns item: {data} of given key
     * 
     * @param {any} key 
     * @returns 
     * 
     * @memberOf Marker
     */
    getItemData(key) {
        let item = this.getItem(key);
        return item ? item.data : null;
    }
    
    isEqual(key, value) {
        return app._.isEqual(this.getItemData(key), value);     
    }
    
    isNew(key) {
       let item = this.getItem(key);
       return item ? item._$isNew : null;
    }
    
    /**
     * current _$isUpdated state of key item
     * @param {any} key 
     * @returns 
     * 
     * @memberOf Marker
     */
    isUpdated(key) {
       let item = this.getItem(key);
       return item ? item._$isUpdated : null; 
    }
    
    /**
     * Comparation between current data and new data by key
     * @param {any} key 
     * @param {any} newData 
     * @returns true if data is new, otherwise returns false
     * 
     * @memberOf Marker
     */
    isUpdatedData(key, newData) {
        return !this.isEqual(key, newData);
    }
    
    _setStateData(key, stateData) {
        let k = this._validKey(key),
        namespace = this._getNamespaceFromScope(k);   
        
        if(namespace) {
            if(!this.caches[namespace])
                this.caches[namespace] = {};
            
            this.caches[namespace][k] = stateData;
        } else {
            this.caches[k] = stateData;
        }
    }
    
    _initCaches() {
        for (var i = 0; i <  cc.sys.localStorage.length; i++){
            let key = cc.sys.localStorage.key(i);
            let data = cc.sys.localStorage.getItem(key);
            
            try {
                data = JSON.parse(data);
            } catch(e) {
                // INGORE ERROR
            }
            
            this._setStateData(key, {
                data,
                _$isNew: false,
                _$isUpdated: false
            });
        }
    }
    
    _validKey(key) {
        if(!key)
            return null;
            
        return (key instanceof Object) ? JSON.stringify(key) : `${key}`;
    }
    
    /**
     * 
     * @param {any} key 
     * @param {any} [parentObject=this.caches] 
     * @returns 
     * 
     * @memberOf Marker
     */
    _isCached(key) {
        let k = this._validKey(key);
        if(!k)
            return false;
        let namespace = this._getNamespaceFromScope(k);
        
        let parentObject = namespace ? this.caches[namespace] : this.caches;
        
        return parentObject && parentObject.hasOwnProperty(k);
    }
    
    // return name if key contains namespace, otherwise return null;
    _getNamespaceFromScope(key) {
        key = this._validKey(key);
        if(!key)
            return;
        
        let pattern = /^(\$\[[A-Za-z0-9]+\]_)/;
        
        let matches = key.match(pattern);
        let namespace = matches && matches[0].match(/[A-Za-z0-9]+/);
        
        // namespace && namespace.slice(0, -1); // remove `_` character
        
        return namespace;
    }
    
    log() {
        log(this.caches);
    }
}
