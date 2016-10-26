import app from 'app';
import Component from 'Component';
import TabRub from 'TabRub';
import GridViewRub from 'GridViewRub';
import ExchangeDialog from 'ExchangeDialog';

class TabExchangeHistory extends Component {
    constructor() {
        super();
        this.GridViewCardTabRub = null;
        this.GridViewItemTabRub = null;

        this.GridViewItemTabNode = null;
        this.GridViewCardTabNode = null;

        this.flag = null;
    }

    onLoad() {
        // wait til every requests is done
        // this.node.active = false;

        // get content node
        // this.contentNode = this.node.getChildByName('view').getChildByName('content');
        // this._initItemsList();
        // init tabRub
        this._getExchangeDialogComponent().hideUpdatePhone();
        this._initData().then((data) => {
            this._initTabs(data);
        });
        // this._initTabs();
    }

    _initData() {
        let sendObject = {
            'cmd': app.commands.EXCHANGE_HISTORY,
            'data': {
                [app.keywords.PAGE]: 0,
            }
        };


        return new Promise((resolve, reject) => {
            app.service.send(sendObject, (res) => {

                log(res);

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
        let event = cc.Component.EventHandler(this.node, 'TabExchangeHistory', 'updateDataCardTab');
        this.GridViewCardTabRub = new GridViewRub(['x', 'x', 'x'], d.cards, { position: cc.v2(2, 94), width: 715, event });
        this.GridViewCardTabNode = this.GridViewCardTabRub.getNode();

        let event2 = cc.Component.EventHandler(this.node, 'TabExchangeHistory', 'updateDataItemTab');
        this.GridViewItemTabRub = new GridViewRub(['x', 'x', 'x'], d.items, { position: cc.v2(2, 94), width: 715, event2 });
        this.GridViewItemTabNode = this.GridViewItemTabRub.getNode();


        let tabs = [{
            title: 'Thẻ cào',
            value: this.GridViewCardTabNode
        }, {
            title: 'Vật phẩm',
            value: this.GridViewItemTabNode
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

    _getExchangeDialogComponent() {
        // this node -> body -> dialog -> dialog (parent)
        let dialogNode = this.node.parent.parent.parent;
        return dialogNode.getComponent(ExchangeDialog);
    }

    _getUpdatePhoneNode() {
        return this._getExchangeDialogComponent().updatePhoneNode();
    }

    updateDataCardTab(sender, type) {
        if (type === app.const.SCROLL_EVENT.SCROLL_TO_BOTTOM) {
            this.flag = 'top';
        }

        if (this.flag === 'top' && type === app.const.SCROLL_EVENT.AUTO_SCROLL_ENDED) {
            this._requestCardData();
            this.flag = null;
        }
    }
    updateDataItemTab(sender, type) {
        if (type === app.const.SCROLL_EVENT.SCROLL_TO_BOTTOM) {
            this.flag = 'top';
        }

        if (this.flag === 'top' && type === app.const.SCROLL_EVENT.AUTO_SCROLL_ENDED) {
            this._requestItemData();
            this.flag = null;
        }
    }

    _sendGetCardData() {
        this.GridViewCardTabNode.then(() => {
            this.GridViewCardTabRub.updateData([
                ['01-08-2016 09:15:46', '07-07-2016 16:16:26', '01-07-2016 16:24:17', '01-07-2016 16:23:18', '13-06-2016 11:36:45', '07-06-2016 11:24:33', '05-06-2016 20:07:24', '05-06-2016 19:56:36', '04-06-2016 21:40:28', '04-06-2016 21:35:11'],
                ['Vina 50K', 'Viettel 50K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', ' Mobi 20K', 'Vina 20K'],
                []
            ]);
        });
    }

    _requestItemData() {
        this.GridViewItemTabNode.then(() => {
            this.GridViewItemTabRub.updateData([
                ['01-08-2016 09:15:46', '07-07-2016 16:16:26', '01-07-2016 16:24:17', '01-07-2016 16:23:18', '13-06-2016 11:36:45', '07-06-2016 11:24:33', '05-06-2016 20:07:24', '05-06-2016 19:56:36', '04-06-2016 21:40:28', '04-06-2016 21:35:11'],
                ['Vina 50K', 'Viettel 50K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', ' Mobi 20K', 'Vina 20K'],
                []
            ]);
        });
    }
}

app.createComponent(TabExchangeHistory);