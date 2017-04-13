/**
 * local storage management
 * Its data needs to be refreshed if has any change between currently data and new one.
 */
import app from 'app';

export default class Marker {
    constructor() {
        this._localStorage = cc.sys.localStorage;
        
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
        console.debug(this.caches)
        
        if(!this.getItem(this.SOUND_OPTION)) {
            this.setItem(this.SOUND_OPTION, 'true');
        }
        if(!this.getItem(this.SHOW_INVITATION_POPUP_OPTION)) {
            this.setItem(this.SHOW_INVITATION_POPUP_OPTION, 'true');
        }    
    }
    
    setItem(key, data) {
        let k = this._validKey(key),
            _$isNew = true,
            _$isUpdated = true;
        
        if(this._isCached(key)) {
            _$isNew = false;
            _$isUpdated = this.isUpdatedData(key, data);
        }
        
        this._localStorage.setItem(key, data);
        
        k && (this.caches[k] = {
            data,
            _$isNew,
            _$isUpdated
        });
    }

    getItem(key) {
        let k = this._validKey(key);
        return k ? this.caches[k] : null;
    }

    getItemData(key) {
        let item = this.getItem(key);
        return item ? item.data : null;
    }
    
    isEqual(key, value) {
       return app._.isEqual(this.getItemData(key), value);     
    }
    
    isUpdatedData(key, newData) {
        return !this.isEqual(key, newData);
    }
    
    _initCaches() {
        for(let key in this._localStorage) {
            this.caches[key] = {
                data: this._localStorage.getItem(key),
                _$isNew: false,
                _$isUpdated: false
            };
        }  
    }
    
    _validKey(key) {
        if(!key)
            return null;
            
        return (key instanceof Object) ? JSON.stringify(key) : key.toString();
    }

    _isCached(key) {
        let k = this._validKey(key);
        return k ? this.caches.hasOwnProperty(k) : null;
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