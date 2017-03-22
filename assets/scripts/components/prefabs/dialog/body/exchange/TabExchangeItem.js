import app from 'app';
import DialogActor from 'DialogActor';
import RubUtils from 'RubUtils';
import Utils from 'Utils';
import ExchangeDialog from 'ExchangeDialog';
import LoaderRub from 'LoaderRub';
import CCUtils from 'CCUtils';

class TabExchangeItem extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            contentNode: cc.Node,
            exchangeItem: cc.Node,
            exchangeItemImage: cc.Sprite,
            exchangeItemPrice: cc.Label,
            layoutsNode: cc.Node,
            updatePhoneNumberNode: cc.Node,
            phoneNumberEditbox: cc.EditBox
        };
    }

    onLoad() {
        super.onLoad();
       this._hideUpdatePhoneNumber();
    }

    start() {
        super.start();
        this._initItemsList();
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
        app.system.removeListener(app.commands.PHONE_NUMBER, this._onUpdatePhoneNumber, this);
    }
    
    _onUpdatePhoneNumber(data) {
        if (data[app.keywords.RESPONSE_RESULT]) {
            app.system.showToast(app.res.string('phone_number_confirmation'));
            this._hideUpdatePhoneNumber();
        } else {
            app.system.error(
                app.res.string('error_system')
            );
        }
    }
    
    _initItemsList() {
        var sendObject = {
            'cmd': app.commands.EXCHANGE_LIST,
            'data': {}
        };
        this.showLoader();
        app.service.send(sendObject);
    }

    _onGetExchangeList(data) {
        if (data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES]) {
            let exchangeTypes = data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES];
            exchangeTypes.map((type) => {
                if (type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_TYPE] == app.const.EXCHANGE_LIST_ITEM_TYPE_ID) {
                    const idList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ID_LIST];
                    const nameList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_NAME_LIST];
                    const goldList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_GOLD_LIST];
                    const iconList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ICON_LIST];

                    for (let i = 0; i < idList.length; i++) {
                        let itemId = idList[i];
                        let itemIcon = `https://crossorigin.me/${iconList[i].replace('thumb.', '')}`;
                        let itemGold = goldList[i];
                        let itemName = nameList[i];

                        let item = cc.instantiate(this.exchangeItem);
                        item.active = true;

                        let a = new LoaderRub(item, true);
                        a.show();
                        // add sprite to img 
                        RubUtils.loadSpriteFrame(this.exchangeItemImage, itemIcon, this.exchangeItemImage.node.getContentSize(), true, (sprite) => {
                            a.destroy();
                        });

                        // add price
                        this.exchangeItemPrice.string = `${Utils.numberFormat(itemGold)} XU`;


                        let itemBtn = item.getChildByName('btn').getComponent(cc.Button);
                        itemBtn.itemId = itemId;
                        itemBtn.itemName = itemName;
                        itemBtn.itemGold = itemGold;

                        this.contentNode.addChild(item);
                    }
                }
            });
            exchangeTypes = null;
            // hide loader
            this.hideLoader();
        } else {
            this.pageIsEmpty(this.node);
        }
    }

    onItemBtnClick(event) {
        let gold = event.currentTarget.itemGold;
        let name = event.currentTarget.itemName;
        let id = event.currentTarget.itemId;

        let denyCb = () => true;
        let okCallback = this._onConfirmDialogBtnClick.bind(this, { gold, name, id });

        app.system.confirm(
            app.res.string('exchange_dialog_confirmation', { gold, name }),
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

            let data = {};
            data[app.keywords.EXCHANGE.REQUEST.ID] = id;
            let sendObject = {
                'cmd': app.commands.EXCHANGE,
                data
            };
            // show loader
            this.showLoader();
            app.service.send(sendObject);
        }
    }

    _onExchange(data) {
        this.hideLoader();
        if (data[app.keywords.RESPONSE_RESULT] === true) {
            app.system.showToast(`${data[app.keywords.RESPONSE_MESSAGE]}`);
        } else { // true
            app.system.error(
                app.res.string('error_system')
            );
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