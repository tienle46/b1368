import app from 'app';
import DialogActor from 'DialogActor';
import Utils from 'Utils';

class TabTopDaiGia extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            contentNode: cc.Node,
            crownsNode: cc.Node,
            userMoneyLbl: cc.Label,
        }
    }

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this._getDataFromServer(this.currentPage)
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.RANK_GROUP, this._onGetRankGroup, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.RANK_GROUP, this._onGetRankGroup, this);
    }

    _getDataFromServer(page) {
        let topNodeId = 8;
        let sendObject = {
            'cmd': app.commands.RANK_GROUP,
            'data': {
                [app.keywords.RANK_GROUP_TYPE]: app.const.DYNAMIC_GROUP_LEADER_BOARD,
                [app.keywords.RANK_ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.PAGE]: page,
                [app.keywords.RANK_NODE_ID]: topNodeId,
            }
        };

        this.showLoader(this.contentNode);
        app.service.send(sendObject);
    }

    _onGetRankGroup(res) {
        res[app.keywords.USERNAME_LIST] = res[app.keywords.USERNAME_LIST] || [];
        if (res[app.keywords.USERNAME_LIST].length < 0) {
            this.pageIsEmpty(this.contentNode);
            return;
        }
        let data = [
            res[app.keywords.USERNAME_LIST].map((status, index) => {
                let p = res['p'] || 1;
                let order = (index + 1) + (p - 1) * 20;
                if (this.crownsNode.children[index] && order <= 3)
                    return cc.instantiate(this.crownsNode.children[index]);
                else
                    return `${order}.`;
            }),
            res[app.keywords.USERNAME_LIST],
            res['ui1l'].map((amount) => {
                this.userMoneyLbl.string = `${Utils.numberFormat(amount)}`;
                return cc.instantiate(this.userMoneyLbl.node);
            }),
        ];
        let head = {
            data: ['STT', 'Tài khoản', 'Chips'],
            options: {
                fontColor: app.const.COLOR_YELLOW
            }
        };

        let next = this.onNextBtnClick;
        let prev = this.onPreviousBtnClick;

        let rubOptions = {
            paging: { prev, next, context: this },
            size: this.contentNode.getContentSize(),
            group: { widths: ['', 380, ''] }
        };

        this.initView(head, data, rubOptions);

        this.contentNode.addChild(this.getScrollViewNode());
        this.hideLoader(this.contentNode);
    }

    onPreviousBtnClick(page) {
        this._getDataFromServer(page);
    }

    onNextBtnClick(page) {
        this._getDataFromServer(page);
    }
}

app.createComponent(TabTopDaiGia);