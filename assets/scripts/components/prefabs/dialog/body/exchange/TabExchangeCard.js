import app from 'app';
import PopupTabBody from 'PopupTabBody';
import RubUtils from 'RubUtils';
import NodeRub from 'NodeRub';
import Utils from 'Utils';
import CCUtils from 'CCUtils';
import ActionBlocker from 'ActionBlocker';

class TabExchangeCard extends PopupTabBody {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            providerItemNode: cc.Node,
            cardItemNode: cc.Node,
            providerContainerNode: cc.Node,
            cardItemsContainerNode: cc.Node,
            activeStateSprite: cc.Sprite,
            inActiveStateSprite: cc.Sprite,
            // providerLbl: cc.Label,
            balanceLbl: cc.Label,
            goldLbl: cc.Label,
            itemLogoSprite: cc.Sprite,
            layoutsNode: cc.Node,
            updatePhoneNumberNode: cc.Node,
            phoneNumberEditbox: cc.EditBox
        };

        this.selectedItem = { id: null, gold: null, name: null };
        this._tabData = {};
        this._isLoaded = false;
    }
    
    onLoad() {
        super.onLoad();
        this.selectedItem = { id: null, gold: null, name: null };
        this._tabData = {};
        this._isLoaded = false;
        
        this._hideUpdatePhoneNumber();
    }
    
    onDestroy() {
        super.onDestroy();
        window.free(this._tabData);
        this.selectedItem = { id: null, gold: null, name: null };
        this._isLoaded = false;
    }
    
    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        super.loadData();
        
        this._initCardsList();
        return true;
    }
    
    onDataChanged(data = {}) {
        let types = data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES];
        !this._isLoaded && types && types.length > 0 && this._renderCards(types);
    }
    
    onClickBackBtn() {
        this._hideUpdatePhoneNumber();
    }
    
    onClickUpdateBtn() {
        let phoneNumber = this.phoneNumberEditbox.string; 
        
        // invalid phone number
        if (!phoneNumber || isNaN(Number(phoneNumber)) || phoneNumber.length < 8) {
            app.system.error(
                app.res.string('error_phone_number_is_invalid')
            );
        } else {
            let sendObject = {
                cmd: app.commands.UPDATE_PHONE_NUMBER,
                data: {
                    [app.keywords.PHONE_NUMBER]: phoneNumber
                }
            };

            app.service.send(sendObject);
        } 
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.EXCHANGE_LIST, this._onGetExchangeList, this);
        app.system.addListener(app.commands.EXCHANGE, this._onExchange, this);
        app.system.addListener(app.commands.UPDATE_PHONE_NUMBER, this._onUpdatePhoneNumber, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.EXCHANGE, this._onExchange, this);
        app.system.removeListener(app.commands.EXCHANGE_LIST, this._onGetExchangeList, this);
        app.system.removeListener(app.commands.UPDATE_PHONE_NUMBER, this._onUpdatePhoneNumber, this);
    }
    
    _onUpdatePhoneNumber(data) {
        if (data[app.keywords.RESPONSE_RESULT]) {
            this._hideUpdatePhoneNumber();
        }
    }
    
    _initCardsList() {
        var sendObject = {
            'cmd': app.commands.EXCHANGE_LIST,
            'data': {}
        };
        this.showLoadingProgress();
        app.service.send(sendObject);
    }

    _onGetExchangeList(data) {
        this.setLoadedData({
            [app.keywords.EXCHANGE_LIST.RESPONSE.TYPES]: data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES] || []
        });
    }
    
    _renderCards(types) {
        let cardValues = [];
        this._isLoaded = true;
        
        types.map((type) => {
            if (type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_TYPE] == app.const.EXCHANGE_LIST_CARD_TYPE_ID) {
                const idList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ID_LIST];
                const nameList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_NAME_LIST];
                const goldList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_GOLD_LIST];
                const iconList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ICON_LIST];

                for (let i = 0; i < idList.length; i++) {
                    let itemId = idList[i];
                    // let itemIcon = iconList[i].replace('thumb.', '');
                    let neededGold = goldList[i];
                    let itemName = nameList[i];
                    let providerName = itemName.trim().match(/([a-zA-Z]{3,})/g);
                    providerName && (providerName = providerName[0]);

                    let amount = itemName.toUpperCase().match(/([0-9]{2,})+(K)/g);
                    amount && (amount = Number(amount[0].toUpperCase().replace('K', '')) * 1000);
                    
                    if (providerName && !Utils.isEmpty(providerName)) {
                        if (!this._tabData.hasOwnProperty(providerName) || !this._tabData[providerName]) {
                            this._tabData[providerName] = [];
                        }
                        this._tabData[providerName].push({ id: itemId, gold: amount, needed: neededGold, name: itemName });
                    }
                }
                this._initProviders();
            }
        });
    }
    
    _initProviders() {
        let count = 0;
        for (let key in this._tabData) {
            let activeState = `${key.toLowerCase()}-active`;
            let inactiveState = `${key.toLowerCase()}-inactive`;
            RubUtils.getSpriteFramesFromAtlas('blueTheme/atlas/providers', [activeState, inactiveState], (sprites) => {
                this.activeStateSprite.spriteFrame = sprites[activeState];
                this.inActiveStateSprite.spriteFrame = sprites[inactiveState];

                let provider = cc.instantiate(this.providerItemNode);
                this.addNode(provider);
                provider.active = true;
                provider.name = key;

                let toggle = provider.getComponent(cc.Toggle);
                toggle.isChecked = count == 0;
                this.providerContainerNode.addChild(provider);

                if (toggle.isChecked) {
                    // toggle.check();
                    this.onProviderBtnClick(toggle);
                }

                count++;
            });
        }
    }

    onProviderBtnClick(toggle) {
        let name = toggle.node.name;
        RubUtils.getSpriteFrameFromAtlas('blueTheme/atlas/providers', name.toLowerCase(), (sprite) => {
            CCUtils.destroyAllChildren(this.cardItemsContainerNode, 0);

            this._tabData[name].forEach(item => {
                // this.providerLbl.string = name.toUpperCase();
                this.balanceLbl.string = Utils.numberFormat(item.needed);
                this.goldLbl.string = `${Utils.numberFormat(item.gold)} VNĐ`;

                this.itemLogoSprite.spriteFrame = sprite;

                let cardItem = cc.instantiate(this.cardItemNode);
                this.addNode(cardItem);

                cardItem.active = true;
                cardItem.itemSelected = { id: item.id, gold: item.needed, name: item.name };

                this.cardItemsContainerNode.addChild(cardItem);
            });
        });
    }

    onExchangeBtnClick(event) {
        this.selectedItem = event.currentTarget.parent.itemSelected;

        let denyCb = () => true;
        let okCallback = this._onConfirmDialogBtnClick.bind(this);

        if (this.selectedItem.id) {
            let { id, gold, name } = this.selectedItem;
            app.system.confirm(
                app.res.string('exchange_dialog_confirmation', { gold: Utils.numberFormat(gold), name }),
                denyCb,
                okCallback
            );
        } else {
            app.system.error(
                app.res.string('error_exchange_dialog_need_to_choice_item')
            );
        }
    }

    /**
     * 
     * @param {any} event onHandleExchangeBtnClick's event
     * @returns
     * 
     * @memberOf TabExchangeCard
     */
    _onConfirmDialogBtnClick(event) {
        let parentNode = this.node.parent.parent;

        if (app.context.needUpdatePhoneNumber()) {
            // hide this node
            this._showUpdatePhoneNumber();
        } else {
            let { id, gold, name} = this.selectedItem;
            let myCoin = app.context.getMeBalance();

            if (Number(myCoin) < Number(gold)) {
                app.system.error(
                    app.res.string('error_exchange_dialog_not_enough_money', { ownerCoin: Utils.numberFormat(myCoin), name })
                );
                return;
            }

            ActionBlocker.runAction(ActionBlocker.USER_WITHDRAWAL, () => {
                let data = {};
                data[app.keywords.EXCHANGE.REQUEST.ID] = id;
                let sendObject = {
                    'cmd': app.commands.EXCHANGE,
                    data
                };

                // show loader
                app.system.showLoader(app.res.string('waiting_server_response'));
                app.service.send(sendObject);
            });
        }
    }

    _onExchange(data) {
        app.system.hideLoader();
        if (data[app.keywords.RESPONSE_RESULT] === true) {
            app.system.showToast(`${data[app.keywords.RESPONSE_MESSAGE]}`);
        } else { // true
            ActionBlocker.resetLastTime(ActionBlocker.USER_WITHDRAWAL);
            app.system.error(data[app.keywords.RESPONSE_MESSAGE] ? data[app.keywords.RESPONSE_MESSAGE] : app.res.string('error_system'));
        }
    }

    _hideUpdatePhoneNumber() {
        CCUtils.deactive(this.updatePhoneNumberNode);
        CCUtils.active(this.layoutsNode);
    }
    
    _showUpdatePhoneNumber() {
        CCUtils.active(this.updatePhoneNumberNode);
        CCUtils.deactive(this.layoutsNode);
    }
}

app.createComponent(TabExchangeCard);