/**
 * local storage management
 * Its data needs to be refreshed if has any change between currently data and new one.
 */
import app from 'app';
import Utils from 'Utils';

export default class Marker {
    constructor() {
        this._localStorage = cc.sys.localStorage;
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
        
        
        // cache requests
        this.TOPUP_DIALOG_CACHE_TAB_CARD = "$[RQ]_TOPUP_DIALOG_CACHE_TAB_CARD";
        this.TOPUP_DIALOG_CACHE_TAB_SMS = "$[RQ]_TOPUP_DIALOG_CACHE_TAB_SMS";
        this.TOPUP_DIALOG_CACHE_TAB_IAP = "$[RQ]_TOPUP_DIALOG_CACHE_TAB_IAP";
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
                    if(!Utils.isObject)
                        data = JSON.parse(data);
                    
                    data = JSON.stringify(data);
                } catch(e) {
                    // INGORE ERROR
                }
            }
        
            this._localStorage.setItem(key, data);
        }
        
        return stateData;
    }

    getItem(key) {
        let k = this._validKey(key);
        if(!k)
            return null;
        let namespace = this._getNamespaceFromScope(k);   
        
        let parentObject = namespace ? this.caches[namespace]: this.caches;
        return parentObject[k];
    }

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
        for(let key in this._localStorage) {
            let data = this._localStorage.getItem(key);
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
        console.log(this.caches);
    }
}

// SUPPORT SCOPEABLE 
// import app from 'app';

// export default class Marker {

//     constructor() {
//         this._localStorage = window.localStorage;
        
//         this.caches = {};
        
//         this._DEFAULT_SCOPE = "$default_scope";
        
//         // this.initCaches();
//     }
    
//     setItem(k, data) {
//         let {key, scope} = this._validKey(k),
//             _$isNew = true,
//             _$isUpdated = true;
        
//         if(this._isCached(key)) {
//             _$isNew = false;
//             _$isUpdated = this.isUpdatedData(key, data);
//         }
        
//         let value = {
//             data,
//             _$isNew,
//             _$isUpdated
//         };
        
//         console.debug(scope, key);
        
//         // this._localStorage.setItem(key, data);
        
//         if(scope) {
//             this._setItemInScope(key, value, scope);
//             return;
//         }          
          
//         this.caches[key] = value;
//     }

//     getItem(key) {
        
//         return this._getCache(key);
//     }

//     getItemData(key) {
//         let item = this.getItem(key);
//         console.debug('getItemData item', item)
//         return item && item.data;
//     }
    
//     isEqual(key, value) {
//        return app._.isEqual(this.getItemData(key), value);     
//     }
    
//     isUpdatedData(key, newData) {
//         return !this.isEqual(key, newData);
//     }
    
//     initCaches() {
//         let loopers = Object.keys(this.caches).length < 1 ? this._localStorage : this.caches;
//         console.debug('this._localStorage', this._localStorage);
        
//         Object.keys(loopers).filter(key => key.indexOf('$') < 0).forEach(k => {
//             let {key, scope} = this._validKey(k),
//                 _$isNew = false,
//                 _$isUpdated = false,
//                 value = {
//                     data: this._localStorage.getItem(key),
//                     _$isNew,
//                     _$isUpdated
//                 };
//             console.debug(`$${key}`, scope, `$${key}` == scope);
            
//             if(`$${key}` == scope)
//                 return;
                
//             if(scope) {
//                 this._setItemInScope(key, value, scope);
//                 return;
//             } 
//             console.debug('key', key);
            
//             this.caches[key] = value;
//         });
      
//         console.debug('this.caches',  this.caches);
//     }
    
//     _setItemInScope(key, value, scope) {
//         if(scope) {
//             !this._localStorage.getItem(scope) && this._localStorage.setItem(scope, scope);
            
//             !this.caches[scope] && (this.caches[scope] = {});
//             if(this.caches[scope]) {
//                 let k = (app.context ? app.context.getMyInfo().name : null) + "_" + key.replace(/\!\{\{(username)\}\}/, "");
                
//                 this._localStorage.setItem(k, value);

//                 if(this.caches[k]){
//                     this.caches[scope][k] = this.caches[k];
//                     this._localStorage.setItem(k, this.caches[scope][k]);
//                     delete this.caches[key];
//                 } else {
//                     this.caches[scope][k] = value;
//                 }
//             }
//             return;
//         }    
//     }
    
//     // key {string}: key
//     // !{{username}}key: key with `username variable` as a scope
//     // !{{string}}key: key with `string` as a scope
    
//     _validKey(key) {
//         let keyStr = (key instanceof Object) ? JSON.stringify(key) : key.toString();
//         // detect if key contains scope
//         if (keyStr.indexOf('!') < 0)
//             return {
//                 key: keyStr,
//                 scope: null
//             };

//         let regEx = /\!\{\{(username)\}\}/;
//         if (regEx.test(keyStr)) {
//             let username = app.context ? app.context.getMyInfo().name : null;
//             return {
//                 key: keyStr,
//                 scope: `$${username}`
//             };
//         }
        
//         // regEx = /\!\{\{(\w*)\}\}/g;
//         // if (regEx.test(keyStr)) {
//         //     let scope = regEx.exec(keyStr)[1];
//         //     return {
//         //         key: keyStr,
//         //         scope
//         //     };
//         // }
//     }

//     _isCached(k) {
//         let {key, scope} = this._validKey(k);
//         let caches = scope ? this.caches[scope] : this.caches;
        
//         return caches ? caches.hasOwnProperty(key) : null;
//     }
    
//     _getCache(k) {
//         let {key, scope} = this._validKey(k);
//         let caches = scope ? this.caches[scope] : this.caches;
        
//         return caches ? caches[key] : null;
//     }
// }