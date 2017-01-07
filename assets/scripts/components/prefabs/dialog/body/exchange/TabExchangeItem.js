import app from 'app';
import Component from 'Component';
import RubUtils from 'RubUtils';
import numeral from 'numeral';
import ExchangeDialog from 'ExchangeDialog';
import LoaderRub from 'LoaderRub';

class TabExchangeItem extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            contentNode: cc.Node,
            exchangeItem: cc.Node,
            exchangeItemImage: cc.Sprite,
            exchangeItemPrice: cc.Label
        };
    }

    onLoad() {
        super.onLoad();
        // wait til every requests is done
        app.system.showLoader();
        this.node.active = false;

        // get content node
        this._getExchangeDialogComponent().hideUpdatePhone();
        this._initItemsList();
    }

    _initItemsList() {
        var sendObject = {
            'cmd': app.commands.EXCHANGE_LIST,
            'data': {}
        };

        app.service.send(sendObject, (data) => {
            if (data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES]) {
                const exchangeTypes = data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES];
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
                                this.addAssets(sprite);
                                a.destroy();
                            });

                            // add price
                            this.exchangeItemPrice.string = `${itemGold.toLocaleString()} XU`;


                            let itemBtn = item.getChildByName('btn').getComponent(cc.Button);
                            itemBtn.itemId = itemId;
                            itemBtn.itemName = itemName;
                            itemBtn.itemGold = itemGold;

                            this.contentNode.addChild(item);
                        }
                    }
                });
                // hide loader
                app.system.hideLoader();
                this.node.active = true;
            }

        }, app.const.scene.EXCHANGE_CHIP);
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
            // hide this node
            this._hide();
            // show update_phone_number
            this._getExchangeDialogComponent().showUpdatePhone();
        } else {
            let myCoin = app.context.getMyInfo().coin;

            if (Number(myCoin) < Number(gold)) {
                app.system.error(
                    app.res.string('error_exchange_dialog_not_enough_money', { ownerCoin: myCoin.toLocaleString(), name })
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
            app.service.send(sendObject, (data) => {
                app.system.hideLoader();
                if (data[app.keywords.RESPONSE_RESULT] === false) {
                    app.system.info(`${data[app.keywords.RESPONSE_MESSAGE]}`);
                } else { // true
                    app.system.error(
                        app.res.string('error_system')
                    );
                }
            });
        }
    }

    _getExchangeDialogComponent() {
        // this node -> body -> dialog -> dialog (parent)
        let dialogNode = this.node.parent.parent.parent;
        return dialogNode.getComponent(ExchangeDialog);
    }

    _getUpdatePhoneNode() {
        return this._getExchangeDialogComponent().updatePhoneNode();
    }

    _hide() {
        this.node.active = false;
    }
}

app.createComponent(TabExchangeItem);