import app from 'app';
import Component from 'Component';
import AlertPopupRub from 'AlertPopupRub';
import ButtonScaler from 'ButtonScaler';
import RubUtils from 'RubUtils';
import ConfirmPopupRub from 'ConfirmPopupRub';
import ExchangeDialog from 'ExchangeDialog';
import numeral from 'numeral';
import LoaderRub from 'LoaderRub';

class TabExchangeCard extends Component {
    constructor() {
        super();
    }

    onLoad() {
        this.loader = new LoaderRub(this.node);

        // wait til every requests is done
        this.node.active = false;
        // show loader
        this.loader.show();
        // get content node
        this.contentNode = this.node.getChildByName('view').getChildByName('content');
        this._getExchangeDialogComponent().hideUpdatePhone();
        this._initCardsList();
    }
    _initCardsList() {
        var sendObject = {
            'cmd': app.commands.EXCHANGE_LIST,
            'data': {}
        };

        app.service.send(sendObject, (data) => {
            if (data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES]) {

                const exchangeTypes = data[app.keywords.EXCHANGE_LIST.RESPONSE.TYPES];
                exchangeTypes.forEach((type) => {
                    if (type[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_TYPE] === '1') {
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
                                event.component = 'TabExchangeCard';
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
            il: [18, 16, 14, 17, 15, 13, 8, 4, 12, 11, 7, 3],
            t: 1,
            gl: [600000, 600000, 600000, 240000, 240000, 240000, 120000, 120000, 120000, 60000, 60000, 60000],
            iml: ['http://123.30.238.174:3769/public/uploads/vina5001461671071815.png', 'http://123.30.238.174:3769/public/uploads/mobi5001461671048640.png', 'http://123.30.238.174:3769/public/uploads/viettel5001461671022520.png', 'http://123.30.238.174:3769/public/uploads/vina2001461671061418.png', 'http://123.30.238.174:3769/public/uploads/mobi2001461671036588.png', 'http://123.30.238.174:3769/public/uploads/viettel2001461671010559.png', 'http://123.30.238.174:3769/public/uploads/mobi1001461670935009.png', 'http://123.30.238.174:3769/public/uploads/viettel1001461670843386.png', 'http://123.30.238.174:3769/public/uploads/vina1001461670992647.png', 'http://123.30.238.174:3769/public/uploads/vina501461670980281.png', 'http://123.30.238.174:3769/public/uploads/mobi501461670923672.png', 'http://123.30.238.174:3769/public/uploads/viettel501461670832320.png'],
            nl: ['Vina 500K', 'Mobi 500K', 'Viettel 500K', 'Vina 200K', 'Mobi 200K', 'Viettel 200K', 'Mobi 100K', 'Viettel 100K', 'Vina 100K', 'Vina 50K', 'Mobi 50K', 'Viettel 50K']
        };
    }

    onHandleExchangeBtnClick(event) {
        let itemGold = event.currentTarget.itemGold;
        let itemName = event.currentTarget.itemName;

        let parentNode = this.node.parent.parent;

        ConfirmPopupRub.show(parentNode, `Bạn có muốn đổi ${numeral(itemGold).format('0,0')} chip để nhận ${itemName} ?`, this._onConfirmDialogBtnClick.bind(this, event));
    }

    /**
     * 
     * @param {any} event onHandleExchangeBtnClick's event
     * @returns
     * 
     * @memberOf TabExchangeCard
     */
    _onConfirmDialogBtnClick(event) {
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

            // show loader
            this.loader.show();
            app.service.send(sendObject, (data) => {
                console.log(data);
                this.loader.hide();
                if (data[app.keywords.RESPONSE_RESULT] === false) {
                    AlertPopupRub.show(parentNode, `${data[app.keywords.RESPONSE_MESSAGE]}`);
                    // app.system.info(`${data[app.keywords.RESPONSE_MESSAGE]}`);
                } else { // true
                    console.error('chua xu ly cho nay :\'(');
                }
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
        lblComponent.string = `${numeral(itemGold).format('0,0')} Chips`;
        lblComponent.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        lblComponent.verticalAlign = cc.Label.VerticalAlign.CENTER;
        lblComponent.fontSize = 16;
        lblComponent.lineHeight = 20;
        lblComponent.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        lblComponent.node.color = new cc.Color(246, 255, 41);

        // let lblNode2 = cc.instantiate(lblNode);
        // lblContainerNode.addChild(lblNode2);
        //
        // let lblComponent2 = lblNode2.getComponent(cc.Label);
        // lblComponent2.string = numeral(itemGold).format('0,0');
        // lblComponent2.node.color = new cc.Color(246, 255, 41);
    }

    _initBackgroundNode(itemNode, itemIcon) {
        // create item/img-bg Node
        let imgBgNode = new cc.Node();
        // let imgBgNodeWidth = 214;
        // let imgBgNodeHeight = 159;
        imgBgNode.y = 41;
        itemNode.addChild(imgBgNode);

        // let imgBgSprite = imgBgNode.addComponent(cc.Sprite);
        // RubUtils.loadSpriteFrame(imgBgSprite, 'dashboard/dialog/imgs/bg-napthe-1', cc.size(imgBgNodeWidth, imgBgNodeHeight));

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
        rowNode.height = 280;
        rowNode.name = 'container';
        return rowNode;
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