import app from 'app';
import PopupTabBody from 'PopupTabBody';
import RubUtils from 'RubUtils';
import {
    deactive,
    active,
    numberFormat
} from 'Utils';

class TabSMS extends PopupTabBody {
    constructor() {
        super();
        
        this.properties = {
            ...this.properties,
            toggleGroupNode: cc.Node,
            itemNode: cc.Node,
            moneyGetLbl: cc.Label,
            iconSprite: cc.Sprite,
            moneySend: cc.Label,
            promotionNode: cc.Node,
            promoteDescLbl: cc.Label,
            // new design
            activeStateSprite: cc.Sprite,
            inActiveStateSprite: cc.Sprite,
            providerItemNode: cc.Node,
            providerContainerNode: cc.Node,
            receiverLbl: cc.Label,
            codeLbl: cc.Label,
            toNumberLbl: cc.Label,
            smsLayoutPanel: cc.Node,
            contentLayoutPanel: cc.Node
        };

        this._balanceChoosen = null;
        
    }

    onLoad() {
        super.onLoad();
        
        this._smses = [];
        this._providers = {};
        this._enabledTelco = [];
        
        this._showSMSLayoutPanel();
        
        this.receiverLbl.string = app.context.getMyInfo().name;
    }
    
    onDestroy() {
        super.onDestroy();
        this._enabledTelco = [];
        this._smses = [];
        this._providers = {};
        this._balanceChoosen = null;
    }
    
    loadData() {
        if(this.loadedData)
            return false
        super.loadData();
        
        this.showLoadingProgress();
        if(!app.context.ctl)
            app.system.marker.initRequest(app.system.marker.TOPUP_DIALOG_CACHE_TAB_SMS, this._requestPaymentList.bind(this), this._renderSMS.bind(this))
        else
            this._onUserGetChargeList(app.context.ctl, true);
        
        return true;
    }
    
    onDataChanged(data) {
        if(data && !app._.isEqual(data, this._data))
            Object.keys(data).length > 0 && this._renderSMS(data);
    }
    
    onSMSBtnClick(e) {
        let { moneySend, telcoId } = e.currentTarget.parent;
        this._balanceChoosen = moneySend;
        Object.values(this._providers).forEach(toggle => {
            toggle.isChecked = toggle.telcoId == telcoId;
            if(toggle.isChecked) {
                toggle.check();
                this.onProviderBtnClick(toggle);
            }
        });
        this._hideSMSLayoutPanel();
        // let toggle = this._providers[telcoId];
        // if(toggle) {
        //     toggle.check();
        //     this.onProviderBtnClick(toggle);
        // }
    }
    
    onProviderBtnClick(toggle) {
        if(!this._balanceChoosen)
            return;
            
        // TODO: change text
        let { telcoId } = toggle;
        
        let { code, shortCode, syntax } = this._smses[this._balanceChoosen][app.keywords.CHARGE_SMS_OBJECT_INFORS].find(info => info.telcoId == telcoId);
        
        if(code && shortCode) {
            this.codeLbl.string = `${code} ${syntax} ${app.context.getMyInfo().name}`;
            this.toNumberLbl.string = shortCode;
            this._hideSMSLayoutPanel();
        }
    }
    
    onBackBtnClick() {
        this._showSMSLayoutPanel();    
    }
    
    onNapBtnClick() {
        this._sendSMS(this.codeLbl.string, this.toNumberLbl.string);
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
    }

    _requestPaymentList() {
        var sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST,
            data: {
                carrierNames: [
                    // carrier name is here.
                ]
            }
        };
                
