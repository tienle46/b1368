import app from 'app';
import PopupTabBody from 'PopupTabBody';
import RubUtils from 'RubUtils';
import Utils from 'Utils';
import CCUtils from 'CCUtils';
import ActionBlocker from 'ActionBlocker';

class TabExchangeItem extends PopupTabBody {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            contentNode: cc.Node,
            exchangeItem: cc.Node,
            exchangeItemImage: cc.Sprite,
            exchangeItemPrice: cc.Label,
            exchangeItemName: cc.Label,
            layoutsNode: cc.Node,
            updatePhoneNumberNode: cc.Node,
            phoneNumberEditbox: cc.EditBox
        };
    }

    onLoad() {
        super.onLoad();
        this._hideUpdatePhoneNumber();
    }
    
    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        super.loadData();
        
        this._initItemsList();
        return true;
    }
    
    onDataChanged(data = {}) {
        let types = data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES];
        types && types.length > 0 && this._renderItems(types);
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
    
    _initItemsList() {
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
    
    _renderItems(exchangeTypes) {
        exchangeTypes.map((type) => {
            if (type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_TYPE] == app.const.EXCHANGE_LIST_ITEM_TYPE_ID) {
                const idList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ID_LIST];
                const nameList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_NAME_LIST];
                const goldList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_GOLD_LIST];
                const iconList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ICON_LIST];

                for (let i = 0; i < idList.length; i++) {
                    let itemId = idList[i];
                    let itemIconURL = `${iconList[i]}`;
                    let itemGold = goldList[i];
                    let itemName = nameList[i];
                
                    // add sprite to img 
                    RubUtils.loadSpriteFrame(this.exchangeItemImage, itemIconURL, this.exchangeItemImage.node.getContentSize(), true, (sprite) => {
                        // add price
                        this.exchangeItemPrice.string = `${Utils.numberFormat(itemGold)} ${app.config.currencyName}`;
                        this.exchangeItemName.string = `${itemName}`;
                        
                        let item = cc.instantiate(this.exchangeItem);
                        item.active = true;
                        
                        let itemBtnNode = item.getChildByName('btn');
                        itemBtnNode.itemId = itemId;
                        itemBtnNode.itemName = itemName;
                        itemBtnNode.itemGold = itemGold;

                        this.contentNode.addChild(item);
                    });
                }
            }
        });
    }
    
    onItemBtnClick(event) {
        let gold = event.currentTarget.itemGold;
        let name = event.currentTarget.itemName;
        let id = event.currentTarget.itemId;

        let denyCb = () => true;
        let okCallback = this._onConfirmDialogBtnClick.bind(this, { gold, name, id });

        app.system.confirm(
            app.res.string('exchange_dialog_confirmation', {gold: Utils.numberFormat(gold), name }),
            denyCb,
            okCallback
        );
    }

    _onConfirmDialogBtnClick(data) {
        let { gold, name, id } = data;
        if (app.context.needUpdatePhoneNumber()) {
           this._showUpdatePhoneNumber();
        } else {
            let myCoin = app.context.getMeBalance();

            if (Number(myCoin) < Number(gold)) {
                app.system.error(
                    app.res.string('error_exchange_dialog_not_enough_money', { ownerCoin: Utils.numberFormat(myCoin), name })
                );
                return;
            }
            
            ActionBlocker.runAction(ActionBlocker.USER_EXCHANGE_ITEM, () => {
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
        } else {            
            ActionBlocker.resetLastTime(ActionBlocker.USER_EXCHANGE_ITEM);
            data[app.keywords.RESPONSE_MESSAGE]  && app.system.error(data[app.keywords.RESPONSE_MESSAGE]);
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

app.createComponent(TabExchangeItem);