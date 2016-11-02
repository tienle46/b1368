import app from 'app';
import Component from 'Component';
import AlertPopupRub from 'AlertPopupRub';
import ButtonScaler from 'ButtonScaler';
import RubUtils from 'RubUtils';
import numeral from 'numeral';
import ExchangeDialog from 'ExchangeDialog';
import ConfirmPopupRub from 'ConfirmPopupRub';
import LoaderRub from 'LoaderRub';

class TabExchangeItem extends Component {
    constructor() {
        super();
    }

    onLoad() {
        // wait til every requests is done
        this.loader = new LoaderRub(this.node);
        this.node.active = false;

        // get content node
        this.contentNode = this.node.getChildByName('view').getChildByName('content');
        this._getExchangeDialogComponent().hideUpdatePhone();
        this._initItemsList();
    }

    _initItemsList() {
        var sendObject = {
            'cmd': app.commands.EXCHANGE_LIST,
            'data': {}
        };

        app.service.send(sendObject, (data) => {
            log(data);
            if (data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES]) {

                const exchangeTypes = data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES];
                exchangeTypes.forEach((type, index) => {

                    if (type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_TYPE] === '2') {
                        const idList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ID_LIST];
                        const nameList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_NAME_LIST];
                        const goldList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_GOLD_LIST];
                        const iconList = type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ICON_LIST];

                        const cnt = idList.length;

                        let rowNode;