        app.service.send(sendObject);
    }

    _onUserGetChargeList(data, hasCtl = false) {
        let cardListIds = data[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ID_LIST] || [];
        let providerNames = data[app.keywords.TASK_NAME_LIST] || [];
        let renderData = {
            smses: data[app.keywords.CHARGE_SMS_OBJECT_IAC] || {}, 
            cardListIds, 
            providerNames
        };
        
        this.loadedData = true;
        hasCtl ? this._renderSMS(renderData) :  app.system.marker.renderRequest(app.system.marker.TOPUP_DIALOG_CACHE_TAB_SMS, renderData, this._renderSMS.bind(this));
    }

    _sendSMS(message, recipient) {
        if (app.env.isBrowser()) {
            app.system.showToast(app.res.string('error_not_support_platform'));
        } else if (app.env.isMobile()) {
            if (app.env.isIOS()) {
                window.jsb.reflection.callStaticMethod("JSBUtils", "sendSMS:recipient:", message, recipient);
            }
            if (app.env.isAndroid()) {
                // TODO
                window.jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "jsbSMS", "(Ljava/lang/String;Ljava/lang/String;)V", message, recipient);
            }
        }
    }
    
    _renderSMS({smses = {}, cardListIds = [], providerNames = []} = {}) {
        this.hideLoadingProgress();  
        // app.keywords.CHARGE_SMS_OBJECT
        this._smses = smses;

        if (Object.keys(smses).length > 0) {
            Object.keys(smses).forEach(key => {
                let moneySend = key,
                    infos = smses[key][app.keywords.CHARGE_SMS_OBJECT_INFORS] || [],
                    moneyGot = smses[key]['balance'],
                    promoteDesc = smses[key]['promoteDesc'];
                    
                infos.forEach((smsInfo, i) => {
                    let telcoId = smsInfo.telcoId;
                    
                    if(!app._.includes(this._enabledTelco, telcoId))
                        this._enabledTelco.push(telcoId); 
                });
                this._initItem(moneySend, moneyGot, moneyGot > moneySend, promoteDesc);
            });
            this._initProviderIcon(cardListIds, providerNames);
        }
    }
    
    _initItem(moneySend, moneyGot, hasPromotion, promoteDesc) {
        let iconNumber = Math.round(moneyGot / 10000) + 1;
        RubUtils.getSpriteFrameFromAtlas(app.res.ATLAS_URLS.CHIPS, `scoreIcon_${iconNumber >= 5 ? 5 : iconNumber}`, (sprite) => {
            this.iconSprite.spriteFrame = sprite;

            this.moneyGetLbl.string = `${numberFormat(moneyGot)}`;
            this.moneySend.string = `${numberFormat(moneySend)} VNĐ`;
            
            this.promotionNode.active = hasPromotion;
            this.promoteDescLbl.string = promoteDesc || "";
            
            
            let item = cc.instantiate(this.itemNode);
            item.active = true;
            item.moneySend = moneySend;
            
            this.toggleGroupNode.addChild(item);
        });
    }
    
    _initProviderIcon(cardListIds, providerNames) {
        if (this._enabledTelco.length > 0) {
            this._enabledTelco.forEach(id => {
                let index = cardListIds.findIndex(cardListId => cardListId === id);
                if(index >= 0) {
                    let providerName = providerNames[index];
                    let activeState = `${providerName.toLowerCase()}-active`;
                    let inactiveState = `${providerName.toLowerCase()}-inactive`;
                    
                    RubUtils.getSpriteFramesFromAtlas(app.res.ATLAS_URLS.PROVIDERS, [activeState, inactiveState], (sprites) => {
                        this.activeStateSprite.spriteFrame = sprites[activeState];
                        this.inActiveStateSprite.spriteFrame = sprites[inactiveState];

                        let provider = cc.instantiate(this.providerItemNode);
                        this.addNode(provider);
                        provider.active = true;

                        let toggle = provider.getComponent(cc.Toggle);
                        toggle.isChecked = index == 0;
                        toggle.telcoId = id;
                        
                        if(!this._providers[id])
                            this._providers[id] = {};
                        this._providers[id] = toggle;
                        
                        this.providerContainerNode.addChild(provider);
                    });
                }
            });
        }
    }
    
    _showSMSLayoutPanel() {
        active(this.smsLayoutPanel)
        deactive(this.contentLayoutPanel);
    }
    
    _hideSMSLayoutPanel() {
        deactive(this.smsLayoutPanel)
        active(this.contentLayoutPanel);
    }
}

app.createComponent(TabSMS);