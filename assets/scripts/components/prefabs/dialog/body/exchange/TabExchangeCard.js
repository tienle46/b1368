import app from 'app';
import Component from 'Component';
import AlertPopupRub from 'AlertPopupRub';
import ButtonScaler from 'ButtonScaler';
import RubUtils from 'RubUtils';

class TabExchangeCard extends Component {
    constructor() {
        super();
    }

    onLoad() {
        // wait til every requests is done
        this.node.active = false;

        // get content node
        this.contentNode = this.node.getChildByName('view').getChildByName('content');
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

                    rowNode.addChild(itemNode);

                    // add Spite 
                    let sprite = itemNode.addComponent(cc.Sprite);
                    RubUtils.loadSpriteFrame(sprite, itemIcon, (spriteFrame) => {
                        let itemNodeWidth = 245;
                        let itemNodeHeight = 131;
                        spriteFrame.node.setContentSize(cc.size(itemNodeWidth, itemNodeHeight));
                        spriteFrame.node.x = -254 + (i % 3) * (itemNodeWidth + 13);
                        spriteFrame.node.y = 0;
                    }, true);

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
        // TODO
        // if user gold less than itemGold -> show AlertPopupRub
        // else send request
        let id = event.currentTarget.itemId;

        let data = {};
        data[app.keywords.EXCHANGE.REQUEST.ID] = id;
        let sendObject = {
            'cmd': app.commands.EXCHANGE,
            data
        };
        console.log(sendObject);
        // this.node -> dialogbody node -> dialog node
        AlertPopupRub.show(this.node.parent.parent, 'clicked !');

        app.service.send(sendObject, (data) => {
            console.log(data);
        });
    }

    _initRowNode() {
        let rowNode = new cc.Node();
        rowNode.width = 780;
        rowNode.height = 124;
        rowNode.name = 'container';
        return rowNode;
    }
}

app.createComponent(TabExchangeCard);