                        for (let i = 0; i < cnt; i++) {
                            let itemId = idList[i];
                            let itemIcon = iconList[i].replace('thumb.', '');
                            let itemGold = goldList[i];
                            let itemName = nameList[i];

                            if (i % 3 === 0) {
                                rowNode = null;
                                rowNode = this._initRowNode();
                                this.contentNode.addChild(rowNode);
                            }

                            if (rowNode) {
                                let itemNode = new cc.Node();
                                let itemNodeWidth = 234;
                                let itemNodeHeight = 262;

                                itemNode.itemId = itemId;
                                itemNode.itemGold = itemGold;
                                itemNode.itemName = itemName;

                                rowNode.addChild(itemNode);

                                let itemSprite = itemNode.addComponent(cc.Sprite);
                                RubUtils.loadSpriteFrame(itemSprite, 'dashboard/dialog/imgs/bg-napthe', cc.size(itemNodeWidth, itemNodeHeight), false, (sprite) => {
                                    sprite.node.x = -260 + (i % 3) * (itemNodeWidth + 21);
                                    sprite.node.y = 0;
                                });
                                // image background node
                                this._initBackgroundNode(itemNode, itemIcon);

                                // lblContainerNode
                                this._initLabelNode(itemNode, itemName, itemGold);

                                // add Button
                                let btn = itemNode.addComponent(cc.Button);

                                let event = new cc.Component.EventHandler();
                                event.target = this.node;
                                event.component = 'TabExchangeItem';
                                event.handler = 'onHandleExchangeBtnClick';
                                btn.clickEvents = [event];

                                // add ButtonScaler component
                                itemNode.addComponent(ButtonScaler);
                            }
                        }

                    }
                });

                // hide loader
                this.loader.hide();
                this.node.active = true;
            }

        }, app.const.scene.EXCHANGE_CHIP);
    }

    _fakeData() {
        let data = {
            su: true,
            il: [23, 22, 24, 21, 25, 20, 27, 26],
            t: 2,
            gl: [26148000, 22188000, 22188000, 20988000, 19188000, 17988000, 5988000, 2868000],
            iml: ['http://123.30.238.174:3769/public/uploads/1451274749501461671654269.jpg', 'http://123.30.238.174:3769/public/uploads/1451274749501461671600091.jpg', 'http://123.30.238.174:3769/public/uploads/uk_ef-zg935cfegww_003_003_gold_100592089307261461671696752.jpeg', 'http://123.30.238.174:3769/public/uploads/apple-iphone-6-16gb11461671642625.jpg', 'http://123.30.238.174:3769/public/uploads/samsung-galaxy-s7-edge-russia1461671732852.jpg', 'http://123.30.238.174:3769/public/uploads/apple-iphone-6-16gb11461671521743.jpg', 'http://123.30.238.174:3769/public/uploads/oppo-neo-7-the-tecake-11461671812290.jpg', 'http://123.30.238.174:3769/public/uploads/oppo-neo-5-unboxing001_thumb1461671960283.jpg'],
            nl: ['iPhone 6s Plus 16GB', 'iPhone 6s 16GB', 'Samsung Galaxy S7 Edge', 'iPhone 6 Plus 16GB', 'Samsung Galaxy S7', 'iPhone 6 16GB', 'OPPO R7 Lite', 'OPPO Neo 5']
        };
    }

    onHandleExchangeBtnClick(event) {
        let itemGold = event.currentTarget.itemGold;
        let itemName = event.currentTarget.itemName;

        let parentNode = this.node.parent.parent;

        ConfirmPopupRub.show(parentNode, `Bạn có muốn đổi ${numeral(itemGold).format('0,0')} chip để nhận ${itemName} ?`, this._onConfirmDialogBtnClick, null, this);
    }

    _onConfirmDialogBtnClick() {
        let itemGold = event.currentTarget.itemGold;
        let itemName = event.currentTarget.itemName;

        let parentNode = this.node.parent.parent;
        if (app.context.needUpdatePhoneNumber()) {
            // hide this node
            this._hide();
            // show update_phone_number
            this._getExchangeDialogComponent().showUpdatePhone();
        } else {
            // TODO
            // if user gold less than itemGold -> show AlertPopupRub
            let myCoin = app.context.getMyInfo().coin;
            console.log(myCoin);
            if (Number(myCoin) < Number(itemGold)) {
                AlertPopupRub.show(parentNode, `Số tiền hiện tại ${numeral(myCoin).format('0,0')} không đủ để đổi vật phẩm ${itemName}`);
                return;
            }
            // else send request
            let id = event.currentTarget.itemId;

            let data = {};
            data[app.keywords.EXCHANGE.REQUEST.ID] = id;
            let sendObject = {
                'cmd': app.commands.EXCHANGE,
                data
            };
            log(sendObject);
            app.service.send(sendObject, (data) => {
                log(data);
            });
        }
    }

    _initLabelNode(itemNode, itemName, itemGold) {
        let lblContainerNode = new cc.Node();
        lblContainerNode.name = 'lblContainerNode';
        lblContainerNode.setContentSize(cc.size(220, 73));
        lblContainerNode.setPositionY(-76);
        itemNode.addChild(lblContainerNode);
        // add layout
        let layout = lblContainerNode.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.VERTICAL;
        layout.padding = 10;
        layout.spacingY = 10;

        let lblNode = new cc.Node();
        let lblNodeWidth = 215;
        let lblNodeHeight = 20;
        lblNode.setContentSize(cc.size(lblNodeWidth, lblNodeHeight));
        lblContainerNode.addChild(lblNode);

        let lblComponent = lblNode.addComponent(cc.Label);
        lblComponent.string = itemName.trim();
        lblComponent.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        lblComponent.verticalAlign = cc.Label.VerticalAlign.CENTER;
        lblComponent.fontSize = 16;
        lblComponent.lineHeight = 20;
        lblComponent.overflow = cc.Label.Overflow.RESIZE_HEIGHT;

        let lblNode2 = cc.instantiate(lblNode);
        lblContainerNode.addChild(lblNode2);

        let lblComponent2 = lblNode2.getComponent(cc.Label);
        lblComponent2.string = numeral(itemGold).format('0,0');
        lblComponent2.node.color = new cc.Color(246, 255, 41);
    }

    _initBackgroundNode(itemNode, itemIcon) {
        // create item/img-bg Node
        let imgBgNode = new cc.Node();
        let imgBgNodeWidth = 214;
        let imgBgNodeHeight = 159;
        imgBgNode.y = 41;
        itemNode.addChild(imgBgNode);

        let imgBgSprite = imgBgNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(imgBgSprite, 'dashboard/dialog/imgs/bg-napthe-1', cc.size(imgBgNodeWidth, imgBgNodeHeight));

        let imgBgWidget = imgBgNode.addComponent(cc.Widget);
        imgBgWidget.top = 10.5;
        imgBgWidget.right = 10;
        imgBgWidget.left = 10;

        let imgNode = new cc.Node();
        imgBgNode.addChild(imgNode);

        let imgSprite = imgNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(imgSprite, itemIcon, cc.size(205, 134), true);
    }

    _initRowNode() {
        let rowNode = new cc.Node();
        rowNode.width = 780;
        rowNode.height = 267;
        rowNode.name = 'container';
        return rowNode;
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