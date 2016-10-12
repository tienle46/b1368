import app from 'app';
import Component from 'Component';
import AlertPopupRub from 'AlertPopupRub';
import ButtonScaler from 'ButtonScaler';
import RubUtils from 'RubUtils';
import ConfirmPopupRub from 'ConfirmPopupRub';
import ExchangeDialog from 'ExchangeDialog';
import numeral from 'numeral';

class TabExchangeCard extends Component {
    constructor() {
        super();
    }

    onLoad() {
        // wait til every requests is done
        this.node.active = false;

        // get content node
        this.contentNode = this.node.getChildByName('view').getChildByName('content');
        this._getExchangeDialogComponent().hideUpdatePhone();

        this._initCardsList();
    }

    _initCardsList() {
        let data = {
            su: true,
            il: [18, 16, 14, 17, 15, 13, 8, 4, 12, 11, 7, 3],
            t: 1,
            gl: [600000, 600000, 600000, 240000, 240000, 240000, 120000, 120000, 120000, 60000, 60000, 60000],
            iml: ['http://123.30.238.174:3769/public/uploads/vina5001461671071815.png', 'http://123.30.238.174:3769/public/uploads/mobi5001461671048640.png', 'http://123.30.238.174:3769/public/uploads/viettel5001461671022520.png', 'http://123.30.238.174:3769/public/uploads/vina2001461671061418.png', 'http://123.30.238.174:3769/public/uploads/mobi2001461671036588.png', 'http://123.30.238.174:3769/public/uploads/viettel2001461671010559.png', 'http://123.30.238.174:3769/public/uploads/mobi1001461670935009.png', 'http://123.30.238.174:3769/public/uploads/viettel1001461670843386.png', 'http://123.30.238.174:3769/public/uploads/vina1001461670992647.png', 'http://123.30.238.174:3769/public/uploads/vina501461670980281.png', 'http://123.30.238.174:3769/public/uploads/mobi501461670923672.png', 'http://123.30.238.174:3769/public/uploads/viettel501461670832320.png'],
            nl: ['Vina 500K', 'Mobi 500K', 'Viettel 500K', 'Vina 200K', 'Mobi 200K', 'Viettel 200K', 'Mobi 100K', 'Viettel 100K', 'Vina 100K', 'Vina 50K', 'Mobi 50K', 'Viettel 50K']
        };

        if (data[app.keywords.RESPONSE_RESULT] && data[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_TYPE] === 1) {
            let rowNode;
            for (let i = 0; i < data[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ID_LIST].length; i++) {
                let itemId = data[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ID_LIST][i];
                let itemIcon = data[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ICON_LIST][i];
                let itemGold = data[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_GOLD_LIST][i];
                let itemName = data[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_NAME_LIST][i];

                if (i % 3 === 0) {
                    rowNode = null;
                    rowNode = this._initRowNode();
                    this.contentNode.addChild(rowNode);
                }

                if (rowNode) {
                    // create item Note
                    let itemNode = new cc.Node();
                    itemNode.itemId = itemId;
                    itemNode.itemGold = itemGold;
                    itemNode.itemName = itemName;

                    rowNode.addChild(itemNode);

                    // add Spite 
                    let sprite = itemNode.addComponent(cc.Sprite);
                    let itemNodeWidth = 245;
                    let itemNodeHeight = 131;
                    RubUtils.loadSpriteFrame(sprite, itemIcon, cc.size(itemNodeWidth, itemNodeHeight), true, (spriteFrame) => {
                        spriteFrame.node.x = -254 + (i % 3) * (itemNodeWidth + 13);
                        spriteFrame.node.y = 0;
                    });

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
            this.node.active = true;
        }
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
    _initRowNode() {
        let rowNode = new cc.Node();
        rowNode.width = 780;
        rowNode.height = 124;
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

    scrollEvent(sender, event) {
        switch (event) {
            case 0:
                console.log('Scroll to Top');
                break;
            case 1:
                console.log('Scroll to Bottom');
                break;
            case 2:
                console.log('Scroll to left');
                break;
            case 3:
                console.log('Scroll to right');
                break;
            case 4:
                console.log('Scrolling');
                break;
            case 5:
                console.log('Bounce Top');
                break;
            case 6:
                console.log('Bounce bottom');
                break;
            case 7:
                console.log('Bounce left');
                break;
            case 8:
                console.log('Bounce right');
                break;
            case 9:
                console.log('Auto scroll ended');
                break;
        }
    }
}

app.createComponent(TabExchangeCard);