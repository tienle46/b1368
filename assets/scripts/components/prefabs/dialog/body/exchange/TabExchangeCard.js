import app from 'app';
import DialogActor from 'DialogActor';
import RubUtils from 'RubUtils';
import ExchangeDialog from 'ExchangeDialog';
import NodeRub from 'NodeRub';
import numeral from 'numeral';

class TabExchangeCard extends DialogActor {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            listAmountCardContentNode: cc.Node,
            cardAmountItem: cc.Node,
            providerLbl: cc.Label,
            providerContainerNode: cc.Node,
            providerDropDownNode: cc.Node,
            providerDropDownItem: cc.Node,
            amountNumberLbl: cc.Label,
            amountNumberDropDownListNode: cc.Node,
            amountNumberDropDownItem: cc.Node,
            hint: cc.RichText
        };

        this.selectedItem = { id: null, gold: null, name: null };
    }

    onLoad() {
        super.onLoad();
        // wait til every requests is done
        // this.node.active = false;
        // show loader
        // app.system.showLoader();
        // this._getExchangeDialogComponent().hideUpdatePhone();
        this.hint.string = "";
    }

    start() {
        super.start();
        this._initCardsList();
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.EXCHANGE_LIST, this._onGetExchangeList, this);
        app.system.addListener(app.commands.EXCHANGE, this._onExchange, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.EXCHANGE, this._onExchange, this);
        app.system.removeListener(app.commands.EXCHANGE_LIST, this._onGetExchangeList, this);
    }

    _initCardsList() {
        var sendObject = {
            'cmd': app.commands.EXCHANGE_LIST,
            'data': {}
        };

        app.system.showLoader();
        app.service.send(sendObject);
    }

    _onGetExchangeList(data) {
        if (data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES]) {
            let cardValues = [];

            let exchangeTypes = data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES];
            exchangeTypes.map((type) => {
                if (type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_TYPE] == app.const.EXCHANGE_LIST_CARD_TYPE_ID) {
                    const idList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ID_LIST];
                    const nameList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_NAME_LIST];
                    const goldList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_GOLD_LIST];
                    const iconList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ICON_LIST];

                    for (let i = 0; i < idList.length; i++) {
                        let itemId = idList[i];
                        // let itemIcon = iconList[i].replace('thumb.', '');
                        let itemGold = goldList[i];
                        let itemName = nameList[i];
                        let amount = itemName.match(/([0-9]{2,})+(K)/g);
                        amount && (amount = amount[0]);
                        amount && (amount = Number(amount.replace('K', '')) * 1000);


                        if (!app._.includes(cardValues, amount)) {
                            cardValues.push(amount);

                            // setup card item
                            let ratioNode = cc.instantiate(this.cardAmountItem);
                            let ratioItem = ratioNode.getComponent('RatioItem');
                            ratioItem.initItemWithoutRatio(amount, itemGold);
                            ratioNode.active = true;

                            // add to container
                            this.listAmountCardContentNode.addChild(ratioNode);
                        }


                        // init providerDropDown list
                        let providerItem = cc.instantiate(this.providerDropDownItem);
                        let lbl = providerItem.getChildByName('providername').getComponent(cc.Label);
                        lbl && (lbl.string = itemName);

                        providerItem.providerName = itemName;
                        providerItem.providerPrice = itemGold;
                        providerItem.providerId = itemId;
                        providerItem.active = true;

                        this.providerDropDownNode.addChild(providerItem);
                    }
                }
            });
            exchangeTypes = null;

            // hide loader
            app.system.hideLoader();
        } else {
            this.pageIsEmpty(this.node);
        }
    }

    onShowProviderDropDownBtnClick() {
        this._toggleDropdown();
    }

    onProviderItemBtnClick(e) {
        let target = e.currentTarget;
        this.providerLbl.string = `${target.providerName}`;

        this.hint.string = `<color=#FAE407>${target.providerName}</color> cần <color=#FAE407>${numeral(target.providerPrice).format('0,0')}</color> Xu để đổi.`;

        this.selectedItem = {
            id: target.providerId,
            gold: target.providerPrice,
            name: target.providerName
        };

        this._toggleDropdown();
    }

    _toggleDropdown() {
        let state = this.providerContainerNode.active;
        this.providerContainerNode.active = !state;
    }

    onExchangeBtnClick(event) {
        let denyCb = () => true;
        let okCallback = this._onConfirmDialogBtnClick.bind(this);

        if (this.selectedItem.id) {
            let { id, gold, name } = this.selectedItem;
            app.system.confirm(
                app.res.string('exchange_dialog_confirmation', { gold: numeral(gold).format('0,0'), name }),
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
            this._hide();
            // show update_phone_number
            this._getExchangeDialogComponent().showUpdatePhone();
        } else {
            let { id, gold, } = this.selectedItem;
            let myCoin = app.context.getMyInfo().coin;

            if (Number(myCoin) < Number(gold)) {
                app.system.error(
                    app.res.string('error_exchange_dialog_not_enough_money', { ownerCoin: numeral(myCoin).format('0,0'), name })
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
            app.system.showLoader();
            app.service.send(sendObject);
        }
    }

    _onExchange(data) {
        app.system.hideLoader();
        if (data[app.keywords.RESPONSE_RESULT] === false) {
            app.system.info(`${data[app.keywords.RESPONSE_MESSAGE]}`);
        } else { // true
            app.system.error(
                app.res.string('error_system')
            );
        }
    }

    _getExchangeDialogComponent() {
        // this node -> body -> dialog -> dialog (parent)
        let dialogNode = this.node.parent.parent.parent;
        console.log(dialogNode.getComponent(ExchangeDialog));

        return dialogNode.getComponent(ExchangeDialog);
    }

    _getUpdatePhoneNode() {
        return this._getExchangeDialogComponent().updatePhoneNode();
    }

    _hide() {
        this.node.active = false;
    }
}

app.createComponent(TabExchangeCard);