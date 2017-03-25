import app from 'app';
import DialogActor from 'DialogActor';
import {
    isEmpty,
    numberFormat
} from 'Utils';
import RubUtils from 'RubUtils';
import CCUtils from 'CCUtils';

class TabCard extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            activeStateSprite: cc.Sprite,
            inActiveStateSprite: cc.Sprite,
            providerItemNode: cc.Node,
            providerContainerNode: cc.Node,
            providerTitleLbl: cc.Label,
            cardLayoutPanel: cc.Node,
            ratioPanel: cc.Node,
            ratioItemContainer: cc.Node,
            ratioItem: cc.Node,
            ratioItemTitleLbl: cc.Label,
            ratioItemXuLbl: cc.Label,
            cardSerialEditBox: cc.EditBox,
            serialNumberEditBox: cc.EditBox
        };

        this.providerId = null;
    }

    onLoad() {
        super.onLoad();
        CCUtils.deactive(this.cardLayoutPanel);
        // wait til every requests is done
        // this._initRatioGroup();
    }

    start() {
        super.start();
        this._initCardsGroup();
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
        // app.system.addListener(app.commands.GET_CHARGE_RATE_LIST, this._onUserGetRateList, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
        // app.system.removeListener(app.commands.GET_CHARGE_RATE_LIST, this._onUserGetRateList, this);
    }

    _initCardsGroup() {
        let sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST,
        };

        // show loader
        this.showLoader();
        app.service.send(sendObject);
    }

    _onUserGetChargeList(data) {
        let cardListIds = data[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ID_LIST] || [];
        if (cardListIds.length > 0) {
            cardListIds.forEach((id, index) => {
                let providerName = data[app.keywords.TASK_NAME_LIST][index];
                let activeState = `${providerName.toLowerCase()}-active`;
                let inactiveState = `${providerName.toLowerCase()}-inactive`;
                
                RubUtils.getSpriteFramesFromAtlas('blueTheme/atlas/providers', [activeState, inactiveState], (sprites) => {
                    this.activeStateSprite.spriteFrame = sprites[activeState];
                    this.inActiveStateSprite.spriteFrame = sprites[inactiveState];

                    let provider = cc.instantiate(this.providerItemNode);
                    this.addNode(provider);
                    provider.active = true;

                    let toggle = provider.getComponent(cc.Toggle);
                    toggle.isChecked = index == 0;
                    toggle.providerName = providerName;
                    toggle.providerId = id;

                    this.providerContainerNode.addChild(provider);

                    if (toggle.isChecked) {
                        // toggle.check();
                        this.onProviderBtnClick(toggle);
                    }

                    if(index === cardListIds.length - 1) {
                        this._showFormPanel();
                    }
                });
            });
            
            this.hideLoader();
        } else {
            this.pageIsEmpty(this.node);
        }
        
        // ratio
        let cardRatios = data['cards'] ? data['cards']['rates'] : [];
        
        cardRatios.forEach(card => {
            let {amount, balance, rate} = card;
            
            this.ratioItemTitleLbl.string = `${numberFormat(amount)} VNĐ`;
            this.ratioItemXuLbl.string = `${numberFormat(balance)} ${app.res.string('currency_name')}`;
            let itemNode = cc.instantiate(this.ratioItem);
            itemNode.active = true;
            
            this.ratioItemContainer.addChild(itemNode);
        });
    }
    
    onProviderBtnClick(toggle) {
        this.providerTitleLbl.string = toggle.providerName;
        this.providerId = toggle.providerId;
    }
    
    onHanleChargeBtnClick() {
        let cardSerial = this.cardSerialEditBox.string.trim();
        let serialNumber = this.serialNumberEditBox.string.trim();

        if (isEmpty(cardSerial) || isEmpty(serialNumber) || isNaN(cardSerial) || isNaN(serialNumber)) {
            app.system.error(
                app.res.string('error_user_enter_empty_input')
            );
        } else {
            let sendObject = {
                'cmd': app.commands.USER_SEND_CARD_CHARGE,
                data: {
                    [app.keywords.CHARGE_CARD_PROVIDER_ID]:this.providerId,
                    [app.keywords.CARD_CODE]:cardSerial,
                    [app.keywords.CARD_SERIAL]:serialNumber
                }
            };

            app.service.send(sendObject); // send request and get `smsg` (system_message) response from server
        }
    }
    
    onRatioBtnClick() {
        this._showRatioBtn();
    }
    
    onBackBtnClick() {
        this._showFormPanel();
    }
    
    _showRatioBtn() {
        CCUtils.deactive(this.cardLayoutPanel);
        CCUtils.active(this.ratioPanel);
    }
    
    _showFormPanel() {
        CCUtils.active(this.cardLayoutPanel);
        CCUtils.deactive(this.ratioPanel);
    }
}

app.createComponent(TabCard);