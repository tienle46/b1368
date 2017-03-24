import app from 'app';
import DialogActor from 'DialogActor';
import RubUtils from 'RubUtils';
import ExchangeDialog from 'ExchangeDialog';
import NodeRub from 'NodeRub';
import Utils from 'Utils';
import CCUtils from 'CCUtils';

class TabExchangeCard extends DialogActor {
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
            providerLbl: cc.Label,
            balanceLbl: cc.Label,
            goldLbl: cc.Label,
            itemLogoSprite: cc.Sprite,
            layoutsNode: cc.Node,
            updatePhoneNumberNode: cc.Node,
            phoneNumberEditbox: cc.EditBox
        };

        this.selectedItem = { id: null, gold: null, name: null };
        this._tabData = {};
    }
    
    onLoad() {
        super.onLoad();
        this._hideUpdatePhoneNumber();
    }
    
    start() {
        super.start();
        this._initCardsList();
    }

    onDestroy() {
        super.onDestroy();
        window.free(this._tabData);
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
    
    _initCardsList() {
        var sendObject = {
            'cmd': app.commands.EXCHANGE_LIST,
            'data': {}
        };

        this.showLoader();
        app.service.send(sendObject);
    }

    _onGetExchangeList(data) {
        if (data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES]) {
            let cardValues = [];

            (data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES] || []).map((type) => {
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

                        let amount = itemName.match(/([0-9]{2,})+(K)/g);
                        amount && (amount = Number(amount[0].replace('K', '')) * 1000);

                        if (providerName && !Utils.isEmpty(providerName)) {
                            if (!this._tabData.hasOwnProperty(providerName) || !this._tabData[providerName]) {
                                this._tabData[providerName] = [];
                            }
                            this._tabData[providerName].push({ id: itemId, gold: amount, needed: neededGold, name: itemName });
                        }
                    }
                    this._initProviders();
                    // console.debug(this._tabData)
                }
            });

            // hide loader
            this.hideLoader();
        } else {
            this.pageIsEmpty(this.node);
        }
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
                this.providerLbl.string = name.toUpperCase();
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
            let { id, gold, } = this.selectedItem;
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

app.createComponent(TabExchangeCard);