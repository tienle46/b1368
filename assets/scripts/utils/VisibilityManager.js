import CCUtils from 'CCUtils';
import Events from 'GameEvents';
import app from 'app'

export default class VisibilityManager {
    /**
     * Creates an instance of VisibilityManager.
     * @param {any} features : Get from config.features data, returned from server
     * 
     * @memberOf VisibilityManager
     */
    constructor(features) {
        this._link = require('Linking'); // dont know reason why I cant import Linking at file header
        this._features = this._initFeatures(features); // feature codes represent to element which will be displayed when value = `true`
        
        this._components = {};
        
        this._addEventListeners()
    }
    
    _addEventListeners() {
        app.system.addListener(Events.CLIENT_CONFIG_CHANGED, this.updateFeatures, this)
    }
    
    updateFeatures(features) {
        this._features = features;

        for(let key in this._components) {
            this.checkVisible(this._components[key])
        }
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
        if(!instance)
            return
            
        let key = this._getKeyFromInstance(instance.name);
        let component = this.getComponent(key);
        if(component) {
            // loop features
            for(let code in this._features) {
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
    
    _initFeatures(features) {
        return Object.assign({}, {
            [VisibilityManager.NAP_THE]: false,
            [VisibilityManager.NAP_SMS]: false,
            [VisibilityManager.FANPAGE]: false,
            [VisibilityManager.EVENT]: false,
            [VisibilityManager.EXCHANGE]: false,
            [VisibilityManager.BANK]: false,
            [VisibilityManager.BOT]: false,
            [VisibilityManager.GIFT_CODE]: false,
            [VisibilityManager.SYSTEM_MESSAGE]: false,
            [VisibilityManager.SMASH_JAR]: false,
            [VisibilityManager.AGENCY]: false
        }, features);        
    }
    
    _actionAllowed(action) {
        if((!this._features[VisibilityManager.NAP_SMS] && action === this._link.ACTION_TOPUP_SMS) ||
            (!this._features[VisibilityManager.NAP_THE] && action === this._link.ACTION_TOPUP_CARD) ||
            (!this._features[VisibilityManager.EXCHANGE] && this._link.isExchangeAction(action)) ||
            ((!this._features[VisibilityManager.BANK] || !this._features[VisibilityManager.GIFT_CODE]) && this._link.isBankOrGiftCodeAction(action)) ||
            (!this._features[VisibilityManager.FANPAGE] && action === this._link.ACTION_FANPAGE) ||
            (!this._features[VisibilityManager.EVENT] && action === this._link.ACTION_EVENT)
        ) {
            return false;
        }
        
        return true;
    }
    
    _act(key, code, state) {
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
                case VisibilityManager.SYSTEM_MESSAGE: {
                    tabComponentName = 'TabSystemMessage';
                    break;
                }
                case VisibilityManager.GIFT_CODE: {
                    tabComponentName = 'TabGiftCode';
                    break;
                }
            }
            
            this._tabBehavior(key, component, tabComponentName, state);
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
                
                case VisibilityManager.AGENCY: {
                    expectedKey = 'BottomBar';
                    element = component.agencyBtnNode;
                    break;
                }
            }
            
            if(key === expectedKey) {
               this._elementBehavior(component, element, state);
            }
        }
        
    }
    
    _tabBehavior(key, multiTabPopup, tabComponentName, state) {
        if(key == 'MultiTabPopup' && tabComponentName) {
            multiTabPopup.filterTab(tab => state? !tab.hide : (tab.componentName !== tabComponentName && !tab.hide));
        }
    }
    
    _elementBehavior(component, node, state) {
        component.activateBehavior(node, state);
    }
    
    _getKeyFromInstance(instanceName) {
        if(!instanceName)
            return;
        
        /**
         * instanceName format: abcd <name>
         */
        let pattern = /(\<[A-Za-z-_0-9]+\>)/;
        let matches = instanceName.match(pattern);
        if(matches) {
            let name = matches[0];
            return name.slice(1, -1);
        }
        
        return null;
    } 
    
    isActive(featureKey) {
        return this._features[featureKey];
    }
}

// default features
VisibilityManager.NAP_THE = "tuc";
VisibilityManager.NAP_SMS = "cs";
VisibilityManager.FANPAGE = "fp";
VisibilityManager.EVENT = "evt";
VisibilityManager.EXCHANGE = "ex";
VisibilityManager.BANK = "bnk";
VisibilityManager.BOT = "bot";
VisibilityManager.GIFT_CODE = "gc";
VisibilityManager.SYSTEM_MESSAGE = "sysm";
VisibilityManager.SMASH_JAR = "smashjar";
VisibilityManager.AGENCY = "agent";
