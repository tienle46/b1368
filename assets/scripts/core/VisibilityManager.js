import CCUtils from 'CCUtils';

export default class VisibilityManager {
    /**
     * Creates an instance of VisibilityManager.
     * @param {any} features : Get from config.features data, returned from server
     * 
     * @memberOf VisibilityManager
     */
    constructor(features) {
        this._link = require('Linking'); // dont know reason why I cant import Linking at file header
        this._features = features;
        this._components = {};
    }
    
    updateFeatures(features) {
        this._features = features;    
    }
    
    addComponent(instance) {
        let key = this._getKeyFromInstance(instance.name);
        key && (this._components[key] = instance);
    }
    
    getComponent(key) {
        if(!key)
            return null;
        
        return this._components[key] || null;
    }
    
    removeComponent(instance) {
        let key = this._getKeyFromInstance(instance.name);
        key && (this._components[key] = null);
    }
    
    // set visibility for displaying a node
    behavior(instance, node, state = false) {
        let key = this._getKeyFromInstance(instance.name);
        let component = this.getComponent(key);
        component && CCUtils[state ? "active": "deactive"](node);
    }
    
    checkVisible(instance) {
        let key = this._getKeyFromInstance(instance.name);
        let component = this.getComponent(key);
        if(component) {
            // loop features
            for(let code in this._features) {
                if(this._features[code])
                    this._act(key, code, this._features[code]);  
            }
        }
    }
    
    goTo(action, data) {
        if(!this._actionAllowed(action)) {
            return;
        }
        this._link.goTo(action, data);    
    }
    
    _actionAllowed(action) {
        if(this._features[VisibilityManager.NAP_SMS] && action === this._link.ACTION_TOPUP_SMS)
            return false;
        if(this._features[VisibilityManager.NAP_THE] && action === this._link.ACTION_TOPUP_CARD)
            return false;
        if(this._features[VisibilityManager.EXCHANGE] && this._link.isExchangeAction(action))
            return false;
        if((this._features[VisibilityManager.BANK] || this._features[VisibilityManager.GIFT_CODE]) && this._link.isBankOrGiftCodeAction(action))
            return false;
        if(this._features[VisibilityManager.FANPAGE] && action === this._link.ACTION_FANPAGE)
            return false;
        if(this._features[VisibilityManager.EVENT] && action === this._link.ACTION_EVENT)
            return false;

        return true;
    }
    
    _act(key, code, states) {
        if(!states)
            return;
        let component = this.getComponent(key);
         
        if(key === 'MultiTabPopup') {
            let tabComponentName = null;
            switch(code) {
                case VisibilityManager.NAP_THE: {
                    tabComponentName = 'TabCard';
                    break;
                }
                case VisibilityManager.NAP_SMS: {
                    tabComponentName = 'TabSMS';
                    break;
                }
                case VisibilityManager.BANK: {
                    tabComponentName = 'TabUserBank';
                    break;
                }
                case VisibilityManager.GIFT_CODE: {
                    tabComponentName = 'TabGiftCode';
                    break;
                }
            }
            
            this._deactiveTab(key, component, tabComponentName);
        } else { // else we need to hide element
            let expectedKey = null,
                element = null;
                
            switch(code) {
                case VisibilityManager.EXCHANGE: {
                    expectedKey = 'TopBar';
                    element = component.shopBtnNode;
                    break;
                }
                case VisibilityManager.FANPAGE: {
                    expectedKey = 'TopBar';
                    element = component.fanPageNode;
                    break;
                }
                case VisibilityManager.EVENT: {
                    expectedKey = 'BottomBar';
                    element = component.eventBtnNode;
                    break;
                }
            }
            
            if(key === expectedKey) {
                this._deactiveElement(component, element);
            }
        }
        
    }
    
    _deactiveTab(key, multiTabPopup, tabComponentName) {
        if(key == 'MultiTabPopup') { 
            tabComponentName && multiTabPopup.filterTab(tab => tab.componentName !== tabComponentName);
        }
    }
    
    _deactiveElement(component, node) {
        component.activateBehavior(node, false);
    }
    
    _getKeyFromInstance(instanceName) {
        if(!instanceName)
            return;
            
        let pattern = /(\<[A-Za-z-_0-9]+\>)/;
        let matches = instanceName.match(pattern);
        if(matches) {
            let name = matches[0];
            return name.slice(1, -1);
        }
        
        return null;
    } 
}

VisibilityManager.NAP_THE = "tuc";
VisibilityManager.NAP_SMS = "cs";
VisibilityManager.FANPAGE = "fp";
VisibilityManager.EVENT = "evt";
VisibilityManager.EXCHANGE = "ex";
VisibilityManager.BANK = "bnk";
VisibilityManager.BOT = "bot";
VisibilityManager.GIFT_CODE = "gc";
