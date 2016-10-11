import app from 'app';
import Component from 'Component';
import ButtonScaler from 'ButtonScaler';
import RubUtils from 'RubUtils';
import TabRub from 'TabRub';
import GridViewRub from 'GridViewRub';

class TabExchangeHistory extends Component {
    constructor() {
        super();
    }

    onLoad() {
        // wait til every requests is done
        // this.node.active = false;

        // get content node
        // this.contentNode = this.node.getChildByName('view').getChildByName('content');
        // this._initItemsList();
        // init tabRub
        this._initData().then((data) => {
            this._initTabs(data);
        });
        // this._initTabs();
    }

    _initData() {
        let sendObject = {
            'cmd': app.commands.EXCHANGE_HISTORY,
        };


        return new Promise((resolve, reject) => {
            app.service.send(sendObject, (res) => {
                let data = {
                    p: 1,
                    il: ['60573', '50669', '47930', '47929', '36103', '30948', '29833', '29822', '29280', '29277'],
                    dl: ['01-08-2016 09:15:46', '07-07-2016 16:16:26', '01-07-2016 16:24:17', '01-07-2016 16:23:18', '13-06-2016 11:36:45', '07-06-2016 11:24:33', '05-06-2016 20:07:24', '05-06-2016 19:56:36', '04-06-2016 21:40:28', '04-06-2016 21:35:11'],
                    // sl: ,
                    nl: ['Vina 50K', 'Viettel 50K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', ' Mobi 20K', 'Vina 20K'],
                    dtl: []
                };

                let d = {
                    cards: [
                        ['01-08-2016 09:15:46', '07-07-2016 16:16:26', '01-07-2016 16:24:17', '01-07-2016 16:23:18', '13-06-2016 11:36:45', '07-06-2016 11:24:33', '05-06-2016 20:07:24', '05-06-2016 19:56:36', '04-06-2016 21:40:28', '04-06-2016 21:35:11'],
                        ['Vina 50K', 'Viettel 50K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', ' Mobi 20K', 'Vina 20K'],
                        []
                    ],
                    items: [
                        ['01-08-2016 09:15:46', '07-07-2016 16:16:26', '01-07-2016 16:24:17', '01-07-2016 16:23:18', '13-06-2016 11:36:45', '07-06-2016 11:24:33', '05-06-2016 20:07:24', '05-06-2016 19:56:36', '04-06-2016 21:40:28', '04-06-2016 21:35:11'],
                        ['Vina1 50K', 'Viettel1 50K', 'Viettel1 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', ' Mobi 20K', 'Vina 20K'],
                        []
                    ]
                };
                resolve(d);
            });
        });
    }


    _initTabs(d) {
        let paginationNode = this.node.getChildByName('pagination');
        let bodyNode = this.node.getChildByName('body');

        // add Tab
        let tabs = [{
            title: 'Thẻ cào',
            value: GridViewRub.node(bodyNode, ['x', 'x', 'x'], d.cards, { position: cc.v2(2, 94), width: 715 })
        }, {
            title: 'Vật phẩm',
            value: GridViewRub.node(bodyNode, {}, d.items, { position: cc.v2(2, 94), width: 715 })
        }];
        let options = {
            itemHeight: 46.5,
            itemWidth: 296.5,
            bg: 'dashboard/dialog/imgs/exchange-dialog-history-child-tab-body-bg',
            activeNormalSprite: 'dashboard/dialog/imgs/exchange-dialog-history-child-tab-active',
            hasEdge: false
        };
        return TabRub.show(paginationNode, bodyNode, tabs, options).then((tabRub) => {
            tabRub.prefab.x = 0;
            tabRub.prefab.y = 20;
            return tabRub;
        });
    }

    _initItemsList() {
        let data = {
            su: true,
            il: [23, 22, 24, 21, 25, 20, 27, 26],
            t: 2,
            gl: [26148000, 22188000, 22188000, 20988000, 19188000, 17988000, 5988000, 2868000],
            iml: ['http://123.30.238.174:3769/public/uploads/1451274749501461671654269.jpg', 'http://123.30.238.174:3769/public/uploads/1451274749501461671600091.jpg', 'http://123.30.238.174:3769/public/uploads/uk_ef-zg935cfegww_003_003_gold_100592089307261461671696752.jpeg', 'http://123.30.238.174:3769/public/uploads/apple-iphone-6-16gb11461671642625.jpg', 'http://123.30.238.174:3769/public/uploads/samsung-galaxy-s7-edge-russia1461671732852.jpg', 'http://123.30.238.174:3769/public/uploads/apple-iphone-6-16gb11461671521743.jpg', 'http://123.30.238.174:3769/public/uploads/oppo-neo-7-the-tecake-11461671812290.jpg', 'http://123.30.238.174:3769/public/uploads/oppo-neo-5-unboxing001_thumb1461671960283.jpg'],
            nl: ['iPhone 6s Plus 16GB', 'iPhone 6s 16GB', 'Samsung Galaxy S7 Edge', 'iPhone 6 Plus 16GB', 'Samsung Galaxy S7', 'iPhone 6 16GB', 'OPPO R7 Lite', 'OPPO Neo 5']
        };
        if (data[app.keywords.RESPONSE_RESULT] && data[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_TYPE] === 2) {
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
                    // create item Node
                    let itemNode = new cc.Node();
                    let itemNodeWidth = 234;
                    let itemNodeHeight = 262;
                    itemNode.x = -260 + (i % 3) * (itemNodeWidth + 21);
                    itemNode.y = 0;

                    itemNode.itemId = itemId;
                    itemNode.itemGold = itemGold;
                    rowNode.addChild(itemNode);

                    let itemSprite = itemNode.addComponent(cc.Sprite);
                    RubUtils.loadSpriteFrame(itemSprite, 'dashboard/dialog/imgs/bg-napthe', (sprite) => {
                        sprite.node.setContentSize(cc.size(itemNodeWidth, itemNodeHeight));
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
            this.node.active = true;
        }
    }
}

app.createComponent(TabExchangeHistory);