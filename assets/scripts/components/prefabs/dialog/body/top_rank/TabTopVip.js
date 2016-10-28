import app from 'app';
import Component from 'Component';
import GridViewRub from 'GridViewRub';
import ExchangeDialog from 'ExchangeDialog';

class TabTopVip extends Component {
    constructor() {
        super();
        this.GridViewCardTabRub = null;
        this.GridViewCardTabNode = null;
        this.flag = null;
        this.topNodeId = 14;
        this.currentPage = 1;
    }

    onLoad() {
        // wait til every requests is done
        // this.node.active = false;

        // get content node
        // this.contentNode = this.node.getChildByName('view').getChildByName('content');
        // this._initItemsList();
        // init tabRub
        this._initData().then((data) => {
            this._initBody(data);
        });
        // this._initTabs();
    }

    _initData() {
        let sendObject = {
            'cmd': app.commands.RANK_GROUP,
            'data': {
                [app.keywords.RANK_GROUP_TYPE]: app.const.DYNAMIC_GROUP_LEADER_BOARD,
                [app.keywords.RANK_ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.PAGE]: this.currentPage,
                [app.keywords.RANK_NODE_ID]: this.topNodeId,
            }
        };

        return new Promise((resolve, reject) => {
            app.service.send(sendObject, (res) => {

                log(res);

                const data = [
                    res['unl'].map((status, index)=>{
                        return index;
                    }),
                    res['unl'],
                    res['ui1l'],
                    res['ui2l'],
                ]

                resolve(data);
            });
        });
    }

    _initBody(d) {
        let bodyNode = this.node.getChildByName('container').getChildByName('body');

        GridViewRub.show(bodyNode, null, d, { position: cc.v2(2, 120), width: 500, group: {widths:[50,200,200,50]} }).then((rub) => {
            this.GridViewCardTabRub = rub;
            this.GridViewCardTabNode = this.GridViewCardTabRub._getNode();
        });
    }
}

app.createComponent(TabTopVip);